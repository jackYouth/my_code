import React from 'react'
import { Icon } from 'antd-mobile'
import { Evaluation } from '@boluome/oto_saas_web_app_component'

import '../styles/order-id.scss'
import WaitAnimation from '../common-components-self/wait-animation'
import PayFooter from '../common-components-self/pay-footer'
import CancelInfo from '../components/cancel-info'
import driverImg from '../img/driver-info.png'

export default class OrderId extends React.Component {
  constructor(props) {
    super(props)
    const { noDriverResponse, currentStatus } = props
    this.state = {
      noDriverResponse,
      currentStatus,
    }
    this.mapNode = this.mapNode
  }
  componentWillReceiveProps(nextprops) {
    // 因为从其他页面过来，有可能不会从新初始化orderId组件，所以将noDriverResponse，currentStatus放到state中，方便自动更新
    const preNoDriverResponse = this.state.noDriverResponse
    const { noDriverResponse = false } = nextprops
    if (preNoDriverResponse !== noDriverResponse) this.setState({ noDriverResponse })

    const { currentStatus, currentOrderInfo = {} } = nextprops
    const { driver = {} } = currentOrderInfo
    this.setState({ currentStatus, driver })
  }
  componentDidUpdate() {
    const { currentStatus, driver } = this.state
    const { currentOrderInfo } = this.props
    if (!currentOrderInfo) return
    const { origin, destination } = currentOrderInfo

    const { Map, Marker, Size, Pixel } = window.AMap
    const AMapIcon = window.AMap.Icon

    // 清除上一个覆盖物
    if (this.driverMark) this.driverMark.setMap()
    // 获取司机经纬度
    // console.log(driver)
    const driverPoint = [driver.longitude, driver.latitude]
    // 设置司机图片
    const myIcon = new AMapIcon({
      image: require('../img/driver-point.png'),
      size:  new Size(45, 75),
    })
    this.driverMark = new Marker({
      position:    driverPoint,
      icon:        myIcon,
      zoom:        1,
      autoFitView: true,
      offset:      new Pixel(-24, -60),
    })
    this.driverMark.setMap(this.map)
    // 当没有当前信息返回时，就不运行下面的代码，防止地图找不到绑定的dom报错(this.map,是确保当页state更新再次刷新地图，同时避免返回在进入，不再渲染地图的原因，比使用preState判断多了后一个作用)
    if (!currentStatus || currentStatus === 0 || currentStatus === 1 || currentStatus === 8 || currentStatus === 11 || currentStatus === 12 || this.map) return true


    // 获取两地经纬度的中点
    const centerlatitude = (parseFloat(origin.latitude) + parseFloat(destination.latitude)) / 2
    const centerlongitude = (parseFloat(origin.longitude) + parseFloat(destination.longitude)) / 2
    // 初始化地图
    this.map = new Map(this.mapNode, {
      center: [centerlongitude, centerlatitude],
    })

    // 获取起、终点经纬度
    const startPoint = [origin.longitude, origin.latitude]
    const endPoint = [destination.longitude, destination.latitude]
    const startIcon = new AMapIcon({
      image: require('../img/start-point.png'),
      size:  new Size(66, 75),
    })
    const endIcon = new AMapIcon({
      image: require('../img/end-point.png'),
      size:  new Size(66, 75),
    })
    const startMark = new Marker({
      position:    startPoint,
      icon:        startIcon,
      zoom:        1,
      autoFitView: true,
      offset:      new Pixel(-32, -70),
    })
    const endMark = new Marker({
      position:    endPoint,
      icon:        endIcon,
      zoom:        1,
      autoFitView: true,
      offset:      new Pixel(-32, -70),
    })
    startMark.setMap(this.map)
    endMark.setMap(this.map)

    // 根据经纬度查询路线
    this.map.plugin('AMap.Driving', () => {
      // 我的路线规划
      const myDriving = new window.AMap.Driving({
        map:         this.map,
        hideMarkers: true,
      })
      myDriving.search(startPoint, endPoint, (status, result) => {
        // 解析返回结果，自己生成操作界面和地图展示界面
        console.log('驾车路线111', status, result)
      })

      // 司机接驾路线规划
      // const driverDriving = new window.AMap.Driving({
      //   map:         this.map,
      //   hideMarkers: true,
      //   isOutline:   false,
      //   showTraffic: false,
      // })
      // driverDriving.search([driverLongitude, driverLatitude], [origin.longitude, origin.latitude], (status, result) => {
      //   // 解析返回结果，自己生成操作界面和地图展示界面
      //   console.log('驾车路线222', status, result)
      // })
    })
  }

