export const getTimeDelta = (timestamp) => {
  let now = Date.now()
  let deltaTime = (now - timestamp) / 1000
  return deltaTime
}

export const getLocalValue = (name) => {
  return JSON.parse(localStorage.getItem(name))
}
