import { combineReducers } from 'redux'

const initialControls = {
  streaming: false,
  recording: false,
  playback: false,
  remote_control: false,
}

const initialCanvasData = {
  x: 0,
  y: 0,
  image_data: '',
  snip_x1: 0,
  snip_y1: 0,
  snip_x2: 0,
  snip_y2: 0,
  snip_image: false,
  snip_frame: '',
  snip_prompt: [
    '',
    'Click at the top left corner of the snip',
    'Click at the bottom right corner of the snip',
    'Press (1) to create action, (2) to save snip, and (3) to discard snip',
    'Create action to: (1) click image or (2) move mouse to image (3) capture text',
    'Snip saved!',
  ],
  snip_prompt_index: 0,
  snip_collection: [],
  screen_width: 1920,
  screen_height: 1080,
  screen_x_scale: 0.5,
  screen_y_scale: 0.5,
  screen_fps: 1,
  screen_timer_max: 100,
  delta_time: 0,
  key_pressed: '',
  task_name: '',
}

const initialSettings = {
  base_url: 'http://127.0.0.1:8003/',
  random_enabled: false,
  random_mouse_path: false,
  random_mouse_position: false,
  random_mouse_range: 4,
  random_mouse_delay: false,
  random_mouse_max_delay: 0.5,
}

const controlReducer = (controls = initialControls, action) => {
  switch (action.type) {
    case 'STREAM_TOGGLE':
      return { ...controls, streaming: action.payload }
    case 'RECORD_TOGGLE':
      return { ...controls, recording: action.payload }
    case 'REMOTE_CONTROL_TOGGLE':
      return { ...controls, remote_control: action.payload }
    case 'PLAYBACK_TOGGLE':
      return { ...controls, playback: action.payload }
  }
  return controls
}

const canvasDataReducer = (canvasData = initialCanvasData, action) => {
  switch (action.type) {
    case 'SET_X':
      return { ...canvasData, x: action.payload }
    case 'SET_Y':
      return { ...canvasData, y: action.payload }
    case 'SET_IMAGE_DATA':
      return { ...canvasData, image_data: action.payload }
    case 'SET_SNIP_X1':
      return { ...canvasData, snip_x1: action.payload }
    case 'SET_SNIP_Y1':
      return { ...canvasData, snip_y1: action.payload }
    case 'SET_SNIP_X2':
      return { ...canvasData, snip_x2: action.payload }
    case 'SET_SNIP_Y2':
      return { ...canvasData, snip_y2: action.payload }
    case 'SET_SNIP_IMAGE':
      return { ...canvasData, snip_image: action.payload }
    case 'SET_SNIP_FRAME':
      return {
        ...canvasData,
        snip_image: true,
        snip_frame: action.payload,
        snip_x1: 0,
        snip_y1: 0,
        snip_x2: 0,
        snip_y2: 0,
        snip_prompt_index: 1,
      }
    case 'SET_SNIP_PROMPT_INDEX':
      return { ...canvasData, snip_prompt_index: action.payload }
    case 'SET_SNIP_COLLECTION':
      return { ...canvasData, snip_collection: action.payload }
    case 'SET_SCREEN_WIDTH':
      return { ...canvasData, screen_width: action.payload }
    case 'SET_SCREEN_HEIGHT':
      return { ...canvasData, screen_height: action.payload }
    case 'SET_SCREEN_X_SCALE':
      return { ...canvasData, screen_x_scale: action.payload }
    case 'SET_SCREEN_Y_SCALE':
      return { ...canvasData, screen_y_scale: action.payload }
    case 'SET_FPS':
      return { ...canvasData, screen_fps: action.payload }
    case 'SET_SCREEN_TIMER_MAX':
      return { ...canvasData, screen_timer_max: action.payload }
    case 'SET_DELTA_TIME':
      return { ...canvasData, delta_time: action.payload }
    case 'SET_KEY_PRESSED':
      return { ...canvasData, key_pressed: action.payload }
    case 'SET_TASK_NAME':
      return { ...canvasData, task_name: action.payload }
    case 'CANVAS_DATA_RESET':
      return {
        ...canvasData,
        snip_x1: 0,
        snip_y1: 0,
        snip_x2: 0,
        snip_y2: 0,
        snip_image: false,
        snip_prompt_index: 0,
        snip_frame: '',
      }
    case 'SET_SNIP_COORDS':
      return {
        ...canvasData,
        snip_prompt_index: action.payload[0],
        snip_x1: action.payload[1],
        snip_y1: action.payload[2],
        snip_x2: action.payload[3],
        snip_y2: action.payload[4],
      }
  }
  return canvasData
}

const settingsReducer = (settings = initialSettings, action) => {
  switch (action.type) {
    case 'SET_BASE_URL':
      return { ...settings, base_url: action.payload }
    case 'SET_TASK_ID':
      return { ...settings, task_id: action.payload }
    case 'SET_SCHEDULE_NAME':
      return { ...settings, schedule_name: action.payload }
    case 'SET_RANDOM_ENABLED':
      return { ...settings, random_enabled: action.payload }
    case 'SET_RANDOM_MOUSE_PATH':
      return { ...settings, random_mouse_path: action.payload }
    case 'SET_RANDOM_MOUSE_POSITION':
      return { ...settings, random_mouse_position: action.payload }
    case 'SET_RANDOM_MOUSE_RANGE':
      return { ...settings, random_mouse_range: action.payload }
    case 'SET_RANDOM_MOUSE_DELAY':
      return { ...settings, random_mouse_delay: action.payload }
    case 'SET_RANDOM_MOUSE_MAX_DELAY':
      return { ...settings, random_mouse_max_delay: action.payload }
  }
  return settings
}

export default combineReducers({
  controls: controlReducer,
  canvasData: canvasDataReducer,
  settings: settingsReducer,
})
