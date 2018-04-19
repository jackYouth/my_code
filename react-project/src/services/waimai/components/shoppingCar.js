import React, { Component } from 'react'
import { browserHistory } from 'react-router'
import { getStore } from '@boluome/common-lib'
import { Icon, Modal, Toast } from 'antd-mobile'
import { login } from 'business'
import getCart from './getCart'
import AddOrMinusToShoppingCar from '../containers/addOrMinusToShoppingCar'
import '../style/shoppingCar.scss'
import '../style/restaurantDetail.scss'

const alert = Modal.alert
// 底部购物车栏
class ShoppingCar extends Component {
  constructor(props) {
    super(props)
    this.state = {
      price:          0,
      agentFee:       0,
      saveOrder:      0,
      customerUserId: getStore('customerUserId', 'session'),
      showContainer:  0,
    }
  }

  componentWillReceiveProps(nextprops) {
    const { data } = nextprops
    const { deliveryInfo = {} } = data !== 'undefined' ? data : ''
    const { deliveryRule = {} } = deliveryInfo !== 'undefined' ? deliveryInfo : ''
    const { agentFees = [], deliveryAmounts = [] } = deliveryRule
    const { shoppingCarArray, restaurantId } = data
    // const { customerUserId } = this.state
    // let restaurantCart = shoppingCarArray[customerUserId][restaurantId]
    let restaurantCart = shoppingCarArray[restaurantId]
    if (!restaurantCart) {
      restaurantCart = []
    }
    const shoppingCar = getCart(restaurantCart)
    // console.log('shoppingCar!!!!!!!!-==--=-==--=', shoppingCar)
    let deliveryAmount = 0
    let agentFee = 0
    this.setState({ price: shoppingCar.reduce((amount, curr) => {
      // console.log('curr', curr)
      amount += curr.realPrice ? Number(curr.realPrice) : curr.originalPrice * curr.quantity
      return amount
    }, 0),
    },
      () => {
        const { price } = this.state
        // deliveryAmounts.forEach((item, index) => {
        //   deliveryAmount = item
        //   agentFee = agentFees[index]
        //   this.setState({ agentFee })
        // })
        deliveryAmount = deliveryAmounts[0]
        agentFee = agentFees[0]
        this.setState({ agentFee })
        this.setState({ deliveryAmount })
        // console.log('123123132123123', price, deliveryAmount, shoppingCar)
        if (price >= deliveryAmount && shoppingCar.length >= 1) {
          this.setState({ saveOrder: 1 })
        } else {
          this.setState({ saveOrder: 0 })
        }
      }
    )
    this.setState({ quantity: shoppingCar.reduce((quantity, curr) => {
      quantity += curr.quantity
      return quantity
    }, 0),
    })
  }

  showPopupContainer(data) {
    if (data) {
      this.setState({ showContainer: 0 })
    } else {
      this.setState({ showContainer: 1 })
    }
  }

  handleCleanUp() {
    const { deleteAll, data } = this.props
    const { restaurantId } = data
    // const customerUserId = getStore('customerUserId', 'session')
    // console.log('shoppingCarArray', shoppingCarArray)
    // shoppingCarArray[customerUserId][restaurantId] = []
    // shoppingCarArray[restaurantId] = []
    // console.log('shoppingCarArray2', shoppingCarArray)
    alert('删除', '是否清空购物车?', [
      { text: '取消', onPress: () => console.log('cancel'), style: 'default' },
      { text: '确定', onPress: () => { deleteAll(restaurantId) }, style: { fontWeight: 'bold' } },
    ])
  }

