import React from 'react'
import Action from './Action'

const ActionType = {
  action: Action,
}

const ActionContainer = ({ block, event_func }) => {
  if (typeof ActionType[block.component] !== 'undefined') {
    return <Action key={block.id} block={block} event_func={event_func} />
  }
  return (
    <div key={block.id}>
      The component {block.component} has not been created yet.
    </div>
  )
}
export default ActionContainer
