import React from 'react'
// import { browserHistory } from 'react-router'
import { Icon } from 'antd-mobile'
import { getStore } from '@boluome/common-lib'
import { Mask } from '@boluome/oto_saas_web_app_component'
import AttributeCom from './attribute.js'
import '../style/listadddown.scss'

import iconadd from '../img/jia.svg'
import iconbigdown from '../img/bigdown1.svg'

// const Item = List.Item
class ListAddDown extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      ...props,
    }
    // console.log('ListAddDown-----', props)
    this.handleAttribute = this.handleAttribute.bind(this)
    this.handleGoodsNumber = this.handleGoodsNumber.bind(this)
    this.handleattribute = this.handleattribute.bind(this)
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      goodsCartarr: nextProps.goodsCartarr,
      data:         nextProps.data,
    })
  }
  componentWillMount() {
    const contact = getStore('coffee_contact', 'session')
    if (contact) {
      this.setState({
        contact,
      })
    }
  }
  // componentWillReceiveProps(nextProps) {
  //   const contact = getStore('coffee_contact', 'session')
  //   console.log('componentDidMount--', contact, nextProps)
  // }
  componentWillUnmount() {
    Mask.closeAll()
  }
  handleCloseEvent() {
    Mask.closeAll()
  }
  // 添加物品的时候分为多规格和无规格
  handleAttribute(data) {
    const { addCartFn, ChooseContactFn } = this.state
    const contact = getStore('coffee_contact', 'session')
    // console.log('handleAttribute', contact)
    if (contact) {
      if (data.attribute) {
        Mask(<AttributeCom data={ data } addCartFn={ addCartFn } />)
      } else {
        addCartFn('no', data)
      }
    } else {
      ChooseContactFn()
    }
  }
  handleattribute(goodsCartarr, productId, ReduceCartNum, ReduceCartListNum, data) {
    const arr = []
    for (let j = 0; j < goodsCartarr.length; j++) {
      if (productId === goodsCartarr[j].data.productId) {
        arr.push(goodsCartarr[j])
      }
    }
    if (arr.length > 1) {
      ReduceCartListNum(data)
    } else {
      ReduceCartNum(data)
    }
  }
  // 减少购买数量的时候
  handleGoodsNumber(data, goodsNumber) {
    // console.log('handleGoodsNumber---', data, goodsNumber)
    const { ReduceCartNum, ReduceCartListNum, goodsCartarr, productId } = this.state
    if (goodsNumber === 1) {
      ReduceCartNum(data)
    } else if (!data.attribute) {
      ReduceCartNum(data)
    } else if (data.attribute) {
      this.handleattribute(goodsCartarr, productId, ReduceCartNum, ReduceCartListNum, data)
    } else {
      ReduceCartListNum(data)
    }
  }
  render() {
    const { goodsCartarr, data, productId, tipsText } = this.state
    let goodsNumber = 0
    for (let s = 0; s < goodsCartarr.length; s++) {
      if (productId === goodsCartarr[s].data.productId) {
        goodsNumber += goodsCartarr[s].quantity
      }
    }
    if (goodsNumber !== 0) {
      return (
        <span className='price_span price_r'>
          <span className='carthano carthas'><span className='price_down icon' onClick={ () => this.handleGoodsNumber(data, goodsNumber) }><Icon type={ iconbigdown } /></span><span className='Sum'>{ goodsNumber }</span></span>
          <span className='price_add icon' onClick={ () => this.handleAttribute(data) }><Icon type={ iconadd } /></span>
        </span>
      )
    }
    return (
      <span className={ `${ tipsText ? 'price_no' : 'price_span price_r' }` }>
        {
          tipsText ? (<span className='price_add icon' onClick={ () => this.handleAttribute(data) }>{ tipsText }</span>) : (<span className='price_add icon' onClick={ () => this.handleAttribute(data) }><Icon type={ iconadd } /></span>)
        }
      </span>
    )
  }
}
export default ListAddDown
