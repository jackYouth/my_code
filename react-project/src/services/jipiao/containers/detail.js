import React from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import { Toast, Modal } from 'antd-mobile'
import { getStore } from '@boluome/common-lib'
import { wrap, Mask, SlidePage, Loading }    from '@boluome/oto_saas_web_app_component'
import { get, send, login } from 'business'
import { detReset } from '../actions/detail.js'
import Detail, { Tuigaiqian } from '../components/detail'

const alert = Modal.alert
let timeOut = ''

const mapStateToProps = ({ detail }) => ({ ...detail })

const mapDispatchToProps = (dispatch, props) => {
  return {
    dispatch,

    goOrder: (info, carbinInfo, index) => {
      const loginAfter = () => {
        const { routeParams } = props
        const { flightTimes, flightTypeFullName } = routeParams
        const { departureTime, airlineName, flightNum } = info
        const { bkParams } = carbinInfo
        const closeLoading = Loading()
        dispatch({ type: 'ORD_INIT' })
        // 核价
        send('/jipiao/v1/pricing', {
          channel:   getStore('channel', 'session'),
          departure: getStore('fromCity'),
          arrive:    getStore('toCity'),
          date:      getStore('date', 'session'),
          deptTime:  departureTime,
          airlineName,
          flightNum,
          bkParams,
        })
        .then(({ code, data, message }) => {
          closeLoading()
          if (code === 0) {
            console.log(data)
            browserHistory.push(`/jipiao/order/${ flightNum }/${ flightTimes }/${ flightTypeFullName }/${ index }`)
          } else {
            Toast.info(message, 1)
          }
        })
      }
      if (getStore('customerUserId', 'session')) {
        loginAfter()
      } else {
        login(err => {
          if (err) {
            Toast.info('未登录', 1)
          } else {
            loginAfter()
          }
        }, true)
      }
    },

    handlePricing: (info, carbinInfo) => {
      const { departureTime, airlineName, flightNum } = info
      const { bkParams } = carbinInfo
      const closeLoading = Loading()
      // 核价
      send('/jipiao/v1/pricing', {
        channel:   getStore('channel', 'session'),
        departure: getStore('fromCity'),
        arrive:    getStore('toCity'),
        date:      getStore('date', 'session'),
        deptTime:  departureTime,
        airlineName,
        flightNum,
        bkParams,
      })
      .then(({ code, data, message }) => {
        closeLoading()
        if (code === 0) {
          console.log(data)
          Mask(
            <SlidePage target='right' showClose={ false } >
              <Tuigaiqian data={ data } />
            </SlidePage>,
            { mask: false, style: { position: 'absolute' } }
          )
        } else {
          Toast.info(message, 1)
        }
      })
    },
  }
}

const mapFunToComponent  = (dispatch, state) => ({
  componentWillMount: () => {
    timeOut = setTimeout(() => {
      alert('', '航班信息可能已过期，请重新搜索', [
        {
          text:    '确定',
          onPress: () => {
            window.location.reload()
            browserHistory.push('/jipiao/air')
          },
        },
      ])
    }, 600000)
  },

  componentWillUnmount: () => {
    clearTimeout(timeOut)
  },
  componentDidMount: () => {
    const { routeParams } = state
    const { flightNum, flightTimes, flightTypeFullName } = routeParams
    // 查询
    get('/jipiao/v1/flight/price', {
      channel:   getStore('channel', 'session'),
      departure: getStore('fromCity'),
      arrive:    getStore('toCity'),
      date:      getStore('date', 'session'),
      flightNum,
      flightTimes,
    })
    .then(({ code, data, message }) => {
      if (code === 0) {
        data.flightTypeFullName = flightTypeFullName
        dispatch(detReset({
          info: data,
        }))
      } else if (code === 1001) {
        alert('', message, [
          {
            text:    '确定',
            onPress: () => {
              browserHistory.push('/jipiao/air')
              window.location.reload()
            },
          },
        ])
      } else {
        console.log(message)
        Toast.info(message, 3)
      }
    })
  },
})

export default
connect(mapStateToProps, mapDispatchToProps)(
  wrap(mapFunToComponent)(Detail)
)
