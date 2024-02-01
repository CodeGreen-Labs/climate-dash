import { Add, FileDownloadOutlined } from '@mui/icons-material'
import { Box, Button, Divider, Grid, Paper, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'

import type { OnFileLoaded } from '@/types/fileUploadTypes'
import { EFilter } from '@/types/filterTypes'
import { makeHeaders } from '@/utils/exportData'

import { BtnWithTooltips, ExportButton } from '../Button'
import Commit from '../Commit'
import CrudTable from '../CrudTable'
import { FilterList } from '../Filter'
import Search from '../Search'
import { ILocalTable } from '../Table'

interface Props extends ILocalTable {
  data: any[]
  columns: any[]
  isLoading: boolean
  handleCommitData: (fee: number) => void
  selectStaged: any[]
  handleOpenDetails: (rowData: any) => void
  setSearchString: (searchField: string) => void
  searchPlaceholder?: string
  handleCreate: () => void
  title: string
  filter: EFilter
  exportFileName?: string
  exportData?: any[]
  onLoadImportData?: OnFileLoaded
  importHeader?: string[]
  importDataExample?: Record<string, any>[]
  withImport?: boolean
  lockWriteFunc?: boolean
}

const ListWithCommit = ({
  data,
  columns,
  isLoading,
  handleCommitData,
  selectStaged,
  handleOpenDetails,
  setSearchString,
  handleCreate,
  exportFileName,
  filter,
  title,
  searchPlaceholder,
  exportData,
  lockWriteFunc,
  ...props
}: Props) => {
  const { t } = useTranslation()
  return (
    <Grid container flex={1} flexDirection="column" pb={2}>
      <Grid container item justifyContent="space-between" flexDirection="row">
        <Grid item>
          <Typography variant="h5" mb={3}>
            {t(title)}
          </Typography>
        </Grid>
        <Grid item>
          <Commit
            handleCommit={handleCommitData}
            stagedCount={selectStaged.length}
            lockWriteFunc={lockWriteFunc}
          />
        </Grid>
      </Grid>
      <Grid container item flexDirection="column" component={Paper}>
        <Grid item alignSelf="flex-start" width="100%" p={2}>
          <Search
            onSearch={(searchField: string) => setSearchString(searchField)}
            onClear={() => setSearchString('')}
            placeHolder={searchPlaceholder}
            sx={{
              background: '#F0F7FA',
            }}
          />
        </Grid>
        <Grid item alignSelf="flex-start" width="100%">
          <Box
            sx={{
              px: 2,
              pb: 2,
            }}
          >
            <FilterList filter={filter} />
          </Box>
          <Divider />
        </Grid>
        <Grid
          item
          container
          direction="row"
          justifyContent="space-between"
          px={2}
          py={4}
        >
          <Grid item>
            <BtnWithTooltips
              startIcon={<Add />}
              disabled={lockWriteFunc}
              btnText="common:action.create"
              onClick={handleCreate}
              sx={{ borderRadius: '40px' }}
              size="large"
            />
          </Grid>
          <Grid
            item
            direction="row"
            container
            justifySelf="flex-end"
            maxWidth="fit-content"
            gap={1}
          >
            {/* {withImport && (
              <>
                <FileUploadButton
                    onLoaded={onLoadImportData}
                    acceptTypes={['.csv']}
                    title="common:action.import"
                    defaultHeader={importHeader}
                  />
                <ExportButton
                  data={importDataExample || []}
                  startIcon={<FilePresentOutlined />}
                  headers={
                    importHeader?.map((item) => ({
                      key: item,
                      label: item,
                    })) || []
                  }
                  filename={'example'}
                  title="common:action.import-example"
                />
              </>
            )} */}
            <ExportButton
              startIcon={<FileDownloadOutlined />}
              data={exportData || data}
              headers={makeHeaders(columns)}
              filename={exportFileName}
            />
          </Grid>
        </Grid>
        <Grid item flex={1} width="100%">
          <Divider />
          <CrudTable
            isLoading={isLoading}
            data={data}
            columns={columns}
            add={false}
            edit={false}
            remove={false}
            extraActions={(rowData) => (
              <Button
                onClick={() => handleOpenDetails(rowData)}
                variant="text"
                id="common:action.view"
              >
                {t('common:action.view')}
              </Button>
            )}
            defaultSorting={{ id: 'updatedAt', desc: true }}
            {...props}
          />
        </Grid>
      </Grid>
    </Grid>
  )
}

export default ListWithCommit
