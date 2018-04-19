import { mergeState, getStore } from '@boluome/common-lib'

const initialState = {
  timeSort:  '',
  priceSort: '',
  botShow:   true,
  date:      getStore('date', 'session'),
}

const air = (state = initialState, action) => {
  switch (action.type) {
    case 'AIR_INIT':
      return initialState
    case 'AIR_RESET':
      return mergeState(state, action)
    default: return state
  }
}

export default air
