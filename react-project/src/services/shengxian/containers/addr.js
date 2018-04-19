import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import { getStore } from '@boluome/common-lib'
import { wrap, Mask } from '@boluome/oto_saas_web_app_component'
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
    goOrder: contactId => {
      Mask.closeAll()
      if (contactId) { browserHistory.push(`/shengxian/${ getStore('channel', 'session') }/order/${ contactId }`) }
    },
  }
}

const mapFunToComponent  = (dispatch, state) => {
  return {
    componentWillMount: () => {
      const { routeParams } = state
      const { contactId } = routeParams
      dispatch(
        addrReset({
          contact: {
            contactId,
          },
        })
      )
    },
  }
}

export default
  connect(mapStateToProps, mapDispatchToProps)(
    wrap(mapFunToComponent)(Addr)
  )
