import { mergeState } from '@boluome/common-lib'

const initialState = {
  title: 'jiudian',
}

const condition = (state = initialState, action) => {
  switch (action.type) {
    case 'FILTER_CONDITIONS' :
    case 'FILTER_ZONES' :
    case 'SHOW_INDEX' :
    case 'CHOOSE_CONDITIONS' :
    case 'CHANGE_OFFSET' :
      return mergeState(state, action)
    default: return state
  }
}

export default condition
