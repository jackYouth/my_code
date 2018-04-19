import React, { Component } from 'react'
import { browserHistory } from 'react-router'
import { OrderDetail } from '@boluome/oto_saas_web_app_component'
import { moment } from '@boluome/common-lib'
import { WhiteSpace, List } from 'antd-mobile'
import { equals } from 'ramda'
import bg from '../img/bg.png'
import '../style/orderDetails.scss'

const Item = List.Item
// id='bl001773304153338'
const OrderDetails = orderDetails => {
  const { orderNo, goPay, login } = orderDetails
  return (
    <div className='orderDetails'>
      { orderNo && <OrderDetail
        content={ <Content orderDetails={ orderDetails } /> }
        id={ orderNo }
        orderType='piaowu'
        login={ login }
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
    const { id, price, contact, realPrice, event, ticket, quantity, platformActivity, coupon, createdAt, dispatchWay } = orderDetailInfo
    const { orderNo } = orderDetails
    console.log(orderNo)
    if (id) {
      return (
        <div className='odlcenter'>
          <Oderdetl event={ event } ticket={ ticket } quantity={ quantity } />
          <div className='borderimg' style={{ backgroundImage: `url(${ bg })` }} />

          <WhiteSpace size='lg' />

          <List>
            <Item
              arrow='horizontal'
              extra={ `${ event.venuesName }` }
              onClick={ () => { browserHistory.push(`/piaowu/addr?addrTitlename=${ event.venuesName }&addrnameStr=${ event.venuesAddr }`) } }
            >
              演出地址：
            </Item>
          </List>

          <WhiteSpace size='lg' />

          { dispatchWay === 1 && <div className='discontact'>
            <h3>配送方式：快递配送</h3>
            <div className='nocant'>
              <h3>收获地址：</h3>
              <div>
                <p>{ contact.name }<i>{ contact.gender === 1 ? '  女士' : '  先生' }</i>{ contact.phone }{ contact.tag && <span>{ contact.tag }</span> }</p>
                <p className='addr'>{ `${ contact.city }${ contact.county }${ contact.address }${ contact.detail }${ contact.houseNum }` }</p>
              </div>
            </div>
          </div> }

          { dispatchWay === 2 && <div className='smzq'>
            <p><i>自取地址：</i><span>{ event.smzqAddress }</span></p>
            <p><i>自取时间：</i><span>{ event.smzqTime }</span></p>
            <p><i>自取提示：</i><span>{ event.smzqMessage }</span></p>
          </div> }

          { dispatchWay === 3 && <p className='infotip'>现场取票：请携带和所填姓名一致的身份证前往演出地址取票</p> }

          <WhiteSpace size='lg' />

          <List>
            <Item extra={ <span>{ price }</span> }>总价</Item>
            { platformActivity && <Item extra={ <span className='numpri'>－ ¥{ platformActivity.price }</span> }><span className='jianhui' style={{ background: '#ff6e19' }}>减</span>{ platformActivity.title }</Item> }
            <Item extra={ <span className='numpri'>- ¥{ coupon ? coupon.price : 0.0 }</span> }><span className='jianhui'>红</span>红包抵扣／兑换红包</Item>
            <Item extra={ <span className='realsubpri'>{ `实付 ¥${ realPrice }` }</span> }><span /></Item>
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

// 订单详情组件
const Oderdetl = ({ event, ticket, quantity }) => {
  const { eventDatetime, eventImgUrlv } = event
  const { facePrice, dealPrice } = ticket
  return (
    <div className='Oderdetail'>
      <img alt='piaowu' src={ eventImgUrlv } />
      <div className='orderInfo'>
        <p>{ event.name || ticket.name }</p>
        <p>{ `时间：${ eventDatetime }` }</p>
        { facePrice && <p>{ `票面价：¥${ facePrice }` }</p> }
        <p><span>售价：<i style={{ color: 'ff4848' }}>¥{ dealPrice }</i></span><span>{ `数量：${ quantity }张` }</span></p>
      </div>
    </div>
  )
}

export default OrderDetails
