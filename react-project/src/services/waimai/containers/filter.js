import { connect } from 'react-redux'
import { wrap, Mask } from '@boluome/oto_saas_web_app_component'
import { getStore, parseQuery } from '@boluome/common-lib'
import Filter from '../components/filter'
import { handleShowFilter, fetchResturants, handleIsOnlinePayChange, handleIsInvoiceChange, handleOrderbyChange, handleCategoryChange, handleCheckdInvoice, handleIsVipDelivery } from '../actions/filter'
import { handleScrollTop } from '../actions/index'

const mapStateToProps = ({ app, indexPage, filter, restaurantDetail }) => {
  const { choosePoint = getStore('geopoint', 'session') } = indexPage
  const { channel } = app
  delete indexPage.orderBy
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
  }
  delete indexPage.offset
  return {
    ...app,
    ...indexPage,
    ...filter,
    fetchData,
    ...restaurantDetail,
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
        dispatch({ type: 'CHANGE_OFFSET', restList, offset: offset + data.length })
        onSuccess(data)
      } else {
        const empty = []
        onSuccess(empty)
      }
    })
  },
  handleIsOnlinePayChange: checked => {
    dispatch({ type: 'CHANGE_OFFSET', offset: 0 })
    dispatch(handleIsOnlinePayChange(checked))
    dispatch(handleShowFilter(0))
  },
  handleIsInvoiceChange: checked => {
    dispatch(handleIsInvoiceChange(checked))
    dispatch(handleShowFilter(0))
  },
  handleIsVipDelivery: checked => {
    dispatch(handleIsVipDelivery(checked))
    dispatch(handleShowFilter(0))
  },
  handleOrderbyChange: orderByChoose => {
    dispatch({ type: 'CHANGE_OFFSET', offset: 0 })
    dispatch(handleOrderbyChange(orderByChoose))
    dispatch(handleShowFilter(0))
  },
  handleCategoryChange: categoryId => {
    dispatch({ type: 'CHANGE_OFFSET', offset: 0 })
    dispatch(handleCategoryChange(categoryId))
    dispatch(handleShowFilter(0))
  },
  handleShowFilter: (showFilter, invo, vipDelivery, isMask) => {
    dispatch(handleShowFilter(showFilter))
    if (isMask) {
      // console.log('invo, vipDelivery, isMask', invo, vipDelivery, isMask)
      dispatch({ type: 'INVOICE_CHANGE', bInvoice: invo })
      dispatch({ type: 'VIPDELIVERY_CHANGE', bVipDelivery: vipDelivery })
    }
  },
  handleCheckdInvoice: (invo, vipDelivery) => dispatch(handleCheckdInvoice(invo, vipDelivery)),
  handleScrollTop:     e => dispatch(handleScrollTop(e)),
})

const mapFunToComponent  = (dispatch, state) => ({
  componentWillMount: () => {
    const { isFromRestDetail } = state
    if (!isFromRestDetail) {
      dispatch({ type: 'CHANGE_OFFSET', offset: 0 })
      dispatch({ type: 'GET_CATEGORY', restList: [] })
      dispatch(handleOrderbyChange(1))
    }
    if (!state.categoryId) {
      const categoryId = parseQuery(location.search).categoryId
      dispatch({ type: 'GO_FILTER', categoryId })
    }
  },
  componentDidMount: () => {
    const { isFromRestDetail, oldScrollTop } = state
    if (document.querySelector('.wrap') && isFromRestDetail) {
      document.querySelector('.wrap').scrollTop = oldScrollTop
    }
    Mask.closeAll()
  },
  componentWillUnmount: () => {
    dispatch({ type: 'RESTAURANT_INFO', isFromRestDetail: 0 })
    dispatch({ type: 'CHANGE_OFFSET', offset: 0 })
    dispatch(handleShowFilter(0))
  },
})

export default
  connect(mapStateToProps, mapDispatchToProps)(
    wrap(mapFunToComponent)(Filter)
  )
