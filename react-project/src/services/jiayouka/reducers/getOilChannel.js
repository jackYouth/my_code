import { mergeState } from '@boluome/common-lib'

const initialState = {}

const GetOilChannel = (state = initialState, action) => {
  switch (action.type) {
    case 'GET_OILCHANNEL':
      return mergeState(state, action)
    default: return state
  }
}

export default GetOilChannel
