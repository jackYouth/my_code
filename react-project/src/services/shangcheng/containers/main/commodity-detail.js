import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import { parseQuery } from '@boluome/common-lib'
import { wrap }    from '@boluome/oto_saas_web_app_component'
import { Toast } from 'antd-mobile'
import { contains, keys, all } from 'ramda'

import CommodityDetail         from '../../components/main/commodity-detail'

import { getCommodityDetail, handleChangeCollect } from '../../actions/main/commodity-detail'
import { checkCommodityStatus } from '../../actions/common-api'

const mapStateToProps = ({ commodityDetail, message }) => {
  const { totalUnreadNum } = message
  return {
    ...commodityDetail,
    totalUnreadNum,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    dispatch,
    handleSelectParams(currentTopParamId, paramsList, prices, parameters, currentNum) {
      // paramsList : { topParamsId: { name: subParamsName, id: subparamsId } }
      // parameters: 先强转一波，保持传入的parameters的纯净
      let newParameters = JSON.parse(JSON.stringify(parameters))
      // topParamsList, subParamsList 分别表示选中的一级规格、二级规格的列表
      const topParamsList = keys(paramsList)
      const subParamsList = topParamsList.map(o => paramsList[o].id)
      // existList: 当前存在的所符合的所有prices组合
      prices.forEach(o => {
        const { specificationItems, inventory } = o
        subParamsList.forEach(oo => {
          // 如果当前标准规格组合中，存在选择的任意一个二级规格且库存小于当前选中商品数量时，
          if (contains(oo)(specificationItems) && inventory < currentNum) {
            // 找到规格列表中对应的规格，添加无库存标记
            newParameters = newParameters.map(t => {
              t.subParameters.map(tt => {
                // 当库存为0时，如果当前二级分类在当前prices的价格列表中且不是选中的二级分类，就添加无库存标记
                if (contains(tt.parameterId)(specificationItems) && !contains(tt.parameterId)(subParamsList)) {
                  tt.noInvertory = true
                }
                return tt
              })
              return t
            })
          }
        })
      })
      let currentPriceInfo = ''
      // 如果选择了当前的所有规格，就将当前的价格保存到规格信息中
      if (subParamsList.length === parameters.length) {
        currentPriceInfo = prices.filter(o => all(e => contains(e)(o.specificationItems))(subParamsList))[0]
      }
      // params: 当前选中的标签列表，newParameters: 带无库存标记的规格列表，currentPriceInfo: 当前规格对应的价格信息(当所有规格选中之后，才有)
      const currentParamsInfo = { paramsList, newParameters, currentPriceInfo }
      dispatch({ type: 'SET_CURRENT_PARAMS', currentParamsInfo })
    },
    handleBrandClick(brandId) {
      browserHistory.push(`/shangcheng/${ brandId }`)
    },
    handleChangePopup(showPopup, buttonType) {
      dispatch({ type: 'SET_POPUP_VISIBLE', showPopup, buttonType })
    },
    handleChangeNum(model, currentNum, currentPriceInfo, checkNum) {
      if (!currentPriceInfo) {
        Toast.info('请选择规格', 1)
        return
      }
      if (model) {
        if (currentNum && checkNum && checkNum <= currentNum) {
          Toast.info('已达到限购数量')
          return
        }
        if (currentNum && currentNum === currentPriceInfo.inventory) {
          Toast.info('已达到库存上限')
          return
        }
        currentNum++
      } else {
        currentNum--
      }
      dispatch({ type: 'SET_CURRENT_NUM', currentNum })
    },
    // allSubSingle: 所有的二级分类都是一个, currentParamsInfo: 当前选中产品参数信息, commodityDetail: 当前商品的详情, currentNum: 当前商品的购买数量, listName: 当前点击的是购物车还是购买按钮, isParasPage: 表示是不是在规格弹出框处，点击的加入购物车或立即购买
    handleClickCartOrPay(currentParamsInfo, commodityDetail, currentNum, listName = 'cartCommoditys', isParasPage = false) {
      // 判断当前规格是否全选，是则生成对应的商品信息，包括数量
      const { paramsList, currentPriceInfo } = currentParamsInfo
      const { parameters } = commodityDetail
      const topParamsList = keys(paramsList)
      console.log(22222, topParamsList, parameters)
      if (topParamsList.length < parameters.length && !all(e => e.subParameters.length === 1)(parameters)) {
        if (isParasPage) {
          let tipParam = ''
          parameters.forEach(o => {
            if (!tipParam && !contains(String(o.parameterId))(topParamsList)) tipParam = o.parameterName
          })
          Toast.info(`请选择${ tipParam }`, 1)
        } else {
          dispatch({ type: 'SET_POPUP_VISIBLE', showPopup: true })
        }
      } else {
        const currentOrderInfo = {
          currentPriceInfo,
          buyNum: currentNum,
          ...commodityDetail,
        }
        dispatch(checkCommodityStatus(currentOrderInfo, listName))
        dispatch({ type: 'SET_POPUP_VISIBLE', showPopup: false })
      }
    },
    handleModalClick() {
      dispatch({ type: 'SET_CURRENT_COMMODITY_STATUS', commodityStatus: '' })
    },
    handleChangeCollect(commodityId, isCollect) {
      dispatch(handleChangeCollect(commodityId, isCollect))
    },
    handleEvaluateClick(commodityId) {
      browserHistory.push(`/shangcheng/evaluateList/${ commodityId }`)
    },
    handleToCart() {
      browserHistory.push('/shangcheng/cart')
    },
    handleToMessage(brandId, brandName) {
      window.location.href = `${ location.origin }/shangcheng/message/dialog?brandId=${ brandId }&brandName=${ brandName }`
      // location.href = window.encodeURIComponent(url)
    },
  }
}

const mapFunToComponent  = dispatch => ({
  componentWillMount() {
    // 清空当前规格信息，避免下一个商品也使用上一个所选的规格
    dispatch({ type: 'SET_CURRENT_PARAMS', currentParamsInfo: { paramsList: {} } })
    const commodityId = parseQuery(location.search).commodityId
    dispatch(getCommodityDetail(commodityId))
    // 清空当前状态树中的上一组数据
    dispatch({ type: 'SET_COMMODITY_DETAIL', commodityDetail: '' })
    dispatch({ type: 'SET_COMMODITY_COLLECT', isCollect: undefined })
    dispatch({ type: 'SET_POPUP_VISIBLE', showPopup: false })
  },
})

export default
connect(mapStateToProps, mapDispatchToProps)(
  wrap(mapFunToComponent)(CommodityDetail)
)
