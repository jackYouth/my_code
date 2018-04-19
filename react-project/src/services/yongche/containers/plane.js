/*
  页面编写注意事项：
  1， 先存经纬度对象，在存地址，因为每一次dispatch都会刷新一次组件，在component中，是先判断地址，如果地址存在，直接用经纬度，所以为了避免报错，要先存经纬度

  2,  页面起终点保存时，加上productType，这样，当切换product时，就可以直接使用对应保存的起终点对象，不会出现变量使用混乱的情况
  起终点对象的保存格式: startPointObj${ productType }
  当前选中的地址对象的保存格式：start_selectedCity${ productType }

  接口中用到经纬度的；
    1，获取附近产品类型
    2，预估价
    3，下单
*/

import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import { wrap, Loading, Mask }    from '@boluome/oto_saas_web_app_component'
import { getStore, setStore, removeStore, moment, week } from '@boluome/common-lib'
import { Toast } from 'antd-mobile'
import { merge } from 'ramda'
import { getLocation, login } from 'business'

import Plane from '../components/plane'
import { getIndexInit, getEstimate, getNearbyCar, checkOrder, createOrder, setStartPoint, setStartPointInAirport } from '../actions/product'

// const day = ['今天', '明天', '后天']
// getMins用户获取传入分钟 - 50之间所有的10的倍数的分钟数
const getMins = m => {
  const mins = []
  m = Math.ceil(m / 10)
  for (let i = m; i < 6; i++) {
    let mItem = i * 10
    if (i === 0) mItem = '00'
    mins.push(mItem)
  }
  return mins
}
// getHours用户获取传入时间 - 23之间所有的小时
const getHours = (hour, isToday = false) => {
  const h = parseFloat(hour.split(':')[0])
  const m = parseFloat(hour.split(':')[1])

  // 是今天
  // 如果是今天，要区分出现在，和第一个时间的节点，是在20之前，还是之后，分别对应两种方式。
  if (isToday) {
    const hours = [[], { h: '现在', mins: [] }]
    let newM = '00'
    for (let i = h; i < 24; i++) {                // 31分钟是一个时间节点，因为31会进到40，40加20就会进入下一时段，所以只有当为当前时间点且在31分钟及以后时，该整点，不记在时间列表内，并不去获取分钟
      if (i === h && m < 31) {                    // 当为当前时间，且分钟在31以内时，将当前时针加入列表，并获取当前时间31分钟以后的整十时刻
        const curM = (Math.ceil(m / 10) * 10) + 20
        hours.push({ h: i, mins: getMins(curM) })
      }
      if (i === h && m >= 31) {                   // 如果是当前时间点且在31分钟及以后时，该整点，不记在时间列表内，且下一个整点的分钟，从该时间点+20-60，再取十整数得到
        newM = (Math.ceil(m / 10) * 10) - 40
      }
      if (i === h + 1) {                          // 当不是当前时间时，将时针加入列表，并获取00分钟以后的整十时刻
        hours.push({ h: i, mins: getMins(newM) })
      }
      if (i > h + 1) {                            // 当不是当前时间时，将时针加入列表，并获取00分钟以后的整十时刻
        hours.push({ h: i, mins: getMins('00') })
      }
    }
    return hours
  }

  // 不是今天
  const hours = [[]]
  for (let i = 0; i < 24; i++) {
    hours.push({ h: i, mins: getMins('00') })
  }
  return hours
}

// getCurrentHour ： 获取当前时间，并格式化成 hh:mm的形式
const getCurrentHour = () => {
  // 格式化日期
  const d = new Date()
  const hour = moment('HH:mm')(d)
  return getHours(hour, true)
}

