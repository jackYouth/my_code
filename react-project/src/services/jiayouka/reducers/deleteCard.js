import { mergeState } from '@boluome/common-lib'

const initialState = {}

const DeleteCard = (state = initialState, action) => {
  switch (action.type) {
    case 'DELETE_CARD':
      return mergeState(state, action)
    default: return state
  }
}


export default DeleteCard
