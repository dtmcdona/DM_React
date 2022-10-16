import React from 'react'
import { connect } from 'react-redux'
import { canvasDataReset, canvasDataSet } from '../actions'

class SnipImageButton extends React.Component {
  render() {
    return (
      <button
        type='button'
        onClick={async () => {
          if (!this.props.snip_image) {
            let url = this.props.settings.base_url + 'screenshot/'
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
        }}
        className='nav--options'
      >
        Snip image
      </button>
    )
  }
}

const mapStateToProps = (state) => {
  return { snip_image: state.canvasData.snip_image, settings: state.settings }
}

export default connect(mapStateToProps, { canvasDataReset, canvasDataSet })(
  SnipImageButton
)
