import React, { Component } from 'react'
// import { browserHistory } from 'react-router'
import { OrderDetail, SlidePage, Mask } from '@boluome/oto_saas_web_app_component'
import { moment } from '@boluome/common-lib'
import { WhiteSpace, List, Icon } from 'antd-mobile'
import { equals } from 'ramda'
// import bg from '../img/bg.png'
import '../style/orderDetails.scss'

const Item = List.Item
// id='bl001773304153338'
const OrderDetails = orderDetails => {
  const { orderNo, goPay } = orderDetails
  return (
    <div className='orderDetails'>
      { orderNo && <OrderDetail
        content={ <Content orderDetails={ orderDetails } /> }
        id={ orderNo }
        orderType='qiche'
        goPay={ () => { goPay(orderNo) } }
      /> }
    </div>
  )
}

class Content extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  componentWillReceiveProps(nextProps) {
    const a = this.props.orderDetailInfo
    const b = nextProps.orderDetailInfo
    if (!equals(a, b)) {
      console.log(b)
    }
  }
  render() {
    const { orderDetailInfo, orderDetails } = this.props
    const { id, partnerId, price = 0, ticketNo, checkIn, seatNumbers, passengers = [], contactor, extraServices = [], realPayPrice, schedules = [], platformActivity, coupon, createdAt } = orderDetailInfo
    const { bool, orderNo, handleBool, handleTui } = orderDetails
    const jisu = extraServices.filter(e => e.type === 3)[0]
    const baoxianData = extraServices.filter(e => e.type === 1)[0]
    console.log(orderNo, jisu, handleBool)
    if (id) {
      const schedule = schedules[0]
      const { stationPhone, stationAddress } = schedule
      return (
        <div className='odlcenter'>
          <WhiteSpace size='lg' />

          { schedules.length && <Card checiinfo={ schedules[0] } /> }
          { ticketNo && <p className='seat_tui'>
            <span>{ checkIn ? `检票口：${ checkIn }` : '' }{ seatNumbers ? `  座位号：${ seatNumbers }` : '' }</span>
            <span onClick={ () => { handleTui(id, partnerId) } }>退票</span>
          </p> }

          <WhiteSpace size='lg' />

          <div className='passenger'>
            <h3><p>乘客信息</p></h3>
            {
              passengers.length > 0 && passengers.map(e => {
                return (
                  <div className='ps_list' key={ `bx${ Math.random() }` }>
                    <div>
                      <p><span>{ e.name }</span>成人票</p>
                      <p><span>身份证</span>{ e.credentialCode }</p>
                    </div>
                    { e.credentialCode === contactor.credentialCode ? <p>取票人</p> : '' }
                  </div>
                )
              })
            }
          </div>
          <p className='passengerbt'><span>取票手机</span>{ contactor && contactor.phone }</p>

          <WhiteSpace size='lg' />

          <div className='switch'>
            <p><span style={ !bool ? { color: '#ffab00' } : {} } onClick={ () => { handleBool(false) } }>取票方式</span><span style={ bool ? { color: '#ffab00' } : {} } onClick={ () => { handleBool(true) } }>车站信息</span></p>
            <div className='switch_c'>
              { !bool ? <p>成功支付后，可凭系统发送短信中的身份证至【汽车站】取票乘车</p>
                   : <div>
                     <p><span>车站电话：</span>{ stationPhone}</p>
                     <p><span>车站地址：</span>{ stationAddress }</p>
                   </div> }
            </div>
          </div>

          <WhiteSpace size='lg' />

          { baoxianData && <List>
            <Item extra={ <span style={{ fontSize: '0.28rem', color: '#999999' }}>{ baoxianData.insuranceProductName }</span> } onClick={ () => {
              Mask(
                <SlidePage target='right' type='root' showClose={ false }>
                  <Baoxian baoxianData={ baoxianData } />
                </SlidePage>, { mask: false }
              )
            } }
            >
              <span style={{ fontSize: '0.28rem' }}>出行保险</span>
            </Item>
          </List>
          }

          <WhiteSpace size='lg' />

          <List>
            <Item extra={ <span>{ price }</span> }>总价</Item>
            { platformActivity && <Item extra={ <span className='numpri'>－ ¥{ platformActivity.price }</span> }><span className='jianhui' style={{ background: '#ff6e19' }}>减</span>{ platformActivity.title }</Item> }
            <Item extra={ <span className='numpri'>- ¥{ coupon ? coupon.price : 0.0 }</span> }><span className='jianhui'>红</span>红包抵扣／兑换红包</Item>
            <Item extra={ <span className='realsubpri'>{ `实付 ¥${ realPayPrice }` }</span> }><span /></Item>
          </List>

          <WhiteSpace size='lg' />

          <List>
            <Item extra={ <span>{ id }</span> }>订单编号</Item>
            <Item extra={ <span>{ moment('YYYY-MM-DD HH:mm:ss')(createdAt) }</span> }>下单时间</Item>
          </List>
        </div>
      )
    }
    return (
      <div />
    )
  }
}

