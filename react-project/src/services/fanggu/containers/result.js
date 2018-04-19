import { connect } from 'react-redux'
import { get, send, getStore } from '@boluome/common-lib';
import { feachDistrictPrice , feachFacility , getBmap } from '../actions/result'
import { confirmDistrict } from '../actions/chooseDistrict'
import { confirmBuilding } from '../actions/chooseBuilde'
import { dyChange , floorChange , sumFloorChange , areaChange , ndChange , chooseCx } from '../actions'
import { wrap } from '@boluome/oto_saas_web_app_component'


import result from '../components/result'

const mapStateToProps = (state) => {

  // console.log('current state=============', state)

  const { inputChange , confirmBuilding , confirmDistrict , feachDistrictPrice , feachFacility , ndChange } = state

  return {
    ...inputChange,
    ...confirmBuilding,
    ...confirmDistrict,
    ...feachDistrictPrice,
    ...feachFacility,
    ...ndChange
  }
}

const mapDispatchToProps = dispatch => {
  return {
    dispatch,
    dyChange: val => dispatch(dyChange(val)),
    floorChange: val => dispatch(floorChange(val)),
    sumFloorChange: val => dispatch(sumFloorChange(val)),
    areaChange: val => dispatch(areaChange(val)),
    ndChange: val => dispatch(ndChange(val)),
    chooseCx: (i , index) => dispatch(chooseCx(i , index)),
    confirmDistrict: (address,residentialareaName) => dispatch(confirmDistrict(address,residentialareaName)),
    confirmBuilding: (id , building) => dispatch(confirmBuilding(id,building)),
    feachFacility: (residentialareaName) => dispatch(feachFacility(residentialareaName))
  }
}

const mapFuncToComponent = (dispatch, state) => {
  return {
    componentWillMount: () => {
      dispatch(feachDistrictPrice(state))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(wrap(mapFuncToComponent)(result))
