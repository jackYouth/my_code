import React from 'react'
import customize from 'customize'

const Root = ({ children }) => (
  <div style={{ width: '100%' }}>
    { children }
  </div>
)


export default customize(Root)
