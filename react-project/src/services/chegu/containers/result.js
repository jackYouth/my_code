import { connect } from 'react-redux'
import { wrap } from '@boluome/oto_saas_web_app_component'
import { getStore } from '@boluome/common-lib'
import result from '../components/result'

import { chooseCity , dateChange , distanceChange } from '../actions'
import { feachCarPrice } from '../actions/result'

const mapStateToProps = ({ app , firstDate , result, carType } , state) => {

  const { city , distance , currentCity } = app
  const { date } = firstDate
  const { carPrice } = result
  const { chooseResult } = carType

  return{
    city, date, distance, currentCity, carPrice, chooseResult
  }
}

const mapDispatchToProps = dispatch => ({
  dispatch,
  chooseCity: result => dispatch(chooseCity(result)),
  dateChange: val => dispatch(dateChange(val)),
  distanceChange: val => dispatch(distanceChange(val))
})

const mapFunToComponent  = (dispatch,state) => ({})

export default
  connect(mapStateToProps, mapDispatchToProps)(
    wrap(mapFunToComponent)(result)
  )
