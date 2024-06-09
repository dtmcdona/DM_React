import React, { createContext, useContext, useMemo, useState } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'

export const SettingsContext = createContext(null)

export function SettingsContextProvider({ children }) {
  const [randomEnabled, setRandomEnabled] = useLocalStorage(
    'randomEnabled',
    false
  )
  const [randomMouseDelay, setRandomMouseDelay] = useLocalStorage(
    'randomMouseDelay',
    false
  )
  const [randomMousePath, setRandomMousePath] = useLocalStorage(
    'randomMousePath',
    false
  )
  const [randomMousePosition, setRandomMousePosition] = useLocalStorage(
    'randomMousePosition',
    false
  )
  const [randomMouseMaxDelay, setRandomMouseMaxDelay] = useLocalStorage(
    'randomMouseMaxDelay',
    0.5
  )
  const [randomMouseRange, setRandomMouseRange] = useLocalStorage(
    'randomMouseRange',
    4
  )

  const value = useMemo(
    () => ({
      randomEnabled,
      setRandomEnabled,
      randomMouseDelay,
      setRandomMouseDelay,
      randomMousePath,
      setRandomMousePath,
      randomMousePosition,
      setRandomMousePosition,
      randomMouseMaxDelay,
      setRandomMouseMaxDelay,
      randomMouseRange,
      setRandomMouseRange,
    }),
    [
      randomEnabled,
      setRandomEnabled,
      randomMouseDelay,
      setRandomMouseDelay,
      randomMousePath,
      setRandomMousePath,
      randomMousePosition,
      setRandomMousePosition,
      randomMouseMaxDelay,
      setRandomMouseMaxDelay,
      randomMouseRange,
      setRandomMouseRange,
    ]
  )

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettingsContext() {
  const context = useContext(SettingsContext)
  if (!context) {
    throw new Error(
      'useControlContext must be used within a ControlContextProvider'
    )
  }
  return context
}
