import { mergeState } from '@boluome/common-lib'

const initialState = {
  title:      'daijia',
  startPoint: {},
}

const app = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_START_POINT':
    case 'GET_CAR_NUM':
    case 'CHANGE_ADDRESS_COMPONENT_SELECT':
    case 'SHOW_ONGOING_MODAL':
      return mergeState(state, action)
    default:
      return state
  }
}

export default app
