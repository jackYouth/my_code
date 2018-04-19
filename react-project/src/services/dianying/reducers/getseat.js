import { mergeState } from '@boluome/common-lib'

const initialState = {
  seatNo: '[]',
}
const getseat = (state = initialState, action) => {
  switch (action.type) {
    case 'GET_RESET':
      return mergeState(state, action)
    case 'GET_INIT':
      return initialState
    default: return state
  }
}

export default getseat
