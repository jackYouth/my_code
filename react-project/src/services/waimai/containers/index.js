import { connect } from 'react-redux'
import { wrap, Loading } from '@boluome/oto_saas_web_app_component'
import { getStore } from '@boluome/common-lib'
import { login, getLocationGaode } from 'business'
import { handleAddress, fetchCategories, goFilter, fetchResturants, handleScrollTop, fetchBestContact, handleCheckdInvoice } from '../actions'
import { handleIsInvoiceChange, handleIsVipDelivery } from '../actions/filter'

import Indexs from '../components/index'

const mapStateToProps = ({ app, indexPage, restaurantDetail, addorMinusToShoppingCar, filter }) => {
  const { choosePoint = getStore('geopoint', 'session'), orderBy = '', invoice = '', isVipDelivery = '' } = indexPage
  const { channel } = app
  let mapType = indexPage.mapType
  if (choosePoint) {
    if (choosePoint.mapType) {
      mapType = choosePoint.mapType
    }
  }
  const fetchData = {
    ...choosePoint,
    channel,
    mapType,
    orderBy,
    invoice,
    isVipDelivery,
  }
  delete filter.offset
  return {
    ...app,
    ...indexPage,
    ...restaurantDetail,
    ...filter,
    fetchData,
    ...addorMinusToShoppingCar,
  }
}

const mapDispatchToProps = dispatch => ({
  dispatch,
  handleFetchMore: (limit, offset, fetchData, onSuccess, oldList = []) => {
    fetchResturants({ ...fetchData, offset, limit }, data => {
      if (data.length > 0) {
        const restList = JSON.parse(JSON.stringify(oldList))
        if (data.length > 10) {
          data.length = 10
        }
        restList.push(...data)
        dispatch({ type: 'REST_LIST', restList, offset: offset + data.length })
        onSuccess(data)
      } else {
        const empty = []
        onSuccess(empty)
      }
    })
  },
  handleScrollTop: e => dispatch(handleScrollTop(e)),
  goFilter:        categoryId => dispatch(goFilter(categoryId)),
  handleAddress:   (addressResult, flag) => dispatch(handleAddress(addressResult, flag)),
  fetchCategories: () => dispatch(fetchCategories()),
  handleGoTop:     () => {
    document.querySelector('.wrap').scrollTop = 0
  },
  checkScrollTop:  () => {
    if (document.querySelector('.wrap').scrollTop > 800) {
      dispatch({ type: 'SHOW_GOTOP', showGoTop: true })
    } else {
      dispatch({ type: 'SHOW_GOTOP', showGoTop: false })
    }
  },
  handleRecommend: orderBy => {
    dispatch({ type: 'RECOMMEND_FILTER', orderBy, offset: 0 })
    dispatch({ type: 'GET_CATEGORY', restList: [] })
  },
  handleCheckdInvoice: (invo, vipDelivery) => {
    dispatch({ type: 'ISSHOW_RECOMMEND', isShowRecommend:0 })
    dispatch(handleCheckdInvoice(invo, vipDelivery))
  },
  handleIsInvoiceChange: checked => {
    dispatch(handleIsInvoiceChange(checked))
  },
  handleIsVipDelivery: checked => {
    dispatch(handleIsVipDelivery(checked))
  },
  handleShowRecommend: isShowRecommend => {
    if (isShowRecommend) {
      document.querySelector('.wrap').scrollTop = document.querySelector('.recommend-filter').offsetTop
    }
    dispatch({ type: 'ISSHOW_RECOMMEND', isShowRecommend })
  },
  componentDidUpdateFun: p => {
    const { isFromRestDetail, orderBy, restList } = p
    if (document.querySelector('.wrap') && !isFromRestDetail && orderBy && restList.length <= 10) {
      document.querySelector('.wrap').scrollTop = document.querySelector('.recommend-filter').offsetTop
    }
  },
})

const mapFunToComponent  = (dispatch, state) => ({
  componentWillMount: () => {
    const handleClose = Loading()
    const { isFromRestDetail = 0, offset = 0 } = state
    if (!isFromRestDetail && offset > 0) {
      dispatch({ type: 'GET_CATEGORY', restList: [] })
    }
    const basisDo = () => {
      const { choosePoint } = state
      // const customerUserId = getStore('customerUserId', 'session')
      // const sessionCart = getStore('shoppingCarArray')
      // let shoppingCarArray = sessionCart || []
      // // session中若没有购物车信息，则取state中
      // if (!sessionCart) {
      //   shoppingCarArray = state.shoppingCarArray
      // }
      // const userCart = shoppingCarArray[customerUserId]
      // if (!userCart) {
      //   shoppingCarArray[customerUserId] = {}
      // }
      // if (customerUserId) {
      //   setStore('shoppingCarArray', shoppingCarArray)
      // } else {
      //   console.log('shoppingCar is err')
      // }
      if (!choosePoint) {
        dispatch(fetchBestContact())
      }
      // dispatch({ type: 'SHOPPINGCAR_ARRAY', shoppingCarArray })
      dispatch({ type: 'MAP_TYPE', mapType: 'gaode' })

      // 是否展示banner
      if (window.location.origin.indexOf('bestpay') > -1 || window.location.origin.indexOf('me') > -1 || window.location.origin.indexOf('blm') > -1 || window.location.origin.indexOf('localhost') > -1) {
        dispatch({ type: 'SHOW_BANNER', showBanner: true })
      }
    }

    // 判断是否有定位信息
    const getLocation = () => {
      const closeLoading = Loading()
      if (!sessionStorage.currentPosition) {
        getLocationGaode(err => {
          if (err) {
            // Mask.closeAll()
            closeLoading()
            console.log('getLocation err', err)
            // Toast.info('定位失败', 2)
            dispatch({ type: 'LOCATION_ERR', locationErr: true, offset: 10 })
          } else {
            basisDo()
            closeLoading()
          }
        })
      } else {
        // Mask.closeAll()
        closeLoading()
        basisDo()
      }
    }

    login(err => {
      if (err) {
        console.log('login err', err)
      } else {
        getLocation()
      }
    }, true)

    handleClose()
  },
  componentDidMount: () => {
    const { isFromRestDetail, oldScrollTop } = state
    if (document.querySelector('.wrap')) {
      if (isFromRestDetail) {
        document.querySelector('.wrap').scrollTop = oldScrollTop
      }
    }
  },
  componentWillUnmount: () => {
    dispatch({ type: 'RESTAURANT_INFO', isFromRestDetail: 0 })
    // dispatch({ type: 'CHANGE_OFFSET', offset: 0 })
    // dispatch({ type: 'FETCH_DATA', fetchData: {} })
    // dispatch({ type: 'GET_CATEGORY', categories: [] })
  },
})

export default
  connect(mapStateToProps, mapDispatchToProps)(
    wrap(mapFunToComponent)(Indexs)
  )
