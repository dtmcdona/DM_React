import MenuButton from './MenuButton'
import MenuInput from './MenuInput'
import { connect } from 'react-redux'
import { settingsValueSet } from '../actions'
import React from 'react'

class Menu extends React.Component {
  render() {
    return (
      <div className='menu--section'>
        <form>
          <h2>Menu</h2>
          <table>
            <tbody>
              {Object.entries(this.props.settings).map(([k, v]) => {
                const temp = k.replaceAll('_', ' ')
                let captialized_key =
                  temp.charAt(0).toUpperCase() + temp.slice(1)
                let input_type = 'text'
                if (typeof v === 'number') {
                  input_type = 'number'
                } else if (typeof v === 'boolean') {
                  return (
                    <tr key={k}>
                      <th>
                        <label>{captialized_key}</label>
                      </th>
                      <th>
                        <MenuButton
                          key_name={k}
                          value={v}
                          updateSettingValue={this.props.settingsValueSet}
                        />
                      </th>
                    </tr>
                  )
                }
                return (
                  <tr key={k}>
                    <th>
                      <label>{captialized_key}</label>
                    </th>
                    <th>
                      <MenuInput
                        key_name={k}
                        value={v}
                        type={input_type}
                        updateSettingValue={this.props.settingsValueSet}
                      />
                    </th>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </form>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return { settings: state.settings }
}

export default connect(mapStateToProps, { settingsValueSet })(Menu)
