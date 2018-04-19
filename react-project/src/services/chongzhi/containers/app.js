import { connect } from 'react-redux'

import App from '../components/app'

const mapStateToProps = ({ app, huafei, liuliang }) => ({ ...app, ...huafei, ...liuliang })

const mapDispatchToProps = dispatch => {
  return {
    dispatch,
    handleCZClick: e => {
      dispatch({ type: 'SET_CZ', currentCZ: e[0] })
      dispatch({ type: 'SET_CURRENT_PHONE', prevPhone: e[1] })
    },
  }
}

export default
  connect(mapStateToProps, mapDispatchToProps)(App)
