import React from 'react'
import { connect } from 'react-redux'
import { controlToggle } from '../actions'

class RecordButton extends React.Component {
  handleClick = () => {
    this.props.controlToggle('RECORD', !this.props.recording)
  }

  render() {
    return (
      <button
        type='button'
        onMouseDown={this.handleClick}
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
