import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import { Toast, Modal } from 'antd-mobile'
import { getStore, parseQuery, setStore } from '@boluome/common-lib'
import { wrap, Loading } from '@boluome/oto_saas_web_app_component'
import { get } from 'business'
import { editCarReset, getKeyboardData, getEditData, SubmitOrder, getLengthData } from '../actions/editCar'

import { featchCarBrands, handleChooseId, handleChooseCar } from '../actions/cartype'
import EditCar from '../components/editCar'

const mapStateToProps = ({ editCar }) => {
  return {
    ...editCar,
  }
}
const alert = Modal.alert
const mapDispatchToProps = dispatch => ({
  dispatch,
  handleChooseId:  brandId => dispatch(handleChooseId(brandId)),
  handleChooseCar: result => dispatch(handleChooseCar(result)),
  handleGoChegu: data => {
    console.log('---session---', data)
    setStore('qichepindao_edit_data', data, 'session')
    browserHistory.push('/qichepindao/carType')
  },
  handleTimevalue: time => {
    dispatch(editCarReset({
      time,
    }))
  },
  handleInputValue: (val, name) => {
    if (name === 'vin') {
      console.log('--vin--', val)
    } else if (name === 'engineNo') {
      console.log('--engineNo--', val)
    } else if (name === 'phone') {
      console.log('--phone--', val)
    }
    const temp = { [name]: val }
    dispatch(editCarReset({
      ...temp,
    }))
  },
  changeCurrentIndex: currentIndex => {
    dispatch(editCarReset({
      currentIndex,
    }))
  },
  changeCurrent: (plateNumber, currentIndex) => {
    // 索引的更改及当作删除函数使用
    if (currentIndex >= 1 && currentIndex <= 6) {
      const arr = JSON.parse(JSON.stringify(plateNumber))
      arr[currentIndex] = ''
      dispatch(editCarReset({
        plateNumber: arr,
      }))
      currentIndex--
    }
    dispatch(editCarReset({
      currentIndex,
    }))
  },
  handleKeydown: (e, plateNumber, currentIndex, value) => {
    console.log('--value--', value, '--JSON-', JSON.parse(JSON.stringify(plateNumber)))
    e.nativeEvent.stopImmediatePropagation()
    if (value.selectedNo || currentIndex !== 1) {
      const arr = JSON.parse(JSON.stringify(plateNumber))
      arr[currentIndex] = e.target.innerHTML
      dispatch(editCarReset({
        plateNumber: arr,
      }))
      // 判断车牌号前缀，查询所在城市
      if ((currentIndex === 1 || currentIndex === 0) && arr[0] && arr[1]) {
        dispatch(getLengthData(arr[0] + arr[1]))
      }
      currentIndex++
      if (currentIndex >= 0 && currentIndex <= 6) {
        dispatch(editCarReset({
          currentIndex,
        }))
      }
    }
  },
  handleOver: (carPhone, cityId, cityName, plateNumber, vin, engineNo, time, chexi, chexing, cheguChexi, id) => {
    const { logo, model } = cheguChexi
    console.log('--SubmitOrder--', carPhone, cityId, cityName, plateNumber, vin, engineNo, logo, model, time, chexi, chexing, id)
    if (!model) {
      Toast.info('请选择车型车系', 1)
      return
    }
    if (!plateNumber || (plateNumber.join('').length) < 7) {
      Toast.info('车牌号不正确', 1)
      return
    }
    if (!vin && !engineNo && !carPhone) {
      console.log('两者都没填')
    } else {
      if (!vin) {
        Toast.info('车架号不能为空', 1)
        return
      }
      if (!engineNo) {
        Toast.info('发动机号不能为空', 1)
        return
      }
      const tel = carPhone.replace(/\s/g, '')
      if (!carPhone) {
        Toast.info('手机号不能为空', 1)
        return
      }
      if (!(/^1(3|4|5|7|8)\d{9}$/.test(tel))) {
        Toast.info('手机号格式不正确', 1)
        return
      }
    }
    const showAlert =  handleClose => {
      handleClose()
      alert('温馨提示', '该车牌号码已存在，请重新输入', [
        {
          text: '我知道了',
          onPress: () => {
            console.log('重新输入')
          },
        },
      ])
    }
    if (id) {
      dispatch(SubmitOrder(carPhone, cityId, cityName, plateNumber, vin, engineNo, logo, model, time, chexi, chexing, id))
    } else {
      const handleClose = Loading()
      const customerUserId = getStore('customerUserId', 'session')
      get(`/weizhang/v1/${ customerUserId }/plate`).then(({ code, data, message }) => {
        if (code === 0) {
          if (data.some(e => e.plateNumber === plateNumber.join(''))) {
            showAlert(handleClose)
          } else {
            dispatch(SubmitOrder(carPhone, cityId, cityName, plateNumber, vin, engineNo, logo, model, time, chexi, chexing, id))
          }
        } else {
          handleClose()
          console.log(message)
        }
      })
    }
  },
})

const mapFunToComponent  = dispatch => ({
  componentWillMount: () => {
    dispatch(featchCarBrands())
    const cheguChexi = getStore('qiche_chegu', 'session') ? getStore('qiche_chegu', 'session') : {}
    const chexi = getStore('qiche_chegu_chexi', 'session')
    const chexing = getStore('qiche_chegu_chexing', 'session')
    const logo = getStore('qiche_chegu_brandIcon', 'session') ? getStore('qiche_chegu_brandIcon', 'session') : ''
    const sessionData = getStore('qichepindao_edit_data', 'session')
    const search = location.search
    let plateNumber = ''
    if (sessionData) {
      dispatch(editCarReset({ ...sessionData }))
    } else if (search && search.indexOf('plateNumber') > -1) {
      plateNumber = parseQuery(search).plateNumber
      dispatch(getEditData(plateNumber))
    } else {
      dispatch(getEditData(plateNumber))
    }
    if (cheguChexi && cheguChexi.wholeModelName) {
      cheguChexi.model = cheguChexi.wholeModelName
      cheguChexi.logo = logo
    }
    console.log('--logo--logo--', cheguChexi, sessionData)
    dispatch(editCarReset({ cheguChexi, chexi, chexing }))
    dispatch(getKeyboardData())
  },
})

export default
  connect(mapStateToProps, mapDispatchToProps)(
    wrap(mapFunToComponent)(EditCar)
  )
