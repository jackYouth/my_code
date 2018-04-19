import { mergeState } from '@boluome/common-lib'

const initialState = {
  title: 'takeaway-order',
}

const order = (state = initialState, action) => {
  switch (action.type) {
    case 'BEST_CONTACT' :
    case 'CHOOSE_CONTACT' :
    case 'ARRIVE_TIME' :
    case 'CART_DATA' :
    case 'USER_TIPS' :
    case 'HANDLE_COUPON' :
    case 'SHOW_BOTTOMADDRESS' :
      return mergeState(state, action)
    default: return state
  }
}

export default order
