import { getStore} from '@boluome/common-lib';
import { Loading }   from '@boluome/oto_saas_web_app_component'

export const showCity = () => {
  // const handleClose = Loading()
  let city = getStore('currentPosition','session').city.replace(/["省", "市", "区", "县"]/, "")
  // console.log('resultcity----------',city);
  return {
    type: 'SHOW_CITY',
    showCity: city
  }
}
