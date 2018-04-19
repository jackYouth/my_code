import { connect } from 'react-redux'
import { wrap } from '@boluome/oto_saas_web_app_component'
import { Loading }   from '@boluome/oto_saas_web_app_component'

import { featchCarBrands, handleChooseId, handleChooseCar } from '../actions/cartype'
import CarType from '../components/carType'

const mapStateToProps = ({ app, firstDate, carType } , state) => {

  const { hotBrandList, brands } = carType

  return{
    brands,
    hotBrandList
  }
}

const mapDispatchToProps = dispatch => ({
  dispatch,
  handleChooseId: brandId => dispatch(handleChooseId(brandId)),
  handleChooseCar: result => dispatch(handleChooseCar(result))
})

const mapFunToComponent  = (dispatch, { carType }, state) => ({
  componentWillMount: () => {
    dispatch(featchCarBrands())
  }
})

export default
  connect(mapStateToProps, mapDispatchToProps)(
    wrap(mapFunToComponent)(CarType)
  )
