import React from 'react'
import { getStore } from '@boluome/common-lib'
import { MapShowGaode } from '@boluome/oto_saas_web_app_component'

export default (
  () => {
    const { shopName, shopLng, shopLat, shopAddress } = getStore('currentShop', 'session')
    return (
      <MapShowGaode { ...{ longitude: shopLng, latitude: shopLat, addrnameStr: shopAddress, addrTitlename: shopName } } />
    )
  }
)
