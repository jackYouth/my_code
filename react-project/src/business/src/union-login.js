// import getLocation from './get-location'
import getLocationGaode from './get-location-gaode'
import login from './login'
// 联合登陆
export default (
  callback => {
    login(err => {
      if (err) {
        callback(err)
      } else {
        // getLocation(callback)  // 2017-11-01 这里注释主要是更换为高德地图
        getLocationGaode(callback)
      }
    })
  }
)
