import React from 'react'
import { parseLocName, getStore } from '@boluome/common-lib'
import { CitySearch } from '@boluome/oto_saas_web_app_component'

const City = ({ cityArr, handleCityChange }) => (
  <CitySearch localCity={ parseLocName(getStore('currentPosition', 'session').city) }
    categoryCode='dianying'
    handleCityData={ res => { handleCityChange(res) } }
    api={ cityArr }
  />
)

export default City
