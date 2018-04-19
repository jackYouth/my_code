import React, { Component } from 'react'
// import { browserHistory } from 'react-router'
import { OrderDetail } from '@boluome/oto_saas_web_app_component'
import { moment } from '@boluome/common-lib'
import { WhiteSpace, List, Card, Flex, Icon } from 'antd-mobile'
// import { Checkbox, Card, Picker, WingBlank, Button, Flex, Icon, Grid, List, InputItem, WhiteSpace } from 'antd-mobile';
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
        orderType='weizhang'
        goPay={ () => { goPay(orderNo) } }
      /> }
    </div>
  )
}

class Content extends Component {
  constructor(props) {
    super(props)
    this.state = {
      bool: true,
    }
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
    const { bool } = this.state
    const { id, plateNumber, refundMoney = 0, vin, engineNo, phone, price = 0, realPrice = 0, platformActivity, coupon, createdAt, violations } = orderDetailInfo
    const { orderNo } = orderDetails
    console.log(orderNo)
    if (id) {
      let untreated = 0
      let totalFine = 0
      let totalPoints = 0
      let totalserviceFee = 0
      let failnum = 0
      const vio = violations && violations.map((o, i) => {
        untreated += 1
        totalFine += o.fine
        totalPoints += o.point
        totalserviceFee += o.serviceFee
        if (o.status === '代缴失败') failnum += 1
        if (bool && i < 1 || !bool) {
          return (
            <div key={ `card${ i * 1 }` } style={{ padding: '0.2rem 0.3rem' }}>
              <Cardlist data={ o }  />
            </div>
          )
        }
        return <div key={ `card${ i * 1 }` } />
      })

      return (
        <div className='odlcenter'>
          <WhiteSpace size='lg' />

          <div className='userinfo'>
            <h3><Icon type={ require('svg/weizhang/id.svg') } />办理资料</h3>
            <p><span>车主电话</span><span>{ phone }</span></p>
            <p><span>发动机号</span><span>{ engineNo }</span></p>
            <p><span>车架号</span><span>{ vin }</span></p>
          </div>

          <WhiteSpace size='lg' />

          <div className='odlinfo'>
            <p><span>服务车辆</span><span className='flate'>{ plateNumber.substr(0,2)}·{plateNumber.substr(2) }</span></p>
            <p><span>代办罚单</span><span>{ untreated }条</span></p>
            <p><span>扣分总数</span><span>{ totalPoints }分</span></p>
            <p><span>罚款总额</span><span>¥{ totalFine.toFixed(2) }</span></p>
            <p><span>代办费用</span><span>¥{ totalserviceFee.toFixed(2) }</span></p>
          </div>

          <div style={{ background: '#fff' }}>{ failnum > 0 && <p className='failtext'>共{ failnum }起违章处理失败</p> }{ vio }</div>
          { violations.length > 1 && <div className='more' onClick={ () => { this.setState({ bool: !bool }) } }>
              { !bool && <p><span><Icon style={{ transform: 'rotate(180deg)' }} type={ require('svg/weizhang/arrowdown.svg') } /></span></p> }
              { !bool && <p>收起更多</p> }
              { bool && <p>展开全部</p> }
              { bool && <p><span><Icon type={ require('svg/weizhang/arrowdown.svg') } /></span></p> }
            </div> }
          <WhiteSpace size='lg' />
          <List>
            <Item extra={ <span>¥{ price.toFixed(2) }</span> }>小计</Item>
            { platformActivity && <Item extra={ <span className='numpri'>－ ¥{ platformActivity.price }</span> }><span className='jianhui' style={{ background: '#ff6e19' }}>减</span>{ platformActivity.title }</Item> }
            <Item extra={ <span className='numpri'>- ¥{ coupon ? coupon.price : 0.0 }</span> }><span className='jianhui'>红</span>红包抵扣／兑换红包</Item>
            <Item extra={ <span className='realsubpri'>{ `实付 ¥${ realPrice.toFixed(2) }` }</span> }><span /></Item>
          </List>

          { (refundMoney > 0) && <WhiteSpace size='lg' /> }

          { (refundMoney > 0) && <div className='odlinfo'>
            <p><span>订单有退款</span><span style={{ color: '#ff4848' }}>¥{ refundMoney.toFixed(2) }</span></p>
          </div> }

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

// card列表
const Cardlist = ({ data }) => {
  return (
    <Card>
      <Card.Header
        title={ <p>{ data.time }<span>{ data.status === '代缴失败' ? data.status : '' }</span></p> }
      />
      <Card.Body>
        <div>{  data.reason }</div>
        <p>{  data.address }</p>
      </Card.Body>
      <Card.Footer content={ <Flex>
        <Flex.Item className='cardFootli'>
            扣分<span>{ data.point }</span>
        </Flex.Item>
        <Flex.Item className='cardFootli'>
            罚款<span>¥{ data.fine }</span>
        </Flex.Item>
        <Flex.Item className='cardFootli'>
            代办费<span>¥{ data.serviceFee }</span>
        </Flex.Item>
      </Flex> }
      />
    </Card>
  )
}

export default OrderDetails
