import { mergeState } from '@boluome/common-lib'

const initialState = {
  promotion: {
    discount: 0,
  },
  phone: '',
}

const confirm = (state = initialState, action) => {
  switch (action.type) {
    case 'PROMOTION_CHANGE' :
    case 'PHONE' :
      return mergeState(state, action)
    default: return state
  }
}

export default confirm
