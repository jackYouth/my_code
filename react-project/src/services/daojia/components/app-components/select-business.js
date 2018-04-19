import React from 'react'
import { Grid } from 'antd-mobile'

const SelectBusiness = ({ serverBusiness, handleGridClick, handleContainerClose }) => {
  const data = serverBusiness.map(item => ({
    icon: item.bigLogoImg,
    text: item.brandName,
    id:   item.brandId,
  }))
  data.unshift({ icon: require('../../img/all.png'), text: '全部', id: '' })
  const handleClick = res => {
    handleGridClick(res)
    handleContainerClose()
  }
  return <Grid data={ data } onClick={ handleClick } />
}

export default SelectBusiness
