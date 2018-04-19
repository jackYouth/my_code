import { mergeState } from '@boluome/common-lib'

const initialState = {
  title: 'chegu'
}

const firstDate = (state = initialState, action) => {
    switch (action.type) {
      case 'DATE_CHANGE':
        delete action.type;
        return Object.assign({}, state, action)
      default: return state
    }
}

export default firstDate;
