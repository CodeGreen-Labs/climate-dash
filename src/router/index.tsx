import { walletApi } from '@codegreen-labs/api-react'
import { createHashRouter, LoaderFunction, redirect } from 'react-router-dom'

import { IClimateToken } from '@/hooks/chia/useClimateTokens'
import Layout from '@/layout'
import CommitLayout from '@/layout/CommitLayout'
import Explorer, { ExplorerDetail } from '@/pages/Explorer'
import KycList, {
  KycDashboard,
  KycDetails,
  KycForm,
  KycImportPreview,
} from '@/pages/Kyc'
import NotFound from '@/pages/NotFound'
import RuleList, {
  RuleDashboard,
  RuleDetails,
  RuleForm,
  RuleViolatingDetails,
} from '@/pages/Rule'
import RuleImportPreview from '@/pages/Rule/RuleImportPreview'
import Wallet, {
  CreateMnemonic,
  ImportMnemonic,
  Send,
  WalletDetail,
} from '@/pages/Wallet'
import Retire from '@/pages/Wallet/Retire/Retire'
import { climateWarehouseApi } from '@/services'
import store from '@/store'
import { IWallet } from '@/types/chiaApi'
import { prefix0x } from '@/utils/chia'

const climateTokenLoader: LoaderFunction<{
  params: { assetId: string }
}> = async ({ params: { assetId: _assetId } }): Promise<IClimateToken> => {
  if (!_assetId) {
    throw new Response('Invalid assetId', { status: 404 })
  }
  const assetId = prefix0x(_assetId)
  const { data: units } = await store.dispatch(
    climateWarehouseApi.endpoints.getAllUnits.initiate({})
  )
  const { data: wallets } = await store.dispatch(
    walletApi.endpoints.getWallets.initiate()
  )

  const wallet = (wallets as IWallet[])?.find(
    (w) => prefix0x(w.meta.assetId) === assetId
  )
  const unit = units?.find(
    (u) => prefix0x(u.marketplaceIdentifier || '') === assetId
  )

  if (!wallet || !unit) {
    throw new Response('Invalid assetId', { status: 404 })
  }
  return {
    assetId,
    walletId: wallet.id,
    unitId: unit.warehouseUnitId,
    projectId: unit.issuance.warehouseProjectId,
  }
}

const router = createHashRouter([
  {
    path: '/',
    children: [
      { loader: () => redirect('/kyc'), index: true },
      {
        path: 'kyc',
        children: [
          {
            element: <Layout />,
            children: [
              {
                index: true,
                element: (
                  <CommitLayout>
                    <KycList />
                  </CommitLayout>
                ),
              },
              { path: 'dashboard', element: <KycDashboard /> },
            ],
          },
          {
            element: <Layout displayMenu={false} />,
            children: [
              { path: 'details/:address', element: <KycDetails /> },
              { path: 'create/', element: <KycForm /> },
              { path: 'edit/:address', element: <KycForm /> },
              { path: 'import-preview', element: <KycImportPreview /> },
            ],
          },
        ],
      },
      {
        path: 'rule',
        children: [
          {
            element: <Layout />,
            children: [
              {
                index: true,
                element: (
                  <CommitLayout>
                    <RuleList />
                  </CommitLayout>
                ),
              },
              { path: 'dashboard/', element: <RuleDashboard /> },
            ],
          },
          {
            element: <Layout displayMenu={false} />,
            children: [
              { path: 'details/:catId', element: <RuleDetails /> },
              { path: 'create/', element: <RuleForm /> },
              { path: 'edit/:catId', element: <RuleForm /> },
              {
                path: 'violating/:txId',
                element: <RuleViolatingDetails />,
              },
              { path: 'import-preview', element: <RuleImportPreview /> },
            ],
          },
        ],
      },
      {
        path: 'wallet',
        children: [
          {
            element: <Layout fullWidth />,
            children: [
              {
                element: <Wallet />,
                children: [
                  { index: true, element: <></> },
                  {
                    path: 'detail/:assetId',
                    loader: climateTokenLoader,
                    element: <WalletDetail />,
                  },
                ],
              },
            ],
          },
          {
            element: <Layout displayMenu={false} />,
            children: [
              {
                path: 'send/:assetId',
                loader: climateTokenLoader,
                element: <Send />,
              },
              {
                path: 'retire/:assetId',
                loader: climateTokenLoader,
                element: <Retire />,
              },
              { path: 'import-mnemonic', element: <ImportMnemonic /> },
              { path: 'create-mnemonic', element: <CreateMnemonic /> },
            ],
          },
        ],
      },
      {
        path: 'explorer',
        children: [
          {
            element: <Layout fullWidth />,
            children: [{ index: true, element: <Explorer /> }],
          },
          {
            element: <Layout displayMenu={false} fullWidth />,
            children: [
              { path: 'details/:assetId', element: <ExplorerDetail /> },
            ],
          },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
])

export default router
