import { ControlButton } from './ControlButton'
import { useControlsContext } from '../contexts/controls'

export default function NavBarControls() {
  const {
    streaming,
    setStreaming,
    recording,
    setRecording,
    remoteControlling,
    setRemoteControlling,
  } = useControlsContext()
  return (
    <nav>
      <ControlButton
        value={streaming}
        setValue={setStreaming}
        enabledText={'Stop Stream'}
        disabledText={'Start Stream'}
      />
      <ControlButton
        value={recording}
        setValue={setRecording}
        enabledText={'Stop Recording'}
        disabledText={'Start Recording'}
      />
      <ControlButton
        value={remoteControlling}
        setValue={setRemoteControlling}
        enabledText={'Remote Control On'}
        disabledText={'Remote Control Off'}
      />
    </nav>
  )
}
