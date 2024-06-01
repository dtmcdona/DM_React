import { useRef, useEffect } from 'react'
import {
  base_url,
  defaultHeaders,
  screenFPS,
  screenHeight,
  screenWidth,
  screenXScale,
  screenYScale,
} from './constants'
import { useQuery } from '@tanstack/react-query'

const Canvas = ({ snipFrame, streaming, x1, x2, y1, y2 }) => {
  const canvas = useRef()
  const { data: screenshot } = useQuery({
    queryKey: ['screenshot'],
    queryFn: () =>
      fetch(`${base_url}screenshot`, {
        method: 'GET',
        cors: 'no-cors',
        cache: 'no-cache',
        headers: defaultHeaders,
      }).then((res) => res.json()),
    refetchInterval: 1000 / screenFPS,
    enabled: streaming,
  })
  const width = screenWidth * screenXScale
  const height = screenHeight * screenYScale

  useEffect(() => {
    const context = canvas.current.getContext('2d')
    draw(context)
  })

  const draw = (context) => {
    let img = new Image(width, height)
    if (typeof snipFrame == 'string' && snipFrame !== '') {
      if (x1 !== 0 && y1 !== 0) {
        context.clearRect(0, 0, width, screenYScale * y1)
        context.clearRect(0, 0, screenXScale * x1, height)
      }
      if (x2 !== 0 && y2 !== 0) {
        context.clearRect(0, screenYScale * y2, width, height)
        context.clearRect(screenXScale * x2, 0, width, height)
      }
      context.drawImage(img, 0, 0, width, height)
      img.src = `data:image/png;base64,${snipFrame}`
    } else if (streaming && screenshot?.data) {
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

  return <canvas ref={canvas} width={width} height={height} />
}

export default Canvas
