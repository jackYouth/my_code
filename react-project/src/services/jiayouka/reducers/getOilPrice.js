import { mergeState } from '@boluome/common-lib'

const initialState = {}

const GetOilPrice = (state = initialState, action) => {
  switch (action.type) {
    case 'GET_OILPRICE':
      return mergeState(state, action)
    default: return state
  }
}


export default GetOilPrice
