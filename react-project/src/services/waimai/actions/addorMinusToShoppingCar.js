import { setStore } from '@boluome/common-lib'
// import { Toast } from 'antd-mobile'

// 添加至购物车
export const addToShoppingCar = (foodsObj, props, num) => {
  // const customerUserId = getStore('customerUserId', 'session')
  console.log('props', props)
  const { shoppingCarArray, restaurantId, menuCategoryName, menuCategoryId } = props
  const { foodId, price, foodName, specialId } = foodsObj
  // let restaurantCart = shoppingCarArray[customerUserId][restaurantId]
  let restaurantCart = shoppingCarArray[restaurantId]
  if (!restaurantCart) {
    restaurantCart = []
  }
  const hasActivity = foods => {
    console.log('foods', foods)
    if (foods.activity && foods.activity.discount) {
      console.log(foods.activity && foods.activity.discount !== 'undefined')
      return true
    }
    return false
  }

  const addFood = (restaurantList, foods) => {
    const filterFood = restaurantList.filter(o => { return o.specialId === foods.specialId })
    if (num) {
      console.log('add food')
      if (filterFood.length > 0) {
        filterFood[0].quantity++
      } else {
        restaurantList.push({
          foodId,
          quantity:      1,
          menuCategoryId,
          menuCategoryName,
          foodsInfo:     foodsObj,
          price,
          foodName,
          specialId,
          originalPrice: price,
        })
      }
    } else if (!num && filterFood[0].quantity > 1) {
      console.log('minus 数量大于一 已有的food')
      filterFood[0].quantity--
    } else {
      console.log('minus 数量唯一 已有的food')
      restaurantList.forEach((item, index) => {
        if (item.specialId === specialId) {
          restaurantList.splice(index, 1)
        }
      })
    }
  }

  const addActivity = (restaurantList, foods) => {
    const { activity } = foods
    const filterActivity = restaurantList.filter(o => { return o.discount === activity.discount })
    if (num) {
      console.log('添加优惠商品')
      if (filterActivity.length > 0) {
        console.log('has this filterActivity', filterActivity)
        const filterActivityFood = filterActivity[0].foods.filter(o => { return o.specialId === foods.specialId })
        if (filterActivityFood.length > 0) {
          console.log('act specialId repeat')
          filterActivityFood[0].quantity++
          // Toast.info('该美食限一份优惠，已为您选择最大优惠', 2)
        } else {
          // Toast.info('已为您选取选择最大优惠', 2)
          console.log('add new act specialId')
          filterActivity[0].foods.push({
            activity,
            foodId,
            quantity:      1,
            menuCategoryId,
            menuCategoryName,
            foodsInfo:     foodsObj,
            price,
            foodName,
            specialId,
            discountPrice: Number((activity.discount * price).toFixed(2)),
            discount:      activity.discount,
            maxQuantity:   activity.maxQuantity,
            originalPrice: foodsObj.originalPrice,
          })
          console.log('added new act specialId', filterActivity)
        }
      } else {
        console.log('creat a newActivity')
        const newActivity = {
          discount:    activity.discount,
          maxQuantity: activity.maxQuantity,
          foods:       [{
            activity,
            foodId,
            quantity:      1,
            menuCategoryId,
            menuCategoryName,
            foodsInfo:     foodsObj,
            price,
            foodName,
            specialId,
            discountPrice: Number((activity.discount * price).toFixed(2)),
            discount:      activity.discount,
            maxQuantity:   activity.maxQuantity,
            originalPrice: foodsObj.originalPrice,
          }],
        }
        console.log('created a newActivity', newActivity)
        restaurantList.push(newActivity)
        return restaurantList
      }
    } else {
      console.log('删除优惠商品')
      const filterActivityFood = filterActivity[0].foods.filter(o => { return o.specialId === foods.specialId })
      if (!num && filterActivityFood[0].quantity > 1) {
        console.log('删除数量大于一的优惠商品')
        filterActivityFood[0].quantity--
      } else {
        console.log('删除数量为一的优惠商品')
        filterActivity[0].foods.forEach((item, index) => {
          if (item.specialId === specialId) {
            filterActivity[0].foods.splice(index, 1)
          }
        })
      }
    }
  }

  if (hasActivity(foodsObj)) {
    addActivity(restaurantCart, foodsObj)
  } else {
    addFood(restaurantCart, foodsObj)
  }
  setStore('shoppingCarArray', shoppingCarArray)
  return {
    type: 'SHOPPINGCAR_ARRAY',
    shoppingCarArray,
  }
}
