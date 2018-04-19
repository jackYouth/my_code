import { mergeState } from '@boluome/common-lib'

const initialState = {

}

const select = (state = initialState, action) => {
  switch (action.type) {
    case 'SEL_RESET':
      return mergeState(state, action)
    case 'SEL_INIT':
      return initialState
    default: return state
  }
}

export default select
