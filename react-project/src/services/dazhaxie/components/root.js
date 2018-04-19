import React from 'react'
import offlinePluginRuntime from 'offline-plugin/runtime'

offlinePluginRuntime.install()

export default (
  ({ children }) => (
    <div>{ children }</div>
  )
)
