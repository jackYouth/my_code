import { mergeState } from '@boluome/common-lib'

const initialState = {}

const GetCardsList = (state = initialState, action) => {
  switch (action.type) {
    case 'GET_CARDS':
      return mergeState(state, action)
    default: return state
  }
}

export default GetCardsList
