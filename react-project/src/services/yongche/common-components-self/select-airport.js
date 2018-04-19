import React from 'react'
import { Search, Empty, Loading } from '@boluome/oto_saas_web_app_component'
import { getStore } from '@boluome/common-lib'
import { Toast } from 'antd-mobile'
import coordtransform from 'coordtransform'

import { get } from '../actions'

import LeftComponent from './address-left-component'
import '../styles/select-airport.scss'

export default class SelectAirport extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      resultArr: '',
    }
    this.handleSearch = this.handleSearch.bind(this)
    this.handleAirportClick = this.handleAirportClick.bind(this)
    this.getAirports = this.getAirports.bind(this)
    this.handleChangeCurrentCity = this.handleChangeCurrentCity.bind(this)
    this.getAirports()
  }
  getAirports() {
    const closeLoading = Loading()
    const { myAttribute } = this.props
    const channel = getStore('channel', 'session')
    const productType = getStore('currentProduct', 'session').code
    // 如果session中保存有选中的地址，就使用地址里的id，如果没有，就使用start_selecctedCity的id，因为初始化时肯定保存了start_selecctedCity，不然会重新选择城市
    let cityId = getStore(`${ myAttribute }_selectedCity${ productType }`, 'session') ? getStore(`${ myAttribute }_selectedCity${ productType }`, 'session').id : getStore('defaultPointObj', 'session').id
    if (channel === 'didi') cityId = getStore(`${ myAttribute }_selectedCity${ productType }`, 'session') ? getStore(`${ myAttribute }_selectedCity${ productType }`, 'session').name : getStore('defaultPointObj', 'session').name
    get('/yongche/v1/city/airport', { channel, cityId }).then(({ code, data, message }) => {
      if (code === 0) {
        this.setState({ resultArr: data })
      } else {
        Toast.fail(message, 1)
      }
      closeLoading()
    })
  }
  handleSearch(keyWord) {
    let { resultArr } = this.state
    resultArr = resultArr.filter(item => item.name.indexOf(keyWord) >= 0)
    this.setState({ resultArr })
    return resultArr
  }
  handleAirportClick(res) {
    const { handleContainerClose, myAttribute, handleChangePoint } = this.props
    const productType = getStore('currentProduct', 'session').code
    const city = getStore(`${ myAttribute }_selectedCity${ productType }`, 'session') ? getStore(`${ myAttribute }_selectedCity${ productType }`, 'session').name : getStore('defaultPointObj', 'session').name
    const { code, name, terminalCode } = res
    const longitude = coordtransform.bd09togcj02(res.longitude, res.latitude)[0]
    const latitude = coordtransform.bd09togcj02(res.longitude, res.latitude)[1]
    let { address = '' } = res
    if (!address) address = name
    // 将参数转化成和地址选择时handleChangeStartPointObj所需的返回数据格式相同的
    handleChangePoint({ city, name, location: { lat: latitude, lng: longitude }, address, code, terminalCode })
    handleContainerClose()
  }
  handleChangeCurrentCity() {
    // const { myAttribute } = this.props
    // setStore(`${ myAttribute }_selectedCity`, res, 'session')
    this.getAirports()
  }
  render() {
    const { handleContainerClose, myAttribute } = this.props
    const productType = getStore('currentProduct', 'session').code
    const { resultArr } = this.state
    if (!resultArr) {
      return <div />
    }
    if (resultArr.length <= 0) {
      return <Empty message='没有搜索结果，换个关键词试试～' imgUrl={ require('../img/nofound.png') } />
    }
    let selectedAddress = ''
    if (getStore(`${ myAttribute }_selectedCity${ productType }`, 'session')) {
      selectedAddress = { name: getStore(`${ myAttribute }_selectedCity${ productType }`, 'session').name }
    }
    return (
      <Search
        selfClass='airport-search'
        inputPlaceholder='请您选择机场'
        content={ <AirportContent datas={ resultArr } handleAirportClick={ this.handleAirportClick } /> }
        noResult={ <Empty message='没有找到机场信息~' imgUrl={ require('../img/nofound.png') } /> }
        onFeach={ keyWord => this.handleSearch(keyWord) }
        handleResult={ result => { console.log('result:', result) } }
        rightComponent={ <Cancel { ...{ handleContainerClose } } /> }
        leftComponent={ <LeftComponent { ...{ myAttribute, selectedAddress, handleChangeCurrentCity: this.handleChangeCurrentCity } } /> }
        delayTime={ 500 }
        disabled={ 'true' }
      />
    )
  }
}


const Cancel = props => {
  const { handleContainerClose } = props
  return (
    <span className='cancel' onClick={ () => handleContainerClose() }>取消</span>
  )
}

const AirportContent = ({ datas, handleAirportClick }) => {
  return (
    <ul className='airport-container'>
      {
        datas.map(item => (
          <li className='airport-item' key={ item.name } onClick={ () => handleAirportClick(item) }>
            <h1>{ item.name }</h1>
            {
              item.address &&
              <p>{ item.address }</p>
            }
          </li>
        ))
      }
    </ul>
  )
}
