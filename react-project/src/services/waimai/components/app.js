import React from 'react'
import customize from 'customize'
import '../style/app.scss'

const Root = ({ children }) => (
  <div>
    { children }
  </div>
)

export default customize(Root)