// getDays：用于组装今天，明天，后天的时间节点
const getDays = () => {
  // 定义联动第一级需要使用的数据
  const date1 = moment('YYYY-MM-DD')(new Date())
  const date2 = moment('YYYY-MM-DD')(new Date((new Date()).getTime() + (1000 * 60 * 60 * 24)))
  const date3 = moment('YYYY-MM-DD')(new Date((new Date()).getTime() + (1000 * 60 * 60 * 24 * 2)))
  const date4 = moment('YYYY-MM-DD')(new Date((new Date()).getTime() + (1000 * 60 * 60 * 24 * 3)))
  const datas = [[]]
  datas.push({ d: '今天', dValue: date1, hours: getCurrentHour() })
  datas.push({ d: '明天', dValue: date2, hours: getHours('00:00') })
  datas.push({ d: '后天', dValue: date3, hours: getHours('00:00') })
  const channel = location.pathname.split('/')[2]
  // 如果是神州的，出发时间需要加上第四天的数据
  if (channel === 'shenzhou') datas.push({ d: week()(moment('day')(date4)), dValue: date4, hours: getHours('00:00') })
  return datas
}

const mapStateToProps = ({ product }) => {
  // 获取是否是一口价
  const isSinglePrice = getStore('isSinglePrice', 'session')
  // 获取channel
  const channel = getStore('channel', 'session')
  // isStartTimes2表示当前是否是神州接机且有航班号的情况，如果是，则改变isStartTimes2, defaultCurrentDate, datePickerExtra,
  const { isStartTimes2 } = product
  // 获取时间三级联动数据源
  const timeDatas = getDays()
  let startTimes = timeDatas.reduce((preValue1, { d, dValue, hours }) => {
    preValue1.push({
      label:    d,
      value:    dValue,
      children: hours.reduce((preValue2, { h, mins }) => {
        if (mins) {
          const mLabel = h === '现在' ? h : `${ h } 点`
          preValue2.push({
            label:    mLabel,
            value:    h,
            children: mins.map(item => ({
              label: `${ item } 分`,
              value: item,
            })),
          })
          return preValue2
        }
        return false
      }),
    })
    return preValue1
  })
  if (isStartTimes2) {
    const times = ['10', '20', '30', '40', '50', '60', '70', '80', '90']
    startTimes = [{
      label:    '到达后',
      value:    '到达后',
      children: times.map(item => ({ label: item, value: item, children: [{ label: '分钟', value: '分钟' }] })),
    }]
  }
  // 如果是滴滴，且是一口价，就删掉现在这个时间选项
  if (channel === 'didi' && isSinglePrice) {
    startTimes[0].children = startTimes[0].children.filter(o => o.label !== '现在')
    // 初始时，切换成送机，会直接去请求estimate接口，这时didi一口价不支持立即出发，所以要获取二十分钟后的时间
    const firstReverseTime = `${ startTimes[0].value } ${ startTimes[0].children[0].value }:${ startTimes[0].children[0].children[0].value }`
    setStore('firstReverseTime', firstReverseTime, 'session')
  }
  const startPointObj = getStore('defaultPointObj', 'session')

  return {
    ...product,
    showChannel: false,
    startTimes,
    isStartTimes2,
    isSinglePrice,
    channel,
    startPointObj,
  }
}

// 定义公用方法
// 清空已选择地址等信息
const clearInfo = dispatch => {
  // dispatch({ type: 'SET_START_POINT_OBJ', startPointObj: {} })
  // dispatch({ type: 'SET_START_POINT_STR', startPointStr: '' })
  dispatch({ type: 'SET_END_POINT_OBJ', endPointObj: {} })
  dispatch({ type: 'SET_END_POINT_STR', endPointStr: '' })
  dispatch({ type: 'SET_CURRENT_DATE', currentDate: '' })         // 避免接机时选中的是延误多少分钟，然后切换到非接机时也是延误多少分钟的现象
  // dispatch({ type: 'SET_CURRENT_PASSENGER', currentPassenger: '换乘车人' })
  dispatch({ type: 'SET_NEARBY_CAR', currentCarInfo: '' })
  dispatch({ type: 'SET_ESTIMATA', estimate: '' })
  dispatch({ type: 'SET_CURRENT_FLIGHT_NO', flightNo: '', flightDate: [''], defaultCurrentDate: ['今天', '现在'] })
  dispatch({ type: 'SET_IS_START_TIMES_2', isStartTimes2: false })
}


