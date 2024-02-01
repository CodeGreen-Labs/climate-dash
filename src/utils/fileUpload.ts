const custom_csv_parser = (line: string): string[] => {
  const values = []
  let in_quotes = false
  let current_value = ''

  for (const char of line) {
    if (char === '"') {
      in_quotes = !in_quotes
    } else if (char === ',' && !in_quotes) {
      values.push(current_value.trim())
      current_value = ''
    } else {
      current_value += char
    }
  }

  // Append the last value
  values.push(current_value.trim())

  return values
}

export { custom_csv_parser }
