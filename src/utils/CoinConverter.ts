import Decimal from 'decimal.js-light'

type Amount = number | string

const isValidInput = (amount: Amount): boolean => {
  try {
    const value = new Decimal(amount)
    return Boolean(value)
  } catch (err) {
    return false
  }
}

const ensureValidInput = (amount: Amount): void => {
  if (!isValidInput(amount)) {
    throw new Error('Invalid input')
  }
}

export const catToMojo = (catAmount: Amount): Decimal => {
  ensureValidInput(catAmount)
  return new Decimal(catAmount).mul(new Decimal(10).pow(3))
}

export const xchToMojo = (xchAmount: Amount): Decimal => {
  ensureValidInput(xchAmount)
  return new Decimal(xchAmount).mul(new Decimal(10).pow(12))
}

export const mojoToCat = (catAmount: Amount): Decimal => {
  ensureValidInput(catAmount)
  return new Decimal(catAmount).div(new Decimal(10).pow(3))
}

export const mojoToXch = (xchAmount: Amount): Decimal => {
  ensureValidInput(xchAmount)
  return new Decimal(xchAmount).div(new Decimal(10).pow(12))
}

export const mojoToDisplayBalance = (
  amount: number | string,
  assetId?: string
) => {
  if (assetId) {
    return mojoToCat(amount).toFixed(3).toString()
  } else {
    return mojoToXch(amount).toFixed().toString()
  }
}
