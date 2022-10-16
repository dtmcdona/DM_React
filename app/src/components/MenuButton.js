function MenuButton({ key_name, value, updateSettingValue }) {
  return (
    <div key={key_name}>
      <button
        type='button'
        onClick={() => {
          updateSettingValue(`${key_name.toUpperCase()}`, !value)
        }}
      >
        {value ? 'On' : 'Off'}
      </button>
    </div>
  )
}

export default MenuButton
