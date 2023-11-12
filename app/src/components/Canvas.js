import { useRef, useEffect, useState } from 'react'
import { default_image } from './constants'
import { useQuery } from '@tanstack/react-query'

const Canvas = ({
  base_url,
  height,
  width,
  screen_fps,
  screen_x_scale,
  screen_y_scale,
  snip_frame,
  snip_x1,
  snip_x2,
  snip_y1,
  snip_y2,
  streaming,
}) => {
  const canvas = useRef()
  const { data: screenshot } = useQuery({
    queryKey: ['screenshot'],
    queryFn: () =>
      fetch(`${base_url}screenshot`, {
        method: 'GET',
        cors: 'no-cors',
        cache: 'no-cache',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          Accepts: 'application/json',
        },
      }).then((res) => res.json()),
    refetchInterval: 1000 / screen_fps,
  })

  useEffect(() => {
    const context = canvas.current.getContext('2d')
    draw(context)
  })

  const draw = (context) => {
    let img = new Image(width, height)
    if (typeof snip_frame == 'string' && snip_frame !== '') {
      if (snip_x1 !== 0 && snip_y1 !== 0) {
        context.clearRect(0, 0, width, screen_y_scale * snip_y1)
        context.clearRect(0, 0, screen_x_scale * snip_x1, height)
      }
      if (snip_x2 !== 0 && snip_y2 !== 0) {
        context.clearRect(0, screen_y_scale * snip_y2, width, height)
        context.clearRect(screen_x_scale * snip_x2, 0, width, height)
      }
      context.drawImage(img, 0, 0, width, height)
      img.src = `data:image/png;base64,${snip_frame}`
    } else if (streaming) {
      console.log('Rendering image')
      img.onload = function () {
        context.drawImage(img, 0, 0, img.width, img.height)
      }
      img.src = `data:image/png;base64,${screenshot.data}`
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
