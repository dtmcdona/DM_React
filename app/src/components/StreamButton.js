import React from 'react'
import { connect } from 'react-redux'
import { controlToggle } from '../actions'

class StreamButton extends React.Component {
  handleClick = () => {
    this.props.controlToggle('STREAM', !this.props.streaming)
  }
  render() {
    return (
      <button
        type='button'
        onMouseDown={this.handleClick}
        className='nav--options'
      >
        {this.props.streaming ? 'Stop Stream' : 'Start Stream'}
      </button>
    )
  }
}

const mapStateToProps = (state) => {
  return { streaming: state.controls.streaming }
}

export default connect(mapStateToProps, { controlToggle })(StreamButton)
