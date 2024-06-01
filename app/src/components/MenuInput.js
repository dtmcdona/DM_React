import { useCallback, useMemo } from 'react'

function MenuInput({ name, defaultValue, value, setValue }) {
  const type = typeof defaultValue

  const updateValue = useCallback(
    (event) => {
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
      setValue(updatedValue)
    },
    [setValue]
  )

  return useMemo(
    () => (
      <div key={`${name}Input`}>
        <input name={name} type={type} value={value} onChange={updateValue} />
      </div>
    ),
    [name, value, updateValue]
  )
}

export default MenuInput
