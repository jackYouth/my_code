import { connect } from 'react-redux'
// import { browserHistory } from 'react-router'
import { wrap }    from '@boluome/oto_saas_web_app_component'
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
  }
}

const mapFunToComponent  = dispatch => ({
  componentWillMount: () => {
    console.log(dispatch)
  },
  componentDidMount: () => console.log('root mounted', dispatch),
  componentWillUnmount: () => {
    const num = document.getElementsByClassName('mask-container').length
    for (let i = 0; i < num; i++) {
      document.getElementsByClassName('mask-container')[0].parentNode.remove()
    }
  },
})

export default
connect(mapStateToProps, mapDispatchToProps)(
  wrap(mapFunToComponent)(orderDetails)
)
