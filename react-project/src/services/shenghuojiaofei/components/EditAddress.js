import React from 'react'
import { getStore } from '@boluome/common-lib'
import { Mask, SlidePage, CitySearch } from '@boluome/oto_saas_web_app_component'
import { List, WhiteSpace, InputItem } from 'antd-mobile'
import { merge } from 'ramda'

import Button from './Button'

class HomeManege extends React.Component {
  constructor(props) {
    super(props)
    const { currentBillInfo } = props
    const { cityName, address, cityId } = currentBillInfo
    this.state = {
      currentCity:    cityName,
      currentAddress: address,
      currentCityId:  cityId,
    }
    this.handleChangeCity = this.handleChangeCity.bind(this)
    this.handleChangeAddress = this.handleChangeAddress.bind(this)
    this.handleClick = this.handleClick.bind(this)
  }

  handleChangeCity(curSelectedCity) {
    const currentCity = curSelectedCity.name
    const currentCityId = curSelectedCity.id
    this.setState({ currentCity, curSelectedCity, currentCityId })
  }

  handleChangeAddress(currentAddress) {
    this.setState({ currentAddress })
  }

  handleClick() {
    const { curSelectedCity, currentAddress, currentCity, currentCityId } = this.state
    const { handleChangeCityData, currentHomeTag, currentBillInfo, handleNewEdit } = this.props
    if (currentCity !== currentBillInfo.cityName) handleChangeCityData(curSelectedCity)
    const editParas = {
      address:  currentAddress,
      cityId:   currentCityId,
      cityName: currentCity,
      tag:      currentHomeTag,
      tid:      currentBillInfo.tid,
    }
    handleNewEdit(editParas, merge(currentBillInfo, editParas))
  }

  render() {
    const { currentBillInfo } = this.props
    const { cityName, address } = currentBillInfo
    const { currentCity, currentAddress } = this.state
    const Item = List.Item
    const localCity = getStore('localCity', 'session')
    return (
      <div>
        <List>
          <Item arrow='horizontal'
            extra={ currentCity }
            onClick={ () => Mask(
              <SlidePage target='right' showClose={ false } >
                <CitySearch localCity={ localCity } categoryCode='shenghuojiaofei' handleCityData={ this.handleChangeCity } api={ '/shenghuojiaofei/v1/chinaums/citys' } />
              </SlidePage>) }
          >
            所在城市
          </Item>
          <InputItem defaultValue={ currentAddress } onChange={ this.handleChangeAddress }>详细地址</InputItem>
        </List>
        <WhiteSpace size='lg' />
        <Button title='保存' handleClick={ this.handleClick } btnStyle={ (currentCity === cityName && currentAddress === address) ? { background: '#cccccc' } : {} } />
      </div>
    )
  }
}

export default HomeManege
