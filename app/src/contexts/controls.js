import React, { createContext, useContext, useMemo, useState } from 'react'

export const ControlsContext = createContext(null)

export function ControlsContextProvider({ children }) {
  const [streaming, setStreaming] = useState(false)
  const [recording, setRecording] = useState(false)
  const [remoteControlling, setRemoteControlling] = useState(false)

  const value = useMemo(
    () => ({
      streaming,
      setStreaming,
      recording,
      setRecording,
      remoteControlling,
      setRemoteControlling,
    }),
    [
      streaming,
      setStreaming,
      recording,
      setRecording,
      remoteControlling,
      setRemoteControlling,
    ]
  )

  return (
    <ControlsContext.Provider value={value}>
      {children}
    </ControlsContext.Provider>
  )
}

export function useControlsContext() {
  const context = useContext(ControlsContext)
  if (!context) {
    throw new Error(
      'useControlContext must be used within a ControlContextProvider'
    )
  }
  return context
}
