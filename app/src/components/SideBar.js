import {
  FaMousePointer,
  FaMouse,
  FaUndo,
  FaRegFileImage,
  FaRoute,
  FaRegArrowAltCircleRight,
} from 'react-icons/fa'
import React from 'react'
import { base_url, defaultHeaders } from './constants'

export default function SideBar({
  handleDeleteAction,
  lastActionId,
  mouseMode,
  setMouseMode,
  snipFrame,
  setSnipFrame,
  setStartMouseDrag,
  resetCanvasData,
}) {
  const handleMouseModeClick = () => {
    setMouseMode('click')
  }

  const handleMouseModeClickRight = () => {
    setMouseMode('click_right')
  }

  const handleMouseModeMove = () => {
    setMouseMode('move_to')
  }

  const handleMouseModeDrag = () => {
    setStartMouseDrag()
  }

  const handleSnipImage = async () => {
    if (snipFrame === '') {
      let url = base_url + 'screenshot/'
      let response = await fetch(url, { headers: defaultHeaders })
      if (response.ok) {
        let json = await response.json()
        console.log(json.data)
        setSnipFrame(json.data)
      } else {
        alert('HTTP-Error: ' + response.status)
      }
    } else {
      resetCanvasData()
    }
  }

  return (
    <>
      <h4>Actions:</h4>
      <ul>
        <li>
          <button onMouseDown={handleMouseModeClick}>
            {<FaMousePointer size='16' />}
            <br />
            {mouseMode === 'click' ? '(Active) Click Left' : 'Click Left'}
          </button>
        </li>
        <li>
          <button onMouseDown={handleMouseModeClickRight}>
            {<FaRegArrowAltCircleRight size='16' />}
            <br />
            {mouseMode === 'click_right'
              ? '(Active) Click Right'
              : 'Click Right'}
          </button>
        </li>
        <li>
          <button onMouseDown={handleMouseModeMove}>
            {<FaMouse size='16' />}
            <br />
            {mouseMode === 'move_to' ? '(Active) Move Mouse' : 'Move Mouse'}
          </button>
        </li>
        <li>
          <button onMouseDown={handleMouseModeDrag}>
            {<FaRoute size='16' />}
            <br />
            {mouseMode === 'drag_to' ? '(Active) Drag Mouse' : 'Drag Mouse'}
          </button>
        </li>
        <li>
          <button type='button' onMouseDown={handleSnipImage}>
            <FaRegFileImage size='16' />
            <br />
            Snip image
          </button>
        </li>
      </ul>
      <h4>Options:</h4>
      <ul>
        <li>
          <button name={lastActionId} onMouseDown={handleDeleteAction}>
            {<FaUndo size='16' />}
            <br />
            Undo Action
          </button>
        </li>
      </ul>
    </>
  )
}
