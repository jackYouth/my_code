import { connect } from 'react-redux'
import { wrap }    from '@boluome/oto_saas_web_app_component'
import App         from '../components/app'

const mapStateToProps = ({ app }) => ({ ...app })

const mapDispatchToProps = dispatch => ({ dispatch })

const mapFunToComponent  = () => ({
  componentDidMount: () => console.log('root mounted'),
})

export default
connect(mapStateToProps, mapDispatchToProps)(
  wrap(mapFunToComponent)(App)
)
