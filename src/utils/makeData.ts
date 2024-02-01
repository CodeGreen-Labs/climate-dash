import { faker } from '@faker-js/faker'

import { Issuance } from '@/types/climateWarehouseTypes'

export const generateMockIssuance = (): Issuance => {
  const issuance = {
    id: faker.datatype.uuid(),
    orgUid: faker.datatype.uuid(),
    warehouseProjectId: faker.datatype.uuid(),
    startDate: faker.date.past().toISOString(),
    endDate: faker.date.future().toISOString(),
    verificationApproach: faker.random.words(),
    verificationReportDate: faker.date.past().toISOString(),
    verificationBody: faker.company.name(),
    timeStaged: faker.date.recent().toISOString(),
    createdAt: faker.date.recent().toISOString(),
    updatedAt: faker.date.recent().toISOString(),
  }

  return issuance
}

export const generateMockRuleProjectInfo = () => {
  const ruleProjectInfo = {
    projectName: faker.company.name(),
    originProjectId: faker.datatype.uuid(),
    currentRegistry: faker.company.name(),
    projectLink: faker.internet.url(),
    projectDeveloper: faker.company.name(),
    program: faker.random.word(),
    sector: faker.random.word(),
    projectType: faker.random.word(),
    projectStatus: faker.random.word(),
    projectStatusDate: faker.date.past().toISOString(),
  }

  return ruleProjectInfo
}
