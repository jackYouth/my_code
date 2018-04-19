import { parseLocName, setStore, getStore } from '@boluome/common-lib'
import { get } from 'business'
import { Loading } from '@boluome/oto_saas_web_app_component'

export const handleCityData = chooseCity => {
  setStore('chooseCity', chooseCity, 'session')
  return {
    type:         'CITY_DATA',
    chooseCity,
    DistanceType: 1,
  }
}

export const myPosition = () => {
  setStore('chooseCity', '', 'session')
  return {
    type:         'CITY_DATA',
    chooseCity:   {},
    DistanceType: 0,
  }
}

export const cleanChooseConditions = () => {
  return {
    type:             'CHOOSE_CONDITIONS',
    chooseConditions: {},
    offset:           0,
  }
}

export const handlePriceFilter = priceFilterData => {
  console.log('priceFilterData', priceFilterData)
  const a = priceFilterData[0]
  const b = priceFilterData[1]
  let StarRate
  let LowRate
  let HighRate
  switch (a) {
    case '五星／豪华型':
      StarRate = 5
      break
    case '四星／高档型':
      StarRate = 4
      break
    case '三星／舒适型':
      StarRate = 3
      break
    case '二星以下／经济':
      StarRate = 2
      break
    default:
      StarRate = ''
  }
  switch (b) {
    case '¥150以下':
      LowRate = 0
      HighRate = 150
      break
    case '¥150-300':
      LowRate = 150
      HighRate = 300
      break
    case '¥301-450':
      LowRate = 301
      HighRate = 450
      break
    case '¥451-600':
      LowRate = 451
      HighRate = 600
      break
    case '¥601-1000':
      LowRate = 601
      HighRate = 1000
      break
    case '¥1000以上':
      LowRate = 1001
      HighRate = 1000000
      break
    default:
      LowRate = ''
      HighRate = ''
  }
  return {
    type:      'PRICEFILTER_DATA',
    PageIndex: 1,
    priceFilterData,
    offset:    0,
    StarRate,
    LowRate,
    HighRate,
  }
}

export const handleCurrAddr = currentAddress => {
  return {
    type: 'CURRENT_ADDRESS',
    currentAddress,
  }
}

export const handleCurrCity = (currentCityInfo = {}) => dispatch => {
  const handleClose = Loading()
  console.log('currentCityInfo-------->', currentCityInfo)
  // const { city = '上海' } = currentCityInfo
  let city = '定位中'
  let currentCityName
  if (currentCityInfo && currentCityInfo.city) {
    city = currentCityInfo.city
    currentCityName = parseLocName(city)
  } else {
    currentCityName = '上海'
  }
  let currentCityId
  get(`/jiudian/v1/cities/${ currentCityName }/id`, { channel: getStore('channel'), name: currentCityName })
  .then(({ code, data = {}, message }) => {
    if (code === 0) {
      currentCityId = data
      setStore('currentCityId', currentCityId)
      dispatch({
        type: 'CURRENT_CITY',
        currentCityId,
        currentCityInfo,
        currentCityName,
      })
    } else {
      console.log(message)
    }
    handleClose()
  }).catch(err => {
    handleClose()
    console.log('handleCurrCity', err)
  })
}
