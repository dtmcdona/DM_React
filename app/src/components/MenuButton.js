import { useCallback, useMemo } from 'react'

function MenuButton({ name, value, setValue }) {
  const updateValue = useCallback(() => setValue((prev) => !prev), [setValue])
  return useMemo(
    () => (
      <div key={`${name}Input`}>
        <button
          name={name}
          type='button'
          className={value ? 'button--active' : ''}
          onClick={updateValue}
        >
          {value ? 'On' : 'Off'}
        </button>
      </div>
    ),
    [name, value, updateValue]
  )
}

export default MenuButton
