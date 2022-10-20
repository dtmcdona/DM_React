import { Component } from 'react'
import './App.css'
import Menu from './components/Menu'
import StreamButton from './components/StreamButton'
import RecordButton from './components/RecordButton'
import RemoteControlButton from './components/RemoteControlButton'
import SnipImageButton from './components/SnipImageButton'
import Recorder from './components/Recorder'

class App extends Component {
  render() {
    return (
      <>
        <nav>
          <StreamButton />
          <RecordButton />
          <RemoteControlButton />
          <SnipImageButton />
        </nav>
        <div className='main--section'>
          <Recorder />
          <Menu />
        </div>
      </>
    )
  }
}

export default App
