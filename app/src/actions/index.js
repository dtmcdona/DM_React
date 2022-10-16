export const controlToggle = (type, val) => {
  return {
    type: `${type}_TOGGLE`,
    payload: val,
  }
}

export const canvasDataSet = (type, val) => {
  return {
    type: `SET_${type}`,
    payload: val,
  }
}

export const canvasSetCoords = (prompt_index, x1, y1, x2, y2) => {
  return {
    type: 'SET_SNIP_COORDS',
    payload: [prompt_index, x1, y1, x2, y2],
  }
}

export const canvasDataReset = () => {
  return {
    type: 'CANVAS_DATA_RESET',
  }
}

export const settingsValueSet = (type, val) => {
  return {
    type: `SET_${type}`,
    payload: val,
  }
}
