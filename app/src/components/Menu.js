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
    <>
      <form>
        <h2>Menu</h2>
        <div className='menu--list'>
          <div className='menu--row' key='randomEnabled'>
            <label>Random enabled</label>
            <MenuButton
              name='randomEnabled'
              value={randomEnabled}
              setValue={setRandomEnabled}
            />
          </div>
          <div className='menu--row' key='randomMousePath'>
            <label>Random mouse path</label>
            <MenuButton
              name='randomMousePath'
              value={randomMousePath}
              setValue={setRandomMousePath}
            />
          </div>
          <div className='menu--row' key='randomMousePosition'>
            <label>Random mouse position</label>
            <MenuButton
              name='randomMousePosition'
              value={randomMousePosition}
              setValue={setRandomMousePosition}
            />
          </div>
          <div className='menu--row' key='randomMouseRange'>
            <label>Random mouse range</label>
            <MenuInput
              name='randomMouseRange'
              value={randomMouseRange}
              setValue={setRandomMouseRange}
            />
          </div>
          <div className='menu--row' key='randomMouseDelay'>
            <label>Random mouse delay</label>
            <MenuButton
              name='randomMouseDelay'
              value={randomMouseDelay}
              setValue={setRandomMouseDelay}
            />
          </div>
          <div className='menu--row' key='randomMouseMaxDelay'>
            <label>Random mouse max delay</label>
            <MenuInput
              name='randomMouseMaxDelay'
              value={randomMouseMaxDelay}
              setValue={setRandomMouseMaxDelay}
            />
          </div>
        </div>
      </form>
    </>
  )
}
