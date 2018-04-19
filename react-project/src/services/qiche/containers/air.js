import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import { setStore } from '@boluome/common-lib'
import { wrap } from '@boluome/oto_saas_web_app_component'
// import { Modal } from 'antd-mobile'
import { airReset, getqcdata, fliterdata } from '../actions/air.js'
import Air from '../components/air'

let reTop = 0

const mapStateToProps = ({ air }) => ({ ...air })

const mapDispatchToProps = dispatch => {
  return {
    dispatch,

    handleFilternear: (filiterObj, defineQcdata, txt) => {
      let index = ''
      filiterObj.fromArr.map((e, i) => {
        if (e.name === txt) index = i
        return e
      })
      if (typeof index === 'number' && !filiterObj.fromArr[index].choose) {
        const filiterObjing = JSON.parse(JSON.stringify(filiterObj))
        filiterObjing.fromArr[index].choose = true
        const arr = fliterdata(filiterObjing, defineQcdata)
        dispatch(airReset({
          qcdata:     arr,
          filiterObj: filiterObjing,
        }))
      }
    },

    handleScroll: (top, botShow) => {
      const num = top - reTop
      if (num > 0 && botShow) {
        dispatch(airReset({
          botShow: false,
        }))
      } else if (num < 0 && !botShow) {
        dispatch(airReset({
          botShow: true,
        }))
      }
      reTop = top
    },

    handleFilterback: (defiliterObj, defineQcdata, filiterObj, qcdata, filiterObjing, handleContainerClose) => {
      if (JSON.parse(JSON.stringify(defiliterObj)) === JSON.parse(JSON.stringify(filiterObjing))) {
        dispatch(airReset({
          qcdata: defineQcdata,
        }))
      } else if (JSON.parse(JSON.stringify(filiterObj)) === JSON.parse(JSON.stringify(filiterObjing))) {
        console.log('筛选条件未变')
      } else {
        const arr = fliterdata(filiterObjing, defineQcdata)
        dispatch(airReset({
          qcdata:     arr,
          filiterObj: filiterObjing,
        }))
      }
      handleContainerClose()
    },

    handleTime: (date, obj) => {
      const datesplit = date.split('-')
      const nextdate = new Date()
      nextdate.setFullYear(datesplit[0], (datesplit[1] * 1) - 1, datesplit[2])
      const datestr = nextdate.toLocaleDateString()
      setStore('date', datestr.replace(/\//g, '-'), 'session')
      dispatch(getqcdata(obj))
    },

    goOrder: checiinfo => {
      setStore('checiinfo', checiinfo, 'session')
      dispatch({ type: 'ORD_INIT' })
      browserHistory.push('/qiche/order')
    },
  }
}

const mapFunToComponent  = (dispatch, state) => ({
  componentWillMount: () => {
    // 查询
    if (!state.defineQcdata) {
      dispatch(getqcdata())
    }
  },
})

export default
connect(mapStateToProps, mapDispatchToProps)(
  wrap(mapFunToComponent)(Air)
)
