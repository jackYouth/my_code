import { mergeState } from '@boluome/common-lib'

const initialState = {}

const ShowInfo = (state = initialState, action) => {
  switch (action.type) {
    case 'SHOW_INFO':
      return mergeState(state, action)
    default: return state
  }
}


export default ShowInfo
