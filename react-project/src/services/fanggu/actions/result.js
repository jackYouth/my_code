import { get, getStore} from '@boluome/common-lib';
import { Loading }   from '@boluome/oto_saas_web_app_component'
import { Toast } from 'antd-mobile';

let city
if(sessionStorage.chooseCity){
  city = sessionStorage.chooseCity
} else {
  city = getStore('currentPosition','session').city.replace(/["省", "市", "区", "县"]/, "")
}

export const feachDistrictPrice = (data) => dispatch => {
  // let postData = {
  //   area: 123,
  //   floorBuilding: '默认楼栋',
  //   builtedTime: 2010,
  //   floor: 2,
  //   totalfloor: 8,
  //   toward: '南'
  // }
  // let urls = '/fanggu/v1/city/:city/filter/:filter/valuation'
  // urls = urls.replace(/:city/g,'上海')
  // urls = urls.replace(/:filter/g,'佘山珑原有间墅')
  let postData = {
    area: data.area,
    floorBuilding: data.buildingName,
    builtedTime: new Date(data.year._d).getFullYear(),
    floor: data.floor,
    totalfloor: data.sumFloor,
    toward: data.cx
  }
  let urls = '/fanggu/v1/city/:city/filter/:filter/valuation'
  urls = urls.replace(/:city/g,city)
  urls = urls.replace(/:filter/g,sessionStorage.buildingName)
  const handleClose = Loading()
  get( urls , postData )
  .then(({ code, data = {}, message }) => {
    if(code === 0) {
      dispatch({
        type: 'FEACH_DISTRICTPRICE',
        information: data
      })
      dispatch(feachFacility(data.residentialareaName))
    } else {
      console.log(message)
    }
    handleClose()
  }).catch(err => {
    handleClose()
    Toast.info('价格信息请求失败',2)
  })
}

export const feachFacility = (residentialareaName) => dispatch => {
  let urls = '/fanggu/v1/city/:city/filter/:filter/periphery'
  // urls = urls.replace(/:city/g,'上海')
  // urls = urls.replace(/:filter/g,'佘山珑原有间墅')
  urls = urls.replace(/:city/g,city)
  urls = urls.replace(/:filter/g,sessionStorage.buildingName)
  const handleClose = Loading()
  get(urls)
  .then(({ code, data = {}, message }) => {
    if(code === 0) {
      dispatch({
        type: 'FEACH_FACILITY',
        facilityInfor: data
      })
    } else {
      Toast.info(message)
    }
    handleClose()
  }).catch(err => {
    handleClose()
    console.log(err)
  })
}
