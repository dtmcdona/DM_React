import { Component } from 'react'
import ActionContainer from './ActionContainer'
import { connect } from 'react-redux'
import {
  canvasDataReset,
  canvasDataSet,
  canvasSetCoords,
  controlToggle,
  settingsValueSet,
} from '../actions'
import Canvas from './Canvas'
import SideBar from './SideBar'
import CanvasConsole from './CanvasConsole'
import { base_url, logging } from './constants'

var task_id = ''
var action_list = []
var snip_list = []
var timestamp = Date.now()

function Action(
  id,
  func,
  x1,
  x2,
  y1,
  y2,
  images,
  image_conditions,
  variables,
  variable_conditions,
  comparison_values,
  time_delay,
  sleep_duration,
  key_pressed,
  true_case,
  false_case,
  error_case,
  num_repeats,
  random_path,
  random_range,
  random_delay
) {
  return {
    id: id,
    function: func,
    x1: x1,
    y1: y1,
    x2: x2,
    y2: y2,
    images: images,
    image_conditions: image_conditions,
    variables: variables,
    variable_conditions: variable_conditions,
    comparison_values: comparison_values,
    time_delay: time_delay,
    sleep_duration: sleep_duration,
    key_pressed: key_pressed,
    true_case: true_case,
    false_case: false_case,
    error_case: error_case,
    num_repeats: num_repeats,
    random_path: random_path,
    random_range: random_range,
    random_delay: random_delay,
    component: 'action',
  }
}

const get_request_api = (path) => {
  let url = `${base_url}${path}`
  let xhr = new XMLHttpRequest()
  xhr.open('GET', url)

  xhr.setRequestHeader('Accept', 'application/json')
  xhr.setRequestHeader('Content-Type', 'application/json')
  xhr.setRequestHeader('Access-Control-Allow-Origin', '*')

  xhr.send()
}

class Recorder extends Component {
  constructor(props) {
    super(props)
    this.handleMouseMove = this.handleMouseMove.bind(this)
    this.handleClick = this.handleClick.bind(this)
    this.handleKeyPress = this.handleKeyPress.bind(this)
    this.state = { x: 0, y: 0, task_id: '' }
  }

  getTimeDelta = () => {
    let now = Date.now()
    let deltaTime = (now - timestamp) / 1000
    timestamp = now
    this.props.canvasDataSet('DELTA_TIME', deltaTime)
  }

