import { Paper } from '@mui/material'
import { ReactNode, useCallback, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import UnitSelector from '@/components/Cadt/UnitSelector'
import { EditForm } from '@/components/Form'
import {
  useAddRuleMutation,
  useGetAllOrgsQuery,
  useGetKycLevelListQuery,
  useGetProjectByIdQuery,
  useGetProjectByOrgUidQuery,
  useGetRuleByTokenIdQuery,
  useGetUnitByIdQuery,
  useGetUnitsByOrgUidQuery,
  useUpdateRuleMutation,
} from '@/services'
import { Issuance } from '@/types/climateWarehouseTypes'
import { DetailFormRows, FormRowGroup } from '@/types/formTypes'
import { CreateRule } from '@/types/ruleApiTypes'
import type { RuleEditForm, RuleKeys } from '@/types/ruleTypes'
import { removePrefix0x, shortenHash } from '@/utils/chia'
import { findHomeOrg } from '@/utils/dataLayler'
import { formatDate, formatTime } from '@/utils/datetime'
import { createDetailRows, createFormColumn, styleTableRow } from '@/utils/form'
import { kycLevelTranslator } from '@/utils/translation'

const editAbleList: RuleKeys[] = ['rule.kyc_receiving', 'rule.kyc_retirement']

const RuleForm = () => {
  //  selected items for create rule
  const [selectedProjectId, setSelectedProjectId] = useState<string>()
  const [selectedIssuanceId, setSelectedIssuanceId] = useState<string>()
  const [selectedUnitId, setSelectedUnitId] = useState<string>()

  const navigate = useNavigate()
  const { data: kycLevels } = useGetKycLevelListQuery()

  const { catId: editId } = useParams()
  const { data: editState, isLoading: ruleIsLoading } =
    useGetRuleByTokenIdQuery(editId || '', {
      skip: !editId,
    })
  const { data: projectInfo, isLoading: projectIsLoading } =
    useGetProjectByIdQuery(editState?.warehouse_project_id || '', {
      skip: !editState?.warehouse_project_id,
    })
  const { data: unitInfo, isLoading: unitIsLoading } = useGetUnitByIdQuery(
    editState?.warehouse_unit_id || '',
    {
      skip: !editState?.warehouse_unit_id,
    }
  )

  const issuanceInfo = useMemo<Issuance | undefined>(() => {
    if (projectInfo) {
      return projectInfo.issuances.find((i) => i.id === editState?.issuance_id)
    }
  }, [projectInfo])

  const editData = useMemo(() => {
    if (editState) {
      return {
        rule: editState,
        project: projectInfo,
        issuance: issuanceInfo,
        unit: unitInfo,
      }
    }
  }, [editId, issuanceInfo, unitInfo])
  // api
  const [addRule] = useAddRuleMutation()
  const [updateRule] = useUpdateRuleMutation()

  const { data: allOrgs } = useGetAllOrgsQuery()
  const myOrg = findHomeOrg(allOrgs)
  // TODO - Change the id base on the current user registry
  const { data: projects } = useGetProjectByOrgUidQuery(myOrg, { skip: !myOrg })
  const { data: units } = useGetUnitsByOrgUidQuery(myOrg, { skip: !myOrg })
  const handleSaveData = async (data: RuleEditForm) => {
    const body = Object.assign({}, data)
    if (editId) {
      if (body.rule.kyc_receiving)
        body.rule.kyc_receiving = parseInt(String(body.rule.kyc_receiving))
      if (body.rule.kyc_retirement)
        body.rule.kyc_retirement = parseInt(String(body.rule.kyc_retirement))
      const filteredRule = body.rule
      delete filteredRule.commit_status
      delete filteredRule.createdAt
      delete filteredRule.updatedAt
      return await updateRule({ ...filteredRule, cat_id: editId }).unwrap()
    } else {
      const curProject = projects?.find(
        (item) => item.projectId === selectedProjectId
      )
      const curIssuance = curProject?.issuances?.find(
        (item) => item.id === selectedIssuanceId
      )
      const curUnit = units?.find((u) => u.warehouseUnitId === selectedUnitId)
      const newListItem: CreateRule = {
        origin_project_id: curProject?.originProjectId || '',
        warehouse_project_id: curProject?.warehouseProjectId || '',
        warehouse_unit_id: curUnit?.warehouseUnitId || '',
        issuance_id: curIssuance?.id || '',
        cat_id: curUnit?.marketplaceIdentifier || '',
        kyc_receiving: parseInt(String(data.rule?.kyc_receiving)) || 1,
        kyc_retirement: parseInt(String(data.rule?.kyc_retirement)) || 1,
        kyc_sending: parseInt(String(data.rule?.kyc_sending)) || 1,
      }
      return await addRule(newListItem)
    }
  }

  const handleOnSaveSuccess = () => {
    navigate({ pathname: '/rule' })
  }

  const handleOnSelectUnit = (unitId: string) => {
    if (unitId === selectedUnitId) setSelectedUnitId(() => '')
    else setSelectedUnitId(() => unitId || '')
  }

  const handleOnChange = useCallback((data: RuleEditForm) => {
    if (data?.project?.projectId) {
      setSelectedProjectId(data.project.projectId)
      if (data.issuance?.id) {
        setSelectedIssuanceId(data.issuance.id)
      } else {
        setSelectedIssuanceId(undefined)
        setSelectedUnitId(undefined)
      }
    } else {
      setSelectedProjectId(undefined)
      setSelectedIssuanceId(undefined)
      setSelectedUnitId(undefined)
    }
  }, [])
  const kycLevelOption = useMemo(
    () =>
      kycLevels?.map((item) => {
        return {
          value: item.level,
          label: kycLevelTranslator(kycLevels, item.level, false),
        }
      }),
    [kycLevels]
  )

  const projectOptions = useMemo(
    () =>
      projects?.map((item) => ({
        label: item.projectName,
        value: item.projectId,
      })),
    [projects]
  )

  const insuranceOptions = useMemo(() => {
    if (!selectedProjectId) return []
    const curProject = projects?.find(
      (item) => item.projectId === selectedProjectId
    )
    return (
      curProject?.issuances?.map((item) => ({
        label: `${formatDate(item.startDate)} - ${formatDate(item.endDate)}`,
        value: item.id,
      })) || []
    )
  }, [selectedProjectId])

  const curProject = useMemo(
    () => projects?.find((item) => item.projectId === selectedProjectId),
    [selectedProjectId]
  )

  const curIssuance = useMemo(
    () =>
      curProject?.issuances?.find(
        (item: Issuance) => item.id === selectedIssuanceId
      ),
    [selectedIssuanceId]
  )

  const selectedUnit = useMemo(
    () => units?.find((u) => u.warehouseUnitId === selectedUnitId),
    [selectedUnitId]
  )

  const createNewRuleRowGroups: FormRowGroup<any, any>[] = useMemo<
    FormRowGroup<RuleEditForm, any>[]
  >(() => {
    const projectExtensionRows = [
      [
        createFormColumn(
          'tableRow',
          'rule:data.project-developer',
          'project.projectDeveloper'
        ),
      ],
      [createFormColumn('tableRow', 'rule:data.program', 'project.program')],
      [createFormColumn('tableRow', 'rule:data.sector', 'project.sector')],
      [
        createFormColumn(
          'tableRow',
          'rule:data.project-type',
          'project.projectType'
        ),
      ],
      [
        createFormColumn(
          'tableRow',
          'rule:data.project-status',
          'project.projectStatus'
        ),
      ],
      [
        createFormColumn(
          'tableRow',
          'rule:data.project-status-date',
          'project.projectStatusDate',
          {
            cell: (value: any) => formatTime(value as string),
          }
        ),
      ],
    ]
    const projectRows = [
      [
        createFormColumn('title', 'rule:data.project-info', '', {
          hasRowDivider: true,
          columnSx: { p: 2 },
        }),
      ],
      [
        createFormColumn(
          'autocompleteSelector',
          'rule:data.project-name',
          'project.projectId',
          {
            options: projectOptions,

            resetOnChange: [
              'rule.kyc_receiving',
              'rule.kyc_retirement',
              'rule.kyc_sending',
              'issuance.id',
            ],
          }
        ),
      ],
    ]

    const issuanceRows = [
      [
        createFormColumn('title', 'rule:data.issuance-info', '', {
          hasRowDivider: true,
          columnSx: { py: 2 },
        }),
      ],
      [
        createFormColumn(
          'option',
          insuranceOptions?.length > 0 ? '' : 'common:no-option',
          'issuance.id',
          {
            options: insuranceOptions,
          }
        ),
      ],
    ]
    const kycRows = [
      [
        createFormColumn('title', 'rule:data.transaction-rules', '', {
          hasRowDivider: true,
          columnSx: { py: 2 },
        }),
      ],

      [
        createFormColumn(
          'popupRadio',
          'rule:data.kyc-for-token-sending',
          'rule.kyc_sending',
          {
            options: kycLevelOption,
            columnSx: {
              borderRight: 'rgba(0, 0, 0, 0.12) 1px solid',
            },
          }
        ),
        createFormColumn(
          'popupRadio',
          'rule:data.kyc-for-token-receiving',
          'rule.kyc_receiving',
          {
            options: kycLevelOption,
            columnSx: {
              borderRight: 'rgba(0, 0, 0, 0.12) 1px solid',
            },
          }
        ),

        createFormColumn(
          'popupRadio',
          'rule:data.kyc-for-token-retirement',
          'rule.kyc_retirement',
          {
            options: kycLevelOption,
          }
        ),
      ],
    ]
    if (selectedProjectId) {
      projectRows.push(
        [
          createFormColumn('subtitle', 'rule:data.project-details', '', {
            columnSx: { pl: 6 },
          }),
        ],
        [
          createFormColumn(
            'tableRow',
            'rule:data.project-name',
            'project.projectName'
          ),
        ],

        [
          createFormColumn(
            'tableRow',
            'rule:data.origin-project-id',
            'project.originProjectId'
          ),
        ],
        [
          createFormColumn(
            'tableRow',
            'rule:data.current-registry',
            'project.currentRegistry'
          ),
        ],
        [
          createFormColumn(
            'tableRow',
            'rule:data.project-link',
            'project.projectLink',
            {
              extensionRows: projectExtensionRows,
            }
          ),
        ]
      )
    }
    if (selectedIssuanceId) {
      issuanceRows.push(
        [
          createFormColumn('subtitle', 'rule:data.issuance-details', '', {
            columnSx: { pl: 6 },
          }),
        ],
        [
          createFormColumn(
            'tableRow',
            'rule:data.verification-period-start',
            'issuance.startDate',
            {
              cell: (info: unknown) => formatDate(info as unknown as string),
            }
          ),
        ],

        [
          createFormColumn(
            'tableRow',
            'rule:data.verification-period-end',
            'issuance.endDate',
            {
              cell: (info: unknown) => formatDate(info as unknown as string),
            }
          ),
        ],

        [
          createFormColumn(
            'tableRow',
            'rule:data.verification-body',
            'issuance.verificationBody'
          ),
        ],
        [
          createFormColumn(
            'tableRow',
            'rule:data.verification-approach',
            'issuance.verificationApproach'
          ),
        ],
        [createFormColumn('subtitle', 'rule:data.issuance-units')],
        [
          {
            type: 'customize',
            header: 'rule:data.unit-details',
            cell: () => (
              <UnitSelector
                units={
                  units?.filter((u) => u.issuanceId === selectedIssuanceId) ||
                  []
                }
                selectedUnitId={selectedUnitId}
                handleChange={handleOnSelectUnit}
              />
            ),
          },
        ]
      )
    }

    return [
      {
        warpComponent: (children: ReactNode) => <Paper>{children}</Paper>, // Adjust the wrapper component as needed
        rows: styleTableRow(projectRows, 0),
      },
      {
        warpComponent: (children: ReactNode) => (
          <Paper sx={{ mt: 5 }}>{children}</Paper>
        ), // Adjust the wrapper component as needed
        rows: styleTableRow(issuanceRows, 0),
      },
      {
        warpComponent: (children: ReactNode) => (
          <Paper sx={{ mt: 5 }}>{children}</Paper>
        ), // Adjust the wrapper component as needed
        rows: kycRows,
      },
    ]
  }, [
    kycLevels,
    projectOptions,
    kycLevelOption,
    insuranceOptions,
    selectedUnitId,
    selectedProjectId,
    selectedIssuanceId,
  ])

  const reviewRowGroups: FormRowGroup<any, any>[] = useMemo(() => {
    const unitRows = [
      [['tableRow', 'rule:data.unit-vintage-year', 'unit.vintageYear']],

      [
        [
          'tableRow',
          'rule:data.cat-id',
          'unit.marketplaceIdentifier',
          {
            cell: (value: any) => shortenHash(removePrefix0x(value as string)),
          },
        ],
      ],

      [['tableRow', 'rule:data.serial-number-block', 'unit.serialNumberBlock']],

      [['tableRow', 'rule:data.unit-count', 'unit.unitCount']],

      [['tableRow', 'rule:data.unit-owner', 'unit.unitOwner']],
    ]
    const projectExtensionRows = [
      [['tableRow', 'rule:data.project-developer', 'project.projectDeveloper']],

      [['tableRow', 'rule:data.program', 'project.program']],
      [['tableRow', 'rule:data.sector', 'project.sector']],
      [['tableRow', 'rule:data.project-type', 'project.projectType']],
      [['tableRow', 'rule:data.project-status', 'project.projectStatus']],
      [
        [
          'tableRow',
          'rule:data.project-status-date',
          'project.projectStatusDate',
          {
            cell: (value: any) => formatTime(value as string),
          },
        ],
      ],
    ]
    const projectRows = [
      [
        ['title', 'rule:data.project-info', ''],
        ['tableRow', 'rule:data.project-name', 'project.projectName'],
      ],

      [['tableRow', 'rule:data.origin-project-id', 'project.originProjectId']],

      [['tableRow', 'rule:data.current-registry', 'project.currentRegistry']],

      [
        [
          'tableRow',
          'rule:data.project-link',
          'project.projectLink',
          {
            extensionRows: projectExtensionRows,
          },
        ],
      ],
    ]

    const styledProjectRows = createDetailRows(projectRows as DetailFormRows)

    const issuanceRows = [
      [['divider']],
      [
        ['title', 'rule:data.issuance-info', ''],
        [
          'tableRow',
          'rule:data.verification-period-start',
          'issuance.startDate',
          {
            cell: (info: unknown) => formatDate(info as unknown as string),
          },
        ],
      ],

      [
        [
          'tableRow',
          'rule:data.verification-period-end',
          'issuance.endDate',
          {
            cell: (info: unknown) => formatDate(info as unknown as string),
          },
        ],
      ],

      [
        [
          'tableRow',
          'rule:data.verification-body',
          'issuance.verificationBody',
        ],
      ],

      [
        [
          'tableRow',
          'rule:data.verification-approach',
          'issuance.verificationApproach',
        ],
      ],
    ]

    const styleIssuanceAndUnitRows = createDetailRows([
      ...issuanceRows,
      ...unitRows,
    ] as DetailFormRows)

    const kycRows = [
      [['divider']],
      [
        ['title', 'rule:data.transaction-rules', ''],
        [
          'tableRow',
          'rule:data.kyc-for-token-sending',
          'rule.kyc_sending',
          {
            cell: (level: any) => kycLevelTranslator(kycLevels || [], level),
          },
        ],
      ],
      [
        [
          'tableRow',
          'rule:data.kyc-for-token-receiving',
          'rule.kyc_receiving',
          {
            cell: (level: any) => kycLevelTranslator(kycLevels || [], level),
          },
        ],
      ],

      [
        [
          'tableRow',
          'rule:data.kyc-for-token-retirement',
          'rule.kyc_retirement',
          {
            cell: (level: any) => kycLevelTranslator(kycLevels || [], level),
          },
        ],
      ],
    ]

    const styleKycRows = createDetailRows(kycRows as DetailFormRows)

    return [
      {
        warpComponent: (children: ReactNode) => (
          <Paper sx={{ py: 4, pl: 4 }}>{children}</Paper>
        ),
        rows: [
          ...styledProjectRows,
          ...styleIssuanceAndUnitRows,
          ...styleKycRows,
        ],
      },
    ]
  }, [curProject, curIssuance, selectedUnit])

  const editRowGroups = useMemo<FormRowGroup<RuleEditForm, any>[]>(() => {
    const unitRows = [
      [['tableRow', 'rule:data.unit-vintage-year', 'unit.vintageYear']],

      [
        [
          'tableRow',
          'rule:data.cat-id',
          'unit.marketplaceIdentifier',
          {
            cell: (value: any) => shortenHash(removePrefix0x(value as string)),
          },
        ],
      ],

      [['tableRow', 'rule:data.serial-number-block', 'unit.serialNumberBlock']],

      [['tableRow', 'rule:data.unit-count', 'unit.unitCount']],

      [['tableRow', 'rule:data.unit-owner', 'unit.unitOwner']],
    ]
    const projectExtensionRows = [
      [['tableRow', 'rule:data.project-developer', 'project.projectDeveloper']],

      [['tableRow', 'rule:data.program', 'project.program']],

      [['tableRow', 'rule:data.sector', 'project.sector']],

      [['tableRow', 'rule:data.project-type', 'project.projectType']],

      [['tableRow', 'rule:data.project-status', 'project.projectStatus']],

      [
        [
          'tableRow',
          'rule:data.project-status-date',
          'project.projectStatusDate',
          {
            cell: (value: any) => formatTime(value as string),
          },
        ],
      ],
    ]
    const projectRows = [
      [
        ['title', 'rule:data.project-info', ''],
        ['tableRow', 'rule:data.project-name', 'project.projectName'],
      ],

      [['tableRow', 'rule:data.origin-project-id', 'project.originProjectId']],

      [['tableRow', 'rule:data.current-registry', 'project.currentRegistry']],

      [
        [
          'tableRow',
          'rule:data.project-link',
          'project.projectLink',
          {
            extensionRows: projectExtensionRows,
          },
        ],
      ],
    ]

    const styledProjectRows = createDetailRows(projectRows as DetailFormRows)

    const issuanceRows = [
      [['divider']],
      [
        ['title', 'rule:data.issuance-info', ''],
        [
          'tableRow',
          'rule:data.verification-period-start',
          'issuance.startDate',
          {
            cell: (info: unknown) => formatDate(info as unknown as string),
          },
        ],
      ],

      [
        [
          'tableRow',
          'rule:data.verification-period-end',
          'issuance.endDate',
          {
            cell: (info: unknown) => formatDate(info as unknown as string),
          },
        ],
      ],

      [
        [
          'tableRow',
          'rule:data.verification-body',
          'issuance.verificationBody',
        ],
      ],

      [
        [
          'tableRow',
          'rule:data.verification-approach',
          'issuance.verificationApproach',
        ],
      ],
    ]

    const styledIssuanceAndUnitRows = createDetailRows([
      ...issuanceRows,
      ...unitRows,
    ] as DetailFormRows)

    const kycRows = [
      [
        createFormColumn('title', 'rule:data.transaction-rules', '', {
          columnSx: { py: 2, px: 4 },
          hasRowDivider: true,
        }),
      ],

      [
        createFormColumn(
          'popupRadio',
          'rule:data.kyc-for-token-sending',
          'rule.kyc_sending',
          {
            options: kycLevelOption,
            columnSx: {
              borderRight: 'rgba(0, 0, 0, 0.12) 1px solid',
            },
          }
        ),
        createFormColumn(
          'popupRadio',
          'rule:data.kyc-for-token-receiving',
          'rule.kyc_receiving',
          {
            options: kycLevelOption,
            columnSx: {
              borderRight: 'rgba(0, 0, 0, 0.12) 1px solid',
            },
          }
        ),
        createFormColumn(
          'popupRadio',
          'rule:data.kyc-for-token-retirement',
          'rule.kyc_retirement',
          {
            options: kycLevelOption,
          }
        ),
      ],
    ]

    return [
      {
        warpComponent: (children: ReactNode) => (
          <Paper sx={{ py: 3, pl: 4 }}>{children}</Paper>
        ),
        rows: [...styledProjectRows, ...styledIssuanceAndUnitRows],
      },
      {
        warpComponent: (children: ReactNode) => (
          <Paper sx={{ mt: 5, px: 0 }}>{children}</Paper>
        ),
        rows: [...kycRows],
      },
    ]
  }, [editState, kycLevels])
  return (
    <EditForm
      defaultValues={
        editId
          ? editData
          : {
              project: curProject,
              issuance: curIssuance,
              unit: selectedUnit,
              rule: {
                kyc_receiving: 1,
                kyc_retirement: 1,
                kyc_sending: 1,
              },
            }
      }
      isEdit={!!editId}
      editRowGroups={editId ? editRowGroups : createNewRuleRowGroups}
      reviewRowGroups={reviewRowGroups}
      editAbleList={editAbleList}
      createFormTitle={'rule:create'}
      onChange={(data) => handleOnChange(data)}
      onSave={async (data) => handleSaveData(data as RuleEditForm)}
      onSaveSuccess={handleOnSaveSuccess}
      warpFormComponent={Paper}
      disableSubmitBtn={
        editId
          ? false
          : !selectedProjectId || !selectedIssuanceId || !selectedUnitId
      }
      isLoading={ruleIsLoading || projectIsLoading || unitIsLoading}
    />
  )
}

export default RuleForm
