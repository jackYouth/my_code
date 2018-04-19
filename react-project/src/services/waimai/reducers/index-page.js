import { mergeState } from '@boluome/common-lib'

const initialState = {
  title:            'takeaway-index',
  offset:           0,
  shoppingCarArray: {},
  mapType:          'gaode',
}

const indexPage = (state = initialState, action) => {
  switch (action.type) {
    case 'HANDLE_ADDRESS' :
    case 'GET_CATEGORY' :
    case 'GET_RESTAURANT' :
    case 'CHANGE_OFFSETTT':
    case 'GO_FILTER' :
    case 'FETCH_DATA' :
    case 'REST_LIST' :
    case 'OLD_SCROLLTOP' :
    case 'BEST_CONTACT' :
    case 'LOCATION_ERR' :
    case 'MAP_TYPE' :
    case 'SHOW_GOTOP' :
    case 'RECOMMEND_FILTER' :
    case 'ISSHOW_RECOMMEND' :
    case 'HANDLE_COMMENDFILTER' :
      return mergeState(state, action)
    default: return state
  }
}

export default indexPage
