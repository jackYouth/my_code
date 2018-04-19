import { mergeState } from '@boluome/common-lib'

const initialState = {
  title: 'huoche',
}

const refund = (state = initialState, action) => {
  switch (action.type) {
    case 'CHANGE_DATA' :
      return mergeState(state, action)
    default: return state
  }
}

export default refund
