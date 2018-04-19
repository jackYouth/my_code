import { mergeState } from '@boluome/common-lib'

const initialState = {
  title: 'konggang-order',
}

const detail = (state = initialState, action) => {
  switch (action.type) {
    case 'HANDLE_COUPON' :
      return mergeState(state, action)
    default: return state
  }
}

export default detail
