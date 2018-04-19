import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import { parseQuery, get, getStore }  from '@boluome/common-lib'
import { wrap } from '@boluome/oto_saas_web_app_component'
import { Toast } from 'antd-mobile'
import Select from '../components/select'
import { secReset, getData } from '../actions/select.js'

// const alert = Modal.alert

const mapStateToProps = state => {
  const { select } = state
  return {
    ...select,
  }
}

const mapDispatchToProps = dispatch => {
  return {

    handleSubmit: (eventId, ticketsId, num) => {
      if (num > 0 && ticketsId) {
        const search = parseQuery(location.search)
        const { activityCode } = search
        browserHistory.push(`/piaowu/order?activityCode=${ activityCode }&eventId=${ eventId }&ticketsId=${ ticketsId }&num=${ num }`)
      } else if (ticketsId) {
        Toast.info('请选择票数')
      } else {
        Toast.info('暂未选票')
      }
    },

    handleChangenum: (ynum, tp, datali) => {
      if (tp && datali.quantity) {
        let num = ynum
        if (datali.splitStyle === 4) {
          const oe = datali.quantity % 2 ? datali.quantity - 1 : datali.quantity
          num = ynum < oe ? ynum + 2 : ynum
        } else if (datali.splitStyle === 3) {
          num = ynum < (datali.quantity - 1) ? ynum + 1 : ynum
        } else {
          num = ynum < datali.quantity ? ynum + 1 : ynum
        }
        if (num === ynum) Toast.info(`该票剩余${ num }张`)
        dispatch(secReset({ num }))
      } else if (datali && ynum > 0) {
        let num = ynum
        if (datali.splitStyle === 4) {
          num = ynum >= 2 ? ynum - 2 : ynum
        } else {
          num = ynum - 1
        }
        dispatch(secReset({ num }))
      } else {
        dispatch(secReset({ num: ynum }))
      }
    },

    handleSelectpri: data => {
      if (data && data.quantity > 0 && data.splitStyle === 2) {
        dispatch(secReset({ num: data.quantity, datali: data }))
      } else if (data && data.quantity > 0) {
        dispatch(secReset({ num: 0, datali: data }))
      }
    },

    handleSelectsub: data => {
      if (data) dispatch(secReset({ data }))
      const search = parseQuery(location.search)
      const { activityCode } = search
      dispatch(getData(activityCode, data.id))
    },

    dispatch,
  }
}

const mapFunToComponent  = dispatch => {
  return {
    componentWillMount: () => {
      const search = parseQuery(location.search)
      const { activityCode } = search
      get('/piaowu/queryEventList', {
        channel: getStore('piaowu_channel', 'session'),
        activityCode,
      }).then(({ code, data, message }) => {
        if (code === 0) {
          console.log(data)
          const { id, priceLevel } = data[0]
          dispatch(getData(activityCode, id, priceLevel[0]))
          dispatch(secReset({
            dataList: data,
            data:     data[0],
          }))
        } else {
          console.log(message)
        }
      })
      .catch(err => {
        console.log(err)
      })
    },
  }
}

export default
  connect(mapStateToProps, mapDispatchToProps)(
    wrap(mapFunToComponent)(Select)
  )
