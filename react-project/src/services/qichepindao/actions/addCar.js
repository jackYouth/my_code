import { get, send } from 'business'
import { getStore } from '@boluome/common-lib'
// import { getWeizhangData } from './app'
import { keys } from 'ramda'

export const addCarReset = data => ({
  type: 'ADDCAR_RESET',
  ...data,
})

// 验证车牌有效性
export const TestData = dataarr => dispatch => {
  const userId = getStore('customerUserId', 'session')
  const sendUrl = '/weizhang/v1/check/user/plates'
  const sendData = {
    channel: 'chexingyi',
    userId,
  }
  get(sendUrl, sendData).then(({ code, data, message }) => {
    if (code === 0) {
      if (data) {
        const datalist = dataarr.reduce((arr, item) => {
          if ((keys(data)).some(o => Number(o) === item.id)) {
            item.isError = true
            item.untreated = data[item.id].untreated
            arr.push(item)
          } else {
            item.isError = false
            arr.push(item)
          }
          return arr
        }, [])
        dispatch(addCarReset({ platData: datalist }))
      }
    } else {
      console.log(message)
    }
  })
}

// 获取车牌列表
export const getListData = () => dispatch => {
  const userId = getStore('customerUserId', 'session')
  const sendUrl = `/weizhang/v1/${ userId }/plate`
  const sendData = {
    userId,
  }
  get(sendUrl, sendData).then(({ code, data, message }) => {
    if (code === 0) {
      console.log('data-add--11--', data)
      // const arr = []
      for (let i = 0; i < data.length; i++) {
        data[i].isError = true
        data[i].untreated = ''
      }
      dispatch(addCarReset({ platData: data }))
      if (data.length > 0) {
        // dispatch(getWeizhangData(data[0]))
        console.log('---test--TestData-', data)
        dispatch(TestData(data))
      }
    } else {
      console.log(message)
    }
  })
}

// 删除车牌
export const detelePlateData = plateNumber => dispatch => {
  console.log('--detelePlateData-plateNumber-', plateNumber)
  const userId = getStore('customerUserId', 'session')
  const sendUrl = `/weizhang/v1/${ userId }/${ plateNumber }`
  const sendData = {
    userId,
    plateNumber,
  }
  send(sendUrl, sendData, 'delete').then(({ code, data, message }) => {
    if (code === 0) {
      console.log('detelePlateData----', data)
      dispatch(getListData())
    } else {
      console.log(message)
    }
  })
}
