import React from 'react'
import { List, Icon, WhiteSpace } from 'antd-mobile'
import { Mask, SlidePage } from '@boluome/oto_saas_web_app_component'

import '../style/showPromotion.scss'
import '../style/InvoiceDetails.scss'

// import InvoiceDetails from './InvoiceDetails'

import zhuyiIcon from '../img/zhuyi.svg'
// import jianIcon from '../img/jiantexts.svg'
// import hongIcon from '../img/hong.svg'
import closeIcon from '../img/close.png'

const Item = List.Item
class ShowPromotion extends React.Component {
  constructor(props) {
    super(props)
    // const newState = merge(state)(props)
    this.state = {
      ...props,
    }
    this.handleNoticeShow = this.handleNoticeShow.bind(this)
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
  handleNoticeShow() {
    const { realPayPrice, passengers, platformActivity = {}, coupon = {}, trains, withoutDiscountedPrice, insuranceDoc } = this.state
    Mask(
      <SlidePage target='right' showClose={ false }>
        <Invoice
          realPayPrice={ realPayPrice }
          platformActivity={ platformActivity }
          coupon={ coupon }
          trains={ trains }
          passengers={ passengers }
          withoutDiscountedPrice={ withoutDiscountedPrice }
          insuranceDoc={ insuranceDoc }
        />
      </SlidePage>
      , { mask: false, style: { position: 'absolute' } })
  }
  render() {
    const { realPayPrice, platformActivity = {}, coupon = {}, price } = this.state
    // const { title, price, activityId } = platformActivity
    return (
      <div className='showPromotionWrap'>
        <List>
          <Item extra={ `¥${ price.toFixed(2) }` }>总价</Item>
          <Item className='active oto' extra={ <span className='text_oto'>-¥{ platformActivity.price ? platformActivity.price : '0.00' }</span> }><span className='iconspanj iconoto'>减</span><span>{ platformActivity.title ? platformActivity.title : '平台活动' }</span></Item>
          <Item className='coupon oto' extra={ <span className='text_oto'>-¥{ coupon.price ? coupon.price : '0.00' }</span> }><span className='iconspanh iconoto'>红</span><span>{ coupon.title ? coupon.title : '红包优惠' }</span></Item>
          <Item className='payPrice' extra={ <ShowDown handleNoticeShow={ this.handleNoticeShow } realPayPrice={ realPayPrice } /> }><span className='hidden'>我需要隐藏</span></Item>
        </List>
        <WhiteSpace size='lg' />
      </div>
    )
  }
}

export default ShowPromotion

// 显示优惠活动那一块
const ShowDown = ({ handleNoticeShow, realPayPrice }) => {
  return (
    <div className='show'>
      <span>实付</span>
      <span>¥{ realPayPrice.toFixed(2) }</span>
      {
        realPayPrice === 0 ? ('') : (<Icon onClick={ () => handleNoticeShow() } type={ zhuyiIcon } />)
      }
    </div>
  )
}
// 由于数据不同意的情况，单独分离出来 费用详情 ------有的时候花时间去精简代码成本可能并没有作用
const Invoice = ({ realPayPrice, passengers, trains, platformActivity, coupon, withoutDiscountedPrice, insuranceDoc, handleContainerClose }) => {
  const { seatName, unitPrice, packagePrice } = trains
  console.log('realPayPrice-', realPayPrice)
  return (
    <div className='InvoiceDetails'>
      <div className='title'>
        <span className='line' />
        <span className='text'>费用明细</span>
        <span className='line' />
      </div>
      <div className='price'>{ `¥ ${ realPayPrice.toFixed(2) }` }</div>
      <div className='list'>
        <p><span>{ seatName }</span><span>{ `¥${ unitPrice } X ${ passengers.length }份` }</span></p>
        {
          withoutDiscountedPrice && withoutDiscountedPrice !== 0 ? (<p><span>手续费</span><span>{ `¥${ withoutDiscountedPrice } X ${ passengers.length }份` }</span></p>) : ('')
        }
        {
          packagePrice && packagePrice !== 0 ? (<p><span>加速包</span><span>{ `¥${ packagePrice } X ${ passengers.length }份` }</span></p>) : ('')
        }
        {
          insuranceDoc && insuranceDoc.length !== 0 ? (<p><span>{ insuranceDoc[0].insuranceName }</span><span>{ `¥${ insuranceDoc[0].price } X ${ insuranceDoc[0].venders.length }` }</span></p>) : ''
        }
        <p><span>平台活动</span><span className='Preferential'>-¥{ platformActivity && platformActivity.price ? platformActivity.price : '0.00' }</span></p>
        <p><span>红包优惠</span><span className='Preferential'>-¥{ coupon && coupon.price ? coupon.price : '0.00' }</span></p>
      </div>
      <img onClick={ () => { Mask.closeAll(); location.hash = ''; handleContainerClose() } } src={ closeIcon } alt='' />
    </div>
  )
}
