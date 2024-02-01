import { yupResolver } from '@hookform/resolvers/yup'
import {
  Button,
  CircularProgress,
  Grid,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { useEffect, useMemo, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import * as yup from 'yup'

import TabForm from '@/components/TabForm'
import useAddMnemonic from '@/hooks/chia/useAddMnemonic'
import { TabInfo } from '@/types/tabFormTypes'
import { displayToast } from '@/utils/toast'

interface IFormInput {
  mnemonic: string
  password: string
  confirmPassword: string
}

const schema = yup.object().shape({
  mnemonic: yup.string().required('Mnemonic is required'),
  password: yup.string().required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Confirm Password is required'),
})

enum Step {
  Policy = 'wallet:create.title',
  Phrase = 'wallet:create.phrase.title',
  Password = 'Set Password',
  Creating = 'wallet:create.creating.title',
}

interface Title {
  title: Step
  submitBtn?: string
  cancelBtn?: string
}

const CreateMnemonic = () => {
  const [t] = useTranslation()
  const navigate = useNavigate()
  const [curTab, setCurTab] = useState(Step.Phrase)
  const [title, setTitle] = useState<Title>({
    title: Step.Policy,
    submitBtn: 'common:action.next',
    cancelBtn: 'common:action.cancel',
  })
  const { addMnemonic, generateMnemonic } = useAddMnemonic()

  const methods = useForm<IFormInput>({
    defaultValues: {
      mnemonic: '',
      password: '',
      confirmPassword: '',
    },
    mode: 'onChange',
    resolver: yupResolver(schema),
  })

  const submitDisabled = useMemo(() => {
    switch (curTab) {
      case Step.Password:
        return !methods.formState.isValid
      default:
        break
    }
  }, [curTab, methods.formState])

  const onGenerateMnemonic = async () => {
    const mnemonic = await generateMnemonic().unwrap()
    methods.setValue('mnemonic', mnemonic.join(' '))
  }

  const handleSaveSeed = async (mnemonic: string) => {
    try {
      await addMnemonic({
        mnemonic,
        label: 'ClimateDASH',
      })
    } catch (error) {
      const { message } = error as Error
      displayToast(400, message)
    }
  }

  const handleOnSubmit = () => {
    switch (curTab) {
      case Step.Policy:
        onGenerateMnemonic()
        setTitle({
          title: Step.Phrase,
          submitBtn: 'common:action.create',
          cancelBtn: 'common:action.back',
        })
        return setCurTab(Step.Phrase)
      case Step.Phrase: {
        const values = methods.getValues()
        handleSaveSeed(values.mnemonic)
        setTitle({ title: Step.Creating })
        setCurTab(Step.Creating)
        setTimeout(() => navigate(-1), 2000)
        break
      }
      default:
        break
    }
  }

  const handleOnCancel = () => {
    switch (curTab) {
      case Step.Phrase:
        setTitle({
          title: Step.Policy,
          submitBtn: 'common:action.next',
          cancelBtn: 'common:action.cancel',
        })
        return navigate(-1)
      case Step.Password:
        setTitle({
          title: Step.Phrase,
          submitBtn: 'common:action.next',
          cancelBtn: 'common:action.back',
        })
        return setCurTab(Step.Phrase)
      default:
        break
    }
  }

  useEffect(() => {
    onGenerateMnemonic()
  }, [])

  const tabs: TabInfo[] = useMemo(
    () => [
      {
        label: Step.Phrase,
        value: Step.Phrase,
        children: (
          <form>
            <Stack gap={5} px="10%" justifyContent="center">
              <Typography variant="body2" color="gray" textAlign="center">
                {t('wallet:create.phrase.content')}
              </Typography>
              <TextField
                color="primary"
                placeholder="Input your mnemonic"
                multiline
                rows={5}
                disabled
                value={methods.getValues().mnemonic}
                {...methods.register('mnemonic')}
              />
            </Stack>
          </form>
        ),
      },
      {
        label: Step.Creating,
        value: Step.Creating,
        children: (
          <Grid
            container
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            height="100%"
          >
            <Grid item>
              <Typography variant="body2" color="gray" textAlign="center">
                {t('wallet:create.creating.content')}
              </Typography>
            </Grid>
            <Grid item mt={2}>
              <CircularProgress />
            </Grid>
          </Grid>
        ),
      },
    ],
    [methods.formState]
  )

  return (
    <Grid container flexDirection="column" justifyContent="space-between" p={5}>
      <FormProvider {...methods}>
        <Grid container gap={2} alignItems="center" flexDirection="column">
          <Grid container width={700} gap={2}>
            <Grid item width="100%" textAlign="center">
              <Typography variant="h5">{t(title.title)}</Typography>
            </Grid>
            <Grid item width="100%">
              <TabForm
                curTab={curTab}
                setCurTab={setCurTab}
                tabs={tabs}
                displayTabs={false}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid container width="100%" mt={2} justifyContent="center" gap={10}>
          {title.cancelBtn && (
            <Button
              color="primary"
              variant="outlined"
              onClick={() => handleOnCancel()}
            >
              {t(title.cancelBtn)}
            </Button>
          )}

          {title.submitBtn && (
            <Button
              variant="contained"
              onClick={() => handleOnSubmit()}
              disabled={submitDisabled}
            >
              {t(title.submitBtn)}
            </Button>
          )}
        </Grid>
      </FormProvider>
    </Grid>
  )
}

export default CreateMnemonic
