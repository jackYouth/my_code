import React from 'react'
import { List, Accordion, WhiteSpace, Icon } from 'antd-mobile'
import { Mask, SlidePage } from '@boluome/oto_saas_web_app_component'

// import RefundInfoCom from './RefundInfoCom'

import '../style/OrderRefundCom.scss'
import '../style/InvoiceDetails.scss'
import tipsIcon from '../img/tipsOrgan.svg'
import closeIcon from '../img/close.png'

const Item = List.Item
class OrderRefundCom extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      ...props,
    }
    this.handRefundInfoCom = this.handRefundInfoCom.bind(this)
  }
  componentWillUnmount() {
    // 物极必反
    // const node = document.getElementsByClassName('mask-container')
    // if (node.length > 0) {
    //   node[0].remove()
    // }
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      ...nextProps,
    })
  }
  onChange() {
    console.log('onChange')
  }
  handleConfirmRefund(fn) {
    fn()
    console.log('OrderRefundCom---OK')
  }
  handRefundInfoCom(o, withoutDiscountedPrice) {
    Mask(
      <SlidePage target='right' showClose={ false }>
        <InfoCom data={ o } withoutDiscountedPrice={ withoutDiscountedPrice } />
      </SlidePage>
      , { mask: true, style: { position: 'absolute' } }
    )
  }
  render() {
    const { refundList, refundCountPrice, withoutDiscountedPrice } = this.state
    return (
      <div className='OrderrefundWrap'>
        <Accordion accordion openAnimation={{}} className='my-accordion' onChange={ this.onChange }>
          <Accordion.Panel header={ <div><span className='orderrefund'>订单有退款</span><span className='refundCountPrice'>{ `¥${ refundCountPrice.toFixed(2) }` }</span></div> }>
            <List className='my-list'>
              <RefundList handRefundInfoCom={ this.handRefundInfoCom } refundList={ refundList } withoutDiscountedPrice={ withoutDiscountedPrice } />
            </List>
          </Accordion.Panel>
        </Accordion>
        <WhiteSpace size='lg' />
      </div>
    )
  }
}

export default OrderRefundCom

// 如果有退款，展示乘客和退款信息
const RefundList = ({ handRefundInfoCom, refundList, withoutDiscountedPrice }) => {
  if (refundList && refundList[0].name) {
    return (
      <div>
        {
          refundList.map(o => (
            <Item className='refundlistwrap'>
              <div className='refundTitleL'><span>{ o.name }</span><span>{ o.passengerType }</span><span>{ o.seatName }</span></div>
              <div className='refundTitleR'><span>实际退款</span><span>¥{ o.realRefundPrice }</span><span onClick={ () => handRefundInfoCom(o, withoutDiscountedPrice) }><Icon type={ tipsIcon } /></span></div>
              <div className='refundedTips'><span>{ o.date.split(' ')[0] }</span><span>退票成功</span><span className='tips'>预计1-5个工作日内完成退款</span></div>
            </Item>
          ))
        }
      </div>
    )
  }
  return (
    <div>
      {
        refundList.map(o => (
          <Item className='refundlistwrap' key={ `${ o.createdAt + Math.random() }` }>
            <div className='refundTitleR2'><span className='refundTime'>{ o.createdAt }</span><span>{ o.explain }</span><span className='refundRight'>¥{ o.realRefundPrice }</span><span className='refundRight'>退款金额</span></div>
            <div className='refundedTips'><span className='tips'>预计1-5个工作日内完成退款</span></div>
          </Item>
        ))
      }
    </div>
  )
}

const InfoCom = ({ data, withoutDiscountedPrice, handleContainerClose }) => {
  const { realRefundPrice, detail } = data
  const { facePrice, cancellationCharge } = detail
  return (
    <div className='InvoiceDetails'>
      <div className='title'>
        <span className='line' />
        <span className='text'>退款明细</span>
        <span className='line' />
      </div>
      <div className='price'>{ `¥ ${ realRefundPrice.toFixed(2) }` }</div>
      <div className='list'>
        <p><span>车票价</span><span className='spanR'>¥{ facePrice }</span></p>
        <p className='thoughSpan'><span>手续费不可退</span><span className='spanR'>¥{ withoutDiscountedPrice }</span></p>
        <p className='thoughSpan'><span>退票手续费</span><span className='hongColor'>¥{ cancellationCharge }</span></p>
        {
          detail && detail.platformActivity ? (<p><span>平台活动</span><span className='Preferential'>-¥{ detail.platformActivity }</span></p>) : ('')
        }
        {
          detail && detail.coupon ? (<p><span>优惠券</span><span className='Preferential'>-¥{ detail.coupon }</span></p>) : ('')
        }
      </div>
      <img onClick={ () => { handleContainerClose() } } src={ closeIcon } alt='' />
    </div>
  )
}
