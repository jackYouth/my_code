import { mergeState } from '@boluome/common-lib'

const initialState = {}

const DiscountPrice = (state = initialState, action) => {
  switch (action.type) {
    case 'GET_COUPONID':
      return mergeState(state, action)
    default: return state
  }
}


export default DiscountPrice
