import { mergeState } from '@boluome/common-lib'

const initialState = {}

const page1 = (state = initialState, action) => {
  switch (action.type) {
    case 'CHANGE_NUM' :
      return mergeState(state, action)
    default:
      return state
  }
}

export default page1
