import { mergeState } from '@boluome/common-lib'

const initialState = {
  title: 'jiudian',
}

const orderDetails = (state = initialState, action) => {
  switch (action.type) {
    case 'ORDER_ID' :
    case 'ORDERDETAILS_INFO' :
      return mergeState(state, action)
    default: return state
  }
}

export default orderDetails
