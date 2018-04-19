import { mergeState, getStore } from '@boluome/common-lib'

const initialState = {
  contactorName:  '',
  contactorPhone: getStore('userPhone', 'session') || '',
  bool:           false,
  invoiceData:    '',
}

const order = (state = initialState, action) => {
  switch (action.type) {
    case 'ORD_RESET':
      return mergeState(state, action)
    case 'ORD_INIT':
      return initialState
    default: return state
  }
}

export default order
