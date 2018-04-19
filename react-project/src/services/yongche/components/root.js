import React from 'react'
import customize from 'customize'

export default customize(
  ({ children }) => (
    <div style={{ overflow: 'auto', height: '100%' }}>{ children }</div>
  )
)
