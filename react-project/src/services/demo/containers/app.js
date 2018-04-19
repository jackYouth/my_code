import { connect } from 'react-redux'
import { wrap } from '@boluome/oto_saas_web_app_component'
import { login, getLocation } from 'business'
import App from '../components/app'

const mapStateToProps = state => {
  const { app } = state
  return {
    ...app,
  }
}

const mapDispatchToProps = dispatch => ({ dispatch })

const mapFunToComponent = () => ({
  componentWillMount: () => {
    login(err => {
      if (err) {
        // console.log(err)
      } else {
        getLocation()
        // console.log('success');
      }
    })
  },
  componentDidMount: () => {
  },
})

export default
  connect(mapStateToProps, mapDispatchToProps)(
    wrap(mapFunToComponent)(App)
  )
