import React from 'react'
import { getStore, setStore } from '@boluome/common-lib'
import { UserCenter, Mask, SlidePage, AddressSearchGaode, Listview, Loading } from '@boluome/oto_saas_web_app_component'
import { List, Icon, Toast } from 'antd-mobile'
import { send } from 'business'
import { merge, equals } from 'ramda'

import SelectBusiness from './app-components/select-business'
import SelectTimes from './app-components/select-times'
import SelectSort from './app-components/select-sort'
import GoodItem from './common-component/good-item'
import NoOneComponent from './common-component/no-one-component'
import '../styles/app.scss'

const LItem = List.Item

if (location.origin.indexOf('blm.test') >= 0) {
  const VConsole = require('vconsole')
  // new VConsole()
  console.log('vconsole', VConsole.test)
}

export default class App extends React.Component {
  constructor(props) {
    super(props)
    const { currentCategoryIndex, selectedCity } = props
    this.state = {
      currentCategoryIndex,
      selectedCity,                                                              // 表示当前选中的行业小类
      goodsParas:           { industryCategoryId: currentCategoryIndex },            // 表示当前请求goods时传的参数
      businessActive:       false,                                                   // 表示当前商家选择按钮是否是选中状态
      timesActive:          false,                                                   // 表示当前时间选择按钮是否是选中状态
      sortActive:           false,                                                   // 表示当前排序选择按钮是否是选中状态
      currentDateIndex:     0,                                                       // 表示当前选中的日期在列表中的索引
      currentTimeIndex:     0,                                                       // 表示当前选中的分钟在列表中的索引
      currentSort:          { name: '推荐排序', id: 'default' },                      // 表示当前选中的是哪一种排序方式，默认为default
      offset:               0,                                                       // 表示默认的当前商品数，offset
      currentBusinnessName: '选择商家',
    }
    this.handleSelectCity = this.handleSelectCity.bind(this)
    this.handleGridClick = this.handleGridClick.bind(this)
    this.handleTimeItemClick = this.handleTimeItemClick.bind(this)
    this.handleSortItemClick = this.handleSortItemClick.bind(this)
    this.handleFetchDataMid = this.handleFetchDataMid.bind(this)
    this.limit = 0
    this.fetchNum = 0
  }
  componentWillReceiveProps(nextProps) {
    const { selectedCity } = nextProps
    const preSelectedCity = this.props.selectedCity
    if (!equals(selectedCity)(preSelectedCity)) {
      this.setState({ selectedCity })
    }
  }
  shouldComponentUpdate() {
    const maskNode = document.querySelector('.mask')
    // 当点击遮罩时，关闭所有滑层，并改变对应状态
    if (maskNode) {
      maskNode.onclick = () => {
        Mask.closeAll()
        this.setState({ businessActive: false, timesActive: false, sortActive: false })
        this.closeBusiness = ''
        this.closeTimes = ''
        this.closeSort = ''
      }
    }
    return true
  }
  handleSelectCity(cityData) {
    const { city, name, location } = cityData
    console.log('cityData', cityData)
    // 将经纬度转为详细地址
    const pointToCity = (longitude, latitude) => {
      window.AMap.service('AMap.Geocoder', () => {
        // 地址 <-> 经纬度
        const geocoder = new window.AMap.Geocoder({
          radius:     1000,
          extensions: 'all',
        })
        geocoder.getAddress([longitude, latitude], (status, result) => {
          if (status === 'complete' && result.info === 'OK') {
            const selectedCity = { city, address: name, county: result.regeocode.addressComponent.district, longitude, latitude }
            setStore('selectedCity', selectedCity, 'session')
            this.setState({ selectedCity, offset: 0 })
          } else {
            console.log('经纬度转地址失败')
          }
        })
      })
    }
    pointToCity(location.lng, location.lat)
  }
  handleFilterClickMiddleware(currentCategoryIndex) {
    const { categories } = this.props
    const { goodsParas } = this.state
    this.setState({ currentCategoryIndex, offset: 0 })
    goodsParas.industryCategoryId = categories[currentCategoryIndex].industryCategoryId
    this.handleFetchDataMid(20, 0, goodsParas, this.onSuccess)
  }
  // 分别定义选择商家按钮和商家选择按钮的点击事件
  handleGridClick(res) {
    console.log('res', res)
    const { goodsParas } = this.state
    goodsParas.brandId = res.id
    this.setState({ goodsParas, offset: 0, currentBusinnessName: res.text })
    this.handleFetchDataMid(20, 0, goodsParas, this.onSuccess)
    // 将closeBusiness的Mask变成''
    this.closeBusiness = ''
    this.setState({ businessActive: false })
  }
  handleBusinessClick() {
    const { serverBusiness } = this.props
    if (this.closeBusiness) {
      this.closeBusiness()
      this.closeBusiness = ''
      this.setState({ businessActive: false })
      return
    }
    this.setState({ businessActive: true, timesActive: false, sortActive: false })
    // 关闭其他的slidePage
    if (this.closeTimes) this.closeTimes()
    this.closeTimes = ''
    if (this.closeSort) this.closeSort()
    this.closeSort = ''
    this.closeBusiness = Mask(<SlidePage showClose={ false } target='up selector-mask'><SelectBusiness { ...{ serverBusiness, handleGridClick: this.handleGridClick } } /></SlidePage>, { style: { marginTop: '1.63rem', zIndex: '10' } })
  }
  // 分别定义选择时间按钮和时间选择按钮的点击事件
  handleTimeItemClick(res) {
    const { goodsParas } = this.state
    const { date, serviceTime, currentDateIndex, currentTimeIndex } = res
    goodsParas.date = date
    goodsParas.serviceTime = serviceTime
    this.setState({ goodsParas, currentDateIndex, currentTimeIndex, timesActive: false })
    this.handleFetchDataMid(20, 0, goodsParas, this.onSuccess)
    // 将closeBusiness的Mask变成''
    this.closeTimes = ''
  }
  handleTimesClick() {
    const { serverTimes } = this.props
    const { currentDateIndex, currentTimeIndex } = this.state
    if (this.closeTimes) {
      this.closeTimes()
      this.closeTimes = ''
      this.setState({ timesActive: false })
      return
    }
    this.setState({ timesActive: true, businessActive: false, sortActive: false })
    // 关闭其他的slidePage
    if (this.closeBusiness) this.closeBusiness()
    this.closeBusiness = ''
    if (this.closeSort) this.closeSort()
    this.closeSort = ''
    this.closeTimes = Mask(<SlidePage showClose={ false } target='up selector-mask'><SelectTimes { ...{ serverTimes, handleTimeItemClick: this.handleTimeItemClick, currentDateIndex, currentTimeIndex } } /></SlidePage>, { style: { marginTop: '1.63rem', zIndex: '10' } })
  }
  // 分别定义选择时间按钮和时间选择按钮的点击事件
  handleSortItemClick(currentSort) {
    const { goodsParas } = this.state
    goodsParas.sort = currentSort.id
    this.setState({ currentSort, sortActive: false, goodsParas })
    this.handleFetchDataMid(20, 0, goodsParas, this.onSuccess)
    // 将closeBusiness的Mask变成''
    this.closeSort = ''
  }
  handleSortClick() {
    const serverSorts = [{ name: '推荐排序', id: 'default' }, { name: '价格从低到高', id: 'price' }, { name: '好评从高到低', id: 'quality' }]
    const { currentSort } = this.state
    if (this.closeSort) {
      this.closeSort()
      this.closeSort = ''
      this.setState({ sortActive: false })
      return
    }
    this.setState({ sortActive: true, businessActive: false, timesActive: false })
    // 关闭其他的slidePage
    if (this.closeTimes) this.closeTimes()
    this.closeTimes = ''
    if (this.closeBusiness) this.closeBusiness()
    this.closeBusiness = ''
    this.closeSort = Mask(<SlidePage showClose={ false } target='up selector-mask'><SelectSort { ...{ serverSorts, handleSortItemClick: this.handleSortItemClick, currentSort } } /></SlidePage>, { style: { marginTop: '1.63rem', zIndex: '10' } })
  }

