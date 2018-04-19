import React from 'react'
import { connect } from 'react-redux'
// import { browserHistory } from 'react-router'
import { Toast } from 'antd-mobile'
import { get } from '@boluome/common-lib'
import { SlidePage, Mask, wrap, Loading } from '@boluome/oto_saas_web_app_component'
import { afterOrdering, login } from 'business'
import OrderDetails, { Logs } from '../components/orderDetails'
import { odlReset } from '../actions/orderDetails.js'

const mapStateToProps = ({ orderDetails }) => ({ ...orderDetails, login })

const mapDispatchToProps = dispatch => {
  return {
    dispatch,

    handleLog: (id, orderDetailInfo) => {
      // const data = {
      //   expressNumber:   'ex5cddx889',
      //   express:         '易果生鲜物流',
      //   logisticsDetail: [
      //     {
      //       time:   '2016-07-26 14:47:33',
      //       detail: '您提交了订单，等待客服审核。',
      //     },
      //     {
      //       time:   '2016-07-26 15:57:23',
      //       detail: '您的订单已通过审核。',
      //     },
      //   ],
      // }
      // Mask(
      //   <SlidePage target='right' showClose={ false } >
      //     <Logs orderDetailInfo={ orderDetailInfo } data={ data } />
      //   </SlidePage>,
      //   { mask: false }
      // )
      // 获取物流信息
      const closeLoading = Loading()
      get('/shengxian/v1/order/logistics', {
        id,
        channel: 'yiguo',
      }).then(({ code, data, message }) => {
        closeLoading()
        if (code === 0) {
          console.log(data)
          Mask(
            <SlidePage target='right' showClose={ false } >
              <Logs orderDetailInfo={ orderDetailInfo } data={ data } />
            </SlidePage>,
            { mask: false }
          )
        } else {
          console.log(message)
          Toast.info(message)
        }
      })
    },

    goPay: orderNo => {
      afterOrdering({ id: orderNo })
    },
  }
}

const mapFunToComponent  = (dispatch, state) => ({
  componentWillMount: () => {
    const { routeParams } = state
    const { orderNo } = routeParams
    console.log(123456)
    dispatch(odlReset({
      orderNo,
    }))
  },
})

export default
connect(mapStateToProps, mapDispatchToProps)(
  wrap(mapFunToComponent)(OrderDetails)
)
