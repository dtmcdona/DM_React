import { useCallback, useReducer } from 'react'

function reducer(state, action) {
  switch (action.type) {
    case 'reset_canvas_data': {
      return {
        mouseMode: 'click',
        snipFrame: '',
        snipId: '',
        snipPromptIndex: 0,
        x1: 0,
        y1: 0,
        x2: 0,
        y2: 0,
      }
    }
    case 'set_mouse_mode': {
      return {
        ...state,
        mouseMode: action.nextMouseMode,
      }
    }
    case 'set_snip_frame': {
      return {
        ...state,
        snipFrame: action.nextSnipFrame,
        snipId: '',
        snipPromptIndex: 1,
        x1: 0,
        y1: 0,
        x2: 0,
        y2: 0,
      }
    }
    case 'set_snip_id': {
      return {
        ...state,
        snipId: action.nextSnipId,
        snipPromptIndex: 4,
      }
    }
    case 'set_snip_top_left': {
      return {
        ...state,
        snipPromptIndex: 2,
        x1: action.nextX1,
        y1: action.nextY1,
      }
    }
    case 'set_snip_bottom_right': {
      return {
        ...state,
        snipPromptIndex: 3,
        x2: action.nextX2,
        y2: action.nextY2,
      }
    }
    case 'set_snip_prompt_index': {
      return {
        ...state,
        snipPromptIndex: state.nextSnipPromptIndex,
      }
    }
    case 'set_start_mouse_drag': {
      return {
        mouseMode: 'drag_to',
        snipFrame: '',
        snipId: '',
        snipPromptIndex: 5,
        x1: 0,
        y1: 0,
        x2: 0,
        y2: 0,
      }
    }
    case 'set_drag_start': {
      return {
        ...state,
        snipPromptIndex: 6,
        x1: action.nextX1,
        y1: action.nextY1,
      }
    }
    case 'set_drag_end': {
      return {
        ...state,
        snipPromptIndex: 6,
        x1: action.nextX1,
        y1: action.nextY1,
      }
    }
  }
  throw Error('Unknown action: ' + action.type)
}

export function useCanvasData() {
  const [state, dispatch] = useReducer(reducer, {
    mouseMode: 'click',
    snipFrame: '',
    snipId: '',
    snipPromptIndex: 0,
    x1: 0,
    y1: 0,
    x2: 0,
    y2: 0,
  })

  const resetCanvasData = useCallback(() => {
    dispatch({
      type: 'reset_canvas_data',
    })
  }, [dispatch])

  const setMouseMode = useCallback(
    (mode) => {
      dispatch({
        type: 'set_mouse_mode',
        nextMouseMode: mode,
      })
    },
    [dispatch]
  )

  const setSnipFrame = useCallback(
    (frame) => {
      dispatch({
        type: 'set_snip_frame',
        nextSnipFrame: frame,
      })
    },
    [dispatch]
  )

  const setSnipId = useCallback(
    (nextId) => {
      dispatch({
        type: 'set_snip_id',
        nextSnipId: nextId,
      })
    },
    [dispatch]
  )

  const setSnipTopLeft = useCallback(
    (nextX1, nextY1) => {
      dispatch({
        type: 'set_snip_top_left',
        nextX1,
        nextY1,
      })
    },
    [dispatch]
  )

  const setSnipBottomRight = useCallback(
    (nextX2, nextY2) => {
      dispatch({
        type: 'set_snip_bottom_right',
        nextX2,
        nextY2,
      })
    },
    [dispatch]
  )

  const setSnipPromptIndex = useCallback(
    (index) => {
      dispatch({
        type: 'set_snip_prompt_index',
        nextSnipPromptIndex: index,
      })
    },
    [dispatch]
  )

  const setStartMouseDrag = useCallback(() => {
    dispatch({
      type: 'set_start_mouse_drag',
    })
  }, [dispatch])

  const setDragStart = useCallback(
    (nextX1, nextY1) => {
      dispatch({
        type: 'set_drag_start',
        nextX1,
        nextY1,
      })
    },
    [dispatch]
  )

  const setDragEnd = useCallback(
    (nextX2, nextY2) => {
      dispatch({
        type: 'set_drag_end',
        nextX2,
        nextY2,
      })
    },
    [dispatch]
  )

  return {
    ...state,
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
  }
}
