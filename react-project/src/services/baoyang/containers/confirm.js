import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import { Toast } from 'antd-mobile'
import { getStore } from '@boluome/common-lib'
import { saveOrder } from '../actions/confirm'
import Confirm from '../components/confirm'

const mapStateToProps = ({ app, confirm }) => {
  const { channel } = app
  const { promotion, phone } = confirm
  const currentService = getStore('currentService', 'session')
  const currentShop = getStore('currentShop', 'session')
  return {
    currentService,
    currentShop,
    channel,
    promotion,
    phone,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    dispatch,
    handlePromotionChange: promotion => {
      // const { coupon, activity, discount } = promotion
      // console.log(coupon, activity, discount)
      dispatch({ type: 'PROMOTION_CHANGE', promotion })
    },
    handleToMap: shopId => {
      browserHistory.push(`/baoyang/${ shopId }/map`)
    },
    handlePhone: v => {
      const phone = v.replace(/\s/g, '')
      dispatch({ type: 'PHONE', phone })
    },
  }
}

const mergeProps = (stateProps, dispatchProps) => {
  return {
    ...stateProps,
    ...dispatchProps,
    handleSaveOrder: () => {
      const { dispatch } = dispatchProps
      const { currentService, currentShop, promotion, channel, phone } = stateProps
      const { coupon, activities } = promotion
      const { lv1ServiceTypeId, lv2ServiceTypeId } = currentService
      const { shopId, shopLng, shopLat } = currentShop
      if (!phone) {
        Toast.info('手机号不能为空', 1)
        return
      } else if (!(/^1(3|4|5|7|8)\d{9}$/.test(phone))) {
        Toast.info('手机号格式不能正确', 1)
        return
      }
      const userPhone = getStore('userPhone', 'session') ? getStore('userPhone', 'session') : phone
      const userId = getStore('customerUserId', 'session')
      const postData = {
        channel,
        userPhone,
        shopId,
        shopLng,
        shopLat,
        lv1ServiceTypeId,
        lv2ServiceTypeId,
        userId,
      }
      if (coupon) {
        const { id } = coupon
        postData.couponId = id
      }
      if (activities) {
        const { id } = activities
        postData.activityId = id
      }

      dispatch(saveOrder(postData))
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(Confirm)
