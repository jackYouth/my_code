import { mergeState, clone } from '@boluome/common-lib'

const initialState = {}

const inputChange = (state = initialState, action) => {
  switch (action.type) {
    case 'DY_CHANGE':
        return mergeState(state, action)
    case 'FLOOR_CHANGE':
        return mergeState(state, action)
    case 'SUMFLOOR_CHANGE':
        return mergeState(state, action)
    case 'AREA_CHANGE':
        return mergeState(state, action)
    case 'ND_CHANGE':
        return mergeState(state, action)
    case 'CHOOSE_CX':
        return mergeState(state, action)
    case 'BUILDING_CHANGE':
        return mergeState(state, action)
    default: return state
  }
}

export default inputChange
