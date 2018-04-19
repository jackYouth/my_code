import { connect }            from 'react-redux'
import { wrap, Loading }      from '@boluome/oto_saas_web_app_component'
import { Toast }              from 'antd-mobile'
import { login, getLocationGaode } from 'business'
import { getStore, setStore }           from '@boluome/common-lib'
import { handleCityData, myPosition, handlePriceFilter, handleCurrAddr, handleCurrCity, cleanChooseConditions } from '../actions/index'
import App                    from '../components/app'


const mapStateToProps = ({ app, condition }) => ({ ...app, ...condition })

const mapDispatchToProps = dispatch => ({
  dispatch,
  handleCityData:        data => dispatch(handleCityData(data)),
  myPosition:            () => dispatch(myPosition()),
  handlePriceFilter:     data => dispatch(handlePriceFilter(data)),
  cleanChooseConditions: () => dispatch(cleanChooseConditions()),
  setChannel:            info => {
    const { brandCode = 'ctrip' } = info
    const currentPosition = getStore('currentPosition', 'session')
    setStore('channel', brandCode)
    dispatch({ type: 'SET_CHANNEL', channel: brandCode })
    dispatch(handleCurrCity(currentPosition))
  },
  myClick:               cb => {
    const customerUserId = getStore('customerUserId', 'session')
    // console.log(cb)
    if (customerUserId) {
      // Toast.info('do not login', 2)
      cb()
    } else {
      login(err => {
        if (err) {
          Toast.info(err, 2)
        } else {
          // Toast.info('login success', 2)
          cb()
        }
      }, true)
    }
  },
})

const mapFunToComponent  = dispatch => ({
  componentWillMount: () => {
    dispatch({ type: 'IS_DETAIL', isFromDetail: false })
    const customerUserId = getStore('customerUserId', 'session')
    if (!customerUserId) {
      login(err => {
        if (err) {
          console.log('login err', err)
        } else {
          const position = getStore('currentPosition', 'session')
          if (!position) {
            const handleClose = Loading()
            getLocationGaode(errs => {
              if (errs) {
                console.log('jiudian getLocationGaode err1---->', errs)
                dispatch(handleCurrCity({ city: '上海市' }))
                setStore('geopoint', { latitude: 31.27021, longitude: 121.47113 }, 'session')
                handleClose()
              } else {
                const currentAddress = getStore('currentAddress', 'session')
                const currentPosition = getStore('currentPosition', 'session')
                dispatch(handleCurrAddr(currentAddress))
                dispatch(handleCurrCity(currentPosition))
                handleClose()
              }
            })
          }
        }
      })
    }
  },
  componentDidMount: () => {
    const dateInfo = getStore('dateInfo')
    dispatch({ type: 'DATE_INFO', dateInfo })
  },
  componentWillUnmount: () => {
    dispatch({ type: 'CHANGE_PAGEINDEX', PageIndex: 1 })
  },
})

export default
connect(mapStateToProps, mapDispatchToProps)(
  wrap(mapFunToComponent)(App)
)
