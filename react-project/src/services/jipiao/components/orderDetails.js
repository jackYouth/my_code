import React, { Component } from 'react'
import { browserHistory } from 'react-router'
import { OrderDetail, Mask, SlidePage } from '@boluome/oto_saas_web_app_component'
import { moment } from '@boluome/common-lib'
import { send } from 'business'
import { WhiteSpace, List, Icon, Accordion } from 'antd-mobile'
import { equals } from 'ramda'
import { Tuigaiqian } from '../components/detail'
import '../style/orderDetails.scss'

const Item = List.Item
// id='bl001773304153338'
const OrderDetails = orderDetails => {
  const { login, orderNo, goPay } = orderDetails
  return (
    <div className='orderDetails'>
      { orderNo && <OrderDetail
        content={ <Content orderDetails={ orderDetails } /> }
        login={ login }
        id={ orderNo }
        orderType='jipiao'
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
      const { orderDetailInfo } = nextProps
      const { relatedOrders = [] } = orderDetailInfo
      const idlist = relatedOrders.reduce((arr, e) => {
        if (e.type === 'baoxian') {
          arr.push(e.id)
        }
        return arr
      }, [])
      if (idlist.length > 0) {
        // 查询保险
        send('/baoxian/v1/info', {
          orderIds: idlist,
        })
        .then(({ code, data, message }) => {
          if (code === 0) {
            this.setState({
              baoxianData: data,
            })
          } else {
            console.log(message)
          }
        })
      }
    }
  }
  render() {
    const { baoxianData = [] } = this.state
    const { orderDetailInfo, orderDetails } = this.props
    const { RV, isChangeShow, flights, changeRule, passengers = [], contactor, id, createdAt, coupon = '', platformActivity = '', price = 0, realPrice = 0, status, endorseList, refundList, isUnpaid } = orderDetailInfo
    // isChangeShow 51返呗不需要改签
    const { orderNo } = orderDetails
    const passList = passengers.reduce((arr, e) => {
      if (!e.isChangeSuccess) {
        arr.push(e)
      }
      return arr
    }, [])
    const renum = refundList ? refundList.reduce((num, e) => {
      return num + e.realRefundPrice
    }, 0) : 0
    const addp = (coupon ? coupon.price : 0) + (platformActivity ? platformActivity.price : 0)
    if (flights) {
      return (
        <div className='odlcenter'>

          <WhiteSpace size='lg' />

          { passList.length > 0 && <Card flightData={ flights[0] } status={ status } /> }
          { (status !== 4 && status !== 25) && <p className='tgTip'><span onClick={ () => {
            Mask(
              <SlidePage target='right' showClose={ false } >
                <Tuigaiqian data={ changeRule } />
              </SlidePage>,
              { mask: false, style: { position: 'absolute' } }
            )
          } }
          >退改签规则</span></p> }
          { (status === 4 || status === 25) && passList.map((e, i) => <Suepass bdbt={ i === (passList.length - 1) ? 'true' : '' } key={ `pas${ e.credentialCode }${ i * 1 }` } isChangeShow={ isChangeShow } suepassinfo={ e } changeRule={ changeRule } cabinType={ flights[0].cabinType } orderDetails={ orderDetails } eoId={ orderNo } isUnpaid={ isUnpaid } />) }

          { (status === 4 || status === 25) && endorseList.map(e => <Sueflag key={ `Sueflag${ e.orderId }` } endorse={ e } isChangeShow={ isChangeShow } passengers={ passengers } orderDetails={ orderDetails } status={ status } isUnpaid={ isUnpaid } />) }

          { (status !== 4 && status !== 25) && <Passinfo passengers={ passengers } /> }

          <WhiteSpace size='lg' />

          <div className='passWrap'>
            <div className='passinfo'>
              <span>联系人</span>
              <div>
                <p><span className='passname'>{ contactor.name }</span><span>{ `${ contactor.phone.slice(0, 3) } **** ${ contactor.phone.slice(-4) }` }</span></p>
              </div>
            </div>
          </div>

          { baoxianData.length > 0 && <Baoxianwrap baoxianData={ baoxianData } /> }
          <WhiteSpace size='lg' />

          <List>
            <Item extra={ <span>¥{ price.toFixed(2) }</span> }>总价</Item>
            { platformActivity && <Item extra={ <span className='numpri'>－ ¥{ platformActivity.price }</span> }><span className='jianhui' style={{ background: '#ff6e19' }}>减</span>{ platformActivity.title }</Item> }
            <Item extra={ <span className='numpri'>- ¥{ coupon ? coupon.price : 0.0 }</span> }><span className='jianhui'>红</span>红包抵扣／兑换红包</Item>
            <Item extra={ <span className='realsubpri'>{ `实付 ¥${ realPrice.toFixed(2) }` }<Icon type={ require('svg/jipiao/tiping.svg') } onClick={ () => {
              Mask(
                <SlidePage target='right' showClose={ false } >
                  <Pridetail pasdata={ passengers } baoxianShowData={ baoxianData } realPrice={ realPrice } RV={ RV } addp={ addp } />
                </SlidePage>,
                { mask: false, style: { position: 'absolute' } }
              )
            } }
            />
            </span> }
            ><span /></Item>
          </List>
          <WhiteSpace size='lg' />

          {
            RV.contains === 1 && <div>
              <List>
                <Item arrow='horizontal' onClick={ () => { browserHistory.push(`/jipiao/remail/${ orderNo }`) } }>报销凭证</Item>
              </List>
              <WhiteSpace size='lg' />
            </div>
          }

          {
            refundList.length > 0 && <div>
              <WhiteSpace size='lg' />
              <Accordion accordion openAnimation={{}}>
                <Accordion.Panel header={ <p className='refund_accor'>订单有退款<span style={{ float: 'right' }}>¥{ renum.toFixed(2) }</span></p> }>
                  <List>
                    <Item>
                      {
                        refundList.map((e, i) => <Refundli key={ `refundli${ e.name }${ e.date }` } refundli={ e } index={ i } platformActivity={ platformActivity } coupon={ coupon } />)
                      }
                    </Item>
                  </List>
                </Accordion.Panel>
              </Accordion>
            </div>
          }
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

// 费用明细
const Pridetail = props => {
  const { handleContainerClose, pasdata, baoxianShowData = [], realPrice, RV, addp } = props
  const { facePrice, airportFee, fuelTax } = pasdata[0]
  return (
    <div className='pridetail'>
      <fieldset>
        <legend>费用明细</legend>
      </fieldset>
      <h2>¥{ realPrice.toFixed(2) }</h2>
      <div className='main_pri'>
        <p><span>成人票价</span><span>¥{ facePrice } <i>x { pasdata.length }人</i></span></p>
        <p><span>燃油</span><span>¥{ fuelTax } <i>x { pasdata.length }人</i></span></p>
        <p><span>机建</span><span>¥{ airportFee } <i>x { pasdata.length }人</i></span></p>
      </div>
      {
        (RV.contains === 1 ||  baoxianShowData.length > 0) && <div className='add_pri'>
          {
            RV.contains === 1 ? <p><span>报销凭证</span><span>¥20 <i>x 1份</i></span></p> : ''
          }
          {
            baoxianShowData.map(e => <p key={ `${ e.insuranceName }mingxi` }><span>{ e.insuranceName }</span><span>¥{ e.price } <i>x { e.venders.length }份</i></span></p>)
          }
        </div>
      }
      {
        addp ? <div className='cup_pri'><p><span>优惠券</span><span>-¥{ addp }</span></p></div> : ''
      }
      <div className='closebtn'>
        <p><Icon onClick={ () => { handleContainerClose() } } type={ require('svg/jipiao/close.svg') } /></p>
      </div>
    </div>
  )
}

// 改签费用明细
const ChangePridetail = props => {
  const { handleContainerClose, data, tui } = props
  const { changeFee, upgradeFee } = data
  const totalFee = changeFee + upgradeFee
  return (
    <div className='pridetail'>
      <fieldset>
        <legend>{ tui ? '退款明细' : '费用明细' }</legend>
      </fieldset>
      <h2>¥{ totalFee.toFixed(2) }</h2>
      <div className='main_pri'>
        <p><span>升舱费</span><span>¥{ upgradeFee }</span></p>
        <p><span>改签手续费</span><span>¥{ changeFee }</span></p>
      </div>
      <div className='closebtn'>
        <p><Icon onClick={ () => { handleContainerClose() } } type={ require('svg/jipiao/close.svg') } /></p>
      </div>
    </div>
  )
}

// 退款费用明细
const RefundPridetail = props => {
  const { handleContainerClose, data, realRefundPrice, coupon, platformActivity, index } = props
  const { facePrice, cancellationCharge, insurance } = data
  return (
    <div className='pridetail'>
      <fieldset>
        <legend>退款明细</legend>
      </fieldset>
      <h2>¥{ realRefundPrice.toFixed(2) }</h2>
      <div className='main_pri'>
        <p><span>机票价</span><span>¥{ facePrice }</span></p>
        {
          insurance.length > 0 && insurance.map(e => <p key={ `refundli${ e.insuranceName }` }><span>{ e.insuranceName }</span><span>¥{ e.price }</span></p>)
        }
        <p><span>退票手续费</span><span>-¥{ cancellationCharge }</span></p>
        { (coupon && (index === 0)) && <p><span>优惠券</span><span>-¥{ coupon.price }</span></p> }
        { (platformActivity && (index === 0)) && <p><span>平台活动</span><span>-¥{ platformActivity.price }</span></p> }
      </div>
      <div className='closebtn'>
        <p><Icon onClick={ () => { handleContainerClose() } } type={ require('svg/jipiao/close.svg') } /></p>
      </div>
    </div>
  )
}

// 发票费用明细
const FapiaoPridetail = props => {
  const { handleContainerClose, data } = props
  const { postage } = data
  return (
    <div className='pridetail'>
      <fieldset>
        <legend>退款明细</legend>
      </fieldset>
      <h2>¥{ postage.toFixed(2) }</h2>
      <div className='main_pri'>
        <p><span>邮寄费</span><span>¥{ postage }</span></p>
      </div>
      <div className='closebtn'>
        <p><Icon onClick={ () => { handleContainerClose() } } type={ require('svg/jipiao/close.svg') } /></p>
      </div>
    </div>
  )
}

// 退款
const Refundli = ({ refundli, coupon, platformActivity, index }) => {
  const { ticketType, name, date, cabinType, realRefundPrice, detail, explain } = refundli
  return (
    <div className='refund_accorli'>
      <p>
        <span>{ name }</span>
        <span>{ ticketType }</span>
        <span>{ cabinType }</span>
        <span>
          <i>实际退款</i>
          <i>¥{ realRefundPrice }</i>
          <Icon type={ require('svg/jipiao/tiping.svg') } onClick={ () => {
            Mask(
              <SlidePage target='right' showClose={ false } >
                {
                  explain === '退票成功' ? <RefundPridetail data={ detail } realRefundPrice={ realRefundPrice } coupon={ coupon } platformActivity={ platformActivity } index={ index } />
                                        : explain === '改签失败' ? <ChangePridetail data={ detail } tui={ '1' } />
                                        : <FapiaoPridetail data={ detail } />
                }
              </SlidePage>,
              { mask: false, style: { position: 'absolute' } }
            )
          } }
          />
        </span>
      </p>
      <p><span>{ `${ moment('YYYY-MM-DD')(date) }  ${ explain }` }</span>预计1-5个工作日内完成退款</p>
    </div>
  )
}

// 出票成功航班信息展示
const Sueflag = props => {
  const { isChangeShow, endorse, passengers, orderDetails, status, isUnpaid } = props
  const { flights, changeRule } = endorse
  const passList = passengers.filter(e => {
    if (e.endorseOrderId && endorse.orderId === e.endorseOrderId) {
      return true
    }
    return false
  })
  return (
    <div className='Sueflag'>
      <Card flightData={ flights[0] } status={ status } />
      {
        passList.map((e, i) => <Suepass bdbt={ i === (passList.length - 1) ? 'true' : '' } key={ `suepas${ e.credentialCode }${ i * 1 }` } isChangeShow={ isChangeShow } suepassinfo={ e } changeRule={ changeRule } cabinType={ flights[0].cabinType } orderDetails={ orderDetails } isUnpaid={ isUnpaid } />)
      }
    </div>
  )
}

// 出票成功乘客展示
const Suepass = props => {
  const { isChangeShow, suepassinfo, changeRule, cabinType, orderDetails, eoId, isUnpaid, bdbt } = props
  const { name, credentialCode, displayStatus, endorseOrderId, ticketNo, status, isChangePay, isChange, isRefund, isUploadPhoto } = suepassinfo
  const { orderNo, goChange, goRefund, goChangeord, goRefundup } = orderDetails
  const changeid = eoId || endorseOrderId
  return (
    <div className='Suepass' style={ bdbt ? {} : { borderBottom: '1px dashed #e5e5e5' } }>
      <p><span>{ name }</span><span>成人票</span><span>{ cabinType }</span></p>
      <p><span>{ `${ credentialCode.slice(0, 4) } ******** ${ credentialCode.slice(-3) }` }</span><span onClick={ () => {
        if (changeRule) {
          Mask(
            <SlidePage target='right' showClose={ false } >
              <Tuigaiqian data={ changeRule } />
            </SlidePage>,
            { mask: false, style: { position: 'absolute' } }
          )
        }
      } }
      >退改签规则<Icon type={ require('svg/jipiao/arrowRight.svg') } /></span></p>
      <p>
        <span>
          { displayStatus }
          { ((isChangePay && status === 21) || status === 2 || status === 23 || status === 22) && <Icon type={ require('svg/jipiao/tiping.svg') } onClick={ () => {
            Mask(
              <SlidePage target='right' showClose={ false } >
                <ChangePridetail data={ suepassinfo } />
              </SlidePage>,
              { mask: false, style: { position: 'absolute' } }
            )
          } }
          /> }
        </span>
        <span style={ isRefund ? { color: '#666666', borderColor: '#666666' } : {} } onClick={ () => { if (isRefund) { goRefund(orderNo, ticketNo) } } }>退票</span>
        { status !== 2 && isChangeShow && <span style={ isChange ? { color: '#666666', borderColor: '#666666' } : {} } onClick={ () => { if (isChange) { goChange(orderNo, ticketNo, changeid, isUnpaid) } } }>改签</span> }
        { status === 2 && <span style={{ color: '#ffab00', borderColor: '#ffab00' }} onClick={ () => { goChangeord(orderNo, ticketNo) } }>去支付</span> }
      </p>
      { status === 13 && isUploadPhoto && <p onClick={ () => { goRefundup(orderNo, ticketNo) } }>图片上传失败，请重新上传<Icon type={ require('svg/jipiao/arrowRight.svg') } /></p> }
    </div>
  )
}

// 航班信息展示
const Card = ({ flightData, status }) => {
  const { flightTypeFullName, departureTime, departureAirport, departureTerminal, departureDate, duration, arrivalTime, arrivalAirport, arrivalTerminal, arrivalDate, carrierName, flightNum, correct, meal, isStop, stopCity } = flightData
  return (
    <div className='detailCart' style={ (status === 4 || status === 25) ? { background: 'rgba(255,171,0,0.05)' } : {} }>
      <div className='cart_main'>
        <div>
          <p>{ departureDate }</p>
          <h3>{ departureTime }</h3>
          <p>{ departureAirport }{ departureTerminal }</p>
        </div>
        <div className='cart_mainmid'>
          <p>{ duration }</p>
          <p>{ isStop ? <span style={ (status === 4 || status === 25) ? { background: 'rgba(255,171,0,0.05)' } : {} }>停</span> : '' }</p>
          { stopCity && <p>{ stopCity }</p> }
        </div>
        <div>
          <p>{ arrivalDate }</p>
          <h3>{ arrivalTime }</h3>
          <p>{ arrivalAirport }{ arrivalTerminal }</p>
        </div>
      </div>
      <p>{ `${ carrierName }${ flightNum }   ${ flightTypeFullName }  ${ correct ? `准点率${ correct }` : '' }  ${ meal ? '提供餐食' : '' }` }</p>
    </div>
  )
}

const Passinfo = ({ passengers }) => {
  return (
    <div className='pass'>
      <WhiteSpace size='lg' />
      <div className='passWrap'>
        <div className='passinfo'>
          <span>乘客</span>
          <div>
            {
              passengers && passengers.map((e, i) => <p key={ `pass${ i * 1 }${ e.credentialCode }` }><span className='passname'>{ e.name }</span><span className='passid'>{ `${ e.credentialCode.slice(0, 4) } ******** ${ e.credentialCode.slice(-3) }` }</span></p>)
            }
          </div>
        </div>
      </div>
    </div>
  )
}

// 保险信息
const Baoxianwrap = ({ baoxianData }) => {
  return (
    <div>
      <WhiteSpace size='lg' />
      <div className='baoxianShow' onClick={
        () => Mask(
          <SlidePage target='right' showClose={ false } >
            <Baoxian baoxianData={ baoxianData } />
          </SlidePage>,
          { mask: false, style: { position: 'absolute' } }
        )
      }
      >
        <div>
          {
            baoxianData && baoxianData.map(e => <p key={ `show${ e.insuranceName }` }>{ e.insuranceName }<span><i>¥{ e.price }</i>/份{ `x${ e.venders.length }` }</span></p>)
          }
        </div>
        <div>
          <Icon type={ require('svg/jipiao/arrowRight.svg') } />
        </div>
      </div>
    </div>
  )
}

const Baoxian = ({ baoxianData }) => {
  return (
    <div className='baoxian'>
      <div className='baoxian_main'>
        {
          baoxianData.length > 0 && baoxianData.map(e => <Baoxianitem key={ `secshow${ e.insuranceName }` } baoxianitemData={ e } />)
        }
      </div>
    </div>
  )
}

const Baoxianitem = ({ baoxianitemData }) => {
  const { insuranceName, price, companyName, venders } = baoxianitemData
  return (
    <div className='baoxianlist'>
      <div className='baoxianlist_title' >
        <div>
          <p>{ insuranceName }<span><i>¥{ price }</i>/份</span></p>
          <Icon onClick={ () => Mask(<SlidePage target='right' showClose={ false } ><Tan key={ `tan${ baoxianitemData.insuranceName }` } data={ baoxianitemData } /></SlidePage>, { mask: false, style: { position: 'absolute' } }) } type={ require('svg/jipiao/tip.svg') } />
        </div>
        <p>{ companyName }</p>
      </div>
      <div className='baoxianlist_showselect'>
        {
          venders.map(e => <Baoxianpassitem key={ `${ e.insuranceName }${ e.name }` } baoxianpassData={ e } />)
        }
      </div>
    </div>
  )
}

const Baoxianpassitem = ({ baoxianpassData }) => {
  const { name, policyNo, displayStatus } = baoxianpassData
  return (
    <div className='baoxianpassData'>
      <p><span>被保险人</span><span>{ name }</span></p>
      { policyNo && <p><span>保单号</span><span>{ policyNo }</span><span>{ displayStatus }</span></p> }
    </div>
  )
}

// 保险信息
const Tan = props => {
  const { handleContainerClose, data } = props
  const { detail, insuranceName } = data
  return (
    <div className='baoxianinfo'>
      <h3>{ insuranceName }</h3>
      <div className='bxif'>
        {
          detail.map(e => <p>{ e }</p>)
        }
      </div>
      <div className='closebtn'>
        <p><Icon onClick={ () => { handleContainerClose() } } type={ require('svg/jipiao/close.svg') } /></p>
      </div>
    </div>
  )
}

export default OrderDetails
