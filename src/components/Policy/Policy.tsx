import {
  Box,
  Checkbox,
  Container,
  List,
  ListItem,
  ListItemText,
  Typography,
} from '@mui/material'
import { useTranslation } from 'react-i18next'

interface Props {
  accepted: boolean
  setAccepted: (value: boolean) => void
}

interface ListItemContent {
  title: string
  contents: {
    title: string
    content: string
  }[]
}

function Policy({ accepted, setAccepted }: Props) {
  const { t } = useTranslation('wallet', { keyPrefix: 'create' })
  const handleAcceptance = () => {
    setAccepted(!accepted)
  }

  const policyTerms: ListItemContent[] = [
    {
      title: t('policy.title'),
      contents: [
        {
          title: t('policy.content.terms.title'),
          content: t('policy.content.terms.content'),
        },
        {
          title: t('policy.content.user-responsibility.title'),
          content: t('policy.content.user-responsibility.content'),
        },
        {
          title: t('policy.content.prohibited-activities.title'),
          content: t('policy.content.prohibited-activities.content'),
        },
        {
          title: t('policy.content.security-measures.title'),
          content: t('policy.content.security-measures.content'),
        },
        {
          title: t('policy.content.privacy.title'),
          content: t('policy.content.privacy.content'),
        },
        {
          title: t('policy.content.disclaimer-of-liability.title'),
          content: t('policy.content.disclaimer-of-liability.content'),
        },
      ],
    },
    {
      title: t('terms-of-use.title'),
      contents: [
        {
          title: t('terms-of-use.content.wallet-creation.title'),
          content: t('terms-of-use.content.wallet-creation.content'),
        },
        {
          title: t('terms-of-use.content.wallet-access.title'),
          content: t('terms-of-use.content.wallet-access.content'),
        },
        {
          title: t('terms-of-use.content.transactions.title'),
          content: t('terms-of-use.content.transactions.content'),
        },
        {
          title: t('terms-of-use.content.service-availability.title'),
          content: t('terms-of-use.content.service-availability.content'),
        },
        {
          title: t('terms-of-use.content.compliance-with-laws.title'),
          content: t('terms-of-use.content.compliance-with-laws.content'),
        },
        {
          title: t('terms-of-use.content.modification-of-terms.title'),
          content: t('terms-of-use.content.modification-of-terms.content'),
        },
      ],
    },
  ]

  return (
    <Container sx={{ justifyContent: 'center', display: 'flex', mb: 5 }}>
      <Box my={1}>
        {policyTerms.map((item, index) => (
          <List key={index} dense>
            <ListItemText secondary={item.title} />
            {item.contents.map((content, index) => (
              <ListItem alignItems="flex-start" key={index}>
                <ListItemText secondary={`${index + 1}.`} sx={{ mr: 1 }} />
                <ListItemText
                  sx={{
                    width: '100%',
                  }}
                  secondary={`${content.title}: ${content.content}`}
                />
              </ListItem>
            ))}
          </List>
        ))}
        <Box mt={2}>
          <Checkbox
            checked={accepted}
            onChange={handleAcceptance}
            color="primary"
            inputProps={{ 'aria-label': 'Accept Terms' }}
          />
          <Typography variant="body2" component="span">
            {t('read-policy-and-terms')}
          </Typography>
        </Box>
      </Box>
    </Container>
  )
}

export default Policy
