export const base_url = 'http://127.0.0.1:8003/'
export const logging = true

export const action_constants = {
  action_functions: [
    {
      label: 'Click mouse left here',
      value: 'click',
    },
    {
      label: 'Click mouse right here',
      value: 'click_right',
    },
    {
      label: 'Click on image',
      value: 'click_image',
    },
    {
      label: 'Click on image within region',
      value: 'click_image_region',
    },
    {
      label: 'Move mouse to',
      value: 'move_to',
    },
    {
      label: 'Move mouse to image',
      value: 'move_to_image',
    },
    {
      label: 'Drag mouse to',
      value: 'drag_to',
    },
    {
      label: 'Keyboard button pressed',
      value: 'key_pressed',
    },
    {
      label: 'Capture text or image',
      value: 'capture_screen_data',
    },
  ],
  conditionals: [
    {
      label: 'None',
      value: 'none',
    },
    {
      label: 'Text equals',
      value: 'equals',
    },
    {
      label: 'Text greater than',
      value: 'greater_than',
    },
    {
      label: 'Text less than',
      value: 'less_than',
    },
    {
      label: 'If text exists',
      value: 'if',
    },
    {
      label: 'If text does not exist',
      value: 'if_not',
    },
    {
      label: 'If image present',
      value: 'if_image_present',
    },
  ],
  result_functions: [
    {
      label: 'Continue to next action',
      value: 'continue',
    },
    {
      label: 'Set action name',
      value: 'set_action_name',
    },
    {
      label: 'Skip to action id:',
      value: 'skip_to_id',
    },
    {
      label: 'Wait for _ seconds',
      value: 'sleep',
    },
    {
      label: 'Wait _ seconds then repeat',
      value: 'sleep_and_repeat',
    },
    {
      label: 'Set variable to:',
      value: 'set_variable',
    },
    {
      label: 'Add _ to variable:',
      value: 'increment_variable',
    },
    {
      label: 'Subtract _ to variable:',
      value: 'decrement_variable',
    },
    {
      label: 'Switch to task:',
      value: 'switch_task',
    },
    {
      label: 'Exit task',
      value: 'end_task',
    },
    {
      label: 'Create task process',
      value: 'spawn_process',
    },
    {
      label: 'Repeats:',
      value: 'repeat',
    },
  ],
}

export const snip_prompts = [
  '',
  'Click at the top left corner of the snip',
  'Click at the bottom right corner of the snip',
  'Press (1) to create action, (2) to save snip, and (3) to discard snip',
  'Create action to: (1) click image or (2) move mouse to image (3) capture text',
  'Click the starting location for the mouse drag',
  'Click the ending location the mouse drag',
]

export const defaultHeaders = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  Accepts: 'application/json',
}

export const screenFPS = 60
export const screenWidth = 1920
export const screenHeight = 1080
export const screenXScale = 0.5
export const screenYScale = 0.5

export const point_functions = ['click', 'move_to', 'drag_to']
export const region_functions = [
  'capture_screen_data',
  'click_image_region',
  'drag_to',
]
export const position_functions = [
  'click',
  'click_right',
  'move_to',
  'drag_to',
  'capture_screen_data',
  'click_image_region',
]
export const image_functions = [
  'click_image',
  'move_to_image',
  'click_image_region',
]
