import React from 'react'
// import { Icon } from 'antd-mobile'
import { CitySearch } from '@boluome/oto_saas_web_app_component'
import { getStore } from '@boluome/common-lib'

const City = ({ LocationAddr, cityHot, chooseCity, handlePoint, mark }) => {
  const channel = getStore('huoche_channel', 'session')
  return (
    <div style={{ fontSize: '0.24rem' }}>
      <CitySearch
        localCity={ LocationAddr }
        categoryCode={ channel }
        showCancel='true'
        handleCityData={ result => { handlePoint(result, chooseCity, mark) } }
        api='/huoche/v1/city/list'
        cityHot={ cityHot }
        handleContainerClose={ () => window.history.back() }
      />
    </div>
  )
}

export default City
