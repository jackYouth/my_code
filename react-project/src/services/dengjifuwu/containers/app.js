import { connect }            from 'react-redux'
import { wrap, Mask, Loading }               from '@boluome/oto_saas_web_app_component'
import { getStore, setStore }           from '@boluome/common-lib'
import { login, getLocationGaode } from 'business'
// import coordtransform from 'coordtransform'
import App                    from '../components/app'
import { getAllData, handleChooseAirport, handleAirport, handleThisData, handleAreaInfo, handleChooseTerminal, handleChooseInternational } from '../actions/index'

const mapStateToProps = ({ app }) => ({ ...app })

const mapDispatchToProps = dispatch => ({
  dispatch,
  // handleAreaInfo: (v, channel, airportId, type) => {
  //   // dispatch(handleAirport(v, channel))
  //   dispatch(handleAreaInfo(v, channel, airportId, type))
  // },
  handleAirport: (v, channel, props) => {
    const { airportInfo = {}, loungeArr = [], aisleArr = [] } = props
    const { airportId = '', type = [] } = airportInfo
    if (v === '1') {
      setStore('serverType', 'lounge', 'session')
    } else {
      setStore('serverType', 'aisle', 'session')
    }
    if (!airportId) {
      dispatch(handleAirport(v, channel, props))
    } else {
      console.log('airportId', airportId, type)
      const serverType = getStore('serverType', 'session')
      const thisServerArr = serverType === 'lounge' ? loungeArr : aisleArr
      const thisAirportType = thisServerArr.filter(i => { return i.airportId === airportId }).length > 0 ? thisServerArr.filter(i => { return i.airportId === airportId })[0].type : []
      console.log('thisAirportType', thisAirportType, thisServerArr)
      // dispatch(handleAreaInfo(v, channel, airportId, thisAirportType))
      if (thisAirportType.length > 0) {
        dispatch(handleAreaInfo(v, channel, airportId, thisAirportType))
      } else {
        dispatch({
          type:     'AREA_INFO',
          areaInfo: [],
        })
      }
    }
  },
  handleThisData:            thisData => dispatch(handleThisData(thisData)),
  handleChooseTerminal:      chooseTerminal => dispatch(handleChooseTerminal(chooseTerminal)),
  handleChooseInternational: chooseInternational => dispatch(handleChooseInternational(chooseInternational)),
  handleChooseAirport:       (result, channel) => {
    dispatch(handleChooseTerminal(['全部航站楼']))
    dispatch(handleChooseInternational(['全部出发区域']))
    dispatch(handleChooseAirport(result, channel))
  },
})

const mapFunToComponent  = (dispatch, state) => ({
  componentWillMount: () => {
    console.log('state', state)
    document.title = '空港易行'
    const customerUserId = getStore('customerUserId', 'session')
    const { channel, airportInfo = {} } = state
    const handleClose = Loading()
    if (!customerUserId) {
      login(err => {
        if (err) {
          console.log('login err', err)
          handleClose()
        } else {
          getLocationGaode(errs => {
            if (errs) {
              // 定位失败，给默认值--上海
              console.log('getLocation err', errs)
              setStore('geopoint', { latitude: 31.27021, longitude: 121.47113 }, 'session')
              dispatch(handleAirport('1', channel))
              dispatch(getAllData())
              handleClose()
              Mask.closeAll()
            } else if (!airportInfo.airportId) {
              handleClose()
              dispatch(handleAirport('1', channel))
              dispatch(getAllData())
              // const geopoint = getStore('geopoint', 'session')
              // geopoint.latitude = coordtransform.gcj02tobd09(geopoint.latitude, geopoint.longitude)[0]
              // geopoint.longitude = coordtransform.gcj02tobd09(geopoint.latitude, geopoint.longitude)[1]
              // setStore('geopoint', geopoint, 'session')
            }
          })
        }
      })
    } else {
      getLocationGaode(err => {
        if (err) {
          // 定位失败，给默认值--上海
          console.log('getLocation err', err)
          setStore('geopoint', { latitude: 31.27021, longitude: 121.47113 }, 'session')
          dispatch(handleAirport('1', channel))
          dispatch(getAllData())
          handleClose()
          Mask.closeAll()
        } else if (!airportInfo.airportId) {
          handleClose()
          dispatch(handleAirport('1', channel))
          dispatch(getAllData())
        }
      })
    }
  },
})

export default
connect(mapStateToProps, mapDispatchToProps)(
  wrap(mapFunToComponent)(App)
)
