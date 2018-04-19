import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import { setStore } from '@boluome/common-lib'
import City from '../components/city'

const mapStateToProps = ({ app }) => ({ ...app })

const mapDispatchToProps = dispatch => ({
  dispatch,
  handleCityChange: loc => {
    setStore('cityName', loc.name, 'session')
    browserHistory.push('/shengxian')
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(City)
