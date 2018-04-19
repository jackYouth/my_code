import { mergeState } from '@boluome/common-lib'

const initialState = {}

const EditInfo = (state = initialState, action) => {
  switch (action.type) {
    case 'EDIT_INFO':
      return mergeState(state, action)
    default: return state
  }
}


export default EditInfo
