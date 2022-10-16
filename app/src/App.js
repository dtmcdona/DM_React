import { Component } from 'react'
import './App.css'
import Menu from './components/Menu'
import StreamButton from './components/StreamButton'
import RecordButton from './components/RecordButton'
import RemoteControlButton from './components/RemoteControlButton'
import PlaybackButton from './components/PlaybackButton'
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
          <PlaybackButton />
          <SnipImageButton />
        </nav>
        <Recorder />
      </>
    )
  }
}

export default App
