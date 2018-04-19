import { getStore } from '@boluome/common-lib'
import { Loading } from '@boluome/oto_saas_web_app_component'
import { Toast } from 'antd-mobile'
import { keys } from 'ramda'

import { send } from './ajax'

import { addCommodity } from './common-fuc'


export const checkCommodityStatus = (currentOrderInfo, listName) => dispatch => {
  // const closeLoading = Loading()
  const { brandId, commodityId, currentPriceInfo } = currentOrderInfo
  const specifications = [{ specificationId: currentPriceInfo.specificationId }]
  const checkMsgList = [
    {
      brandId,
      commodities: [
        {
          commodityId,
          specifications,
        },
      ],
    },
  ]
  send('/mall/v1/commodity/status', { checkMsgList }).then(({ code, data, message }) => {
    if (code === 0) {
      if (data[0].canService === false || data[0].commodities.canService === false) {
        Toast.info(data[0].description, 1)
        return
      }
      const currentSpec = data[0].commodities[0].specifications[0]
      const { canService, description } = currentSpec
      if (!canService) {
        dispatch({ type: 'SET_CURRENT_COMMODITY_STATUS', commodityStatus: currentSpec })
        Toast.info(description, 1)
        // closeLoading()
        return
      }
      const commodityListData = getStore(listName)
      if (listName === 'cartCommoditys') Toast.info('加入购物车成功', 1)
      dispatch(addCommodity(currentOrderInfo, commodityListData, listName))
    } else {
      Toast.fail(message)
    }
    // closeLoading()
  })
}

export const checkCartStatus = cartCommoditys => dispatch => {
  if (cartCommoditys.totalNum === 0) {
    dispatch({ type: 'SET_CART_GOODS', cartCommoditys })
    // statusChecked ：购物城中的商品状态是否检测过
    dispatch({ type: 'SET_CHECKED_STATUS', statusChecked: true })
    return
  }
  const closeLoading = Loading()
  const checkMsgList = cartCommoditys.brandList.map(o => {
    const { brandId, commodityList } = o
    // commoditiesInfo: 表示单个商品的信息，commodityId相同的商品会合并到一起, { commodityId: specifications }, specifications是一个数组: [specificationId, specificationId...]
    const commoditiesInfo = {}
    commodityList.forEach(oo => {
      const { commodityId, currentPriceInfo } = oo
      if (commoditiesInfo[commodityId]) {
        commoditiesInfo[commodityId].push({ specificationId: currentPriceInfo.specificationId })
      } else {
        commoditiesInfo[commodityId] = [{ specificationId: currentPriceInfo.specificationId }]
      }
    })
    const commodities = keys(commoditiesInfo).map(commodityId => ({
      commodityId:    Number(commodityId),
      specifications: commoditiesInfo[commodityId],
    }))
    return {
      brandId,
      commodities,
    }
  })
  send('/mall/v1/commodity/status', { checkMsgList }).then(({ code, data, message }) => {
    if (code === 0) {
      const { brandList } = cartCommoditys
      // 更改商品的数据
      data.forEach((o, i) => {
        // 如果商家的状态为休息中时，将其下所有的商品都置于商家的状态，否则去匹配具体商品状态
        if (o.canService === false) {
          brandList[i].commodityList = brandList[i].commodityList.map(bb => {
            bb.canService = false
            bb.description = o.description
            return bb
          })
        } else {
          // 匹配具体商品状态
          o.commodities.forEach(oo => {
            const commodityItemCanservice = oo.canService
            const commodityItemDescription = oo.description
            oo.specifications.forEach(ooo => {
              // 根据返回数据当前商品的所有规格信息，去到购物车数据中找到指定规格的商品，然后将返回的canService字段，赋予购物车中的规格
              brandList[i].commodityList.forEach((b, bi) => {
                if (commodityItemCanservice === false) {
                  brandList[i].commodityList[bi].currentPriceInfo.canService = false
                  brandList[i].commodityList[bi].currentPriceInfo.description = commodityItemDescription
                  return
                }
                if (b.currentPriceInfo.specificationId === ooo.specificationId) {
                  brandList[i].commodityList[bi].currentPriceInfo.canService = ooo.canService
                  brandList[i].commodityList[bi].currentPriceInfo.description = ooo.description
                }
              })
            })
          })
        }
      })
      dispatch({ type: 'SET_CART_GOODS', cartCommoditys })
      // statusChecked ：购物城中的商品状态是否检测过
      dispatch({ type: 'SET_CHECKED_STATUS', statusChecked: true })
    } else {
      Toast.fail(message)
    }
    closeLoading()
  })
}
