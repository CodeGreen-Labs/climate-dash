import dayjs from 'dayjs'
import { describe, expect, it } from 'vitest'

import { flattenObject } from '@/utils/tableData'

describe('flattenObject', () => {
  const input = {
    user: {
      name: { firstName: 'John', lastName: 'Doe' },
      address: 'test address',
    },
    id: '123',
    expired_date: dayjs(),
  }
  const excludedKeys = ['expired_date']

  const expectedOutput = {
    'walletUser.name.firstName': 'John',
    'walletUser.name.lastName': 'Doe',
    'walletUser.address': 'test address',
    id: '123',
    expired_date: input.expired_date,
  }

  it('should flatten the object correctly', () => {
    const result = flattenObject(excludedKeys, input)
    expect(result).toEqual(expectedOutput)
  })
})
