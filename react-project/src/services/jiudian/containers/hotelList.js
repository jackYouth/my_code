import { connect }     from 'react-redux'
import { getStore }    from '@boluome/common-lib'
import { wrap }        from '@boluome/oto_saas_web_app_component'
import { fetchHotels, handlePaixuChange, handleShaixuan, handleWeizhi, handleScrollTop } from '../actions/hotelList'
import { handlePriceFilter, cleanChooseConditions } from '../actions'
import closeMask from '../components/closeMask'
import HotelList       from '../components/hotelList'

const mapStateToProps = ({ app, condition, hotelList }) => {
  const { HighRate, LowRate, StarRate, DistanceType = 0 } = app
  const { chooseConditions = {} } = condition
  const { PageIndex = 1, Sort = 'Default', BrandId = [], Facilities = [], ThemeIds = [], Zone = '', DistrictId = '' } = hotelList
  const { startDate, endDate } = getStore('dateInfo')
  const currentCityId = getStore('currentCityId')
  const chooseCity = getStore('chooseCity', 'session') || {}
  const { latitude, longitude } = getStore('geopoint', 'session') || {}
  const lat = latitude
  const lng = longitude

  // console.log('PageIndex---------->', PageIndex)
  const fetchData = {
    ArrivalDate:   startDate,
    DepartureDate: endDate,
    CityId:        chooseCity.id || currentCityId,
    PageSize:      20,
    BrandId:       BrandId.length > 0 ? BrandId.join() : '',
    Facilities:    Facilities.length > 0 ? Facilities.join() : '',
    ThemeIds:      ThemeIds.length > 0 ? ThemeIds.join() : '',
    lng:           Number(DistanceType) === 0 ? lng : '',
    lat:           Number(DistanceType) === 0 ? lat : '',
    QueryText:     !chooseConditions.name ? '' : chooseConditions.name,
    mapType:       Number(DistanceType) === 0 ? 'gaode' : '',
    channel:       getStore('channel'),
    DistanceType,
    PageIndex,
    Sort,
    Zone,
    DistrictId,
    StarRate,
    LowRate,
    HighRate,
  }
  return {
    ...app,
    ...condition,
    ...hotelList,
    fetchData,
  }
}

const mapDispatchToProps = dispatch => ({
  dispatch,
  handleFetchMore: (limit, offset, fetchData, onSuccess, oldList = []) => {
    // console.log('fetchData-=-==--==--==--=', fetchData)
    fetchHotels({ ...fetchData, offset }, data => {
      if (data.length > 0) {
        let { PageIndex = 1 } = fetchData
        const restList = JSON.parse(JSON.stringify(oldList))
        restList.push(...data)
        dispatch({ type: 'REST_LIST', restList })
        dispatch({ type: 'CHANGE_OFFSET', offset: offset + data.length })
        dispatch({ type: 'CHANGE_PAGEINDEX', PageIndex: ++PageIndex })
        onSuccess(data)
      } else {
        const empty = []
        onSuccess(empty)
      }
    })
  },
  handlePaixuChange:     val => dispatch(handlePaixuChange(val)),
  handleShaixuan:        val => dispatch(handleShaixuan(val)),
  handleWeizhi:          val => dispatch(handleWeizhi(val)),
  handlePriceFilter:     data => dispatch(handlePriceFilter(data)),
  handleScrollTop:       e => dispatch(handleScrollTop(e)),
  cleanChooseConditions: () => dispatch(cleanChooseConditions()),
})

const mapFunToComponent = (dispatch, state) => ({
  componentWillMount: () => {
    const { isFromDetail } = state
    if (!isFromDetail) {
      dispatch({ type: 'CHANGE_OFFSET', PageIndex: 1, offset: 0 })
      dispatch({ type: 'WEIZHI_DATA', DistrictId: '', Zone: '', Sort: '', BrandId: '', Facilities: '', ThemeIds: '' })
    }
  },
  componentDidMount: () => {
    const { isFromDetail, oldScrollTop } = state
    if (isFromDetail) {
      // console.log('yes', state)
      document.querySelector('.list').scrollTop = oldScrollTop
      console.log('yes2-=-=--=-=-=', document.querySelector('.list').scrollTop)
    } else {
      // console.log('no')
      document.querySelector('.list').scrollTop = 0
    }
  },
  componentWillUnmount: () => {
    // console.log('indexPage Will Unmount')
    // dispatch({ type: 'CHANGE_OFFSET', offset: 0 })
    dispatch({ type: 'FETCH_DATA', fetchData: {} })
    closeMask()
    // dispatch({ type: 'WEIZHI_DATA', DistrictId: '', Zone: '', Sort: '', BrandId: '', Facilities: '', ThemeIds: '' })
  },
})

export default
connect(mapStateToProps, mapDispatchToProps)(
  wrap(mapFunToComponent)(HotelList)
)
