import React from 'react'
import { MapShowGaode } from '@boluome/oto_saas_web_app_component'

const Addr = ({ addrTitlename, addrnameStr, longitude, latitude }) => {
  if (addrTitlename) {
    return (
      <MapShowGaode addrTitlename={ addrTitlename } addrnameStr={ addrnameStr } latitude={ latitude } longitude={ longitude } />
    )
  }
  return (
    <div />
  )
}

export default Addr
