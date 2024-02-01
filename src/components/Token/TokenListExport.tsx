import { ExportButton } from '@/components/Button'
import { useTypedSelector } from '@/store'

const TokenListExport = () => {
  const exportAssetList = useTypedSelector(
    (state) => state.wallet.exportAssetList
  )

  return (
    <ExportButton
      data={Object.values(exportAssetList)}
      headers={[
        { label: 'External Project ID', key: 'warehouseProjectId' },
        { label: 'Asset Id', key: 'assetId' },
        { label: 'Name', key: 'projectName' },
        { label: 'Vintage Year', key: 'vintageYear' },
        { label: 'Current Registry', key: 'currentRegistry' },
        { label: 'Quantity Held', key: 'balance' },
      ]}
      filename="Token-List"
    />
  )
}

export default TokenListExport
