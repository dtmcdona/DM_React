import Canvas from './Canvas'
import SideBar from './SideBar'
import CanvasConsole from './CanvasConsole'
import {
  base_url,
  logging,
  screenHeight,
  screenWidth,
  screenXScale,
  screenYScale,
} from './constants'
import { getTimeDelta } from 'helpers'
import React, { useEffect, useState } from 'react'
import { useControlsContext } from '../contexts/controls'
import Action from './Action'
import { useSettingsContext } from '../contexts/settings'
import { useCanvasData } from '../hooks/useCanvasData'

const get_request_api = (path) => {
  let url = `${base_url}${path}`
  let xhr = new XMLHttpRequest()
  xhr.open('GET', url)

  xhr.setRequestHeader('Accept', 'application/json')
  xhr.setRequestHeader('Content-Type', 'application/json')
  xhr.setRequestHeader('Access-Control-Allow-Origin', '*')

  xhr.send()
}

export default function Recorder() {
  const [x, setX] = useState(0)
  const [y, setY] = useState(0)
  const [taskId, setTaskId] = useState('')
  const [playingTask, setPlayingTask] = useState(false)
  const [actionList, setActionList] = useState([])
  const [actionTimestamp, setActionTimestamp] = useState(Date.now())
  const {
    streaming,
    recording,
    setRecording,
    remoteControlling,
    setRemoteControlling,
  } = useControlsContext()
  const {
    randomEnabled,
    randomMouseDelay,
    randomMousePath,
    randomMousePosition,
    randomMouseMaxDelay,
    randomMouseRange,
  } = useSettingsContext()
  const {
    mouseMode,
    snipFrame,
    snipId,
    snipPromptIndex,
    x1,
    y1,
    x2,
    y2,
    resetCanvasData,
    setMouseMode,
    setSnipFrame,
    setSnipId,
    setSnipTopLeft,
    setSnipBottomRight,
    setSnipPromptIndex,
    setStartMouseDrag,
    setDragStart,
    setDragEnd,
  } = useCanvasData()

  const create_action = (
    action_type,
    canvasX = null,
    canvasY = null,
    keyPressed = null
  ) => {
    const deltaTime = getTimeDelta(actionTimestamp)
    setActionTimestamp(Date.now())
    let function_params = ''
    if (
      action_type === 'click' ||
      action_type === 'click_right' ||
      action_type === 'move_to'
    ) {
      function_params = `, "x1": ${canvasX}, "y1": ${canvasY}`
    } else if (action_type === 'drag_to') {
      function_params = `, "x1": ${x1}, "y1": ${y1}, "x2": ${
        canvasX || x2
      }, "y2": ${canvasY || y2}`
    } else if (
      action_type === 'click_image' ||
      action_type === 'move_to_image'
    ) {
      function_params = `, "images": ["${snipId}"]`
    } else if (action_type === 'key_pressed') {
      function_params = `, "key_pressed": "${keyPressed}"`
    }
    if (randomEnabled) {
      if (randomMousePath) {
        let temp = function_params
        function_params = `${temp}, "random_path": true`
      }
      if (randomMousePosition) {
        let temp = function_params
        function_params = `${temp}, "random_range": ${randomMouseRange}`
      }
      if (randomMouseDelay) {
        let temp = function_params
        function_params = `${temp}, "random_delay": ${randomMouseMaxDelay}`
      }
    }

    let data = `{"function": "${action_type}"${function_params}, "time_delay": ${deltaTime}}`

    const url = remoteControlling
      ? `${base_url}add-execute-action/`
      : `${base_url}add-action/`

    let xhr = new XMLHttpRequest()
    xhr.open('POST', url)

    xhr.setRequestHeader('Accept', 'application/json')
    xhr.setRequestHeader('Content-Type', 'application/json')
    xhr.setRequestHeader('Access-Control-Allow-Origin', '*')

    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        const newAction = JSON.parse(xhr.responseText)
        if (newAction?.data !== 'No screen objects found') {
          setActionList([...actionList, newAction])
        }
      }
    }

    xhr.send(data)
  }

  const capture_screen_data = () => {
    let url = `${base_url}capture-screen-data/${x1}/${y1}/${x2}/${y2}/-1`

    let xhr = new XMLHttpRequest()
    xhr.open('GET', url)

    xhr.setRequestHeader('Accept', 'application/json')
    xhr.setRequestHeader('Content-Type', 'application/json')
    xhr.setRequestHeader('Access-Control-Allow-Origin', '*')

    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        const newAction = JSON.parse(xhr.responseText)
        setActionList([...actionList, newAction])
      }
    }

    xhr.send()
  }

  const handleMouseMove = (event) => {
    let x_offset = 10 / screenXScale
    let y_offset = 70 / screenYScale
    setX(event.clientX / screenXScale - x_offset)
    setY(event.clientY / screenYScale - y_offset)
  }

  const handleSaveTask = () => {
    let url = ''
    if (taskId === '') {
      url = `${base_url}add-task`
    } else {
      url = `${base_url}update-task/${taskId}`
    }
    let actionIds = ''
    for (let i = 0; i < actionList.length; i++) {
      if (i === 0) {
        actionIds = actionIds + `"${actionList[i].id}"`
      } else {
        actionIds = actionIds + `, "${actionList[i].id}"`
      }
    }

    let data = `{"id": "${taskId}", "action_id_list": [${actionIds}]}`

    let xhr = new XMLHttpRequest()
    xhr.open('POST', url)

    xhr.setRequestHeader('Accept', 'application/json')
    xhr.setRequestHeader('Content-Type', 'application/json')
    xhr.setRequestHeader('Access-Control-Allow-Origin', '*')

    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        let jsonData = JSON.parse(xhr.responseText)
        setTaskId(jsonData.id)
      }
    }

    xhr.send(data)
  }

  const handleNewTask = async () => {
    setTaskId('')
  }

  const handlePlayTask = async () => {
    let prevRecording = recording
    let prevRemoteControlling = remoteControlling
    setRecording(false)
    setRemoteControlling(false)
    setPlayingTask(true)
    if (logging) {
      console.log('Task started')
    }
    try {
      await get_request_api(`execute-task/${taskId}`)
    } catch (err) {
      if (logging) {
        console.log(err)
      }
    } finally {
      setRecording(prevRecording)
      setRemoteControlling(prevRemoteControlling)
      setPlayingTask(false)
      if (logging) {
        console.log('Task finished')
      }
    }
  }

  const handleClick = (event) => {
    let x_offset = 10 / screenXScale
    let y_offset = 70 / screenYScale
    const canvasX = event.clientX / screenXScale - x_offset
    const canvasY = event.clientY / screenYScale - y_offset
    if (logging) {
      console.log(`Mouse clicked (${x}, ${y})`)
    }
    if (
      canvasX >= 0 &&
      canvasX <= screenWidth &&
      canvasY >= 0 &&
      canvasY <= screenHeight
    ) {
      if (mouseMode === 'drag_to') {
        if (x1 === 0) {
          setDragStart(canvasX, canvasY)
        } else if (x2 === 0) {
          setDragEnd(canvasX, canvasY)
          if (recording) {
            create_action('drag_to', canvasX, canvasY)
          } else {
            get_request_api(`mouse-drag/${x1}/${y1}/${canvasX}/${canvasY}`)
          }
          resetCanvasData()
        }
      } else if (snipFrame !== '') {
        if (x1 === 0) {
          setSnipTopLeft(canvasX, canvasY)
          if (logging) {
            console.log('Captured x1 and y1')
          }
        } else if (x2 === 0) {
          setSnipBottomRight(canvasX, canvasY)
          if (logging) {
            console.log('Captured x2 and y2')
          }
        }
      } else if (streaming && recording) {
        create_action(mouseMode, canvasX, canvasY)
        if (logging) {
          console.log(`Mouse ${mouseMode} sent to Fast API`)
        }
      }
      if (!recording && streaming && remoteControlling) {
        if (mouseMode === 'click') {
          get_request_api(`mouse-click/${canvasX}/${canvasY}/left`)
        } else if (mouseMode === 'click_right') {
          get_request_api(`mouse-click/${canvasX}/${canvasY}/right`)
        } else if (mouseMode === 'move') {
          get_request_api(`mouse-move/${canvasX}/${canvasY}`)
        }
      }
    }
  }

  const handleKeyPress = (event) => {
    event.preventDefault()
    const key = String(event.key)
    if (logging) {
      console.log('Key pressed: ' + event.key)
    }
    if (snipPromptIndex === 3) {
      if (key === '1' || key === '2') {
        //Save image and save snipId
        if (x1 !== 0 && y1 !== 0 && x2 !== 0 && y2 !== 0) {
          let data = '{"base64str": "' + snipFrame + '"}'
          let url = `${base_url}screen-snip/${x1}/${y1}/${x2}/${y2}/`

          let xhr = new XMLHttpRequest()
          xhr.open('POST', url)

          xhr.setRequestHeader('Accept', 'application/json')
          xhr.setRequestHeader('Content-Type', 'application/json')
          xhr.setRequestHeader('Access-Control-Allow-Origin', '*')

          xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
              let jsonData = JSON.parse(xhr.responseText)
              setSnipId(`${jsonData.id}.png`)
              if (key === '2') {
                resetCanvasData()
              }
            }
          }

          xhr.send(data)
        }
      } else if (key === '3') {
        resetCanvasData()
      }
    } else if (snipPromptIndex === 4) {
      console.log('Created Action')
      if (key === '1') {
        create_action('click_image')
        resetCanvasData()
      } else if (key === '2') {
        create_action('move_to_image')
        resetCanvasData()
      } else if (key === '3') {
        capture_screen_data()
        resetCanvasData()
      }
    } else if (x >= 0 && x <= screenWidth && y >= 0 && y <= screenHeight) {
      if (streaming && recording) {
        create_action('key_pressed', null, null, key)
      }
      if (!recording && streaming && remoteControlling) {
        get_request_api(`keypress/${key}`)
      }
    }
  }

  const handleDeleteAction = (event) => {
    if (actionList.length > 0) {
      const id = event.target.name
      if (logging) {
        console.log('Delete action:' + id)
      }
      setActionList(actionList.filter((action) => action.id !== id))
      get_request_api('delete-action/' + id)
    }
  }

  useEffect(() => {
    window.document.addEventListener('keyup', handleKeyPress)

    return () => {
      document.removeEventListener('keyup', handleKeyPress, false)
    }
  })

  return (
    <>
      <div onMouseMove={handleMouseMove} onMouseDown={handleClick}>
        <div className='canvas--group'>
          <div className='canvas--view'>
            <Canvas
              snipFrame={snipFrame}
              streaming={streaming}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
            />
            <CanvasConsole snipPromptIndex={snipPromptIndex} />
          </div>
          <div className='canvas--toolbox'>
            <SideBar
              handleDeleteAction={handleDeleteAction}
              lastActionId={actionList.at(-1)?.id}
              mouseMode={mouseMode}
              setMouseMode={setMouseMode}
              snipFrame={snipFrame}
              setSnipFrame={setSnipFrame}
              setSnipPromptIndex={setSnipPromptIndex}
              setStartMouseDrag={setStartMouseDrag}
              resetCanvasData={resetCanvasData}
            />
          </div>
        </div>
      </div>
      <div className='actions--section'>
        <h2>Task</h2>
        <input
          onChange={(e) => setTaskId(e.target.value)}
          placeholder='Enter task name'
        />
        <button onMouseDown={handleSaveTask}>Save</button>
        <button onMouseDown={handleNewTask}>New</button>
        {!playingTask && (
          <button onMouseDown={handlePlayTask}>Start Task</button>
        )}
        {playingTask && 'Task Playing'}
        <h3>Task actions</h3>
        <table>
          <tbody>
            <tr>
              <th>Function</th>
              <th>Parameters</th>
              <th>Delete</th>
            </tr>
            {actionList.map((action) => (
              <Action
                key={action.id}
                block={action}
                deleteAction={handleDeleteAction}
              />
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
