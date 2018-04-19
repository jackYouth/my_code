import { connect } from 'react-redux'
import { wrap } from '@boluome/oto_saas_web_app_component'

import Demo from '../components/demo'

const mapStateToProps = () => {
  const mock = 'demo'
  return {
    mock,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    dispatch,
  }
}

const mapFunToComponent = () => {
  return {
    componentWillMount() {
      console.log('demo componentWillMount')
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(wrap(mapFunToComponent)(Demo))
