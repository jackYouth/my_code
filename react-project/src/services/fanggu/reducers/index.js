import { combineReducers } from 'redux'

//引入reducers
import clickEvaluation  from './clickEvaluation'
import inputChange from './inputChange'
import cities from './getCities'
import districtList from './chooseDistrict'
import buildeList from './chooseBuilde'
import confirmBuilding from './confirmBuilding'
import confirmDistrict from './confirmDistrict'
import feachDistrictPrice from './feachDistrictPrice'
import feachFacility from './feachFacility'
import ndChange from './ndChange'
import showCity from './showCity'

//组合reducers
export default combineReducers({
  clickEvaluation,
  inputChange,
  cities,
  buildeList,
  districtList,
  confirmBuilding,
  confirmDistrict,
  feachDistrictPrice,
  feachFacility,
  ndChange,
  showCity
})
