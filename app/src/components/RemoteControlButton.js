import React from 'react'
import { connect } from 'react-redux'
import { controlToggle, remoteControlToggle } from '../actions'

class RemoteControlButton extends React.Component {
  handleClick = () => {
    this.props.controlToggle('REMOTE_CONTROL', !this.props.remote_controlling)
  }

  render() {
    return (
      <button type='button' onClick={this.handleClick} className='nav--options'>
        {this.props.remote_controlling
          ? 'Remote Control On'
          : 'Remote Control Off'}
      </button>
    )
  }
}

const mapStateToProps = (state) => {
  return { remote_controlling: state.controls.remote_controlling }
}

export default connect(mapStateToProps, { controlToggle })(RemoteControlButton)
