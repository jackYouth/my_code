import React from 'react'
import { setServerUrl } from '@boluome/common-lib'
import customize from 'customize'

const Root = ({ children }) => (
  <div>
    { children }
  </div>
)

export default customize(Root)
