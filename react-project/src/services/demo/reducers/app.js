// import { mergeState } from '@boluome/common-lib'

const initialState = {}

const test = (state = initialState, action) => {
  switch (action.type) {
      // case 'CHANGE_PAGE':
      //   return mergeState(state, action)
    default:
      return state
  }
}

export default test
