import { mergeState } from '@boluome/common-lib'

const initialState = {
  title: 'orderDetails',
}

const orderDetails = (state = initialState, action) => {
  switch (action.type) {
    case 'ORDER_ID' :
      return mergeState(state, action)
    default: return state
  }
}

export default orderDetails
