import React, { useCallback } from 'react'

export function ControlButton({ value, setValue, enabledText, disabledText }) {
  const updateValue = useCallback(() => {
    setValue((prev) => !prev)
  }, [setValue])
  return (
    <button
      type='button'
      onMouseDown={updateValue}
      className={value ? 'nav--button--active' : 'nav--button'}
    >
      {value ? enabledText : disabledText}
    </button>
  )
}