// 获取定位的一套默认配置
const geoLocationInit = () => dispatch => {
  // 开启一个loading
  const handleClose = Loading()
  const myGetLocation = () => getLocation(err => {
    if (err) {
      console.log('定位失败')
      setStore('localCity', '上海', 'session')
      dispatch({ type: 'SET_PRODUCT_SUPPORT_THIS_CITY', getLocationErr: true })
    } else {
      console.log('定位成功')
      // mockdata
      // 设置模拟的用户名，手机号
      // setStore('customerUserId', 'blm_test', 'session')
      // setStore('userPhone', '18255125485', 'session')
      // setStore('flightHistorys', ['MU7877', 'Mu1q3', 'Mu1q2223', 'Mu1q11', 'Mu1q13', 'Mu1q23', 'Mu1q33', 'Mu1q34'])

      // 测试环境模拟数据
      // if (location.orgin.indexOf('test') >= 0) {
      //   setStore('imei', '358565074359520', 'session')
      //   if (location.pathname.indexOf('didi') >= 0) {
      //     // 将默认地址设为北京的         mockdata
      //     setStore('geopoint', { latitude: '39.924455', longitude: '116.403438' }, 'session')
      //     setStore('currentPosition', { streetNumber: '2号-10号楼-403号', street: '正义路', district: '东城区', city: '北京市', province: '北京市' }, 'session')
      //   }
      // }

      // const geopoint = getStore('geopoint', 'session')
      let name = getStore('currentPosition', 'session').city
      name = name.replace('市', '')
      setStore('localCity', name, 'session')

      // 检查当前城市是否在支持的城市列表中，并获取当前城市对应的cityId，并将对象存入本地
      dispatch(getIndexInit(name, getStore('geopoint', 'session')))
      console.log('test', getStore('geopoint', 'session'))
      // 看是否有未支付和行程中的订单
      dispatch(checkOrder())
      // 定位失败的标记设为false
      dispatch({ type: 'SET_PRODUCT_SUPPORT_THIS_CITY', getLocationErr: false })
    }
    handleClose()
  })
  if (getStore('customerUserId', 'session')) {        // 别人订单页面，跳转到取消订单页面，在跳回到首页时，需要执行这一套
    myGetLocation()
  } else {
    login(error => {
      if (error) {
        console.log('login err')
      } else {
        myGetLocation()
      }
    })
  }
}

// 如果默认的startTimes改变，判断是否需要去请求一次getEstimate接口
const handleStartTimesChange = (canPlace, estimatePara, isStartTimes2, useDefaultDate = false) => dispatch => {
  // 该函数在改变产品类型，和输入航班号之后会调用
  // useDefaultDate: 当是通过改变产品类型，触发该函数时，对于选择到达多少分钟以后，使用用默认，通过航班号触发的时候，就使用已有的时间
  if (canPlace) {
    if (isStartTimes2) {
      if (useDefaultDate || !estimatePara.flightDelayTime) {
        estimatePara = merge(estimatePara)({ flightDelayTime: 30, departureTime: [''] })
      }
    } else {
      estimatePara = merge(estimatePara)({ flightDate: [''], flightNo: '', flightDelayTime: '', departureTime: ['今天', '现在'] })
    }
    dispatch(getEstimate(estimatePara))
  }
}

