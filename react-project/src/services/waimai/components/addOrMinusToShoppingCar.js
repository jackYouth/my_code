import React from 'react'
// import { getStore } from '@boluome/common-lib'
import { Mask } from '@boluome/oto_saas_web_app_component'
import { Toast } from 'antd-mobile'
import getCart from './getCart'
import MoreKindsLayer from './moreKindsLayer'
import '../style/addOrMinusToShoppingCar.scss'

// 加减购物车（每个商品中的加号和减号）
const AddOrMinusToShoppingCar = props => {
  // console.log('AddOrMinusToShoppingCar data', props)
  // const customerUserId = getStore('customerUserId', 'session')
  const { realQuantity, activity = {}, shoppingCarArray, restaurantId, addToShoppingCar, specfoods, attrs, specifications, restaurantInfo } = props !== 'undefined' ? props : ''
  const { isOpen = 1 } = restaurantInfo
  // let restaurantCart = shoppingCarArray[customerUserId][restaurantId]
  let restaurantCart = shoppingCarArray[restaurantId]
  if (!restaurantCart) {
    restaurantCart = []
  }
  const shoppingCar = getCart(restaurantCart)
  let thisFoodLen = 0
  let manyFoodLen = 0
  if (shoppingCar.length > 0) {
    specfoods.forEach(thisFood => {
      shoppingCar.forEach(shoppingCarFood => {
        // specfoods.length === 1，不是多规格商品
        if (specfoods.length === 1 && thisFood.foodId === shoppingCarFood.foodId) {
          return thisFoodLen = shoppingCarFood.quantity
        }
        manyFoodLen = shoppingCar.reduce((a, c) => {
          if (c.foodName === thisFood.foodName) {
            a = Number(a + c.quantity)
          }
          return a
        }, 0)
      })
    })
  }
  const addFood = result => {
    if (specfoods.length === 1) {
      const oneFoodObj = specfoods[0]
      if (!oneFoodObj.specialId) {
        oneFoodObj.specialId = `${ oneFoodObj.foodId }${ oneFoodObj.foodName }`
      }
      if (activity.maxQuantity) {
        oneFoodObj.activity = activity
      }
      addToShoppingCar(oneFoodObj, props, 1)
    } else {
      addToShoppingCar(result, props, 1)
    }
  }
  const minusFood = () => {
    if (specfoods.length === 1) {
      const oneFoodObj = specfoods[0]
      if (!oneFoodObj.specialId) {
        oneFoodObj.specialId = `${ oneFoodObj.foodId }${ oneFoodObj.foodName }`
      }
      if (activity.maxQuantity) {
        oneFoodObj.activity = activity
      }
      addToShoppingCar(oneFoodObj, props, 0)
    } else {
      Toast.info('多规格商品只能在购物车中删除', 2)
    }
  }
  return (
    <div className='addOrMinus-container'>
      {
        thisFoodLen > 0 || manyFoodLen > 0 ?
          <span onClick={ () => minusFood() } style={{ display: 'inline-block', width: '.75rem', height: '.75rem', textAlign: 'center' }}>
            <span className='minus' style={{ marginTop: '.15rem' }}>-</span>
          </span>
        : ''
      }
      {
        thisFoodLen > 0 || manyFoodLen > 0 || realQuantity ? <span className='foodLen'>{ !realQuantity ? specfoods.length > 1 ? manyFoodLen : thisFoodLen : realQuantity }</span> : ''
      }
      <span style={{ display: 'inline-block', width: '.75rem', height: '.75rem', textAlign: 'center' }}
        onClick={ () => {
          if (isOpen) {
            if (specfoods.length === 1) {
              addFood()
            } else {
              return (
                Mask(
                  <MoreKindsLayer attrs={ attrs } props={ props } specifications={ specifications } activity={ activity } onOk={ result => { addFood(result) } } />
                  , { mask: true, maskClosable: false }
                )
              )
            }
          } else {
            console.log('商家休息')
          }
        } }
      >
        <span className={ isOpen ? 'add' : 'no-add' } style={{ marginTop: '.15rem' }}>+</span>
      </span>
    </div>
  )
}

export default AddOrMinusToShoppingCar
