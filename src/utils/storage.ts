export function setStorage<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value))
}
export function getStorage<T>(key: string): T | null {
  const value = localStorage.getItem(key)
  return value ? JSON.parse(value) : null
}

export function removeStorage(key: string): void {
  localStorage.removeItem(key)
}
