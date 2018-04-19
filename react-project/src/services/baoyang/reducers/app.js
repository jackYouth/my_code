import { mergeState } from '@boluome/common-lib'

const initialState = {
  channel:        'diandian',
  offset:         0,
  currentAddress: '定位中...',
  point:          {},
  nolocation:     false,
}

const app = (state = initialState, action) => {
  switch (action.type) {
    case 'UPDATE_OFFSET':
    case 'CHANGE_ADDRESS':
    case 'NOLOCATION':
      return mergeState(state, action)
    default:
      return state
  }
}

export default app
