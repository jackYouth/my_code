import { connect } from 'react-redux'
// import { browserHistory } from 'react-router'
import { getStore, setStore } from '@boluome/common-lib'
import { wrap }    from '@boluome/oto_saas_web_app_component'
// import { getLoaction } from 'business'

import Daojia         from '../../components/main/daojia'
import { getDaojiaInfo } from '../../actions/main/daojia'

const mapStateToProps = ({ daojia }) => {
  return {
    ...daojia,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    dispatch,
    handleServiceClick(service) {
      location.pathname = `/daojia/${ service.code }`
    },
    handleSelectCity(retrunData) {
      const { city, district, location, name } = retrunData
      const selectedCity = { city, address: name, county: district, latitude: location.lat, longitude: location.lng }
      dispatch({ type: 'SET_DAOJIA_ADDRESS', selectedCity })
      dispatch(getDaojiaInfo(selectedCity))
      setStore('selectedCity', selectedCity, 'session')
    },
  }
}

const mapFunToComponent = dispatch => ({
  componentWillMount() {
    const paras = getStore('selectedCity', 'session')
    dispatch(getDaojiaInfo(paras))

    const selectedCity = getStore('selectedCity', 'session')
    const address = getStore('currentAddress', 'session')
    selectedCity.address = address
    dispatch({ type: 'SET_DAOJIA_ADDRESS', selectedCity })
  },
})

export default
connect(mapStateToProps, mapDispatchToProps)(
  wrap(mapFunToComponent)(Daojia)
)