  render() {
    const {
      handleCancelClick, handleToPay, handleRecallClick, currentOrderInfo,
      handelRulesClick,
      handleToIndex,
      flag,
      handlePlaceEvaluate,
    } = this.props
    const { noDriverResponse = false } = this.state
    let { currentStatus } = this.state
    // 根据返回值判断加载哪个页面
    if (!currentOrderInfo) {
      return (<div />)
    }
    // 当订单已取消或是无应答状态且从stroke页面跳转而来时，显示订单取消页
    // 是否是一口价
    const { OTO_SAAS = {} } = window
    const { customer = {} } = OTO_SAAS
    const { isSinglePrice = false } = customer
    // 退款状态，看下面解释
    // 客户订单列表跳转进入时，没有带flag，但是带了联合登陆的参数，所以通过location.search.length > 1来判断是不是当前页面等待直到无司机应答和退款状态，仅当前页面等待直到无司机应答和退款状态是不显示订单取消页面
    if (currentStatus === 8 || currentStatus === 12 || (currentStatus === 4 && isSinglePrice) || (flag === '1' && (currentStatus === 0 || currentStatus === 11)) || (currentStatus === 11 && flag !== '1' && !noDriverResponse)) {
      return (
        <CancelInfo { ...{ currentOrderInfo, isSinglePrice, handleToIndex, handleCancelClick } } />
      )
    }
    // 实时计价，且在当前页面中时，退款状态要显示不转圈的样子，其他从订单列表跳进来都是订单详情页
    // 如果不是从订单列表跳转过来，说明是无司机应答时取消，并变成退款状态的，所以要显示无司机应答的页面，将currentStatus = 0
    if (currentStatus === 11 && flag !== '1' && noDriverResponse) {
      currentStatus = 0
    }

    let { waitTimerName } = this.props
    const { channel, createdAt, id, displayStatus, driver = { name: '', phone: '', score: '0', carColor: '', carType: '', plateNum: '' } } = currentOrderInfo
    if (!waitTimerName) waitTimerName = id
    let currentCircleSvg = require('svg/yongche/grey_circle.svg')
    let currentStatusText = '正在寻找车辆'
    if (currentStatus === 3) {
      currentCircleSvg = require('svg/yongche/yellow_circle.svg')
      currentStatusText = displayStatus
    }
    if (currentStatus === 4) {
      currentCircleSvg = require('svg/yongche/green_circle.svg')
      currentStatusText = '行程已结束，请您支付车费'
    }
    if (currentStatus === 5) {
      currentCircleSvg = require('svg/yongche/green_circle.svg')
      currentStatusText = '服务已完成，感谢您的选择和信赖'
    }
    const { name, phone, carColor, carType, plateNum } = driver
    let { score } = driver
    score = Number(score)
    return (
      <div className='order-id'>
        <div className='header'>
          {
            (currentStatus === 2 || currentStatus === 3 || currentStatus === 4 || currentStatus === 5) &&
            <div className='driver-info'>
              <p className='driver-img' style={{ background: `url(${ driverImg })`, backgroundSize: 'cover' }} />
              <ul className='driver-id'>
                <li className='top'>{ `${ name } ${ plateNum }` }</li>
                <li className='bottom'>
                  {
                    carColor &&
                    <p>{ `${ carColor }-${ carType }` }</p>
                  }
                  {
                    !carColor &&
                    <p>{ carType }</p>
                  }
                  <Evaluation defaultValue={ `${ score / 0.05 }%` } width={ '120px' } />
                  <span>{ score.toFixed(1) }</span>
                </li>
              </ul>
              <a href={ `tel:+86${ phone }` } className='driver-phone'><Icon type={ require('svg/yongche/phone.svg') } size='lg' /></a>
            </div>
          }
          {
            currentStatus !== 0 && currentStatus !== 1 && currentStatus !== 2 &&
            <div className='header-bottom'>
              <Icon type={ currentCircleSvg } size='xxs' />
              <p className='left'>{ currentStatusText }</p>
            </div>
          }
          {
            currentStatus === 2 &&
            <p className='driver-tips'>{ displayStatus }</p>
          }
        </div>
        {
          ((currentStatus === 0 && flag !== '1') || currentStatus === 1) && <WaitAnimation { ...{ noDriverResponse, waitTimerName: id, createdAt } } />
        }
        {
          currentStatus === 0 && noDriverResponse && <p className='footer1' onClick={ () => handleRecallClick(currentOrderInfo, isSinglePrice) }>{ isSinglePrice ? '查看退款进度' : '重新叫车' }</p>
        }
        {
          (currentStatus === 1 || currentStatus === 2) && <p className='footer1' onClick={ () => !noDriverResponse && handleCancelClick(currentStatus, channel) }>取消订单</p>
        }

        {
          ((currentStatus === 4 && !isSinglePrice) || currentStatus === 5) &&
          <PayFooter { ...{ handelRulesClick, handleToPay, currentStatus, currentOrderInfo, handlePlaceEvaluate } } />
        }

        {
          (currentStatus !== 0 && currentStatus !== 1 && currentStatus !== 8) && <div ref={ node => this.mapNode = node } className='my-map' />
        }
        <a href='tel:4000000999' style={{ position: 'absolute', bottom: '2rem', right: '.4rem', width: '1.05rem', height: '1.05rem' }}><img src={ require('../img/contact.png') } alt='contact' style={{ width: '100%', height: '100%' }} /></a>
      </div>)
  }
}

// {
//   currentStatus === 3 && <p className='footer3'>当前计费： <span>¥ 41.30</span></p>
// }
