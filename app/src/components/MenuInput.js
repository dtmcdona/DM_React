import { useMemo } from 'react'

function MenuInput({ key_name, value, type, updateSettingValue }) {
  const updateValue = (event) => {
    const target = event.target
    const type = target.type
    const value = target.value
    let updatedValue = {}
    if (type === 'number') {
      updatedValue = parseFloat(value)
    } else if (type === 'checkbox') {
      updatedValue = JSON.parse(value.toLowerCase())
    } else {
      updatedValue = value
    }
    updateSettingValue(`${target.name.toUpperCase()}`, updatedValue)
  }

  return useMemo(
    () => (
      <div key={key_name}>
        <input
          name={key_name}
          type={type}
          value={value}
          onChange={updateValue}
        />
      </div>
    ),
    [value]
  )
}

export default MenuInput
