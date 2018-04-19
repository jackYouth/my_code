import { mergeState } from '@boluome/common-lib'

const initialState = {}
const picture = (state = initialState, action) => {
  switch (action.type) {
    case 'PIC_RESET':
      return mergeState(state, action)
    case 'PIC_INIT':
      return initialState
    default: return state
  }
}

export default picture
