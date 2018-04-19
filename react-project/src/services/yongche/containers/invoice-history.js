import { connect } from 'react-redux'
import { wrap } from '@boluome/oto_saas_web_app_component'

import InvoiceHistory from '../components/invoice-history'

const mapStateToProps = () => {
  const mock = 'invoice-history'
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
      console.log('invoice-history componentWillMount')
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(wrap(mapFunToComponent)(InvoiceHistory))
