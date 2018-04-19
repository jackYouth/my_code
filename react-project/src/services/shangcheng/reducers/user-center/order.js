import { mergeState } from '@boluome/common-lib'

const initialState = {}

const order = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_ADDRESS_AVAIL':
    case 'SET_CURRENT_ADDRESS':
    case 'SET_CURRENT_FREIGHT':
    case 'SET_CURRENT_FREIGHT_PARAS':
    case 'SET_CURRENT_REMARK':
    case 'SET_INVOICE_INFO':
      return mergeState(state, action)
    default:
      return state
  }
}

export default order
