import React from 'react'
// import { browserHistory } from 'react-router'
import { Icon } from 'antd-mobile'
// import { getStore, setStore } from '@boluome/common-lib'
import { Mask } from '@boluome/oto_saas_web_app_component'
import '../style/attribute.scss'

import iconadd from '../img/jia.svg'
import iconjian from '../img/jian.svg'
import iconcha from '../img/cha.svg'

// const Item = List.Item
class AttributeCom extends React.Component {
  constructor(props) {
    super(props)
    const { data, addCartFn, handleContainerClose } = props
    const { attribute } = data
    const markAttribute = attribute.map(({ name, items }) => ({ name, value: items[0].name, price: items[0].value }))
    // console.log('markAttribute-----', markAttribute)
    this.state = {
      data,
      markAttribute,
      addCartFn,
      sum: 1,
      val: 0,
      handleContainerClose,
    }
    this.handleAttribute = this.handleAttribute.bind(this)
    this.handleraddCartFn = this.handleraddCartFn.bind(this)
    this.handleAddSumBtn = this.handleAddSumBtn.bind(this)
  }
  // componentDidMount() {
  // i.name === item.name && i.value === items.name && i.price === items.value
  // }
  componentWillUnmount() {
    Mask.closeAll()
  }
  handleCloseEvent(handleContainerClose) {
    // Mask.closeAll()
    handleContainerClose()
  }
  handleAttribute(n, s) {
    // console.log('---test--handleAttribute-', n, s)
    const { markAttribute } = this.state
    let { val } = this.state
    for (let i = 0; i < markAttribute.length; i++) {
      if (markAttribute[i].name === n && markAttribute[i].name === '杯型' && markAttribute[i].value !== s.name) {
        val = 0
      }
    }
    for (let i = 0; i < markAttribute.length; i++) {
      // val = 0
      if (markAttribute[i].name === n && markAttribute[i].value !== s.name) {
        markAttribute[i].value = s.name
        markAttribute[i].price = s.value
        val += s.value
      }
    }
    this.setState({
      markAttribute,
      val,
    })
  }
  handleraddCartFn(data, markAttribute, sum) {
    const { addCartFn, handleContainerClose } = this.state
    addCartFn('yes', data, markAttribute, sum)
    // Mask.closeAll()
    handleContainerClose()
  }
  handleAddSumBtn(i) {
    const { sum } = this.state
    if (sum === 1 && i === -1) {
      console.log('最少一个')
    } else {
      this.setState({
        sum: (sum + i),
      })
    }
  }
  render() {
    const { data, markAttribute, sum, val, handleContainerClose } = this.state
    const { productName, price, attribute } = data
    const sumPrice = (price + val) * sum
    // console.log('---------', sumPrice, price, val)
    if (attribute) {
      return (
        <div className='attributeWrap'>
          <div className='title'>
            <span>{ productName }</span>
            <Icon className='close' type={ iconcha } onClick={ () => this.handleCloseEvent(handleContainerClose) } />
          </div>
          <div className='attribute'>
            {
              attribute.map(item => {
                return (
                  <div className='item' key={ `${ item.name + 1 }` }>
                    <p>{ item.name }</p>
                    {
                      (item.items).map(items => (
                        <span className={ `${ markAttribute.filter(o => { return o.name === item.name })[0].value === items.name ? 'markSpan' : '' }` }
                          key={ `${ items.name + 1 }` }
                          onClick={ () => this.handleAttribute(item.name, items) }
                        >
                          { items.name }
                        </span>
                      ))
                    }
                  </div>
                )
              })
            }
          </div>
          <div className='sumChange'>
            <div className='sumText'>购买数量</div>
            <div className='num'>
              <span onClick={ () => this.handleAddSumBtn(-1) }><Icon type={ iconjian } /></span>
              <span className='Sum'>{ sum }</span>
              <span onClick={ () => this.handleAddSumBtn(1) }><Icon type={ iconadd } /></span>
            </div>
          </div>
          <div className='addcart'>
            ¥ <span className='addcart_price'>{ sumPrice }</span>
            <span className='addcart_btn' onClick={ () => this.handleraddCartFn(data, markAttribute, sum) }>选好了</span>
          </div>
        </div>
      )
    }
    return (<div />)
  }
}

export default AttributeCom
