import { mergeState } from '@boluome/common-lib'

const initialState = {
  title:  'takeaway-filter',
  // offset: 0,
}

const filter = (state = initialState, action) => {
  switch (action.type) {
    case 'FILTER_RESTAURANTS' :
    case 'HANDLE_SHOWFILTER' :
    case 'CHANGE_OFFSET':
    case 'ORDERBY_CHANGE':
    case 'HANDLE_CHECKED':
    case 'INVOICE_CHANGE':
    case 'VIPDELIVERY_CHANGE':
      return mergeState(state, action)
    default: return state
  }
}

export default filter
