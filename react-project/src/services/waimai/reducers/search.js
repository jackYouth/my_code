import { mergeState } from '@boluome/common-lib'

const initialState = {
  title: 'takeaway-search',
}

const searchProps = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_KEY' :
    case 'SEARCH_LIST' :
    case 'CHANGE_OFFSET' :
      return mergeState(state, action)
    default: return state
  }
}

export default searchProps
