export const capitalize = (str: string) => {
  const lowerCaseWords = [
    'of',
    'in',
    'for',
    'on',
    'with',
    'about',
    'over',
    'under',
    'beside',
    'between',
    'by',
    'through',
    'during',
    'before',
    'after',
    'a',
    'an',
    'the',
    'and',
    'but',
    'or',
    'yet',
    'so',
    'nor',
    'to',
    'at',
  ]
  const preserveWords = ['ID']

  return str
    .split(' ')
    .map((word, index) => {
      if (preserveWords.includes(word)) {
        return word
      }

      if (index === 0 || !lowerCaseWords.includes(word.toLowerCase())) {
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      }
      return word.toLowerCase()
    })
    .join(' ')
}
