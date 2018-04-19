import React from 'react'
import customize from 'customize'

const width = document.body.clientWidth
console.log('----width-----', width)
// const Root = ({ children }) => (<div style={{ width }}>{ children }</div>)
const Root = ({ children }) => (<div>{ children }</div>)

export default customize(Root)