// 信息展示
const Detail = ({ handleContainerClose }) => {
  return (
    <div className='gou_detail' onClick={ () => { handleContainerClose() } }>
      <div>
        <h2>购票说明</h2>
        <p>1.同一笔订单可购买的车票数量不超过3张，如购票乘车人数超出3位，请分开预订。</p>
        <p>3.当出票失败后，您将会收到出票失败的短信，请勿继续预订当前车次，所退款项将在1-15个工作日内原路退还到您的支付账户中。</p>
        <p>4.部分车站增收服务费，如去车站窗口退票服务费车站不予退还。</p>
        <p>5.系统为您提供的车型信息为参考车型，实际可能根据客运站的调整有所变化，具体以各客运站发车车型为准。</p>
        <h2>取票说明</h2>
        <p>1.请提前至少30分钟（节假日等高峰期建议提前一小时），凭取票人身份证、取票号和取票密码至出发车站取票。（若有取票机，则可凭借取票号取票；若无取票机，则需凭借取票人身份证到窗口办理）。</p>
        <p>2.如您在发车前30分钟仍未收到车票相关信息，请及时拨打4007-777-777进行核实。</p>
        <h2>退改说明</h2>
        <p>1.目前汽车票暂不支持线上退票，如需退票，请在出发车站取出纸质票，再到车站窗口办理退票，办理退票手续车站会收取票面价10%-20%手续费，具体金额请以各客运站站公布的规则为准。</p>
        <p>2.开车后一般不退票（请以各客运站规定为准）。</p>
        <p>3.由于承运人责任造成班车晚点、托班等延迟运输的，旅客可根据需要改乘其他班次或者退票，免收退票费。</p>
        <p>4.临时加班的班次，无法退票（如车站可退票，请以车站为准）。</p>
        <p>5.汽车票业务暂时不支持线上改签操作，如需改签，建议您在发车前至出发车站，在取出纸质票后，再到车站窗口办理退票改签。具体以车站实际情况为准。</p>
        <p>6.办理退票不再支持参与红包、优惠券、立减等活动，服务费不予退还。</p>
        <p>7.部分车站退票需原支付渠道退款，您至始发站办理退票时若车站只同意退票未给予退款，请在3个工作日内联系客服核实并完成退款。</p>
      </div>
    </div>
  )
}

// 车次信息展示
const Card = ({ checiinfo }) => {
  const { coachType, depatureCity, arriveCity, departureStation, arriveStation, departureDate, departureTime, travelTime } = checiinfo
  const datesplit = departureDate.split('-')
  const datetxt = `${ datesplit[1] }月${ datesplit[2] }日${ departureTime }`
  return (
    <div className='detailCart'>
      <p className='qctit'>
        <span>参考车型：{ coachType }</span>
        <span onClick={ () => {
          Mask(
            <SlidePage target='right' type='root' showClose={ false }>
              <Detail />
            </SlidePage>, { mask: false }
          )
        } }
        ><Icon type={ require('svg/jipiao/tiping.svg') } />购票、取票、退票说明</span>
      </p>
      <div className='cart_main'>
        <div>
          <h3>{ depatureCity }</h3>
          <p>{ departureStation }</p>
        </div>
        <div className='cart_mainmid'>
          <p>{ datetxt }</p>
          <p />
          <p>{ travelTime }</p>
        </div>
        <div>
          <h3>{ arriveCity }</h3>
          <p>{ arriveStation }</p>
        </div>
      </div>
    </div>
  )
}

// 保险信息展示
const Baoxian = ({ baoxianData, handleContainerClose }) => {
  const { insuranceName, insuranceProductName, compensationVolume, insuranceOrderNum = '', passengers = [] } = baoxianData
  const tatusText = ['待生效', '已生效', '购买失败']
  const tatusColor = ['#ffab00', '#ffab00', '#ff4848']
  return (
    <div className='baoxian' onClick={ () => { handleContainerClose() } }>
      <div className='baoxian_main'>
        <div className='baoxian_list' key={ `bx${ Math.random() }` }>
          <div>
            <p>{ `${ insuranceName }  ${ insuranceProductName }` }</p>
            <p>{ compensationVolume ? `推荐购买，正常出票，保额${ compensationVolume }万` : '安全出行，建议选购保险' }</p>
          </div>
          <Icon type={ require('svg/qiche/tiping.svg') } />
        </div>
        {
          passengers.length > 0 && passengers.map(e => {
            return (
              <div>
                <div className='ps_list' key={ `bx${ Math.random() }` }>
                  <div>
                    <p><span>被保险人</span>{ `${ e.name }  ${ e.credentialCode }` }</p>
                    { insuranceOrderNum && <p><span>保单号</span>{ insuranceOrderNum }</p> }
                  </div>
                  <p style={{ border: `1px solid ${ tatusColor }`, color: `${ tatusColor }` }}>{ tatusText[e.tatus] }</p>
                </div>
                { e.tatus === 2 && <p style={{ paddingTop: '0.2rem', fontSize: '0.24rem', color: '#ffab00' }}>退款会在1-5个工作日内退回您的支付账户</p> }
              </div>
            )
          })
        }
      </div>
    </div>
  )
}

export default OrderDetails
