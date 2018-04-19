import { mergeState } from '@boluome/common-lib'

const initialState = {
  title: 'jiudian',
}

const hotelList = (state = initialState, action) => {
  switch (action.type) {
    case 'CHANGE_OFFSET' :
    case 'SORT_DATA' :
    case 'SHAIXUAN_DATA' :
    case 'WEIZHI_DATA' :
    case 'CHANGE_PAGEINDEX' :
    case 'PRICEFILTER_DATA' :
    case 'REST_LIST' :
    case 'OLD_SCROLLTOP' :
    case 'CHOOSE_CONDITIONS' :
      return mergeState(state, action)
    default: return state
  }
}

export default hotelList
