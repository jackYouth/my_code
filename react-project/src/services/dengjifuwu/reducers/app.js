import { mergeState } from '@boluome/common-lib'

const initialState = {
  title:   'konggang',
  channel: 'trvok',
}

const app = (state = initialState, action) => {
  switch (action.type) {
    case 'AREA_INFO' :
    case 'THIS_DATA' :
    case 'CHOOSE_TERMINAL' :
    case 'CHOOSE_INTERNATIONAL' :
    case 'AIRPORT_INFO' :
      return mergeState(state, action)
    default: return state
  }
}

export default app
