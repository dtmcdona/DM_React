import React from 'react'
import { connect } from 'react-redux'
import { controlToggle, remoteControlToggle } from '../actions'

class RemoteControlButton extends React.Component {
  render() {
    return (
      <button
        type='button'
        onClick={() => {
          this.props.controlToggle('REMOTE_CONTROL', !this.props.remote_control)
        }}
        className='nav--options'
      >
        {this.props.remote_control ? 'Remote Control On' : 'Remote Control Off'}
      </button>
    )
  }
}

const mapStateToProps = (state) => {
  return { remote_control: state.controls.remote_control }
}

export default connect(mapStateToProps, { controlToggle })(RemoteControlButton)
