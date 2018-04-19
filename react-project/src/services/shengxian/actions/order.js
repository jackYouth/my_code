import { send, getStore } from '@boluome/common-lib'
import { Modal } from 'antd-mobile'

const alert = Modal.alert

export const derReset = data => ({
  type: 'DER_RESET',
  ...data,
})

export const showAlert = info => {
  alert('温馨提示', info, [
    {
      text:    '我知道了',
      onPress: () => {
        console.log(123)
      },
    },
  ])
}

// 配送日期函数
export const getDate = time => {
  const date = new Date()
  const timeArr = time ? time.split('/') : date.toLocaleDateString().split('/')
  const dateArr = []
  for (let i = 0; i < 7; i++) {
    date.setFullYear(parseInt(timeArr[0], 10), parseInt(timeArr[1], 10) - 1, parseInt(timeArr[2], 10) + i)
    const tex = date.toLocaleDateString()
    dateArr.push({
      label: tex,
      value: tex,
    })
  }
  return dateArr
}

// 获取配送费
export const getFreight = (contactId, commodityList) => dispatch => {
  send('/shengxian/v1/freight', {
    channel:        getStore('channel', 'session'),
    customerUserId: getStore('customerUserId', 'session'),
    contactId,
    commodityList,
  }).then(({ code, data, message }) => {
    if (code === 0) {
      dispatch(
        derReset({
          submit:       true,
          freight:      data,
          dateArr:      getDate(data.deliveryDate),
          deliveryDate: [getDate(data.deliveryDate)[0].value],
        })
      )
    } else {
      showAlert(message || '获取配送费失败')
      const dateA = getDate()
      dispatch(
        derReset({
          submit:       false,
          dateArr:      dateA,
          deliveryDate: [dateA[0].value],
        })
      )
      console.log(message)
    }
  })
}
