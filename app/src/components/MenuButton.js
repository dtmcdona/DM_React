function MenuButton({ key_name, value, updateSettingValue }) {
  const updateValue = () => {
    updateSettingValue(`${key_name.toUpperCase()}`, !value)
  }

  return (
    <div key={key_name}>
      <button type='button' onClick={updateValue}>
        {value ? 'On' : 'Off'}
      </button>
    </div>
  )
}

export default MenuButton
