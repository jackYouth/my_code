import { browserHistory } from 'react-router'
import { getStore, setStore } from '@boluome/common-lib'
import { Loading }   from '@boluome/oto_saas_web_app_component'
import { Toast } from 'antd-mobile'
import moment from 'moment'
import { get, send } from 'business'

export const feachCarPrice = (data) => dispatch => {
  console.log('data', data)
  let userId = getStore('customerUserId','session')
  const { city , date , distance , currentCity, chooseResult, chooseHistory } = data
  const { wholeModelName } = chooseResult ? chooseResult : chooseHistory
  let regDate = moment(date).format('YYYY-MM')

  let channelCityId
  let channelCityName
  if ( city && city.channelCityId ){
    channelCityId = city.channelCityId
    channelCityName = city.name
  } else {
    channelCityId = currentCity.channelCityId
    channelCityName = currentCity.name
  }

  let modelId = typeof chooseResult !== 'undefined' ? chooseResult.carModelId : chooseHistory.carModelId

  let postData = {
    'userId' : userId,
    'modelId': modelId,
    'regDate': regDate,
    'mile'   : distance/10000,
    'cityId' : channelCityId,
    'title'  : wholeModelName,
    'cityName': channelCityName,
    'chooseResult' : typeof chooseResult !== 'undefined' ? JSON.stringify(chooseResult) : JSON.stringify(chooseHistory)
  }

  const handleClose = Loading()
  get('/chegu/v1/car/price' , postData)
  .then(({ code, data = {}, message }) => {
    if(code === 0) {
      if(data.price){
        dispatch({
          type: 'FEACH_CARPRICE',
          carPrice: data
        })
        browserHistory.push('/chegu/result')
      } else {
        Toast.info('没有相关车辆信息',2)
      }
    } else {
      Toast.info(message,2)
    }
    handleClose()
  }).catch(err => {
    handleClose()
    console.log(err);
    Toast.info('价格信息请求失败',2)
  })
}
