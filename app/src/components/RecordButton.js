import React from 'react'
import { connect } from 'react-redux'
import { controlToggle } from '../actions'

class RecordButton extends React.Component {
  render() {
    return (
      <button
        type='button'
        onClick={() => {
          this.props.controlToggle('RECORD', !this.props.recording)
        }}
        className='nav--options'
      >
        {this.props.recording ? 'Stop Recording' : 'Start Recording'}
      </button>
    )
  }
}

const mapStateToProps = (state) => {
  return { recording: state.controls.recording }
}

export default connect(mapStateToProps, { controlToggle })(RecordButton)
