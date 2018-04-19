import { connect } from 'react-redux'
import { wrap } from '@boluome/oto_saas_web_app_component'
// import { Loading }   from '@boluome/oto_saas_web_app_component'

import { featchCarBrands, handleChooseId, handleChooseCar } from '../actions/cartype'
import CarType from '../components/carType'

const mapStateToProps = ({ carType }) => {
  return {
    ...carType,
  }
}

const mapDispatchToProps = dispatch => ({
  dispatch,
  handleChooseId:  brandId => dispatch(handleChooseId(brandId)),
  handleChooseCar: result => {
    // dispatch(handleChooseCar(result))
    // window.history.go(-1)
    window.history.back()
    console.log('----result-handleChooseCar-', result, handleChooseCar)
  },
})

const mapFunToComponent  = dispatch => ({
  componentWillMount: () => {
    dispatch(featchCarBrands())
  },
  componentWillUnmount() {
    const num = document.getElementsByClassName('mask-container').length
    for (let i = 0; i < num; i++) {
      document.getElementsByClassName('mask-container')[0].parentNode.remove()
    }
  },
})

export default
  connect(mapStateToProps, mapDispatchToProps)(
    wrap(mapFunToComponent)(CarType)
  )
