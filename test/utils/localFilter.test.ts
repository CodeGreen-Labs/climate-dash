import { describe, expect, it } from 'vitest'

import { localFilter } from '@/utils/tableData'

describe('localFilter', () => {
  const list = [
    {
      user: {
        ein: 'test',
        public_key: 'test',
        name: 'test',
        contact_address: 'test',
        email: 'test1@gmail.com',
      },
      kyc: 2,
      document_id: 'testtestupdated',
      expired_date: '2026-07-27',
      last_modified_time: '2023-06-06T08:23:11.479970',
      id: 'd90c8f33-e093-470e-a36c-06f9718f2911',
      status: 'Pending',
    },
    {
      user: {
        ein: 'test1',
        public_key: 'test1',
        name: 'test1',
        contact_address: 'test1',
        email: 'test1@gmail.com',
      },
      kyc: 1,
      document_id: 'test11',
      expired_date: '2023-06-05',
      last_modified_time: '2023-06-05T09:12:01.647129',
      id: 'd06bd6c4-28fe-4cc0-be04-99190b71a896',
      status: 'Expired',
    },
    {
      user: {
        ein: 'test2',
        public_key: 'test1',
        name: 'test1',
        contact_address: 'test1',
        email: 'test1@gmail.com',
      },
      kyc: 1,
      document_id: 'test11',
      expired_date: '2023-06-05',
      last_modified_time: '2023-06-05T09:12:01.647129',
      id: 'd06bd6c4-28fe-4cc0-be04-99190b71a896',
      status: 'Verified',
    },
  ]

  it('should filter the list based on the provided filter', () => {
    const filter = {
      status: ['Expired', 'Pending'],
    }

    const expectedOutput = [
      {
        user: {
          ein: 'test',
          public_key: 'test',
          name: 'test',
          contact_address: 'test',
          email: 'test1@gmail.com',
        },
        kyc: 2,
        document_id: 'testtestupdated',
        expired_date: '2026-07-27',
        last_modified_time: '2023-06-06T08:23:11.479970',
        id: 'd90c8f33-e093-470e-a36c-06f9718f2911',
        status: 'Pending',
      },
      {
        user: {
          ein: 'test1',
          public_key: 'test1',
          name: 'test1',
          contact_address: 'test1',
          email: 'test1@gmail.com',
        },
        kyc: 1,
        document_id: 'test11',
        expired_date: '2023-06-05',
        last_modified_time: '2023-06-05T09:12:01.647129',
        id: 'd06bd6c4-28fe-4cc0-be04-99190b71a896',
        status: 'Expired',
      },
    ]

    const filteredList = localFilter(filter, list)
    expect(filteredList).toEqual(expectedOutput)
  })
})