  create_action = (action_type) => {
    this.getTimeDelta()
    let function_params = ''
    if (
      action_type === 'click' ||
      action_type === 'click_right' ||
      action_type === 'move_to'
    ) {
      function_params = `, "x1": ${this.state.x}, "y1": ${this.state.y}`
    } else if (action_type === 'drag_to') {
      function_params = `, "x1": ${this.props.snip_x1}, "y1": ${this.props.snip_y1}, "x2": ${this.props.snip_x2}, "y2": ${this.props.snip_y2}`
    } else if (
      action_type === 'click_image' ||
      action_type === 'move_to_image'
    ) {
      function_params = `, "images": ["${snip_list[snip_list.length - 1]}"]`
    } else if (action_type === 'key_pressed') {
      function_params = `, "key_pressed": "${this.props.key_pressed}"`
    }
    if (this.props.random_enabled) {
      if (this.props.random_mouse_path) {
        let temp = function_params
        function_params = `${temp}, "random_path": true`
      }
      if (this.props.random_mouse_position) {
        let temp = function_params
        function_params = `${temp}, "random_range": ${this.props.random_mouse_range}`
      }
      if (this.props.random_mouse_delay) {
        let temp = function_params
        function_params = `${temp}, "random_delay": ${this.props.random_mouse_max_delay}`
      }
    }

    let data = `{"function": "${action_type}"${function_params}, "time_delay": ${this.props.delta_time}}`

    const url = this.props.remote_controlling
      ? `${base_url}add-execute-action/`
      : `${base_url}add-action/`

    let xhr = new XMLHttpRequest()
    xhr.open('POST', url)

    xhr.setRequestHeader('Accept', 'application/json')
    xhr.setRequestHeader('Content-Type', 'application/json')
    xhr.setRequestHeader('Access-Control-Allow-Origin', '*')

    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        let json_data = JSON.parse(xhr.responseText)
        console.log(json_data)
        action_list.push(
          new Action(
            json_data.id,
            json_data.function,
            json_data.x1,
            json_data.x2,
            json_data.y1,
            json_data.y2,
            json_data.images,
            json_data.image_conditions,
            json_data.variables,
            json_data.variable_conditions,
            json_data.comparison_values,
            json_data.time_delay,
            json_data.sleep_duration,
            json_data.key_pressed,
            json_data.true_case,
            json_data.false_case,
            json_data.error_case,
            json_data.num_repeats,
            json_data.random_path,
            json_data.random_range,
            json_data.random_delay
          )
        )
      }
    }

    xhr.send(data)
  }

  capture_screen_data = () => {
    let url =
      `${base_url}capture-screen-data/${this.props.snip_x1}/${this.props.snip_y1}` +
      `/${this.props.snip_x2}/${this.props.snip_y2}/-1`

    let xhr = new XMLHttpRequest()
    xhr.open('GET', url)

    xhr.setRequestHeader('Accept', 'application/json')
    xhr.setRequestHeader('Content-Type', 'application/json')
    xhr.setRequestHeader('Access-Control-Allow-Origin', '*')

    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        let json_data = JSON.parse(xhr.responseText)
        action_list.push(
          new Action(
            json_data.id,
            json_data.function,
            json_data.x1,
            json_data.x2,
            json_data.y1,
            json_data.y2,
            json_data.images,
            json_data.image_conditions,
            json_data.variables,
            json_data.variable_conditions,
            json_data.comparison_values,
            json_data.time_delay,
            json_data.sleep_duration,
            json_data.key_pressed,
            json_data.true_case,
            json_data.false_case,
            json_data.error_case,
            json_data.num_repeats,
            json_data.random_path,
            json_data.random_range,
            json_data.random_delay
          )
        )
      }
    }

    xhr.send()
  }

  handleMouseMove = (event) => {
    let x_offset = 10 / this.props.screen_x_scale
    let y_offset = 70 / this.props.screen_y_scale
    this.setState({
      x: event.clientX / this.props.screen_x_scale - x_offset,
      y: event.clientY / this.props.screen_y_scale - y_offset,
    })
  }

  handleSaveTask = () => {
    let url = ''
    if (task_id === '') {
      url = `${base_url}add-task`
    } else {
      url = `${base_url}update-task/${task_id}`
    }
    let action_id_list = ''
    for (let i = 0; i < action_list.length; i++) {
      if (i === 0) {
        action_id_list = action_id_list + `"${action_list[i].id}"`
      } else {
        action_id_list = action_id_list + `, "${action_list[i].id}"`
      }
    }

    let data = `{"id": "${this.state.task_id}", "action_id_list": [${action_id_list}]}`

    let xhr = new XMLHttpRequest()
    xhr.open('POST', url)

    xhr.setRequestHeader('Accept', 'application/json')
    xhr.setRequestHeader('Content-Type', 'application/json')
    xhr.setRequestHeader('Access-Control-Allow-Origin', '*')

    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        let json_data = JSON.parse(xhr.responseText)
        task_id = json_data.id
      }
    }

    xhr.send(data)
  }

  handleNewTask = async () => {
    this.setState({
      task_id: '',
    })
    task_id = ''
  }

  handlePlayTask = async () => {
    let prev_recording = this.props.recording
    let prev_remote_controlling = this.props.remote_controlling
    this.props.controlToggle('RECORD', false)
    this.props.controlToggle('REMOTE_CONTROL', false)
    this.props.controlToggle('PLAYBACK', true)
    if (logging) {
      console.log('Task started')
    }
    try {
      await get_request_api(`execute-task/${task_id}`)
    } catch (err) {
      if (logging) {
        console.log(err)
      }
    } finally {
      this.props.controlToggle('RECORD', prev_recording)
      this.props.controlToggle('REMOTE_CONTROL', prev_remote_controlling)
      this.props.controlToggle('PLAYBACK', false)
      if (logging) {
        console.log('Task finished')
      }
    }
  }

  handleClick = (event) => {
    let x_offset = 10 / this.props.screen_x_scale
    let y_offset = 70 / this.props.screen_y_scale
    this.setState({
      x: event.clientX / this.props.screen_x_scale - x_offset,
      y: event.clientY / this.props.screen_y_scale - y_offset,
    })
    if (logging) {
      console.log(`Mouse clicked (${this.state.x}, ${this.state.y})`)
    }
    if (
      this.state.x >= 0 &&
      this.state.x <= this.props.screen_width &&
      this.state.y >= 0 &&
      this.state.y <= this.props.screen_height
    ) {
      if (this.props.mouse_mode === 'drag_to') {
        if (this.props.snip_x1 === 0) {
          this.props.canvasSetCoords(6, this.state.x, this.state.y, 0, 0)
        } else if (this.props.snip_x2 === 0) {
          this.props.canvasSetCoords(
            0,
            this.props.snip_x1,
            this.props.snip_y1,
            this.state.x,
            this.state.y
          )
          if (this.props.recording) {
            //Create drag_to action
            this.create_action('drag_to')
          } else {
            get_request_api(
              `mouse-drag/${this.props.snip_x1}/${this.props.snip_y1}` +
                `/${this.state.x}/${this.state.y}`
            )
          }
          //Clear data
          this.props.canvasDataReset(false)
          this.props.controlToggle('MOUSE_MODE', 'click')
        }
      } else if (this.props.snipping_image) {
        if (this.props.snip_x1 === 0) {
          this.props.canvasSetCoords(2, this.state.x, this.state.y, 0, 0)
          if (logging) {
            console.log('Captured x1 and y1')
          }
        } else if (this.props.snip_x2 === 0) {
          this.props.canvasSetCoords(
            3,
            this.props.snip_x1,
            this.props.snip_y1,
            this.state.x,
            this.state.y
          )
          if (logging) {
            console.log('Captured x2 and y2')
          }
        }
      } else if (this.props.streaming && this.props.recording) {
        this.create_action(this.props.mouse_mode)
        if (logging) {
          console.log(`Mouse ${this.props.mouse_mode} sent to Fast API`)
        }
      }
      if (
        !this.props.recording &&
        this.props.streaming &&
        this.props.remote_controlling
      ) {
        if (this.props.mouse_mode === 'click') {
          get_request_api(`mouse-click/${this.state.x}/${this.state.y}/left`)
        } else if (this.props.mouse_mode === 'click_right') {
          get_request_api(`mouse-click/${this.state.x}/${this.state.y}/right`)
        } else if (this.props.mouse_mode === 'move') {
          get_request_api(`mouse-move/${this.state.x}/${this.state.y}`)
        }
      }
    }
  }

  handleKeyPress = (event) => {
    if (logging) {
      console.log('Key pressed: ' + event.key)
    }
    if (this.props.snip_prompt_index === 3) {
      if (event.key === '1') {
        this.props.canvasDataSet('SNIP_PROMPT_INDEX', 4)
      }
      if (event.key === '1' || event.key === '2') {
        //Save image and push file name to snip_list
        if (
          this.props.snip_x1 !== 0 &&
          this.props.snip_x2 !== 0 &&
          this.props.snip_y1 !== 0 &&
          this.props.snip_y2 !== 0
        ) {
          let data = '{"base64str": "' + this.props.snip_frame + '"}'
          let url =
            `${base_url}screen-snip/${this.props.snip_x1}/${this.props.snip_y1}/` +
            `${this.props.snip_x2}/${this.props.snip_y2}/`

          let xhr = new XMLHttpRequest()
          xhr.open('POST', url)

          xhr.setRequestHeader('Accept', 'application/json')
          xhr.setRequestHeader('Content-Type', 'application/json')
          xhr.setRequestHeader('Access-Control-Allow-Origin', '*')

          xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
              let json_data = JSON.parse(xhr.responseText)
              let new_snip_file_name = json_data.id + '.png'
              snip_list.push(new_snip_file_name)
            }
          }

          xhr.send(data)
          if (event.key === '2') {
            this.props.canvasDataReset(false)
          }
        } else if (logging) {
          console.log('Error with snip image prompt')
        }
      } else if (event.key === '3') {
        //Restart
        this.props.canvasDataReset(false)
      }
    } else if (this.props.snip_prompt_index === 4) {
      if (event.key === '1') {
        //Create click_image action
        this.create_action('click_image')
        //Clear data
        this.props.canvasDataReset(false)
      } else if (event.key === '2') {
        //Create move_to_image action
        this.create_action('move_to_image')
        //Clear data
        this.props.canvasDataReset(false)
      } else if (event.key === '3') {
        //Create move_to_image action
        this.capture_screen_data('store_value')
        //Clear data
        this.props.canvasDataReset(false)
      }
    } else if (
      this.state.x >= 0 &&
      this.state.x <= this.props.screen_width &&
      this.state.y >= 0 &&
      this.state.y <= this.props.screen_height
    ) {
      if (this.props.streaming && this.props.recording) {
        this.props.canvasDataSet('KEY_PRESSED', String(event.key))
        this.create_action('key_pressed')
      }
      if (
        !this.props.recording &&
        this.props.streaming &&
        this.props.remote_controlling
      ) {
        get_request_api('keypress/' + event.key)
      }
    }
  }

  handleDeleteAction = (event) => {
    if (action_list.length > 0) {
      const id = event.target.name
      if (logging) {
        console.log('Delete action:' + id)
      }
      let index = 0
      for (let i = 0; i < action_list.length; i++) {
        if (action_list[i].id === id) {
          index = i
          break
        }
      }
      action_list.splice(index, 1)
      get_request_api('delete-action/' + id)
    }
  }

  componentDidMount() {
    window.document.addEventListener('keyup', this.handleKeyPress)
  }
  componentWillUnmount() {
    document.removeEventListener('keyup', this.handleKeyPress, false)
  }

  render() {
    return (
      <div onMouseMove={this.handleMouseMove} onMouseDown={this.handleClick}>
        <div className='canvas--group'>
          <div className='canvas--view'>
            <Canvas
              height={this.props.screen_height * this.props.screen_y_scale}
              width={this.props.screen_width * this.props.screen_x_scale}
              screen_fps={this.props.screen_fps}
              screen_x_scale={this.props.screen_x_scale}
              screen_y_scale={this.props.screen_y_scale}
              snip_frame={this.props.snip_frame}
              snip_x1={this.props.snip_x1}
              snip_x2={this.props.snip_x2}
              snip_y1={this.props.snip_y1}
              snip_y2={this.props.snip_y2}
              streaming={this.props.streaming}
            />
            <CanvasConsole />
          </div>
          <div className='canvas--toolbox'>
            <SideBar
              lastActionId={action_list.at(-1)?.id}
              handleDeleteAction={this.handleDeleteAction}
            />
          </div>
        </div>
        <div className='actions--section'>
          <h2>Task</h2>
          <input
            onChange={(e) =>
              this.setState({
                task_id: e.target.value,
              })
            }
            placeholder='Enter task name'
          />
          <button onMouseDown={this.handleSaveTask}>Save</button>
          <button onMouseDown={this.handleNewTask}>New</button>
          {!this.props.playing_back && (
            <button onMouseDown={this.handlePlayTask}>Start Task</button>
          )}
          {this.props.playing_back && 'Task Playing'}
          <h3>Task actions</h3>
          <table>
            <tbody>
              <tr>
                <th>Function</th>
                <th>Parameters</th>
                <th>Delete</th>
              </tr>
              {action_list.map((block) => (
                <ActionContainer
                  key={`${block.id}-component`}
                  block={block}
                  event_func={this.handleDeleteAction}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    //Controls
    playing_back: state.controls.playing_back,
    recording: state.controls.recording,
    remote_controlling: state.controls.remote_controlling,
    streaming: state.controls.streaming,
    mouse_mode: state.controls.mouse_mode,
    //CanvasData
    delta_time: state.canvasData.delta_time,
    key_pressed: state.canvasData.key_pressed,
    screen_fps: state.canvasData.screen_fps,
    screen_width: state.canvasData.screen_width,
    screen_height: state.canvasData.screen_height,
    screen_timer_max: state.canvasData.screen_timer_max,
    screen_x_scale: state.canvasData.screen_x_scale,
    screen_y_scale: state.canvasData.screen_y_scale,
    snip_frame: state.canvasData.snip_frame,
    snip_prompt_index: state.canvasData.snip_prompt_index,
    snip_x1: state.canvasData.snip_x1,
    snip_x2: state.canvasData.snip_x2,
    snip_y1: state.canvasData.snip_y1,
    snip_y2: state.canvasData.snip_y2,
    snipping_image: state.canvasData.snipping_image,
    //Settings
    random_enabled: state.settings.random_enabled,
    random_mouse_delay: state.settings.random_mouse_delay,
    random_mouse_path: state.settings.random_mouse_path,
    random_mouse_position: state.settings.random_mouse_position,
    random_mouse_max_delay: state.settings.random_mouse_max_delay,
    random_mouse_range: state.settings.random_mouse_range,
  }
}

export default connect(mapStateToProps, {
  controlToggle,
  canvasDataSet,
  canvasSetCoords,
  canvasDataReset,
  settingsValueSet,
})(Recorder)