  render() {
    // console.log('props-------------', this.props)
    const { data } = this.props
    const { shoppingCarArray, restaurantId = '', restaurantInfo } = data
    const { price, agentFee, saveOrder, quantity, showContainer } = this.state
    const customerUserId = getStore('customerUserId', 'session')
    // let restaurantCart = shoppingCarArray[customerUserId][restaurantId]
    let restaurantCart = shoppingCarArray[restaurantId]
    if (!restaurantCart) {
      restaurantCart = []
    }
    const shoppingCar = getCart(restaurantCart)
    // console.log('price', price)
    const { activities = [] } = typeof restaurantInfo !== 'undefined' ? restaurantInfo : ''
    const { deliveryAmount = 0 } = this.state
    // console.log('deliveryAmount', deliveryAmount)
    let currHeight = 0
    if (shoppingCar.length > 3) {
      if (activities.length > 0) {
        currHeight = 'calc(5.8rem - 1.45rem)'
      } else {
        currHeight = 'calc(5.8rem - 0.9rem)'
      }
    } else {
      currHeight = `${ shoppingCar.length } * 1.16rem`
    }
    return (
      <div className='bottom-container'>
        {
          activities.length > 0 ?
            <div className='tip' style={{ bottom: '1rem', display: !showContainer ? 'block' : 'block' }}>
              { activities[0].description }
            </div>
         : ''
        }
        <div className='shoppingCar-container'>
          <div className='maskBlack' onClick={ () => this.showPopupContainer(showContainer) } style={{ display: showContainer && shoppingCar.length > 0 ? 'block' : 'none', height: `((${ shoppingCar.length } * 1.75) + 2.85)rem` }}
            onTouchMove={ e => e.preventDefault() }
          />
          <div className='popup-main-container' style={{ display: showContainer && shoppingCar.length > 0 ? 'block' : 'none' }}>
            <div className='popup-up'>
              {
                activities.length > 0 ?
                  <div className='tip'>
                    { activities[0].description }
                  </div>
               : ''
              }
              <div className='cleanup-container'>
                <i />
                <span>已选商品</span>
                <div className='cleanup-box' onClick={ () => this.handleCleanUp() }>
                  <span>清空</span>
                </div>
              </div>
            </div>
            <div className='popup-listBox' style={{ height: currHeight }}>
              {
                shoppingCar.length > 0 ?
                  shoppingCar.map(item => {
                    // console.log('item', item)
                    const attrs = item.foodsInfo && Array.isArray(item.foodsInfo.attrsArr) && item.foodsInfo.attrsArr.length > 0 ? item.foodsInfo.attrsArr : []
                    const specifications = []
                    // const specs = item.foodsInfo.specs[0].value || ''
                    let specs = ''
                    if (item.foodsInfo.specs.length > 0) {
                      specs = item.foodsInfo.specs[0].value
                    }
                    // console.log('specs', specs, specs.length)
                    return (
                      <div key={ `popshowkey${ Math.random() }` } className='popup-food-box'>
                        <span className='food-name'>
                          <span style={{ height: (attrs.length === 0) && specs.length === 0 ? '100%' : '', lineHeight: (attrs.length === 0) && specs.length === 0 ? '0.89rem' : '' }}>{ item.foodName }</span>
                          {
                            specs ?
                              <span>{ specs }</span>
                            : ''
                          }
                          {
                            attrs.length > 0 ?
                              <span>{ `${ attrs.map(i => { return i.value }) }` }</span>
                            : ''
                          }
                        </span>
                        <span className='food-price'>{ `¥${ (item.realPrice ? Number(item.realPrice) : item.originalPrice * item.quantity).toFixed(2) }` }</span>
                        <div className='addCom-box'>
                          <AddOrMinusToShoppingCar data={ data } specfoods={ [item] } attrs={ attrs } specifications={ specifications } realQuantity={ item.quantity } />
                        </div>
                      </div>
                    )
                  })
                : ''
              }
            </div>
          </div>
          <div className='shoppingCar-container-left' onClick={ () => { if (quantity) { this.showPopupContainer(showContainer) } } } onTouchMove={ e => e.preventDefault() }>
            <div className='shoppingCar'>
              <Icon type={ quantity ? require('../img/shoppingCart.svg') : require('../img/emptyShoppingCart.svg') } />
            </div>
            {
              quantity ? <span className='quantity'>{ quantity }</span> : ''
            }
            <div className='shopping-car-price-container'>
              <span>{ `¥${ (price).toFixed(2) }` }</span>
              <p>{ `另需配送费${ agentFee }元` }</p>
            </div>
          </div>
          <button onClick={ () => {
            if (customerUserId) {
              browserHistory.push('/waimai/order')
            } else {
              login(err => {
                if (err) {
                  console.log('bindUser in waimai service err', err)
                  Toast.info(err, 2)
                } else {
                  browserHistory.push('/waimai/order')
                }
              }, true)
            }
          } }
            disabled={ saveOrder ? '' : 'true' }
            className={ saveOrder ? 'saveOrder' : '' }
          >{ saveOrder ? '结算' : `¥ ${ deliveryAmount }起送` }</button>
        </div>
      </div>
    )
  }
}

export default ShoppingCar
