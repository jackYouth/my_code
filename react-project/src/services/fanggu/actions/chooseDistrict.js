import { get , getStore , setStore} from '@boluome/common-lib';
import { Loading }   from '@boluome/oto_saas_web_app_component'
import { Modal } from 'antd-mobile';

let searchHistory = getStore('searchHistory' , 'session')
let historyArr = searchHistory ? searchHistory : []

const alert = Modal.alert;

export const feachDistrict = key => dispatch => {
  let city = sessionStorage.chooseCity

  if(!city){
    city = getStore('currentPosition','session').city.replace(/["省", "市", "区", "县"]/, "")
  }

  //let key = data
  // console.log('key=========',key);
  let lists = []

  if(key){
    let urls = '/fanggu/v1/city/:city/filter/:filter/position'
               .replace(/:city/g, city)
               .replace(/:filter/g, key)

    const handleClose = Loading()
    get(urls)
    .then(({ code, data = {}, message }) => {
      if(code === 0) {
        dispatch({
          type: 'FEACH_DISTRICT',
          districtList: data
        })
      } else {
        console.log(message)
      }
      handleClose()
    }).catch(err => {
      console.log(err)
      handleClose()
    })
  } else {
    dispatch({
      type: 'FEACH_DISTRICT',
      districtList: []
    })
  }
}

export const confirmDistrict = (residentialareaName, address) => {
    if(residentialareaName){
      historyArr.push(residentialareaName)
    }
    let newArr = []
    historyArr.map((item ,index)=>{
      if(newArr.indexOf(item) == -1) {
        newArr.push(item);
      } else {
        newArr.push(item);
        newArr.splice(newArr.indexOf(item),1)
      }
    })
    setStore('searchHistory',newArr,'session')
    setStore('buildingName' , residentialareaName ,'session')
    return {
      type: 'CONFIRM_DISTRICT',
      address,
      residentialareaName
    }

}
