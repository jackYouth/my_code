import { connect } from 'react-redux'
import { wrap } from '@boluome/oto_saas_web_app_component'
import initReactFastclick from 'react-fastclick'
import App from '../components/app'

const mapStateToProps = ({ app }) => ({ ...app })

const mapDispatchToProps = dispatch => ({ dispatch })

const mapFunToComponent  = () => ({
  componentWillMount: () => {
    initReactFastclick()
  },
  componentDidMount: () => {
    document.title = '外卖'
  },
})

export default
  connect(mapStateToProps, mapDispatchToProps)(
    wrap(mapFunToComponent)(App)
  )
