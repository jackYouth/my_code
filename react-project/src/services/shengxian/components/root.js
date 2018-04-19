import React from 'react'
import customize from 'customize'
import '../../../styles/index.scss'

export default customize(
  ({ children }) => (
    <div>{ children }</div>
  )
)
