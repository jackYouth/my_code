import React from 'react'
import customize from 'customize'

import '../../../styles/index.scss'

export default customize(
  ({ children }) => (
    <div style={{ overflow: 'auto', height: '100%', borderTop: '1px solid #e5e5e5', boxSizing: 'border-box' }}>
      { children }
    </div>
  )
)
