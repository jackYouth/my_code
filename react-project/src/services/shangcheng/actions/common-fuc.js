/*
  购物车数据格式：
  {
    totalNum,
    brandList: [
      {
        brandId: 商家id,
        brandName: 商家名,
        commodityList: [
          { 商品信息, 商品数量 },
          { 商品信息, 商品数量 },
        ]
      },
      {
        brandId: 商家id,
        brandName: 商家名,
        commodityList: [
          { 商品信息, 商品数量 },
          { 商品信息, 商品数量 },
        ]
      },
    ]
  },
  购物车数据在store中都是放入market下的，本地中每次也会有的
*/

import { browserHistory } from 'react-router'
import { setStore } from '@boluome/common-lib'
// import { Toast } from 'antd-mobile'

// 向购物车中增加商品
export const addCommodity = (data, commodityListData, listName = 'cartCommoditys') => dispatch => {
  if (!commodityListData || !commodityListData.totalNum) commodityListData = { totalNum: 0, brandList: [] }
  // notChangeNum: 不改变商品数量   已取消该判断
  const { brandList = [] } = commodityListData
  let { totalNum } = commodityListData
  let inBrandList = false
  let inCommodityList = false
  // 用一个新的商家信息(newCommodityList)来承装操作后的数据，先将就的删除，再把处理过的数据添加进入
  let newCommodityList = []
  const newBrandList =
  brandList.length >= 1
    ? brandList.filter(o => {
      // 如果产品的商家在对应商家列表中，执行下一句注释对应方案
      if (o.brandId === data.brandId) {
        inBrandList = true
        // 如果购物车中已有该种商品，就先删除，然后把这个商品已有数量加添加数量，再重新插入到购物车列表中对应商家列表的商品列表中
        newCommodityList = o.commodityList.map(oo => {
          if (oo.currentPriceInfo.specificationId === data.currentPriceInfo.specificationId) {
            oo.buyNum += data.buyNum
            inCommodityList = true
          }
          return oo
        })
        // 如果不在其中，就将新的插入
        if (!inCommodityList) newCommodityList.unshift(data)
        return false
      }
      return true
    })
    : []
  // 如果产品的商家不在对应商家列表中，就新建一个商品列表，将商品放入进去
  if (!inBrandList) {
    newCommodityList = [data]
  }
  // 将最新的商品列表数据添加到商家列表中
  const currentBrandInfo = {
    brandId:       data.brandId,
    brandName:     data.brandName,
    brandImg:      data.bigLogoImg,
    commodityList: newCommodityList,
  }
  if (listName === 'orderCommoditys') {
    totalNum = data.buyNum
    const totalPrice = data.buyNum * data.currentPriceInfo.sellPrice
    currentBrandInfo.totalNum = totalNum
    currentBrandInfo.totalPrice = totalPrice
    // 给商品添加canService，因为这里直接去下单，不经过购物车，所以没有canService字段
    currentBrandInfo.canService = true
    currentBrandInfo.commodityList = currentBrandInfo.commodityList.map(o => {
      o.currentPriceInfo.canService = true
      return o
    })
    currentBrandInfo.directOrder = true
    setStore('orderCommoditys', currentBrandInfo)
    browserHistory.push('/shangcheng/order')
  } else if (listName === 'cartCommoditys') {
    // 添加到购物车的流程
    newBrandList.push(currentBrandInfo)
    // 将总数量加当前选择商品的数量
    // if (!notChangeNum) totalNum += data.buyNum
    totalNum += data.buyNum
    commodityListData.totalNum = totalNum
    commodityListData.brandList = newBrandList
    setStore('cartCommoditys', commodityListData)
    dispatch({ type: 'SET_CART_GOODS', cartCommoditys: commodityListData })
  }
}

// 删除购物车中，指定商家任意商品的数据
export const delCartCommodity = (cartCommoditys, brandCommodities) => {
  let { brandList } = cartCommoditys
  brandList = brandList.filter(o => {
    if (o.brandId === brandCommodities.brandId) {
      o.commodityList = o.commodityList.filter(oo => {
        let inBrandCommodities = false
        brandCommodities.commodityList.forEach(b => {
          // 找到购物车中的订单商品
          if (b.currentPriceInfo.specificationId === oo.currentPriceInfo.specificationId) inBrandCommodities = true
        })
        return !inBrandCommodities
      })
      if (o.commodityList.length === 0) return false
      return true
    }
    return true
  })
  cartCommoditys.totalNum -= brandCommodities.totalNum
  cartCommoditys.brandList = brandList
  setStore('cartCommoditys', cartCommoditys)
  // dispatch({ type: 'SET_CART_GOODS', cartCommoditys: '' })
  return cartCommoditys
}

export const timeToCountdown = time => {
  time = parseInt(time / 1000, 10)
  const normalTime = dd => (String(dd).length === 1 ? `0${ dd }` : dd)
  const s = normalTime(time % 60)
  const min = normalTime(parseInt(time / 60, 10) % 60)
  const hour = normalTime(parseInt(time / 60 / 60, 10) % 24)
  return `${ hour }:${ min }:${ s }`
}
