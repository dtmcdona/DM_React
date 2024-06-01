import React from 'react'
import { snip_prompts } from './constants'

export default function CanvasConsole({ snipPromptIndex }) {
  return (
    <div className='canvas--console'>
      Stream console: {snip_prompts[snipPromptIndex]}
    </div>
  )
}
