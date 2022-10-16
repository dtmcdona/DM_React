import React from 'react'
import { controlToggle, settingsValueSet } from '../actions'
import { connect } from 'react-redux'

class PlaybackButton extends React.Component {
  render() {
    return (
      <button
        type='button'
        onClick={() => {
          let url = this.props.base_url + 'execute-task/' + this.props.task_id
          let prev_recording = this.props.recording
          let prev_remote_control = this.props.remote_control
          this.props.controlToggle('RECORDING', false)
          this.props.controlToggle('REMOTE_CONTROL', false)
          this.props.controlToggle('PLAYBACK', true)
          try {
            fetch(url)
          } catch (err) {
            console.log(err)
          } finally {
            this.props.controlToggle('RECORDING', prev_recording)
            this.props.controlToggle('REMOTE_CONTROL', prev_remote_control)
            this.props.controlToggle('PLAYBACK', false)
          }
        }}
        className='nav--options'
      >
        {this.props.playback ? 'Task Playing' : 'Start Task'}
      </button>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    recording: state.controls.recording,
    remote_control: state.controls.remote_control,
    playback: state.controls.playback,
    base_url: state.settings.base_url,
    task_id: state.settings.task_id,
  }
}

export default connect(mapStateToProps, { controlToggle, settingsValueSet })(
  PlaybackButton
)
