const initialState = {}

const buildeList = (state = initialState, action) => {
  switch (action.type) {
    case 'FEACH_BUILDE':
        delete action.type;
        return Object.assign({}, state, action)
    default: return state
  }
}

export default buildeList
