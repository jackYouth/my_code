// import React from 'react'
import { connect } from 'react-redux'
// import { browserHistory } from 'react-router'
import { Modal } from 'antd-mobile'
import { setStore, getStore } from '@boluome/common-lib'
import { wrap }    from '@boluome/oto_saas_web_app_component'
import { send } from 'business'
import { getremail } from '../actions/remail.js'
import Remail from '../components/remail'

const alert = Modal.alert

const showAlert = (dispatch, orderNo) => {
  alert('您是否要取消邮寄？', '取消后无法再次申请报销凭证，请您谨慎操作', [
    {
      text:    '是',
      onPress: () => {
        send(`/jipiao/v1/reimburse/${ orderNo }/cancel`, { channel: getStore('channel', 'session') })
        .then(({ code, data, message }) => {
          if (code === 0) {
            dispatch(getremail(orderNo))
            console.log(data)
          } else {
            console.log(message)
          }
        })
      },
    },
    {
      text:    '否',
      onPress: () => {
        console.log('否')
      },
    },
  ])
}

const mapStateToProps = ({ remail }) => ({ ...remail })

const mapDispatchToProps = (dispatch, props) => {
  return {
    dispatch,

    handleSubmit: () => {
      const { routeParams } = props
      const { orderNo } = routeParams
      showAlert(dispatch, orderNo)
    },
  }
}

const mapFunToComponent  = (dispatch, state) => ({
  componentWillMount: () => {
    setStore('channel', 'qunar', 'session')
    const { routeParams } = state
    const { orderNo } = routeParams
    dispatch(getremail(orderNo))
    // dispatch(remReset({
    //   remailData: {
    //     receiverType:  '类别',
    //     receiverTitle: '大润发',
    //     name:          '订单',
    //     phone:         '1396585658',
    //     address:       '花园路',
    //     status:        0,
    //   },
    // }))
    // console.log(orderNo, get, getStore)
  },
})

export default
connect(mapStateToProps, mapDispatchToProps)(
  wrap(mapFunToComponent)(Remail)
)
