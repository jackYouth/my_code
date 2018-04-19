import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import { wrap }    from '@boluome/oto_saas_web_app_component'
import { get, parseQuery } from '@boluome/common-lib'
// import { Toast } from 'antd-mobile'
// import { keys } from 'ramda'
// import { getLocation, login } from 'business'
import Detail         from '../components/detail'
import { delReset } from '../actions/detail.js'

const mapStateToProps = porps => {
  const { detail } = porps
  return {
    ...detail,
  }
}

const mapDispatchToProps = dispatch => ({

  goSel: activityCode => {
    dispatch({ type: 'SEC_INIT' })
    browserHistory.push(`/piaowu/select?activityCode=${ activityCode }`)
  },

  goAddr: (addrTitlename, addrnameStr) => {
    dispatch({ type: 'ADDR_INIT' })
    browserHistory.push(`/piaowu/addr?addrTitlename=${ addrTitlename }&addrnameStr=${ addrnameStr }`)
  },
  dispatch,
})

const mapFunToComponent  = (dispatch, state) => ({
  componentWillMount: () => {
    // 查询
    if (!state.data) {
      const search = parseQuery(location.search)
      const { channel, activityCode } = search
      get('/piaowu/queryActivity', { channel, activityCode })
      .then(({ code, data, message }) => {
        if (code === 0) {
          dispatch(delReset({ data }))
        } else {
          console.log(message)
        }
      })
    }
  },
})

export default
connect(mapStateToProps, mapDispatchToProps)(
  wrap(mapFunToComponent)(Detail)
)
