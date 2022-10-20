import { useRef, useEffect } from 'react'
import { default_image } from './constants'

let screen_timer = 100

const Canvas = ({
  width,
  height,
  controls,
  canvasData,
  settings,
  image_prompt,
  snip_frame,
}) => {
  const canvas = useRef()
  useEffect(() => {
    const context = canvas.current.getContext('2d')
    draw(context)
  })
  const logging = false
  let image_data = default_image

  const draw = (context) => {
    let img = new Image(width, height)
    const x_scale = canvasData.screen_x_scale
    const y_scale = canvasData.screen_y_scale
    if (typeof snip_frame == 'string' && snip_frame !== '') {
      context.clearRect(0, 0, width, 32)
      if (canvasData.snip_x1 !== 0 && canvasData.snip_y1 !== 0) {
        context.clearRect(0, 0, width, y_scale * canvasData.snip_y1)
        context.clearRect(0, 0, x_scale * canvasData.snip_x1, height)
      }
      if (canvasData.snip_x2 !== 0 && canvasData.snip_y2 !== 0) {
        context.clearRect(
          0,
          canvasData.screen_y_scale * canvasData.snip_y2,
          width,
          height
        )
        context.clearRect(
          canvasData.screen_x_scale * canvasData.snip_x2,
          0,
          width,
          height
        )
      }
      context.drawImage(img, 0, 0, width, height)
      let prefix = 'data:image/png;base64,'
      img.src = prefix + snip_frame
      context.font = '20pt Sans'
      context.fillStyle = 'white'
      context.textAlign = 'center'
      context.fillText(image_prompt, width / 2, 24)
    } else if (controls.streaming && screen_timer > 0) {
      img.onload = function () {
        context.drawImage(img, 0, 0, img.width, img.height)
      }
      if (canvasData.snip_prompt_index === 0) screen_timer--
    } else if (controls.streaming) {
      let refresh_rate = canvasData.screen_timer_max / canvasData.screen_fps
      let url = settings.base_url + 'screenshot/'
      let xhr = new XMLHttpRequest()
      xhr.open('GET', url)

      xhr.setRequestHeader('Accept', 'application/json')
      xhr.setRequestHeader('Content-Type', 'application/json')
      xhr.setRequestHeader('Access-Control-Allow-Origin', '*')

      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          let json_data = JSON.parse(xhr.responseText)

          image_data = json_data.data
          if (logging) {
            console.log(xhr.status)
            console.log(xhr.responseText)
            console.log(image_data)
          }
          img.onload = function () {
            context.drawImage(img, 0, 0, img.width, img.height)
          }
          let prefix = 'data:image/png;base64,'
          img.src = prefix + image_data
        }
      }
      xhr.send()
      screen_timer = refresh_rate
    } else {
      img.onload = function () {
        context.font = '40pt Sans'
        context.fillStyle = 'white'
        context.textAlign = 'center'
        context.fillText('Stream Paused', width / 2, height / 2)
      }
    }
  }

  return (
    <>
      <canvas ref={canvas} width={width} height={height} />
    </>
  )
}

export default Canvas
