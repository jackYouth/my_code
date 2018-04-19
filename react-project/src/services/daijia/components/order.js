import React from 'react'
import { NewEvaluation } from '@boluome/oto_saas_web_app_component'
import { Icon as AIcon } from 'antd-mobile'

import '../styles/order.scss'

export default class Order extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      test: 1,
    }
  }
  componentWillReceiveProps(nextProps) {
    const { orderInfo } = nextProps
    if (orderInfo && !this.aMap) {
      const { Map, Icon, Size, Marker, Pixel }  = window.AMap
      const center = [orderInfo.lng, orderInfo.lat]
      const initData = {
        zoom: 18,
        center,
      }
      this.aMap = new Map(this.mapNode, initData)

      const myIcon = new Icon({
        image: require('../img/start-point.png'),
        size:  new Size(80, 90),                    // x, y方向缩放比例，最大为100
      })
      const myMark = new Marker({
        position: center,
        map:      this.aMap,
        icon:     myIcon,
        offset:   new Pixel(-40, -80),
      })
      console.log(myMark.test)
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
    }
  }
  render() {
    const { orderInfo, handleCancelOrder } = this.props
    if (!orderInfo) {
      return (
        <div className='order'>
          <div className='map-node' ref={ node => this.mapNode = node } />
        </div>
      )
    }
    const { status, partnerStatusCode, displayStatus, id, driver = {} } = orderInfo
    const { age, level, name, num, phone, avatar } = driver
    // 默认是取消订单时的样式
    let statusDescribe = '期待下次为您服务'
    let iconStyle = '#999999'
    if (status === 9 && partnerStatusCode === 0) {
      statusDescribe = '请稍等片刻'
      iconStyle = '#ffab00'
    }
    if (status === 9 && partnerStatusCode === 1) {
      statusDescribe = '司机正向您飞奔而来'
      iconStyle = '#4a90e2'
    }
    if (status === 9 && partnerStatusCode === 2) {
      statusDescribe = '司机已到达出发地点'
      iconStyle = '#50e3c2'
    }
    if (status === 9 && partnerStatusCode === 3) {
      statusDescribe = '行驶途中注意安全哦'
      iconStyle = '#4a90e2'
    }
    if (status === 4) {
      statusDescribe = '感谢您使用我们的服务！'
      iconStyle = '#50e3c2'
    }
    const showCancel = status === 9 && (partnerStatusCode === 0 || partnerStatusCode === 1)
    return (
      <div className='order'>
        <div className='map-node' ref={ node => this.mapNode = node } />
        {
          orderInfo &&
          <div className='order-status-info'>
            {
              status === 9 && partnerStatusCode !== 0 &&
              <div className='driver-info'>
                <p style={{ background: `url(${ avatar }) no-repeat center center`, backgroundSize: 'cover' }} className='driver-img' />
                <div className='driver-describe'>
                  <div>
                    <span>{ name }</span>
                    <NewEvaluation defaultValue={ level } width='1.2rem' />
                  </div>
                  <p>{ `车牌号：${ num } 驾龄：${ age }年` }</p>
                </div>
                <a href={ `tel:${ phone }` }><AIcon type={ require('svg/daijia/phone.svg') } size='lg' /></a>
              </div>
            }
            <div className={ status === 9 && partnerStatusCode === 0 ? 'is-wait' : 'no-wait' }>
              <span className='icon' style={{ background: iconStyle }} />
              <span className='status-title'>{ displayStatus }</span>
              <span className='status-describe'>{ statusDescribe }</span>
              {
                showCancel &&
                <span className='status-button' onClick={ () => handleCancelOrder(id) }>取消订单</span>
              }
            </div>
          </div>
        }
      </div>
    )
  }
}


/*
*status： 4: 已完成，8：已取消，9：处理中
*partnerStatusCode：
*等待司机接单：0
*司机已接单和等待司机就位：1
*司机已就位：2
*行驶中：3
*已完成：6
*已取消：7
*/
