import { get, send , getStore} from '@boluome/common-lib';
import { Loading }   from '@boluome/oto_saas_web_app_component'
import { dyChange , floorChange , sumFloorChange , areaChange , ndChange , chooseCx , buildingChange } from './index'
import { confirmDistrict } from './chooseDistrict'

export const chooseCity = (result) => dispatch => {
  
  let oldCity
  if(getStore('chooseCity')){
    oldCity = getStore('chooseCity','session')
  } else {
    oldCity = getStore('currentPosition','session').city.replace(/["省", "市", "区", "县"]/, "")
  }

  if( result.name != oldCity ){
    dispatch(dyChange(''))
    dispatch(floorChange(''))
    dispatch(sumFloorChange(''))
    dispatch(areaChange(''))
    dispatch(ndChange(''))
    dispatch(chooseCx(''))
    dispatch(buildingChange(''))
    dispatch(confirmDistrict(''))
  }
  dispatch({
    type: 'GET_CITIES',
    city: result
  })
}
