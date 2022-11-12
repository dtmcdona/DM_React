import { Component } from 'react'
import '../App.css'
import Components from './components'
import { connect } from 'react-redux'
import {
  canvasDataReset,
  canvasDataSet,
  canvasSetCoords,
  controlToggle,
  settingsValueSet,
} from '../actions'
import Canvas from './Canvas'

var task_id = 0
var action_list = []
var new_action_id = 0
var snip_list = []
var timestamp = Date.now()
const base_url = 'http://127.0.0.1:8003/'

function Action(
  id,
  name,
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
  let dict = {}
  dict['id'] = id
  dict['name'] = name
  dict['function'] = func
  dict['x1'] = x1
  dict['y1'] = y1
  dict['x2'] = x2
  dict['y2'] = y2
  dict['images'] = images
  dict['image_conditions'] = image_conditions
  dict['variables'] = variables
  dict['variable_conditions'] = variable_conditions
  dict['comparison_values'] = comparison_values
  dict['time_delay'] = time_delay
  dict['sleep_duration'] = sleep_duration
  dict['key_pressed'] = key_pressed
  dict['true_case'] = true_case
  dict['false_case'] = false_case
  dict['error_case'] = error_case
  dict['num_repeats'] = num_repeats
  dict['random_path'] = random_path
  dict['random_range'] = random_range
  dict['random_delay'] = random_delay
  dict['component'] = 'action'
  return dict
}

