import MenuButton from './MenuButton'
import MenuInput from './MenuInput'
import React from 'react'
import { useSettingsContext } from '../contexts/settings'

export default function Menu() {
  const {
    randomEnabled,
    setRandomEnabled,
    randomMouseDelay,
    setRandomMouseDelay,
    randomMousePath,
    setRandomMousePath,
    randomMousePosition,
    setRandomMousePosition,
    randomMouseMaxDelay,
    setRandomMouseMaxDelay,
    randomMouseRange,
    setRandomMouseRange,
  } = useSettingsContext()

  return (
    <div className='menu--section'>
      <form>
        <h2>Menu</h2>
        <table>
          <tbody>
            <tr key='randomEnabled'>
              <th>
                <label>Random enabled</label>
              </th>
              <th>
                <MenuButton
                  name='randomEnabled'
                  value={randomEnabled}
                  setValue={setRandomEnabled}
                />
              </th>
            </tr>
            <tr key='randomMousePath'>
              <th>
                <label>Random mouse path</label>
              </th>
              <th>
                <MenuButton
                  name='randomMousePath'
                  value={randomMousePath}
                  setValue={setRandomMousePath}
                />
              </th>
            </tr>
            <tr key='randomMousePosition'>
              <th>
                <label>Random mouse position</label>
              </th>
              <th>
                <MenuButton
                  name='randomMousePosition'
                  value={randomMousePosition}
                  setValue={setRandomMousePosition}
                />
              </th>
            </tr>
            <tr key='randomMouseRange'>
              <th>
                <label>Random mouse range</label>
              </th>
              <th>
                <MenuInput
                  name='randomMouseRange'
                  value={randomMouseRange}
                  setValue={setRandomMouseRange}
                />
              </th>
            </tr>
            <tr key='randomMouseDelay'>
              <th>
                <label>Random mouse delay</label>
              </th>
              <th>
                <MenuButton
                  name='randomMouseDelay'
                  value={randomMouseDelay}
                  setValue={setRandomMouseDelay}
                />
              </th>
            </tr>
            <tr key='randomMouseMaxDelay'>
              <th>
                <label>Random mouse max delay</label>
              </th>
              <th>
                <MenuInput
                  name='randomMouseMaxDelay'
                  value={randomMouseMaxDelay}
                  setValue={setRandomMouseMaxDelay}
                />
              </th>
            </tr>
          </tbody>
        </table>
      </form>
    </div>
  )
}
