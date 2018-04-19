import { mergeState } from '@boluome/common-lib'

const initialState = {}

const ChangeTab = (state = initialState, action) => {
  switch (action.type) {
    case 'CHANGE_TAB':
      return mergeState(state, action)
    default: return state
  }
}

export default ChangeTab
