import React, { Component } from 'react'
import { getStore } from '@boluome/common-lib'
import { merge } from 'ramda'
import { Toast } from 'antd-mobile'
import { Empty, Search, ContactNew } from '@boluome/oto_saas_web_app_component'
// import { getLocation } from 'business'
import icGoback from '../img/notfound.png'
import '../style/newAddressSearch.scss'

let handleSearchAddr
let handleChooseAddress
class AddressSearch extends Component {
  constructor(props) {
    super(props)
    const { longitude, latitude, currentCity } = this.props
    let { selectedAddress } = props
    // 如果没有传入经纬度，默认使用session中保存的定位的经纬度
    if (!selectedAddress) selectedAddress = getStore('geopoint', 'session')
    if (longitude && latitude) {
      selectedAddress = merge(selectedAddress, { longitude, latitude })
    }
    this.state = {
      selectedAddress,
      currentCity,
    }
    // this.mapContainer = ''
  }

  componentDidMount() {
    const { selectedAddress } = this.state
    this.getGoLocation(selectedAddress)
    handleSearchAddr = this.handleSearchAddr.bind(this)
    handleChooseAddress = this.handleChooseAddress.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    const { currentCity } = nextProps
    const preCity = this.state.currentCity
    // 选择城市后，重新初始化地图
    if (currentCity) {
      if (currentCity !== preCity) {
        this.geocoder.getLocation(currentCity, (status, result) => {
          if (status === 'complete') {
            const { geocodes } = result
            const { location } = geocodes[0]
            this.getGoLocation({ latitude: location.lat, longitude: location.lng })
          } else {
            Toast.fail('城市名转化经纬度失败！')
          }
        })
      }
    }
  }

  // 通过经纬度定位，联动
  getGoLocation(selectedAddress) {
    // console.log('selectedAddress', selectedAddress)
    const { Map } = window.AMap
    const point = [selectedAddress.longitude, selectedAddress.latitude]
    const map = new Map(this.mapContainer, {
      center: point,
      zoom:   12,
    })

    map.plugin(['AMap.Geolocation'], () => {
      this.geolocation = new window.AMap.Geolocation({
        enableHighAccuracy: true,
        timeout:            10000,
        zoomToAccuracy:     true,
        showButton:         false,
      })
      map.addControl(this.geolocation)
    })

    window.AMap.service(['AMap.PlaceSearch', 'AMap.Geocoder'], () => {
      // 地址搜索
      this.placeSearch = new window.AMap.PlaceSearch({ map })
      // 地址 <-> 经纬度
      this.geocoder = new window.AMap.Geocoder()
    })
  }

  handleSearchAddr(keyWord, callback) {
    // console.log('keyWord', keyWord, this.props.currentCity)
    this.placeSearch.setCity(this.props.currentCity)
    this.placeSearch.search(keyWord, (status, result) => {
      if (status === 'complete') {
        const searchResult = []
        const pois = result.poiList.pois
        for (let i = 0; i < pois.length; i++) {
          searchResult.push(pois[i])
        }
        this.setState({ searchResult })
        this.searchSearchCallback(null, searchResult)
      } else {
        console.log('地址搜索:', status)
      }
    })
    this.setState({ keyWord })
    // searchSearchCallback 是用来展示搜索结果的，不能取消
    this.searchSearchCallback = callback
  }

  handleChooseContact(contact) {
    const { onSuccess, handleContainerClose } = this.props
    // console.log('contact-==--=-=-=-=-=-=', contact)
    const newContact = {}
    newContact.point = {}
    newContact.point.lat = contact.latitude
    newContact.point.lng = contact.longitude
    newContact.address = contact.city + contact.county + contact.address + contact.detail
    newContact.title = contact.city + contact.county + contact.address + contact.detail
    newContact.contactId = contact.contactId
    this.setState({ newContact })
    onSuccess(contact, 'addedAddress')
    if (contact) {
      handleContainerClose()
    }
  }

  handleChooseAddress(local) {
    const { onSuccess, handleContainerClose } = this.props
    const { currentCity, district } = this.state
    local.city = currentCity
    local.district = district
    onSuccess(local, 'newAddress')
    handleContainerClose()
  }

  componentWillUnmount() {
    const { onSuccess } = this.props
    const { newContact, local } = this.state
    if (!newContact && !local) {
      onSuccess()
    }
  }

  render() {
    const { onSuccess, handleContainerClose, chooseContact } = this.props
    // console.log('chooseContact', this.props)
    return (
      <div className='newAddressSearch-container'>
        <div className='relocate' onClick={ () => {
          onSuccess('fetchBest', 'fetchBest')
          handleContainerClose()
        } }
        >
          点击定位当前位置
        </div>
        <div className='contact-container'>
          <p className='contact-title'>收货地址</p>
          <ContactNew
            handleChange={ contact => this.handleChooseContact(contact) }
            chooseContact={ chooseContact }
            fromWhich={ 1 }
          />
        </div>
        <div ref={ node => this.mapContainer = node } />
      </div>
    )
  }
}

export default class Address extends React.Component {
  constructor(props) {
    super(props)
    const { selectedAddress } = props
    const currentCity = selectedAddress ? selectedAddress.cityName : getStore('localCity', 'session')
    this.state = {
      currentCity,
    }
    this.handleChangeCurrentCity = this.handleChangeCurrentCity.bind(this)
  }
  handleChangeCurrentCity(cityData) {
    document.querySelectorAll('#searchInput').value = ''
    // console.log(document.querySelector('#searchInput'))
    this.setState({ currentCity: cityData.name, cleanKeyWords: true }, () => {
      // console.log('cleankeyWords', this.state)
    })
  }
  render() {
    const { handleContainerClose, onSuccess, LeftComponent, selectedAddress, longitude, latitude, myAttribute = '', chooseContact = {} } = this.props
    const { currentCity, cleanKeyWords = false } = this.state
    // console.log('this.props', this.props)
    return (
      <Search
        selfClass='address-search-bar'
        inputPlaceholder={ '请输入地址' }
        content={ <AddressSearch { ...{ onSuccess, handleContainerClose, currentCity, selectedAddress, longitude, latitude, myAttribute, chooseContact } } /> }
        listItem={ <ListItems { ...{ onSuccess, handleContainerClose } } /> }
        noResult={ <Empty message='没有结果，换个关键词试试～' imgUrl={ icGoback } /> }
        onFeach={ (keyWord, callback) => handleSearchAddr(keyWord, callback) }
        handleResult={ result => { console.log('result:', result) } }
        leftComponent={ LeftComponent ? <LeftComponent selectedAddress={ selectedAddress } handleChangeCurrentCity={ this.handleChangeCurrentCity } myAttribute={ myAttribute } /> : '' }
        delayTime={ 1000 }
        cleanKeyWords={ cleanKeyWords }
      />
    )
  }
}

const ListItems = ({ data }) => {
  // console.log('data', data)
  return (
    <div className='location' onClick={ () => handleChooseAddress(data) }>
      <div className='title'>{ data.name }</div>
      <div className='address'>{ data.address }</div>
    </div>
  )
}
