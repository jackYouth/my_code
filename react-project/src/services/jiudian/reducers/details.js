import { mergeState } from '@boluome/common-lib'

const initialState = {
  title: 'jiudian',
}

const detail = (state = initialState, action) => {
  switch (action.type) {
    case 'HOTEL_DETAIL' :
    case 'HOTEL_ID' :
    case 'SHOW_ROOMEID' :
    case 'RATE_INFO' :
    case 'IMG_LIST' :
    case 'IS_LOADED' :
    case 'IS_DETAIL' :
      return mergeState(state, action)
    default: return state
  }
}

export default detail
