import { mergeState } from '@boluome/common-lib'

const initialState = {
  title:          'takeaway-restaurantDetail',
  bigCanScroll:   1,
  smallCanScroll: 1,
}

const restaurantDetail = (state = initialState, action) => {
  switch (action.type) {
    case 'RESTAURANT_MENU' :
    case 'RESTAURANT_INFO' :
    case 'DELIVERY_INFO' :
    case 'SHOW_ACT' :
    case 'BIG_SCROLL' :
    case 'SMALL_SCROLL' :
    case 'CHOOSE_MENU' :
    case 'RESTAURANT_ID' :
    case 'PHOTO_LIST' :
    case 'CHOOSE_SPECS' :
    case 'CHOOSE_ATTRS' :
    case 'CHANGED_KEY' :
    case 'ALL_FOODS' :
      return mergeState(state, action)
    default: return state
  }
}

export default restaurantDetail
