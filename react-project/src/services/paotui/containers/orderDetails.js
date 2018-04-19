import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import { wrap }    from '@boluome/oto_saas_web_app_component'
// import { getStore, setStore } from '@boluome/common-lib'
import orderDetails         from '../components/orderDetails'

const mapStateToProps = state => {
  console.log(state.orderDetails)
  return {
    ...state.orderDetails,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    dispatch,
    goBackIndex: () => {
      browserHistory.push('/coffee')
    },
  }
}

const mapFunToComponent  = dispatch => ({
  componentWillMount: () => {
    console.log(dispatch)
  },
  componentDidMount: () => console.log('root mounted', dispatch),
})

export default
connect(mapStateToProps, mapDispatchToProps)(
  wrap(mapFunToComponent)(orderDetails)
)
