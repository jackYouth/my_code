import { connect }     from 'react-redux'
import { parseQuery, getStore }  from '@boluome/common-lib'
import { wrap, Mask }        from '@boluome/oto_saas_web_app_component'
import { browserHistory } from 'react-router'
import { login } from 'business'
import { Toast } from 'antd-mobile'
import Detail          from '../components/details'
import { handleFetchDetail, showAllRooms, handleDateChange } from '../actions/details'

const mapStateToProps = ({ app, condition, hotelList, detail, order }) => {
  return {
    ...app,
    ...condition,
    ...hotelList,
    ...detail,
    ...order,
  }
}

const mapDispatchToProps = dispatch => ({
  dispatch,
  showAllRooms:     id => dispatch(showAllRooms(id)),
  handleDateChange: date => {
    const { currentCityId = getStore('currentCityId'), startDate = getStore('dateInfo') ? getStore('dateInfo').startDate : '', endDate = getStore('dateInfo') ? getStore('dateInfo').endDate : '', chooseCity = {} } = date
    const search = parseQuery(location.search)
    const { id } = search
    const HotelIds = String(id)
    const posts = {
      HotelIds,
      channel:       getStore('channel'),
      ArrivalDate:   startDate,
      DepartureDate: endDate,
      cityId:        !chooseCity.id ? currentCityId : chooseCity.id,
    }
    dispatch(handleDateChange(date))
    dispatch(handleFetchDetail(posts))
  },
  goOrderPage: (hotelId, roomId, planId, item, image) => {
    // console.log('hotelId, roomId, planId', hotelId, roomId, planId, item, image)
    dispatch({ type: 'RATE_INFO', rateInfo: item })
    dispatch({ type: 'IMG_LIST', images: image })
    dispatch({ type: 'PLAN_ID', planId })
    const customerUserId = getStore('customerUserId', 'session')
    if (customerUserId) {
      browserHistory.push(`/jiudian/order?hotelId=${ hotelId }&roomId=${ roomId }&planId=${ planId }`)
    } else {
      login(err => {
        if (err) {
          console.log('bindUser in jiudian service err', err)
          Toast.info(err, 2)
        } else {
          browserHistory.push(`/jiudian/order?hotelId=${ hotelId }&roomId=${ roomId }&planId=${ planId }`)
        }
      }, true)
    }
  },
})

const mapFunToComponent = (dispatch, state) => ({
  componentWillMount: () => {
    const { currentCityId = getStore('currentCityId'), chooseCity = {} } = state
    const dateInfo = getStore('dateInfo')
    let startDate = ''
    let endDate = ''
    if (dateInfo) {
      // const { startDate = '', endDate = '' } = dateInfo
      startDate = dateInfo.startDate
      endDate = dateInfo.endDate
    }
    const search = parseQuery(location.search)
    const { id, orderCityId } = search
    const HotelIds = String(id)
    dispatch({ type: 'HOTEL_ID', hotelId: HotelIds })
    const postData = {
      HotelIds,
      channel:       getStore('channel'),
      ArrivalDate:   startDate,
      DepartureDate: endDate,
      cityId:        !orderCityId ? !chooseCity.id ? currentCityId : chooseCity.id : orderCityId,
    }
    if (orderCityId) {
      dispatch({ type: 'IS_DETAIL', isFromDetail: true, orderCityId })
    } else {
      dispatch({ type: 'IS_DETAIL', isFromDetail: true })
    }
    dispatch(handleFetchDetail(postData))
    dispatch({ type: 'CLEAN_SOME' })
  },
  componentWillUnmount: () => {
    dispatch({ type: 'HOTEL_DETAIL', hotelDetail: {} })
    dispatch({ type: 'IS_LOADED', isLoaded: false })
    Mask.closeAll()
  },
})

export default
connect(mapStateToProps, mapDispatchToProps)(
  wrap(mapFunToComponent)(Detail)
)
