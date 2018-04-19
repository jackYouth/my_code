import React from 'react'
import { AddressSearchGaode, Mask, SlidePage, UserCenter } from '@boluome/oto_saas_web_app_component'
import { InputItem, Icon, Modal } from 'antd-mobile'

import LeftComponent from './common-component/left-compoent'

import '../styles/app.scss'

export default class App extends React.Component {
  constructor(props) {
    super(props)
    // isAddressComopnentSelect: 表示当前地址信息的改变是不是因为地址组件中选择造成的，如果是，就需要重新渲染AMapUI
    this.state = {
      phone:   '',
      isFirst: true,
    }
    this.handleAddressComponentSelect = this.handleAddressComponentSelect.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    const { isFirst } = this.state
    const { startPoint, isAddressComopnentSelect, changeAddressComponentSelect } = nextProps
    const preStartPoint = this.props.startPoint
    // 如果是第一次属性改变（这时应该是startPoint变了）或开始地址变了且是通过地址搜索组件改变的，这时需要重新渲染地图
    if ((startPoint.address !== preStartPoint.address && isAddressComopnentSelect) || isFirst) {
      const { Map }  = window.AMap
      const initData = {
        zoom:   18,
      }
      if (startPoint.longitude) initData.center = [startPoint.longitude, startPoint.latitude]
      this.aMap = new Map(this.mapNode, initData)
      this.initAMapUI()
      changeAddressComponentSelect(false)
      this.setState({ isFirst: false })
    }
  }

  // 地图的ui组件要单独抽出来，保证每次在地址搜索组件选择过地址之后，ui组件能重新渲染
  initAMapUI() {
    const { handleChangeStartPoint } = this.props
    // 配置地图插件
    this.aMap.plugin('AMap.Geolocation', () => {
      const geolocation = new window.AMap.Geolocation({
        enableHighAccuracy: true,      // 是否使用高精度定位，默认:true
        timeout:            3000,     // 超过10秒后停止定位，默认：无穷大
        zoomToAccuracy:     true,      // 定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
        buttonPosition:     'RB',
      })
      this.aMap.addControl(geolocation)
    })
    // 拖拽地图事件
    window.AMapUI.loadUI(['misc/PositionPicker'], PositionPicker => {
      const positionPicker = new PositionPicker({
        mode: 'dragMap',
        map:  this.aMap,
        iconStyle: { // 自定义外观
          url: require('../img/start-point.png'),
          ancher: [24, 40],
          size: [48, 48],
        },
      })
      positionPicker.on('success', result => {
        const { regeocode, position, address } = result
        const { pois, addressComponent } = regeocode
        const data = {
          name:     pois[0].name,
          location: position,
          city:     addressComponent.city ? addressComponent.city : addressComponent.province,
          address,
        }
        handleChangeStartPoint(data)
      })
      positionPicker.on('fail', result => {
        console.log('AMapUI', result)
      })
      positionPicker.start()
    })
  }

  handleAddressComponentSelect(data) {
    const { handleChangeStartPoint, changeAddressComponentSelect } = this.props
    this.setState({ isAddressComopnentSelect: true })
    handleChangeStartPoint(data)
    changeAddressComponentSelect(true)
  }

  render() {
    const {
      phone = '', startPoint, handleInputChange, handleToOrder, carNum = '', handleToPriceRules,
      showOngoing, onGoingOrder, handleOngoingModalClick,
    } = this.props
    console.log('startPoint', startPoint)
    let { name } = startPoint
    const { latitude, longitude, address } = startPoint
    const orderParas = {
      latitude,
      longitude,
      address,
      phone: phone.replace(/\s/g, ''),
    }
    const canPlace = name && /^1(3[0-9]|4[579]|5[0-35-9]|7[0-9]|8[0-9])\d{8}$/.test(phone.replace(/\s/g, ''))
    if (!name) name = '请选择出发地点'
    return (
      <div className='daijia' style={ startPoint.latitude ? {} : { display: 'none' } }>
        <UserCenter categoryCode='daijia' />
        <div ref={ node => this.mapNode = node } className='daijia-map' />
        <p className='car-num'>{ `附近有${ carNum }位司机` }</p>
        <div className='daijia-info'>
          <ul className='daijia-info-container address-info'>
            <li>
              <span className='green-icon icon' />
              <p onClick={ () => Mask(<SlidePage showClose={ false }><AddressSearchGaode { ...startPoint } selectedAddress='' onSuccess={ this.handleAddressComponentSelect } LeftComponent={ LeftComponent } noFocus /></SlidePage>) }>{ name }</p>
              <Icon type='right' size='md' color='#ccc' />
            </li>
            <li>
              <span className='orange-icon icon' />
              <InputItem
                type='phone'
                value={ phone }
                onChange={ handleInputChange }
                placeholder='请输入手机号码'
              />
            </li>
            <li onClick={ () => handleToPriceRules(startPoint) }>
              <p>计费规则</p>
              <Icon type='right' size='md' color='#ccc' />
            </li>
          </ul>
          <div className='daijia-info-container to-order' onClick={ () => canPlace && handleToOrder(orderParas) } style={ canPlace ? {} : { background: '#ccc' } }>
            一键下单
          </div>
        </div>

        <Modal
          title='您有一个行程中的订单，是否进入？'
          transparent
          maskClosable={ false }
          visible={ showOngoing }
          footer={
          [
            {
              text:    '确定',
              onPress: () => {
                handleOngoingModalClick(onGoingOrder)
              },
            },
          ] }
          className='onging-modal'
        />
      </div>
    )
  }
}
