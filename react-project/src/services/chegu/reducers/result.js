import { mergeState } from '@boluome/common-lib'

const initialState = {
  title: 'chegu'
}

const result = (state = initialState, action) => {
    switch (action.type) {
      case 'FEACH_CARPRICE':
        return mergeState(state, action)
      default: return state
    }
}

export default result;