  handleFetchDataMid(limit, offset, fetchData, onSuccess) {
    const closeLoading = Loading()
    this.onSuccess = onSuccess
    const selectedCity = getStore('selectedCity', 'session')
    let { goodsParas } = this.state
    const { industryCode } = this.props
    console.log('limit22222', limit, offset)
    goodsParas = merge(goodsParas)({ limit: Math.ceil(offset / limit) + 1, offset: limit })
    const { longitude, latitude, city, county } = selectedCity
    goodsParas = merge(goodsParas)({ longitude, latitude, city, county, industryCode })
    if (goodsParas.date === '' || (goodsParas.date && isNaN(Number(goodsParas.date[0])))) delete goodsParas.date
    if (goodsParas.serviceTime === '' || (goodsParas.serviceTime && isNaN(Number(goodsParas.serviceTime[0])))) delete goodsParas.serviceTime
    send('/daojia/v1/category/services', goodsParas).then(({ code, data, message }) => {
      if (code === 0) {
        const { serviceData } = data
        onSuccess(serviceData)
        if (serviceData.length > 0) this.setState({ offset: this.state.offset + serviceData.length })
      } else {
        Toast.fail(message, 1)
      }
      closeLoading()
    })
  }


  render() {
    const {
      offset, currentCategoryIndex, goodsParas, businessActive, timesActive, sortActive, currentSort,
      currentDateIndex, currentTimeIndex,
      selectedCity,
      currentBusinnessName,
    } = this.state
    const {
      handleGoodClick,
      categories,
      serverTimes,
      industryCode,
      handleSearchClick,
    } = this.props
    if (!categories) {
      return <div />
    }
    console.log('currentBusinnessName', currentBusinnessName)
    return (
      <div className='app'>
        <UserCenter categoryCode={ industryCode } />
        <LItem className='header' extra={ <Icon onClick={ handleSearchClick } type={ require('svg/daojia/search.svg') } size='md' /> }>
          <div className='position' onClick={ () => Mask(
            <SlidePage showClose={ false }>
              <AddressSearchGaode { ...{ selectedCity, onSuccess: this.handleSelectCity, noFocus: true } } />
            </SlidePage>)
          }
          >
            <p>{ (selectedCity && selectedCity.address) ? selectedCity.address : '' }</p>
            <Icon type={ require('svg/daojia/down_push.svg') } size='xxs' />
          </div>
        </LItem>
        <ul className='selector'>
          <li onClick={ () => this.handleBusinessClick() } className={ businessActive ? 'container active' : 'container' }>
            <p>{ currentBusinnessName }</p>
            <Icon type={ businessActive ? 'up' : 'down' } size='xxs' color='#999' />
          </li>
          <li onClick={ () => this.handleTimesClick() } className={ timesActive ? 'container active' : 'container' }>
            <p>{ currentDateIndex === 0 ? '选择时间' : `${ serverTimes[currentDateIndex].date }(${ serverTimes[currentDateIndex].timePointVos[currentTimeIndex].timePoint })` }</p>
            <Icon type={ timesActive ? 'up' : 'down' } size='xxs' color='#999' />
          </li>
          <li onClick={ () => this.handleSortClick() } className={ sortActive ? 'container active' : 'container' }>
            <p>{ currentSort.name }</p>
            <Icon type={ sortActive ? 'up' : 'down' } size='xxs' color='#999' />
          </li>
        </ul>
        <ul className='s-label'>
          {
            categories.map((item, index) => <li className={ index === currentCategoryIndex ? 'active' : '' } key={ item.industryCategoryId } onClick={ () => this.handleFilterClickMiddleware(index) }>{ item.industryCategoryName }</li>)
          }
        </ul>
        <ul className='goods'>
          <Listview
            listItem={ <GoodItem onClick={ handleGoodClick } /> }
            onFetch={ this.handleFetchDataMid }
            limit={ 20 }
            offset={ offset }
            fetchData={ goodsParas }
            noOneComponent={ <NoOneComponent /> }
          />
        </ul>
      </div>
    )
  }
}
