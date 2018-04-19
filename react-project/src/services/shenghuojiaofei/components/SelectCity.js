import React from 'react'
import { CitySearch } from '@boluome/oto_saas_web_app_component'

const SelectCity = ({ handleCityData, localCity }) => {
  return (
    <div>
      <CitySearch handleContainerClose={ () => window.history.back() } localCity={ localCity } categoryCode='shenghuojiaofei' handleCityData={ handleCityData } api={ '/shenghuojiaofei/v1/chinaums/citys' } />
    </div>
  )
}

export default SelectCity
