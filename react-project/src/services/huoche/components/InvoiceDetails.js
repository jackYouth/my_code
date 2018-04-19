import React from 'react'
// import { Icon } from 'antd-mobile'
import { Mask } from '@boluome/oto_saas_web_app_component'

import '../style/InvoiceDetails.scss'
import closeIcon from '../img/close.png'

class InvoiceDetails extends React.Component {
  constructor(props) {
    super(props)
    // const newState = merge(state)(props)
    this.state = {
      ...props,
    }
    // this.handleNoticeShow = this.handleNoticeShow.bind(this)
  }
  componentWillUnmount() {
    const node = document.getElementsByClassName('mask-container')
    if (node.length > 0) {
      node[0].remove()
    }
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      ...nextProps,
    })
  }
  handleNoticeShow() {
    Mask(<OrderDetailsNotice />, { mask: false, style: { position: 'absolute' } })
  }
  render() {
    const { seatsChoose, promotion, touristNumer, withoutDiscountedPrice = 0, checkAccient, maxpriceObj = '', packagePrice, haschecked, ChangeSign, isShow = true, handleContainerClose } = this.state
    console.log('maxpriceObj--', maxpriceObj, seatsChoose, checkAccient, 'packagePrice--', packagePrice)
    console.log('--ChangeSign-', ChangeSign, seatsChoose)
    let price = 0
    let name = ''
    if (maxpriceObj && !seatsChoose && !ChangeSign) {
      price = maxpriceObj.price
      name = maxpriceObj.name
      console.log('maxpriceObj')
    } else if (ChangeSign && isShow === false) {
      price = 0
      name = ''
    } else {
      price = seatsChoose.price
      name = seatsChoose.name
      console.log('seatsChoose')
    }
    const { discount = 0 } = promotion
    const sumDiscounted = Number(withoutDiscountedPrice) * touristNumer.length
    let packagePriceSum = 0
    if (packagePrice) {
      packagePriceSum = Number(packagePrice) * touristNumer.length
    }
    let sum = Number(price) * touristNumer.length
    // console.log('sum--4-', sum)
    sum += sumDiscounted
    // console.log('sum--3-', sum)
    if (checkAccient && haschecked === true) {
      sum += checkAccient.price * touristNumer.length
    }
    // console.log('sum--2-', sum)
    sum += packagePriceSum
    // console.log('sum--1-', sum, packagePriceSum)
    let sumNumber = (sum - discount)
    if (sumNumber < 0) {
      sumNumber = 0.01
    }
    return (
      <div className='InvoiceDetails'>
        <div className='title'>
          <span className='line' />
          <span className='text'>费用明细</span>
          <span className='line' />
        </div>
        <div className='price'>{ `¥ ${ sumNumber.toFixed(2) }` }</div>
        <div className='list'>
          {
            (!price || price === 0) && ChangeSign ? ('') : (<p><span>{ name }</span><span>{ `¥${ price } X ${ touristNumer.length }份` }</span></p>)
          }
          {
            withoutDiscountedPrice && withoutDiscountedPrice !== 0 ? (<p><span>手续费</span><span>{ `¥${ withoutDiscountedPrice } X ${ touristNumer.length }份` }</span></p>) : ('')
          }
          {
            packagePrice && packagePrice !== 0 ? (<p><span>加速包</span><span>{ `¥${ packagePrice } X ${ touristNumer.length }份` }</span></p>) : ('')
          }
          {
            checkAccient && haschecked ? (<p><span>保险</span><span>{ `¥${ checkAccient.price } X ${ touristNumer.length }份` }</span></p>) : ('')
          }
          <p><span>优惠券</span><span className='Preferential'>-¥{ `${ discount.toFixed(2) }` }</span></p>
        </div>
        <img onClick={ () => { Mask.closeAll(); location.hash = ''; handleContainerClose() } } src={ closeIcon } alt='' />
      </div>
    )
  }
}

export default InvoiceDetails

const OrderDetailsNotice = () => {
  return (<div />)
}
