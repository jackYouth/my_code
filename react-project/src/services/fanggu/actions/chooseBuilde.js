import { get, send , getStore, setStore } from '@boluome/common-lib';
import { Loading }   from '@boluome/oto_saas_web_app_component'
import { Toast } from 'antd-mobile';

export const confirmBuilding = (buildingId , buildingName) => {
  return {
    type: 'CONFIRM_BUILDING',
    buildingId,
    buildingName
  }
}
