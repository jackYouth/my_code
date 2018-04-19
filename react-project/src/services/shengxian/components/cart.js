
import React, { Component } from 'react'
import { Icon, Modal } from 'antd-mobile'

import '../style/cart.scss'

const alert = Modal.alert

export default class Cart extends Component {
  static defaultProps = {
  }
  constructor(props) {
    super(props)
    this.state = {
      cartdata: this.props.cartdata,
    }
    this.wrap = null
    this.mask = null
    this.wrapHeight = 0
    this.empty = false
  }

  handleSwitch() {
    const { cartdata } = this.state
    const top = parseFloat(window.getComputedStyle(this.wrap).top, 10)
    if (top || cartdata.length === 0) {
      this.wrap.style.transition = '0.15s ease'
      this.wrap.style.top = 0
      this.mask.style.top = 0
    } else {
      this.wrap.style.transition = '0.15s ease'
      this.wrap.style.top = parseFloat(this.wrapHeight, 10) * (-1)
      this.mask.style.top = parseFloat(window.getComputedStyle(document.querySelector('body')).height, 10) * (-1)
    }
  }

  handlesubmit(e, submit) {
    e.stopPropagation()
    if (submit) {
      submit()
    }
  }

  componentWillReceiveProps(nextProps) {
    // 重置
    const preData = this.state.cartdata
    const { cartdata } = nextProps
    if (preData !== cartdata) {
      this.empty = false
      this.setState({ cartdata }, () => {
        if (cartdata.length === 0) {
          this.handleSwitch()
        } else if (parseFloat(window.getComputedStyle(this.wrap).top, 10)) {
          this.wrap.style.transition = ''
          this.wrap.style.top = parseFloat(this.wrapHeight, 10) * (-1)
        }
      })
    }
  }

  render() {
    const { cartdata } = this.state
    const { listItem, submit, delBuycart } = this.props
    let sum = 0
    let quantity = 0
    this.empty = !(cartdata.length > 0)
    for (let i = 0; i < cartdata.length; i++) {
      sum += cartdata[i].price * cartdata[i].buyQuantity
      quantity += cartdata[i].buyQuantity
      if (!cartdata[i].isBuy) {
        this.empty = true
      }
    }
    sum = parseFloat(sum, 10).toFixed(2)
    return (
      <div className='buy_cart'>
        <div className='cart_mask' onClick={ () => this.handleSwitch() } ref={ node => { if (node) { this.mask = node; node.style.height = window.getComputedStyle(document.querySelector('body')).height } } } />
        <div className='cart_listwarp' ref={ node => { if (node) { this.wrap = node; this.wrapHeight = window.getComputedStyle(node).height } } }>
          <p className='cart_titile'>
            <span>已选商品</span>
            { this.empty && <span className='clear_noeff' onClick={ () => alert('删除无效商品', '确认删除无效商品吗？', [
              { text: '取消', onPress: () => console.log('cancel') },
              { text: '确定', onPress: () => { delBuycart('clear') } },
            ]) }
            >删除失效商品</span> }
            <span className='delete_icon'><Icon type={ require('svg/shengxian/delete.svg') } onClick={ () => alert('清空', '确认清空购物车吗？', [
              { text: '取消', onPress: () => console.log('cancel') },
              { text: '确定', onPress: () => { delBuycart() } },
            ]) }
            />清空</span>
          </p>
          <div>
            {
              cartdata.map((o, i) => React.cloneElement(listItem, { data: o, key: `${ o.commodityName }${ i + 1 }` }))
            }
          </div>
        </div>
        <div className='cart_sum' onClick={ () => this.handleSwitch() }>
          <div className='cart_info'>
            <div className='cart_icon'>
              <Icon type={ !this.empty ? require('svg/shengxian/cart.svg') : require('svg/shengxian/cartB.svg') } />
              { (cartdata.length > 0) && <span className='cart_badge'>{ quantity }</span> }
            </div>
            <div className='cart_price'>
              <p className='sum_price'>￥{ sum }</p>
              <p>不含运费</p>
            </div>
          </div>
          <div className='cart_btn' style={ !this.empty ? { background: '#ffab00' } : { background: '#cccccc' } } onClick={ e => { if (!this.empty) { this.handlesubmit(e, submit) } } }>去结算</div>
        </div>
      </div>
    )
  }
}
