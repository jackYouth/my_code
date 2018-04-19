import { getStore } from '@boluome/common-lib'
import { send }  from 'business'
import { Loading } from '@boluome/oto_saas_web_app_component'
import { Toast }   from 'antd-mobile'

export const handleCreditNo = creditCardNo => {
  return {
    type: 'CARD_NO',
    creditCardNo,
  }
}

export const handleCvv = cvvNo => {
  return {
    type: 'CVV_NO',
    cvvNo,
  }
}

export const handleDate = validDate => {
  return {
    type: 'VALID_DATE',
    validDate,
  }
}

export const handleUserName = userName => {
  return {
    type: 'USER_NAME',
    userName,
  }
}

export const handleID = userID => {
  return {
    type: 'USER_ID',
    userID,
  }
}

export const handleUserPhone = userPhone => {
  return {
    type: 'USER_PHONE',
    userPhone,
  }
}

export const checkCreditCard = creditCardNo => dispatch => {
  const handleClose = Loading()
  send('/jiudian/v1/checkCreditCard', { cardNo: creditCardNo, channel: getStore('channel') })
  .then(({ code, data = {}, message }) => {
    const { IsValid } = data
    if (code === 0 && IsValid) {
      console.log(data)
      dispatch({
        type:     'CARD_INFO',
        cardInfo: data,
      })
    } else {
      console.log(message)
      Toast.info('请输入正确的信用卡号', 2)
    }
    handleClose()
  }).catch(err => {
    handleClose()
    console.log('checkCreditCard', err)
  })
}
