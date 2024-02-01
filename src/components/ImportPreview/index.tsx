import { FilePresent } from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'
import { Button, Divider, Grid, Paper, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'

import { OnFileLoaded } from '@/types/fileUploadTypes'
import { ImportData } from '@/types/importDataTypes'

import FileUploadButton from '../Button/FileUploadButton'
import Table, { ILocalTable } from '../Table'

interface Props extends ILocalTable {
  data: ImportData<any, any>
  filename: string
  onCancel: () => void
  onLoadImportData: OnFileLoaded
  removeFile: () => void
  onUpload: () => Promise<void>
  submitBtnDisabled: boolean
  isLoading: boolean
}

const ImportPreview = ({
  filename,
  data,
  columns,
  onCancel,
  onLoadImportData,
  removeFile,
  onUpload,
  submitBtnDisabled,
  isLoading,
}: Props) => {
  const { t } = useTranslation('common')

  return (
    <Grid flex={1} container flexDirection="column" gap={4} py={2}>
      <Typography variant="h5">
        {filename ? t('preview-data') : t('import-data.title')}
      </Typography>
      {filename && (
        <Grid
          item
          container
          flexDirection="row"
          component={Paper}
          p={3}
          height="88px"
          justifyContent="space-between"
          alignItems="center"
          overflow="auto"
        >
          <Grid item>
            <Grid container flexDirection="row">
              <FilePresent sx={{ mr: 1 }} />
              <Typography>{`${filename}`}</Typography>
            </Grid>
          </Grid>
          <Grid>
            <Button onClick={removeFile}>{t('action.remove')}</Button>
          </Grid>
        </Grid>
      )}
      {data.length || isLoading ? (
        <>
          <Grid item container component={Paper} flexDirection="column">
            <Grid item>
              <Typography variant="h6" p={3}>
                {t('preview-data')}
              </Typography>
              <Divider />
            </Grid>
            <Grid item maxWidth="100%" overflow="hidden">
              <Table
                data={data}
                columns={columns}
                isLoading={isLoading}
                withPagination={true}
                zebraRows={true}
                containerSx={{
                  borderRadius: '4px',
                  p: 2,
                }}
                cellSx={{
                  py: '4px',
                  px: 0,
                }}
                tableSx={{
                  borderRadius: '4px',
                  border: 0.5,
                  borderColor: 'lightgray',
                }}
              />
            </Grid>
          </Grid>
          <Grid item container justifyContent="flex-end" height={24}>
            <Button onClick={onCancel}>{t('action.cancel')}</Button>
            <LoadingButton
              variant="contained"
              disabled={submitBtnDisabled}
              loading={isLoading}
              onClick={() => onUpload()}
            >
              {t('action.upload')}
            </LoadingButton>
          </Grid>
        </>
      ) : (
        <FileUploadButton
          acceptTypes={['.csv']}
          title="action.import"
          withDropZone={!data.length}
          onLoaded={onLoadImportData}
        />
      )}
    </Grid>
  )
}
export default ImportPreview
