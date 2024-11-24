import { useReducer } from 'react'
import {
  action_constants,
  base_url,
  image_functions,
  point_functions,
  position_functions,
  region_functions,
} from './constants'

function Action({ block, deleteAction }) {
  const [action, setAction] = useReducer(
    (state, updates) => ({ ...state, ...updates }),
    {
      id: block.id,
      function: block.function,
      x1: block.x1,
      x2: block.x2,
      y1: block.y1,
      y2: block.y2,
      images: block.images,
      image_conditions: block.image_conditions,
      variables: block.variables,
      variable_conditions: block.variable_conditions,
      comparison_values: block.comparison_values,
      time_delay: block.time_delay,
      sleep_duration: block.sleep_duration,
      key_pressed: block.key_pressed,
      true_case: block.true_case,
      false_case: block.false_case,
      error_case: block.error_case,
      num_repeats: block.num_repeats,
      random_path: block.random_path,
      random_range: block.random_range,
      random_delay: block.random_delay,
      condition: 'none',
    }
  )

  const updateAction = () => {
    let images = ''
    if (String(action.images).length > 0)
      images = '"' + String(action.images).replace(',', '", "') + '"'
    let data =
      `{"id": "${action.id}", ` +
      `"function": "${action.function}", ` +
      `"x1": ${action.x1}, ` +
      `"x2": ${action.x2}, ` +
      `"y1": ${action.y1}, ` +
      `"y2": ${action.y2}, ` +
      `"images": [${images}], ` +
      `"image_conditions": [${action.image_conditions}], ` +
      `"variables": [${action.variables}], ` +
      `"variable_conditions": [${action.variable_conditions}], ` +
      `"time_delay": ${action.time_delay}, ` +
      `"sleep_duration": ${action.sleep_duration}, ` +
      `"key_pressed": "${action.key_pressed}", ` +
      `"true_case": "${action.true_case}", ` +
      `"false_case": "${action.false_case}", ` +
      `"error_case": "${action.error_case}", ` +
      `"num_repeats": ${action.num_repeats}, ` +
      `"random_path": ${action.random_path}, ` +
      `"random_range": ${action.random_range}, ` +
      `"random_delay": ${action.random_delay}}`

    let url = base_url + 'update-action/' + action.id

    let xhr = new XMLHttpRequest()
    xhr.open('POST', url)

    xhr.setRequestHeader('Accept', 'application/json')
    xhr.setRequestHeader('Content-Type', 'application/json')
    xhr.setRequestHeader('Access-Control-Allow-Origin', '*')

    xhr.onreadystatechange = function () {
      console.log(xhr.status)
      console.log(xhr.responseText)
    }

    xhr.send(data)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    updateAction()
  }

  const handleChangeFunction = (e) => {
    if (e.target.value !== 'capture_screen_data') {
      setAction({
        function: e.target.value,
        image_conditions: '',
        variable_conditions: '',
        comparison_value: null,
      })
    } else if (
      e.target.value === 'capture_screen_data' ||
      e.target.value === 'click_image'
    ) {
      if (action.condition === 'if_image_present') {
        setAction({
          function: e.target.value,
          image_conditions: 'if_image_present',
          variable_conditions: '',
        })
      } else if (action.condition !== 'none') {
        setAction({
          function: e.target.value,
          image_conditions: '',
          variable_conditions: action.condition,
        })
      }
    } else {
      setAction({ function: e.target.value })
    }
  }

  const handleChangeCondition = (e) => {
    setAction({ condition: e.target.value })
  }

  const handleChangeConditionTrue = (e) => {
    setAction({ true_case: e.target.value })
  }

  const handleChangeConditionFalse = (e) => {
    setAction({ false_case: e.target.value })
  }

  return (
    <div className='action--row'>
      <form onSubmit={handleSubmit} className='action--form'>
        <div className='action--section'>
          {(action.function === 'capture_screen_data' && (
            <div className='action--condition'>
              Condition:
              <div className='select-container'>
                <select
                  value={action.condition}
                  onChange={handleChangeCondition}
                >
                  {action_constants.conditionals.map((option) => (
                    <option
                      key={`${action.id}-${option.label}`}
                      value={option.value}
                    >
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              Comparison value:
              <div className='select-container'>
                <input
                  type='text'
                  size='10'
                  value={action.comparison_values}
                  onChange={(e) =>
                    setAction({
                      comparison_values: e.target.value.split(','),
                    })
                  }
                />
              </div>
              Condition is true:
              <div className='select-container'>
                <select
                  value={action.true_case}
                  onChange={handleChangeConditionTrue}
                >
                  {action_constants.result_functions.map((option) => (
                    <option
                      key={`${action.id}-${option.label}`}
                      value={option.value}
                    >
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              Condition is false:
              <div className='select-container'>
                <select
                  value={action.false_case}
                  onChange={handleChangeConditionFalse}
                >
                  {action_constants.result_functions.map((option) => (
                    <option
                      key={`${action.id}-${option.label}`}
                      value={option.value}
                    >
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              {(action.false_case === 'sleep' ||
                action.false_case === 'sleep_and_repeat' ||
                action.true_case === 'sleep' ||
                action.true_case === 'sleep_and_repeat') && (
                <div className='input-container'>
                  Wait duration:
                  <input
                    type='text'
                    size='10'
                    value={action.sleep_duration}
                    onChange={(e) =>
                      setAction({
                        sleep_duration: e.target.value,
                      })
                    }
                    required
                  />
                </div>
              )}
            </div>
          )) || <div className='action--condition'></div>}
          <div className='action--function'>
            Action function:
            <div className='select-container'>
              <select value={action.function} onChange={handleChangeFunction}>
                {action_constants.action_functions.map((option) => (
                  <option
                    key={`${action.id}-${option.label}`}
                    value={option.value}
                  >
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            {action.function === 'key_pressed' && (
              <div className='input-container'>
                Keyboard
                <input
                  type='text'
                  size='10'
                  value={action.key_pressed}
                  onChange={(e) => setAction({ key_pressed: e.target.value })}
                />
              </div>
            )}
            {position_functions.includes(action.function) && (
              <div className='input-container'>
                {point_functions.includes(action.function)
                  ? '(x,y): ('
                  : 'Top left (x,y): ('}
                <input
                  type='text'
                  size='10'
                  value={action.x1}
                  onChange={(e) => setAction({ x1: e.target.value })}
                />
                ,
                <input
                  type='text'
                  size='10'
                  value={action.y1}
                  onChange={(e) => setAction({ y1: e.target.value })}
                />
                )
              </div>
            )}
            {region_functions.includes(action.function) && (
              <div className='input-container'>
                {action.function === 'drag_to'
                  ? 'to (x,y):'
                  : 'Bottom right (x,y): ('}
                <input
                  type='text'
                  size='10'
                  value={action.x2}
                  onChange={(e) => setAction({ x2: e.target.value })}
                />
                ,
                <input
                  type='text'
                  size='10'
                  value={action.y2}
                  onChange={(e) => setAction({ y2: e.target.value })}
                />
                )
              </div>
            )}
            Time delay:
            <div className='input-container'>
              <input
                type='text'
                size='10'
                value={action.time_delay}
                onChange={(e) => setAction({ time_delay: e.target.value })}
                required
              />
            </div>
            {image_functions.includes(action.function) && (
              <div className='input-container'>
                Images:
                <input
                  type='text'
                  value={action.images}
                  onChange={(e) => setAction({ images: e.target.value })}
                />
              </div>
            )}
          </div>
          <div className='action--button'>
            <button>Update</button>
          </div>
          <div className='action--button'>
            <button name={block.id} onMouseDown={deleteAction}>
              Delete
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default Action
