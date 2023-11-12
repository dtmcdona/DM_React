import { Component } from 'react'
import './App.css'
import Menu from './components/Menu'
import StreamButton from './components/StreamButton'
import RecordButton from './components/RecordButton'
import RemoteControlButton from './components/RemoteControlButton'
import Recorder from './components/Recorder'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

class App extends Component {
  render() {
    return (
      <QueryClientProvider client={queryClient}>
        <nav>
          <StreamButton />
          <RecordButton />
          <RemoteControlButton />
        </nav>
        <div className='main--section'>
          <Recorder />
          <Menu />
        </div>
      </QueryClientProvider>
    )
  }
}

export default App
