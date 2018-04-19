import React from 'react'
import customize from 'customize'

const App = ({ children }) => (
  <div>{ children }</div>
)

export default customize(App)
