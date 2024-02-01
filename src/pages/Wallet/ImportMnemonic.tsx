import { Button, Container, Stack, TextField, Typography } from '@mui/material'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import useAddMnemonic from '@/hooks/chia/useAddMnemonic'
import { displayToast } from '@/utils/toast'

interface IFormInput {
  mnemonic: string
}

const ImportMnemonic = () => {
  const navigate = useNavigate()
  const [t] = useTranslation()
  const { addMnemonic } = useAddMnemonic()

  const {
    register,
    handleSubmit,
    formState: { isValid },
  } = useForm<IFormInput>()

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    try {
      await addMnemonic({
        mnemonic: data.mnemonic,
        label: 'ClimateDASH',
      })
      navigate('/wallet')
    } catch (error) {
      const { message } = error as Error
      displayToast(400, t(message))
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack alignItems="center" flexDirection="column" pt={3}>
        <Typography variant="h6">{t('wallet:import.title')} </Typography>
        <Container
          sx={{
            mb: 2,
            alignItems: 'center',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: 5,
          }}
        >
          <TextField
            placeholder={t('wallet:import.input')}
            multiline
            rows={4}
            sx={{ width: 450 }}
            {...register('mnemonic', { required: true })}
            required={true}
          />
          <Stack
            flexDirection="row"
            justifyContent="space-between"
            sx={{ width: 450 }}
          >
            <Button
              variant="outlined"
              color="primary"
              onClick={() => {
                navigate(-1)
              }}
            >
              {t('common:action.back')}
            </Button>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={!isValid}
            >
              {t('common:action.commit')}
            </Button>
          </Stack>
        </Container>
      </Stack>
    </form>
  )
}

export default ImportMnemonic
