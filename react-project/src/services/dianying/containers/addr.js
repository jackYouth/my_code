import { connect } from 'react-redux'
import { wrap } from '@boluome/oto_saas_web_app_component'
import Addr from '../components/addr'
import { addrReset } from '../actions/addr.js'


const mapStateToProps = state => {
  const { addr } = state
  return {
    ...addr,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    dispatch,
  }
}

const mapFunToComponent  = (dispatch, state) => {
  return {
    componentWillMount: () => {
      document.title = '影院位置'
      const { OTO_SAAS = {} } = window
      const { customer = {} } = OTO_SAAS
      const { customize = {} } = customer
      if (customize.default.type === 'banner')  document.getElementById('root').firstChild.firstChild.firstChild.lastChild.innerHTML = '影院位置'
      const { routeParams } = state
      const { addrTitlename, addrnameStr, longitude, latitude } = routeParams
      dispatch(
        addrReset({
          addrTitlename,
          addrnameStr,
          longitude,
          latitude,
        })
      )
    },
  }
}

export default
  connect(mapStateToProps, mapDispatchToProps)(
    wrap(mapFunToComponent)(Addr)
  )
