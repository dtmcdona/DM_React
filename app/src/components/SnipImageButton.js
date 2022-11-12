import React from 'react'
import { connect } from 'react-redux'
import { canvasDataReset, canvasDataSet } from '../actions'

class SnipImageButton extends React.Component {
  handleClick = async () => {
    if (!this.props.snipping_image) {
      let url = this.props.base_url + 'screenshot/'
      let response = await fetch(url)
      if (response.ok) {
        let json = await response.json()
        this.props.canvasDataSet('SNIP_FRAME', json.data)
      } else {
        alert('HTTP-Error: ' + response.status)
      }
    } else {
      this.props.canvasDataReset()
    }
  }

  render() {
    return (
      <button type='button' onClick={this.handleClick} className='nav--options'>
        Snip image
      </button>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    snipping_image: state.canvasData.snipping_image,
    base_url: state.settings.base_url,
  }
}

export default connect(mapStateToProps, { canvasDataReset, canvasDataSet })(
  SnipImageButton
)
