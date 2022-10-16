function MenuInput({ key_name, value, type, updateSettingValue }) {
  const updateSettingField = (event) => {
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
    updateSettingValue(`${key_name.toUpperCase()}`, updatedValue)
  }

  return (
    <div key={key_name}>
      <input
        name={key_name}
        type={type}
        value={value}
        size='20'
        onChange={updateSettingField}
      />
    </div>
  )
}

export default MenuInput
