import { Toast } from 'antd-mobile'
// import { browserHistory } from 'react-router'
import { get, send } from 'business'
import { getStore } from '@boluome/common-lib'
import { Loading, Mask } from '@boluome/oto_saas_web_app_component'

export const editCarReset = data => ({
  type: 'EDIT_RESET',
  ...data,
})

// 位数获取
export const getLengthData = platePrefix => dispatch => {
  const sendUrl = '/weizhang/v1/plate/city'
  const sendData = {
    channel: 'chexingyi',
    platePrefix,
  }
  get(sendUrl, sendData).then(({ code, data, message }) => {
    if (code === 0) {
      dispatch(editCarReset({
        ...data[0],
      }))
      // console.log('--city--', data[0])
    } else if (code === 20000) {
      console.log(message)
    }
  })
}

// 获取省份简称
export const getKeyboardData = () => dispatch => {
  get('/weizhang/v1/plate/prefix').then(({ code, data, message }) => {
    if (code === 0) {
      // 调整数据格式
      let season = []
      season = data.reduce((arr, { city, prefix }) => {
        arr.push({
          label:    city,
          value:    city,
          children: prefix.map(p => ({ label: p, value: p })),
        })
        return arr
      }, [])
      // console.log('prefix----', season)
      dispatch(editCarReset({ prefix: season }))
    } else {
      console.log(message)
    }
  })
}

// 新增时还原数据
const dataarr = {
  carPhone:    '',
  cityId:      '31',
  cityName:    '上海',
  engineNo:    '',
  id:          '',
  plateNumber: ['沪', 'A', '', '', '', '', ''],
  userId:      '',
  vin:         '',
  model:       '',
  time:        '',
  chexi:       '',
  chexing:     '',
}
// 查询车辆详情
export const getEditData = plateNumber => dispatch => {
  const userIdcon = getStore('customerUserId', 'session')
  const sendUrl = `/weizhang/v1/${ userIdcon }/${ plateNumber }/detail`
  const sendData = {
    userId: userIdcon,
    plateNumber,
  }
  get(sendUrl, sendData).then(({ code, data, message }) => {
    if (code === 0) {
      if (data && data.length > 0) {
        const { time, vin, engineNo, carPhone, cityId, cityName, id, userId, model, logo, chexi, chexing } = data[0]
        const number = data[0].plateNumber.split('')
        dispatch(editCarReset({
          plateNumber: number,
          vin,
          engineNo,
          carPhone,
          cityId,
          cityName,
          id,
          userId,
          model,
          time,
          logo,
          chexi,
          chexing,
          cheguChexi: {
            model,
            time,
          },
        }))
        console.log('---test----', data)
        const num = data[0].plateNumber.slice(0, 2)
        dispatch(getLengthData(num))
      } else {
        const num = '沪A'
        dispatch(editCarReset({ ...dataarr }))
        dispatch(getLengthData(num))
      }
    } else {
      const num = '沪A'
      dispatch(editCarReset({ ...dataarr }))
      dispatch(getLengthData(num))
      console.log(message)
    }
  })
}

// 保存车牌
export const SubmitOrder = (carPhone, cityId, cityName, plateNumber, vin, engineNo, logo, model, time, chexi, chexing, id, isReload) => {
  console.log('---vvvv----', carPhone, cityId, cityName, plateNumber, vin, engineNo, logo, model, time)
  const handleClose = Loading()
  const submitUrl = '/weizhang/v1/plate'
  const times = time
  const tel = carPhone.replace(/\s/g, '')
  const submitData = {
    userId:      getStore('customerUserId', 'session'),
    carPhone:    tel,
    cityId,
    cityName,
    plateNumber: plateNumber.join(''),
    vin,
    engineNo,
    logo,
    model,
    time:        times,
    id,
    chexi,
    chexing,
  }
  send(submitUrl, submitData).then(({ code, data, message }) => {
    handleClose()
    if (code === 0) {
      console.log('--SubmitOrderSubmitOrder--', SubmitOrder, data)
      if (!isReload) {
        window.history.go(-1)
        Mask.closeAll()
        // browserHistory.push('/qichepindao/addCar/')
      } else {
        window.location.reload()
      }
    } else {
      Toast.info(message, 1)
    }
  })
}
