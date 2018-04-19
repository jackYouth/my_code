import { mergeState } from '@boluome/common-lib'

const initialState = {}

const invoiceInfo = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_invoiceInfo_SELECTE':
    case 'SET_invoiceInfo_ALL_SELECTE':
      return mergeState(state, action)
    default:
      return state
  }
}

export default invoiceInfo
