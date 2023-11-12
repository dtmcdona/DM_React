import React from 'react'
import { connect } from 'react-redux'
import { canvasDataSet } from '../actions'

class CanvasConsole extends React.Component {
  render() {
    return (
      <div className='canvas--console'>
        Stream console: {this.props.snip_prompt[this.props.snip_prompt_index]}
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    snip_prompt: state.canvasData.snip_prompt,
    snip_prompt_index: state.canvasData.snip_prompt_index,
  }
}

export default connect(mapStateToProps, { canvasDataSet })(CanvasConsole)
