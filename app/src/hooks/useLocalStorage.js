import { useEffect, useState } from 'react'

export function useLocalStorage(name, defaultValue) {
  const [value, setValue] = useState(() => {
    if (localStorage.getItem(name)) {
      return JSON.parse(localStorage.getItem(name))
    }
    return defaultValue
  })

  useEffect(() => {
    localStorage.setItem(name, JSON.stringify(value))
  }, [name, value])

  return [value, setValue]
}
