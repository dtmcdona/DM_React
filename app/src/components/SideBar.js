import {
  FaMousePointer,
  FaMouse,
  FaUndo,
  FaRegFileImage,
  FaRoute,
  FaRegArrowAltCircleRight,
} from 'react-icons/fa'
import { connect } from 'react-redux'
import {
  canvasDataReset,
  canvasDataSet,
  canvasSetCoords,
  controlToggle,
} from '../actions'
import React from 'react'
import { base_url } from './constants'

class SideBar extends React.Component {
  handleMouseModeClick = () => {
    this.props.controlToggle('MOUSE_MODE', 'click')
  }

  handleMouseModeClickRight = () => {
    this.props.controlToggle('MOUSE_MODE', 'click_right')
  }

  handleMouseModeMove = () => {
    this.props.controlToggle('MOUSE_MODE', 'move_to')
  }

  handleMouseModeDrag = () => {
    this.props.canvasSetCoords(5, 0, 0, 0, 0)
    this.props.controlToggle('MOUSE_MODE', 'drag_to')
  }

  handleSnipImage = async () => {
    if (!this.props.snipping_image) {
      let url = base_url + 'screenshot/'
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
      <>
        <h4>Actions:</h4>
        <ul>
          <li>
            <button onClick={this.handleMouseModeClick}>
              {<FaMousePointer size='16' />}
              <br />
              {this.props.mouse_mode === 'click'
                ? '(Active) Click Left'
                : 'Click Left'}
            </button>
          </li>
          <li>
            <button onClick={this.handleMouseModeClickRight}>
              {<FaRegArrowAltCircleRight size='16' />}
              <br />
              {this.props.mouse_mode === 'click_right'
                ? '(Active) Click Right'
                : 'Click Right'}
            </button>
          </li>
          <li>
            <button onClick={this.handleMouseModeMove}>
              {<FaMouse size='16' />}
              <br />
              {this.props.mouse_mode === 'move_to'
                ? '(Active) Move Mouse'
                : 'Move Mouse'}
            </button>
          </li>
          <li>
            <button onClick={this.handleMouseModeDrag}>
              {<FaRoute size='16' />}
              <br />
              {this.props.mouse_mode === 'drag_to'
                ? '(Active) Drag Mouse'
                : 'Drag Mouse'}
            </button>
          </li>
          <li>
            <button type='button' onClick={this.handleSnipImage}>
              <FaRegFileImage size='16' />
              <br />
              Snip image
            </button>
          </li>
        </ul>
        <h4>Options:</h4>
        <ul>
          <li>
            <button
              name={this.props.lastActionId}
              onClick={this.props.handleDeleteAction}
            >
              {<FaUndo size='16' />}
              <br />
              {'Undo Action'}
            </button>
          </li>
        </ul>
      </>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    mouse_mode: state.controls.mouse_mode,
    snipping_image: state.canvasData.snipping_image,
  }
}

export default connect(mapStateToProps, {
  controlToggle,
  canvasDataReset,
  canvasDataSet,
  canvasSetCoords,
})(SideBar)