// 起、终点，运力类型，出发时间，航班号 等改变时，都需要重新请求一次预估价格接口
const mapDispatchToProps = dispatch => {
  return {
    dispatch,
    handleTabClick(channel) {
      const preChannel = getStore('channel', 'session')
      if (preChannel !== channel) {
        setStore('channel', channel, 'session')     // 在order-cancel_action中用到
        const Reg = new RegExp(preChannel, 'g')
        browserHistory.push(location.pathname.replace(Reg, channel))
        const name = getStore('localCity', 'session')
        const geopoint = getStore('geopoint', 'session')
        // 获取首页初始化配置
        dispatch(getIndexInit(name, geopoint))
        clearInfo(dispatch)
      }
    },
    handleReloadCity() {
      dispatch(geoLocationInit())
    },
    handleChangeCity(cityData) {
      const { name } = cityData
      window.AMap.service('AMap.Geocoder', () => {
        const geocoder = new window.AMap.Geocoder({
          radius:     1000,
          extensions: 'all',
        })
        geocoder.getLocation(name, (status, res) => {
          if (status === 'complete') {
            const { location } = res.geocodes[0]
            const geopoint = { latitude: location.lat, longitude: location.lng }
            setStore('geopoint', geopoint, 'session')
            // 根据城市名和经纬度，获取首页的默认配置
            dispatch(getIndexInit(name, geopoint))
            dispatch({ type: 'SET_PRODUCT_SUPPORT_THIS_CITY', getLocationErr: false })
          } else {
            console.log('城市名转化经纬度失败')
          }
        })
      })
    },
    handleChangeProduct(currentProduct, canPlace, props) {
      const preCurrentProduct = getStore('currentProduct', 'session')
      if (preCurrentProduct.code !== currentProduct.code) {
        dispatch({ type: 'SET_ESTIMATA', estimate: '' })
        setStore('currentProduct', currentProduct, 'session')
        dispatch({ type: 'SET_CURRENT_PRODUCT', currentProduct })
        // 改变时间格式, 当productType为7且有航班号时
        const productType = currentProduct.code
        if (productType === 7 && props.flightNo7) {
          dispatch({ type: 'SET_IS_START_TIMES_2', isStartTimes2: true })
          dispatch({ type: 'SET_CURRENT_FLIGHT_NO', defaultCurrentDate: ['到达后', '30', '分钟'] })
        } else {
          dispatch({ type: 'SET_IS_START_TIMES_2', isStartTimes2: false })
          dispatch({ type: 'SET_CURRENT_FLIGHT_NO', defaultCurrentDate: ['今天', '现在'] })
        }

        // 如果当前是接机模式，且没有当前productType的起点信息，就执行一次setStartPoint的命令，point和cityData用startPoint里面的
        if ((productType === 'jieji' || productType === 7) && !props[`startPointObj${ productType }`]) {
          const startPointObj = getStore('defaultPointObj', 'session')
          const { latitude, longitude, id, name, title, detail } = startPointObj
          dispatch(setStartPoint({ latitude, longitude }, productType, { id, name, title, detail }))
        }

        // 如果当前是送机模式，且没有当前productType的终点信息，就执行一次setEndPoint命令，point和cityData用startPoint里面的
        if ((productType === 'songji' || productType === 8) && !props[`endPointObj${ productType }`]) {
          const startPointObj = getStore('defaultPointObj', 'session')
          const { id, name, title, detail } = startPointObj
          dispatch(setStartPointInAirport('end', productType, { id, name, title, detail }))
        }

        // 如果当前起终点信息完善，那么肯定请求过estimate接口，把上一次的拿过来用一下，重新请求一次, 这里不能用endPointObj来判断，因为默认的是给了endPointObj
        if (props[`startPointStr${ productType }`] && props[`endPointStr${ productType }`]) {
          if (props[`estimatePara${ productType }`].rideType) {
            dispatch(getEstimate(props[`estimatePara${ productType }`]))
          } else {
            dispatch(getNearbyCar(props[`estimatePara${ productType }`]))
          }
        }
      }
    },
    handleChangeCar(currentCarInfo, canPlace, estimatePara) {
      const { productType } = estimatePara
      dispatch({ type: 'SET_CURRENT_CAR_INFO', [`currentCarInfo${ productType }`]: currentCarInfo })
      // 如果可以提交订单，就重新计算一下预估价
      estimatePara = merge(estimatePara)({ rideType: currentCarInfo.rideType })
      if (canPlace) dispatch(getEstimate(estimatePara))
    },
    handleChangePassenger(currentPassenger, productType) {
      const userPhone = getStore('userPhone', 'session')
      if (userPhone === currentPassenger) currentPassenger = '换乘车人'
      dispatch({ type: 'SET_CURRENT_PASSENGER', [`currentPassenger${ productType }`]: currentPassenger })
    },
    handleChangeDate(currentDate, canPlace, estimatePara, isStartTimes2) {
      if (currentDate.length === 2) currentDate = ['2017-07-11', '现在']
      dispatch({ type: 'SET_CURRENT_DATE', [`currentDate${ estimatePara.productType }`]: currentDate })

      // 如果可以提交订单，就重新计算一下预估价
      if (canPlace) {
        if (isStartTimes2) {
          const flightDelayTime = Number(currentDate[1])
          const departureTime = ''
          estimatePara = merge(estimatePara)({ flightDelayTime, departureTime })
        } else {
          const departureTime = currentDate.length === 2 ? ['2017-07-11', '现在'] : `${ currentDate[0] } ${ currentDate[1] }:${ currentDate[2] }`
          estimatePara = merge(estimatePara)({ departureTime })
        }
        dispatch(getEstimate(estimatePara))
      }
    },
    handleChangeStartPointObj(res, canPlace, estimatePara, currentProduct) {
      const defaultCity = getStore(`startPointObj${ currentProduct.code }`, 'session') ? getStore(`startPointObj${ currentProduct.code }`, 'session').name : getStore('defaultPointObj', 'session').name
      const { address, city = defaultCity, code = '', terminalCode = '' } = res
      const title = res.name
      const point = res.location
      const startPointObj = { latitude: point.lat, longitude: point.lng, title, detail: address, name: city.replace('市', ''), code, terminalCode }
      setStore(`startPointObj${ currentProduct.code }`, startPointObj, 'session')
      dispatch({ type: 'SET_START_POINT_OBJ', [`startPointObj${ currentProduct.code }`]: startPointObj })
      dispatch({ type: 'SET_START_POINT_STR', [`startPointStr${ currentProduct.code }`]: title })

      // 如果可以提交订单，就重新计算一下预估价
      estimatePara = merge(estimatePara)({ startLatitude: point.lat, startLongitude: point.lng, startAddress: title })
      if (code) estimatePara.airCode = code
      if (canPlace) dispatch(getNearbyCar(estimatePara))
    },
    handleChangeEndPointObj(res, canPlace, estimatePara, currentProduct) {
      // 地址搜索浦东新区时，返回对象没有city，这时使用上一次的city或是默认的city
      const defaultCity = getStore(`endPointObj${ currentProduct.code }`, 'session') ? getStore(`endPointObj${ currentProduct.code }`, 'session').name : getStore('defaultPointObj', 'session').name
      const { address, city = defaultCity, code = '', terminalCode = '' } = res
      const title = res.name
      const point = res.location
      const endPointObj = { latitude: point.lat, longitude: point.lng, title, detail: address, name: city.replace('市', ''), code, terminalCode }
      setStore(`endPointObj${ currentProduct.code }`, endPointObj, 'session')
      dispatch({ type: 'SET_END_POINT_OBJ', [`endPointObj${ currentProduct.code }`]: endPointObj })
      dispatch({ type: 'SET_END_POINT_STR', [`endPointStr${ currentProduct.code }`]: title })
      estimatePara = merge(estimatePara)({ endLatitude: point.lat, endLongitude: point.lng, endAddress: title })
      if (code) estimatePara.airCode = code
      if (canPlace) dispatch(getNearbyCar(estimatePara))
    },
    handleChangeUnpay(orderId) {
      browserHistory.push(`/yongche/order/${ orderId }`)
    },
    handleToStroke() {
      const channel = location.pathname.split('/')[2]
      browserHistory.push(`/yongche/${ channel }/stroke`)
    },
    handleToinvoiceInfo() {
      Toast.info('暂未开通发票功能', 2)
      // browserHistory.push('/yongche/invoice')
    },
    handleCreateOrder(orderPara, isSinglePrice, discount) {
      const { contactPhone } = orderPara
      if (contactPhone !== '' && !/^(13[0-9]|15[012356789]|18[0-9]|14[57]|17[678])[0-9]{8}$/.test(contactPhone)) {
        Toast.info('乘车人号码不正确', 1)
      } else {
        if (isSinglePrice && discount) {
          dispatch({ type: 'SET_PAY_FOOTER_VISIBLE', payFooterShow: true })
          return
        }
        dispatch(createOrder(orderPara))
      }
    },
    handelRulesClick() {
      Mask.closeAll()
      browserHistory.push('/yongche/rules')
    },
    handleSingleBackPromotion(data) {
      dispatch({ type: 'SET_PROMOTION_DATA', promotionData: data })
    },
    handleSeletedFlightNo(flightNo, flightDate, canPlace, estimatePara, currentProduct) {           // 只有两个接机才会触发该函数
      const productType = currentProduct.code
      let defaultCurrentDate = ['今天', '现在']
      let isStartTimes2 = false
      if (productType === 7 && flightNo) {
        defaultCurrentDate = ['到达后', '30', '分钟']
        isStartTimes2 = true
      }
      dispatch({ type: 'SET_CURRENT_DATE', [`currentDate${ estimatePara.productType }`]: '' })
      dispatch({ type: 'SET_CURRENT_FLIGHT_NO', [`flightNo${ productType }`]: flightNo, [`flightDate${ productType }`]: flightDate, defaultCurrentDate })
      dispatch({ type: 'SET_IS_START_TIMES_2', isStartTimes2 })
      estimatePara = merge(estimatePara)({ flightNo, flightDate })
      if (productType === 7) {
        dispatch(handleStartTimesChange(canPlace, estimatePara, isStartTimes2))
      } else if (canPlace) {
        dispatch(getEstimate(estimatePara))
      }
    },
    handleChangeFlightNoError() {
      dispatch({ type: 'SET_FLIGHTNO_ERROR_INFO', flightNoError: false, flightNoErrorMessage: '' })
    },
    handleClearFlightNo(e, estimatePara, canPlace, productType) {
      e.stopPropagation()
      const defaultCurrentDate = ['今天', '现在']
      dispatch({ type: 'SET_CURRENT_DATE', [`currentDate${ estimatePara.productType }`]: '' })
      dispatch({ type: 'SET_CURRENT_FLIGHT_NO', [`flightNo${ productType }`]: '', [`flightDate${ productType }`]: [''], defaultCurrentDate })
      dispatch({ type: 'SET_IS_START_TIMES_2', isStartTimes2: false })
      delete estimatePara.flightNo
      delete estimatePara.flightDate
      dispatch(handleStartTimesChange(canPlace, estimatePara, false))
    },
    handleCloseCallback() {
      dispatch({ type: 'SET_PAY_FOOTER_VISIBLE', payFooterShow: false })
    },
    handleToPlane(productType) {
      browserHistory.push(`/yongche/shenzhou/${ productType }`)
    },
    handlePickerClick(pickerVisible) {
      dispatch({ type: 'SET_PICKER_VISIBLE', pickerVisible })
    },
  }
}


const mapFunToComponent  = dispatch => ({
  componentWillMount() {
    const channel = location.pathname.split('/')[2]
    // 设置默认channel
    setStore('channel', channel, 'session')
    // 定位初始化
    dispatch(geoLocationInit())
    // 是否是一口价
    const { OTO_SAAS = {} } = window
    const { customer = {} } = OTO_SAAS
    const { isSinglePrice = false } = customer
    setStore('isSinglePrice', isSinglePrice, 'session')
    // 将专车设为默认弹出优惠框的模式
    window.OTO_SAAS.customer.showActivePopup = true

    // 删除取消原因页面返回的标记
    removeStore('cancelReasonReturn', 'session')

    // setStore('isSinglePrice', true, 'session')
  },
})


export default
connect(mapStateToProps, mapDispatchToProps)(
  wrap(mapFunToComponent)(Plane)
)