const get_request_api = (path) => {
  let url = base_url + path
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
    this.state = { x: 0, y: 0, logging: true, task_name: '' }
  }

  getTimeDelta = () => {
    let now = Date.now()
    let deltaTime = (now - timestamp) / 1000
    timestamp = now
    this.props.canvasDataSet('DELTA_TIME', deltaTime)
  }

  create_action = (action_type) => {
    this.getTimeDelta()
    const date = new Date()
    let timestamp = date.toISOString()
    let function_params = ''
    if (action_type === 'click') {
      let temp = function_params
      function_params =
        temp + ', "x1": ' + this.state.x + ', "y1": ' + this.state.y
    } else if (
      action_type === 'click_image' ||
      action_type === 'move_to_image'
    ) {
      let temp = function_params
      function_params =
        temp + ', "images": ["' + snip_list[snip_list.length - 1] + '", ""]'
    } else if (action_type === 'key_pressed') {
      let temp = function_params
      function_params =
        temp + ', "key_pressed": "' + this.props.key_pressed + '"'
    }
    if (this.props.random_enabled) {
      if (this.props.random_mouse_path) {
        let temp = function_params
        function_params = temp + ', "random_path": true'
      }
      if (this.props.random_mouse_position) {
        let temp = function_params
        function_params =
          temp + ', "random_range": ' + this.props.random_mouse_range
      }
      if (this.props.random_mouse_delay) {
        let temp = function_params
        function_params =
          temp + ', "random_delay": ' + this.props.random_mouse_max_delay
      }
    }

    let data =
      '{"name": "' +
      timestamp +
      '", "function": "' +
      action_type +
      '"' +
      function_params +
      ', "time_delay": ' +
      this.props.delta_time +
      '}'

    let url = base_url + 'add-action/'

    let xhr = new XMLHttpRequest()
    xhr.open('POST', url)

    xhr.setRequestHeader('Accept', 'application/json')
    xhr.setRequestHeader('Content-Type', 'application/json')
    xhr.setRequestHeader('Access-Control-Allow-Origin', '*')

    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        let json_data = JSON.parse(xhr.responseText)
        new_action_id = json_data.id
        action_list.push(
          new Action(
            json_data.id,
            json_data.name,
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

  capture_screen_data = (action_type) => {
    let url = ''
    if (action_type === 'store_value') {
      url =
        base_url +
        'capture-screen-data/' +
        this.props.snip_x1 +
        '/' +
        this.props.snip_y1 +
        '/' +
        this.props.snip_x2 +
        '/' +
        this.props.snip_y2 +
        '/-1'
    }

    let xhr = new XMLHttpRequest()
    xhr.open('GET', url)

    xhr.setRequestHeader('Accept', 'application/json')
    xhr.setRequestHeader('Content-Type', 'application/json')
    xhr.setRequestHeader('Access-Control-Allow-Origin', '*')

    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        let json_data = JSON.parse(xhr.responseText)
        new_action_id = json_data.id
        action_list.push(
          new Action(
            json_data.id,
            json_data.name,
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
        if (this.state.logging) {
          console.log(action_list)
          console.log(xhr.status)
          console.log(xhr.responseText)
        }
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
    let url = base_url + 'add-task'
    let action_id_list = []

    for (let i = 0; i < action_list.length; i++) {
      console.log(action_list[i].id)
      action_id_list.push(action_list[i].id)
    }

    let data =
      '{"name": "' +
      this.state.task_name +
      '", "action_id_list": [' +
      action_id_list +
      ']}'

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

  handlePlayTask = async () => {
    let url = this.props.base_url + 'execute-task/' + task_id
    let prev_recording = this.props.recording
    let prev_remote_controlling = this.props.remote_controlling
    this.props.controlToggle('RECORD', false)
    this.props.controlToggle('REMOTE_CONTROL', false)
    this.props.controlToggle('PLAYBACK', true)
    if (this.state.logging) {
      console.log('Task started')
    }
    try {
      await fetch(url)
    } catch (err) {
      if (this.state.logging) {
        console.log(err)
      }
    } finally {
      this.props.controlToggle('RECORD', prev_recording)
      this.props.controlToggle('REMOTE_CONTROL', prev_remote_controlling)
      this.props.controlToggle('PLAYBACK', false)
      if (this.state.logging) {
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
    if (this.state.logging) {
      console.log('Mouse clicked (' + this.state.x + ', ' + this.state.y + ')')
    }
    if (
      this.state.x >= 0 &&
      this.state.x <= this.props.screen_width &&
      this.state.y >= 0 &&
      this.state.y <= this.props.screen_height
    ) {
      if (this.props.snipping_image) {
        if (this.props.snip_x1 === 0) {
          this.props.canvasSetCoords(2, this.state.x, this.state.y, 0, 0)
          if (this.state.logging) {
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
          if (this.state.logging) {
            console.log('Captured x2 and y2')
          }
        }
      } else if (this.props.streaming && this.props.recording) {
        this.create_action('click')
        if (this.state.logging) {
          console.log('Mouse click sent to Fast API')
        }
      }
      if (
        new_action_id !== 0 &&
        this.props.streaming &&
        this.props.remote_controlling
      ) {
        get_request_api('execute-action/' + new_action_id)
      } else if (
        new_action_id === 0 &&
        this.props.streaming &&
        this.props.remote_controlling
      ) {
        get_request_api('mouse-click/' + this.state.x + '/' + this.state.y)
      }
    }
  }

  handleKeyPress = (event) => {
    if (this.state.logging) {
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
          console.log(data)
          let url =
            base_url +
            'screen-snip/' +
            this.props.snip_x1 +
            '/' +
            this.props.snip_y1 +
            '/' +
            this.props.snip_x2 +
            '/' +
            this.props.snip_y2 +
            '/'

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
        } else if (this.state.logging) {
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
        console.log('Keypress sent to Fast API')
        this.props.canvasDataSet('KEY_PRESSED', String(event.key))
        this.create_action('key_pressed')
      }
      if (
        new_action_id !== 0 &&
        this.props.streaming &&
        this.props.remote_controlling
      ) {
        get_request_api('execute-action/' + new_action_id)
      } else if (
        new_action_id === 0 &&
        this.props.streaming &&
        this.props.remote_controlling
      ) {
        get_request_api('keypress/' + event.key)
      }
    }
  }

  handleDeleteAction = (event) => {
    const id = parseInt(event.target.name, 10)
    if (this.state.logging) {
      console.log('Delete action:' + id)
    }
    var temp_id = 0
    let action_deleted = false
    console.log('Before delete', action_list)
    for (let i = 0; i < action_list.length; i++) {
      if (action_list[i]['id'] === id) {
        action_list.splice(i, 1)
        console.log('ID matched:' + id)
        if (action_list.length > i) {
          action_list[i]['id'] = id
        }
        action_deleted = true
        //console.log(action_list);
      } else if (action_deleted) {
        temp_id = action_list[i]['id']
        action_list[i]['id'] = temp_id - 1
      }
      console.log('After delete', action_list)
    }
    get_request_api('delete-action/' + id)
  }

  componentDidMount() {
    window.document.addEventListener('keyup', this.handleKeyPress)
  }
  componentWillUnmount() {
    document.removeEventListener('keyup', this.handleKeyPress, false)
  }

  render() {
    return (
      <div onMouseMove={this.handleMouseMove} onClick={this.handleClick}>
        <Canvas
          base_url={this.props.base_url}
          height={this.props.screen_height * this.props.screen_y_scale}
          width={this.props.screen_width * this.props.screen_x_scale}
          screen_fps={this.props.screen_fps}
          screen_timer_max={this.props.screen_timer_max}
          screen_x_scale={this.props.screen_x_scale}
          screen_y_scale={this.props.screen_y_scale}
          snip_frame={this.props.snip_frame}
          snip_prompt={this.props.snip_prompt[this.props.snip_prompt_index]}
          snip_prompt_index={this.props.snip_prompt_index}
          snip_x1={this.props.snip_x1}
          snip_x2={this.props.snip_x2}
          snip_y1={this.props.snip_y1}
          snip_y2={this.props.snip_y2}
          streaming={this.props.streaming}
        />
        <div className='actions--section'>
          <h2>Task</h2>
          <input
            onChange={(e) =>
              this.setState({
                task_name: e.target.value,
              })
            }
            placeholder='Enter task name'
          />
          <button onClick={this.handleSaveTask}>Save</button>
          {!this.props.playing_back && (
            <button onClick={this.handlePlayTask}>Start Task</button>
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
                <Components
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
  //console.log('Controls:', state.controls)
  //console.log('CanvasData:', state.canvasData)
  //console.log('Settings', state.settings)
  return {
    //Controls
    playing_back: state.controls.playing_back,
    recording: state.controls.recording,
    remote_controlling: state.controls.remote_controlling,
    streaming: state.controls.streaming,
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
    snip_prompt: state.canvasData.snip_prompt,
    snip_prompt_index: state.canvasData.snip_prompt_index,
    snip_x1: state.canvasData.snip_x1,
    snip_x2: state.canvasData.snip_x2,
    snip_y1: state.canvasData.snip_y1,
    snip_y2: state.canvasData.snip_y2,
    snipping_image: state.canvasData.snipping_image,
    //Settings
    base_url: state.settings.base_url,
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
