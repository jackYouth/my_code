import React, { Component } from 'react'
// import { browserHistory } from 'react-router'
import { OrderDetail } from '@boluome/oto_saas_web_app_component'
import { moment } from '@boluome/common-lib'
import { WhiteSpace, List } from 'antd-mobile'
import { equals } from 'ramda'
import logo from '../img/logo.png'
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
        orderType='shengxian'
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
    const { id, shippingFee, contact, realPrice, invoice, commodityList, platformActivity, coupon, deliveryDate, createdAt } = orderDetailInfo
    const { orderNo, handleLog } = orderDetails
    console.log(orderNo)
    if (id) {
      return (
        <div className='odlcenter'>

          <WhiteSpace size='lg' />

          <List>
            <Item><img className='logo' alt='img' src={ logo } />易果生鲜  为您服务</Item>
            <Item>{
              commodityList.map(o => (<div className='comlist' key={ `com${ o.commodityCode }` }>
                <p>{ o.commodityName }</p>
                <p><span>x{ o.num }</span><span>¥{ o.price }</span></p>
              </div>))
            }</Item>
            <Item extra={ <span>¥{ shippingFee }</span> }>配送费</Item>
            { platformActivity && <Item extra={ <span className='numpri'>－ ¥{ platformActivity.price }</span> }><span className='jianhui' style={{ background: '#ff6e19' }}>减</span>{ platformActivity.title }</Item> }
            <Item extra={ <span className='numpri'>- ¥{ coupon ? coupon.price : 0.0 }</span> }><span className='jianhui'>红</span>红包抵扣／兑换红包</Item>
            <Item extra={ <span className='realsubpri'>{ `实付金额 ¥${ realPrice }` }</span> }><span /></Item>
          </List>

          <WhiteSpace size='lg' />

          <div className='discontact'>
            <h3>配送时间<span>{ deliveryDate.replace(/-/g, '/') }</span></h3>
            <div className='nocant'>
              <h3>收货地址</h3>
              <div>
                <p>{ contact.name }<i>{ contact.gender === 1 ? '  女士' : '  先生' }</i>{ contact.phone }</p>
                <p className='addr'>{ `${ contact.city }${ contact.county }${ contact.address }${ contact.detail }${ contact.houseNum }` }</p>
              </div>
            </div>
          </div>

          <WhiteSpace size='lg' />

          <List className='wuliutip'>
            <Item
              arrow='horizontal'
              extra='跟踪物流'
              onClick={ () => { handleLog(orderNo, orderDetailInfo) } }
            >
              物流信息
            </Item>
          </List>

          <WhiteSpace size='lg' />

          { invoice && <div className='fapiao'>
            <h3>发票</h3>
            <div>
              <p>{ invoice }</p>
            </div>
          </div> }

          <WhiteSpace size='lg' />
          <List>
            <Item extra={ <span>{ id }</span> }>订单编号</Item>
            <Item extra={ <span>{ moment('YYYY-MM-DD HH:mm:ss')(createdAt) }</span> }>下单时间</Item>
            <Item extra={ <span>在线支付</span> }>支付方式</Item>
          </List>
        </div>
      )
    }
    return (
      <div />
    )
  }
}

export const Logs = ({ orderDetailInfo, data }) => {
  const { express, logisticsDetail } = data
  const { commodityList, deliveryDate } = orderDetailInfo
  return (
    <div className='log_wrap'>
      <div className='logtitle'>
        <p><img alt='img' src={ commodityList[0].picUrl } /><span className='imgtip'>{ commodityList.length }件商品</span></p>
        <div className='info'>
          <p>承运来源：{ express }</p>
          <p>预计送达：{ deliveryDate }</p>
          <p>联系电话：021-98767865</p>
        </div>
      </div>
      <WhiteSpace size='lg' />
      <div className='loglist'>
        <div>
          {
            logisticsDetail && logisticsDetail.map(o => (<div key={ `loglist${ o.time }` }>
              <p>{ o.detail }</p>
              <p>{ o.time }</p>
            </div>))
          }
        </div>
      </div>
    </div>
  )
}

export default OrderDetails
