import React from 'react'
import { List, WhiteSpace, Picker, InputItem, Toast } from 'antd-mobile'
import { Mask, SlidePage, CitySearch } from '@boluome/oto_saas_web_app_component'
import { getStore } from '@boluome/common-lib'
import { map } from 'ramda'

import Button from './Button'

class AddHome extends React.Component {
  constructor(props) {
    super(props)
    const { currentBillInfo } = props
    const { cityName } = currentBillInfo
    this.state = {
      currentCity:     cityName,
      curSelectedCity: getStore('selectedCity', 'session').selectedCity,
      currentAddress:  '',
      curHome:         '',
      curInputHome:    '',
    }
    this.handleChangeCity = this.handleChangeCity.bind(this)
    this.handleChangeAddress = this.handleChangeAddress.bind(this)
    this.handleClick = this.handleClick.bind(this)
    this.handleChangeHome = this.handleChangeHome.bind(this)
    this.handleInputHome = this.handleInputHome.bind(this)
  }

  handleChangeCity(curSelectedCity) {
    const currentCity = curSelectedCity.name
    this.setState({ currentCity, curSelectedCity })
  }

  handleChangeAddress(currentAddress) {
    this.setState({ currentAddress })
  }

  handleClick(inHome) {
    if (inHome) {
      Toast.fail('已存在此家庭名称，请重新修改', 1)
      return
    }
    const { curSelectedCity, currentAddress, currentCity, curInputHome } = this.state
    let { curHome } = this.state
    const { handleChangeCityData, currentBillInfo, handleNewHome } = this.props
    curHome = curHome[0]
    if (curHome === '其它') {
      curHome = curInputHome
    }
    if (currentCity !== currentBillInfo.cityName) handleChangeCityData(curSelectedCity)
    //  将所有的参数变为空，并改变指定信息
    // for (let i in currentBillInfo) {
    //   currentBillInfo[i] = ''
    // }
    map(() => '')(currentBillInfo)

    const paras = {
      address:  currentAddress,
      cityName: currentCity,
      cityId:   curSelectedCity.id,
      tag:      curHome,
    }
    handleNewHome(paras, curHome)
  }

  handleChangeHome(curHome) {
    this.setState({ curHome })
  }

  handleInputHome(curInputHome) {
    this.setState({ curInputHome })
  }

  render() {
    const { currentBillInfo, homes, userCategory } = this.props
    const { cityName } = currentBillInfo
    const { currentCity, currentAddress, curHome, curInputHome } = this.state
    let inHome = false
    userCategory.forEach(item => {
      if (item.tag === curInputHome) {
        inHome = true
      }
    })
    const Item = List.Item
    return (
      <div>
        <List>
          <Picker disabled={ 0 } data={ homes } value={ curHome } title='选择名称' cols={ 1 } extra={ curHome } onChange={ this.handleChangeHome }>
            <Item arrow='horizontal'>家庭</Item>
          </Picker>
          { curHome[0] === '其它' && <InputItem defaultValue={ curInputHome } onChange={ this.handleInputHome } placeholder='请输入自定义家庭名称'>名称</InputItem> }
          <Item arrow='horizontal' extra={ currentCity } onClick={ () => Mask(
            <SlidePage target='right' showClose={ false } >
              <CitySearch localCity={ cityName } categoryCode='shenghuojiaofei' handleCityData={ this.handleChangeCity } api={ '/shenghuojiaofei/v1/chinaums/citys' } />
            </SlidePage>) }
          >
            所在城市
          </Item>
          <InputItem defaultValue={ currentAddress } onChange={ this.handleChangeAddress } placeholder='家庭详细地址'>详细地址</InputItem>
        </List>
        <WhiteSpace size='lg' />
        <Button title='保存' handleClick={ () => ((curHome !== '' && curHome[0] !== '其它') || curInputHome !== '') && this.handleClick(inHome) } btnStyle={ ((curHome !== '' && curHome[0] !== '其它') || curInputHome !== '') ? { } : { background: '#cccccc' } } />
      </div>
    )
  }
}


export default AddHome
