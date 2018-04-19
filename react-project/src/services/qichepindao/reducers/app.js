import { mergeState, getStore } from '@boluome/common-lib'

const initialState = {
  cityName:        '上海',
  keys:            getStore('keys', 'session') || 'hot',
  regionWrap:      false,
  regionCon:       '',
  totalFine:       '',
  totalPoints:     '',
  untreated:       '',
  violations:      [],
  totalserviceFee: '',
  isError:         true,
}

const app = (state = initialState, action) => {
  switch (action.type) {
    case 'ADD_RESET':
      return mergeState(state, action)
    default: return state
  }
}

export default app
