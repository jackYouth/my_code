import { connect } from 'react-redux'
import { wrap } from '@boluome/oto_saas_web_app_component'

import Comment from '../components/comment'

const mapStateToProps = () => {
  const mock = 'Comment'
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
      console.log('Comment componentWillMount')
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(wrap(mapFunToComponent)(Comment))
