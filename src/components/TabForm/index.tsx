import { Box, Stack, Tab, Tabs } from '@mui/material'
import { useTranslation } from 'react-i18next'

import TabPanel from '@/components/TabPanel'
import { TabFormProps } from '@/types/tabFormTypes'

const TabForm = ({
  curTab,
  setCurTab,
  tabs,
  displayTabs = true,
  tabStyles,
  warpComponent,
}: TabFormProps) => {
  const { t } = useTranslation()
  return (
    <Stack
      width="100%"
      component={warpComponent}
      sx={{
        position: 'relative',
      }}
    >
      <Box pt={5}>
        {tabs.map(({ value, header }) => (
          <TabPanel key={value} selected={curTab} name={value}>
            {header}
          </TabPanel>
        ))}
      </Box>
      <Box p={displayTabs ? 1 : 0}>
        {displayTabs && (
          <Tabs
            sx={{ position: 'absolute', top: 8, left: 20, ...tabStyles }}
            value={curTab}
            onChange={(e, newValue) => setCurTab(newValue)}
            aria-label="wrapped label tabs"
          >
            {tabs.map(({ label, value }) => (
              <Tab
                key={label}
                label={t(label as string)}
                value={value}
                id={`wrapped-tab-${label}`}
              />
            ))}
          </Tabs>
        )}
      </Box>
      <Box>
        {tabs.map(({ value, children }) => (
          <TabPanel key={value} selected={curTab} name={value}>
            {children}
          </TabPanel>
        ))}
      </Box>
    </Stack>
  )
}

export default TabForm
