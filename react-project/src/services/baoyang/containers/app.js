import { connect }    from 'react-redux'
import { browserHistory } from 'react-router'
import { wrap, Loading, Mask } from '@boluome/oto_saas_web_app_component'
import { Login, getLocationGaode } from 'business'
import { getStore, setStore } from '@boluome/common-lib'
import { fetchShop, changeAddress }  from '../actions/app'
import App            from '../components/app'


const mapStateToProps = ({ app }) => {
  const { offset, channel, currentAddress, point, nolocation } = app
  return {
    currentAddress,
    fetchData: {
      ...point,
      channel,
    },
    offset,
    nolocation,
  }
}

const mapDispatchToProps = dispatch => ({
  dispatch,
  handleFetchShop: (limit, offset, fetchData, onSuccess) => {
    fetchShop({ limit, offset, ...fetchData }, data => {
      console.log(offset + data.length)
      if (data.length !== 0) {
        dispatch({ type: 'UPDATE_OFFSET', offset: offset + data.length })
      }
      onSuccess(data)
    })
  },
  handleChangeAddress: reply => {
    // console.log('reply----', reply)
    let { address } = reply
    // const { title, point } = reply
    const { title, location } = reply
    const { lat, lng } = location
    const currentPoint = { longitude: lng, latitude: lat }
    address = address.replace(/[ ]/g, '')
    setStore('currentAddress', address, 'session')
    setStore('geopoint', currentPoint, 'session')
    dispatch(changeAddress({
      currentAddress: address || title,
      point:          currentPoint,
      offset:         0,
    }))
    dispatch({ type: 'NOLOCATION', nolocation: false })
  },
  handleShopClick: shop => {
    const { shopId } = shop
    dispatch({ type: 'UPDATE_OFFSET', offset: 0 })
    setStore('currentShop', shop, 'session')
    browserHistory.push(`/baoyang/${ shopId }/detail`)
  },
  handleGoderDetails: () => {
    browserHistory.push('/baoyang/orderDetails')
  },
})

const mapFunToComponent  = dispatch => ({
  componentWillMount: () => {
    Login(err => {
      if (err) {
        console.log('用户绑定失败')
      } else {
        console.log('用户绑定成功')
      }
    }, true)
    getLocationGaode(err => {
      // 定位成功
      const handleClose = Loading()
      if (err) {
        const currentAddress = '上海'
        const point          = { latitude: '31.23037', longitude: '121.4737' }
        setStore('currentAddress', currentAddress, 'session')
        setStore('geopoint', point, 'session')
        dispatch({ type: 'UPDATE_SHOP', shop: {} })
        dispatch(changeAddress({
          currentAddress,
          point,
        }))
        dispatch({ type: 'UPDATE_OFFSET', offset: 0 })
        dispatch({ type: 'NOLOCATION', nolocation: true })
        Mask.closeAll()
      } else {
        handleClose()
        const currentAddress = getStore('currentAddress', 'session')
        const point          = getStore('geopoint', 'session')
        console.log('log in unionLogin', currentAddress, point)
        dispatch({ type: 'UPDATE_SHOP', shop: {} })
        dispatch(changeAddress({
          currentAddress,
          point,
        }))
        dispatch({ type: 'UPDATE_OFFSET', offset: 0 })
        dispatch({ type: 'NOLOCATION', nolocation: false })
        Mask.closeAll()
      }
      handleClose()
    })
    // unionLogin(() => {
    //   handleClose()
    //   const currentAddress = getStore('currentAddress', 'session')
    //   const point          = getStore('geopoint', 'session')
    //   console.log('log in unionLogin', currentAddress, point)
    //   dispatch({ type: 'UPDATE_SHOP', shop: {} })
    //   dispatch(changeAddress({
    //     currentAddress,
    //     point,
    //   }))
    //   dispatch({ type: 'UPDATE_OFFSET', offset: 0 })
    //   Mask.closeAll()
    // })
  },
  componentWillUnmount: () => {
    dispatch({ type: 'UPDATE_OFFSET', offset: 0, point: {} })
  },
})

export default
connect(mapStateToProps, mapDispatchToProps)(
  wrap(mapFunToComponent)(App)
)
