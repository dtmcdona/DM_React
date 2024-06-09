import { Component } from 'react'
import './App.css'
import Menu from './components/Menu'
import Recorder from './components/Recorder'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import NavBarControls from 'components/NavBarControls'
import { ControlsContextProvider } from './contexts/controls'
import { SettingsContextProvider } from './contexts/settings'

const queryClient = new QueryClient()

class App extends Component {
  render() {
    return (
      <QueryClientProvider client={queryClient}>
        <ControlsContextProvider>
          <NavBarControls />
          <div className='main--section'>
            <SettingsContextProvider>
              <Recorder />
              <Menu />
            </SettingsContextProvider>
          </div>
        </ControlsContextProvider>
      </QueryClientProvider>
    )
  }
}

export default App
