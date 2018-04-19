import { mergeState } from '@boluome/common-lib'

const initialState = {
  title:   'jiudian',
  channel: 'ctrip',
}

const app = (state = initialState, action) => {
  switch (action.type) {
    case 'CITY_DATA' :
    case 'PRICEFILTER_DATA' :
    case 'CURRENT_ADDRESS' :
    case 'DATE_INFO' :
    case 'CURRENT_CITY' :
    case 'IS_DETAIL' :
    case 'SET_CHANNEL' :
      return mergeState(state, action)
    default: return state
  }
}

export default app
