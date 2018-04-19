import { getStore } from '@boluome/common-lib'
import { Loading }   from '@boluome/oto_saas_web_app_component'
import { Toast } from 'antd-mobile'
import { afterOrdering, send } from 'business'
import { fetchCardsList } from '../actions/getCardsList'

export const AddChooseClass = currIndex => {
  return {
    type: 'ADD_CLASS',
    currIndex,
  }
}

export const ChangeTab = categoryId => {
  return {
    type: 'CHANGE_TAB',
    categoryId,
  }
}

export const showInfo = currId => {
  return {
    type: 'SHOW_INFO',
    currId,
  }
}

export const editInfo = id => {
  return {
    type: 'EDIT_INFO',
    id,
  }
}

export const getdiscountPrice = ({ discount, activities = {}, coupon = {} }) => {
  if (activities && activities.id) {
    console.log('activities~~~')
    return {
      type:          'GET_COUPONID',
      discountPrice: discount,
      actId:         activities ? activities.id : '',
    }
  } else if (coupon && coupon.id) {
    console.log('coupon~~~')
    return {
      type:          'GET_COUPONID',
      couponId:      coupon ? coupon.id : '',
      discountPrice: discount,
    }
  } else if (coupon && coupon.id && activities && activities.id) {
    console.log('mixed~~~')
    return {
      type:          'GET_COUPONID',
      actId:         activities ? activities.id : '',
      couponId:      coupon ? coupon.id : '',
      discountPrice: discount,
    }
  }
  console.log('unavailable~~~')
  return {
    type:          'GET_COUPONID',
    actId:         '',
    couponId:      '',
    discountPrice: 0,
  }
}

// export const getdiscountPrice = e => {
//   if (e.promotionBackData.target === 'platform') {
//     return {
//       type:          'GET_COUPONID',
//       couponId:      '',
//       discountPrice: e.discountPrice,
//       actId:         e.promotionBackData.activity ? e.promotionBackData.activity.id : '',
//     }
//   } else if (e.promotionBackData.target === 'coupon') {
//     return {
//       type:          'GET_COUPONID',
//       couponId:      e.promotionBackData.coupons ? e.promotionBackData.coupons.id : '',
//       discountPrice: e.discountPrice,
//     }
//   } else if (e.promotionBackData.target === 'mixed') {
//     return {
//       type:          'GET_COUPONID',
//       actId:         e.promotionBackData.activity ? e.promotionBackData.activity.id : '',
//       couponId:      e.promotionBackData.coupons ? e.promotionBackData.coupons.id : '',
//       discountPrice: e.discountPrice,
//     }
//   }
//   return {
//     type:          'GET_COUPONID',
//     actId:         '',
//     couponId:      '',
//     discountPrice: 0,
//   }
// }

export const DeleteCard = id => dispatch => {
  let urls = '/jiayouka/v1/cards/:id'
  urls = urls.replace(/:id/g, id)
  const handleClose = Loading()
  send(urls, { 'Content-Type': 'application/x-www-form-urlencoded' }, 'delete')
  .then(({ code, message }) => {
    if (code === 0) {
      dispatch({
        type: 'DELETE_CARD',
      })
      dispatch(fetchCardsList({ customerUserId: getStore('customerUserId', 'session'), categoryId: getStore('categoryId', 'session') }))
    } else {
      console.log(message)
    }
    handleClose()
  })
}

export const SaveOrder = postData => dispatch => {
  const handleClose = Loading({ mask: true, maskClosable: false })
  send('/jiayouka/v1/order', postData, 'post')
  .then(({ code, data = {}, message }) => {
    if (code === 0) {
      dispatch({
        type: 'SAVE_ORDER',
        postData,
      })
      afterOrdering(data)
      handleClose()
    } else {
      handleClose()
      Toast.info(message)
      console.log(message)
    }
  })
}
