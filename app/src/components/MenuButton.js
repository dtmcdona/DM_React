import { useMemo } from 'react'

function MenuButton({ key_name, value, updateSettingValue }) {
  const updateValue = (event) => {
    updateSettingValue(`${event.target.name.toUpperCase()}`, !value)
  }

  return useMemo(
    () => (
      <div key={key_name}>
        <button name={key_name} type='button' onClick={updateValue}>
          {value ? 'On' : 'Off'}
        </button>
      </div>
    ),
    [value]
  )
}

export default MenuButton
