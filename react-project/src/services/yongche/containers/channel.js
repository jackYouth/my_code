/*
  页面编写注意事项：
  1， 先存经纬度对象，在存地址，因为每一次dispatch都会刷新一次组件，在component中，是先判断地址，如果地址存在，直接用经纬度，所以为了避免报错，要先存经纬度

*/

import { connect } from 'react-redux'
import { wrap }    from '@boluome/oto_saas_web_app_component'
import { setStore, getStore } from '@boluome/common-lib'

import Channel from '../components/channel'
import { getNearbyProduct, getNearbyCar } from '../actions/product.js'

const mapStateToProps = ({ channel }) => {
  return {
    ...channel,
  }
}


// 清空已选择地址等信息
const clearInfo = dispatch => {
  // dispatch({ type: 'SET_START_POINT_OBJ', startPointObj: {} })
  // dispatch({ type: 'SET_START_POINT_STR', startPointStr: '' })
  dispatch({ type: 'SET_END_POINT_OBJ', endPointObj: {} })
  dispatch({ type: 'SET_END_POINT_STR', endPointStr: '' })
  // dispatch({ type: 'SET_CURRENT_DATE', currentDate: '' })
  // dispatch({ type: 'SET_CURRENT_PASSENGER', currentPassenger: '换乘车人' })
  dispatch({ type: 'SET_NEARBY_CAR', currentCarInfo: '' })
  dispatch({ type: 'SET_ESTIMATA', estimate: '' })
}

const mapDispatchToProps = dispatch => {
  return {
    dispatch,
    handleTabClick(channel) {
      setStore('channel', channel, 'session')
      const { latitude, longitude } = getStore('defaultPointObj', 'session')
      // 获取附近可用产品类型
      const productPara = {
        channel,
        latitude,
        longitude,
      }
      dispatch(getNearbyProduct(productPara))
      dispatch(getNearbyCar())
      clearInfo(dispatch)
    },
  }
}


const mapFunToComponent  = () => ({
  componentDidMount() {
    // 将默认的channel存在session中
    setStore('channel', 'didi', 'session')
    // getLocation(() => {
    //   // 将默认地址设为北京的         mockdata
    //   setStore('geopoint', { latitude: '39.910873', longitude: '116.413677' }, 'session')
    //   setStore('currentPosition', { streetNumber: '2号-10号楼-403号', street: '正义路', district: '东城区', city: '北京市', province: '北京市' }, 'session')
    //
    //   const geopoint = getStore('geopoint', 'session')
    //   const currentname = getStore('currentPosition', 'session').city
    //   dispatch({ type: 'SET_CURRENT_CITY', currentname })
    //   // 获取附近可用产品类型，选择第一个添加到路径中
    //   const productPara = {
    //     latitude:  geopoint.latitude,
    //     longitude: geopoint.longitude,
    //   }
    //   dispatch(getNearbyProduct(productPara))
    // })
  },
})


export default
connect(mapStateToProps, mapDispatchToProps)(
  wrap(mapFunToComponent)(Channel)
)
