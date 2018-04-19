import { mergeState } from '@boluome/common-lib'

const initialState = {
  title: 'qichepindao',
}

const carType = (state = initialState, action) => {
  switch (action.type) {
    case 'HOT_BRANDLIST' :
      return mergeState(state, action)
    case 'BRAND_LIST' :
      return mergeState(state, action)
    case 'CAR_SERIES' :
      return mergeState(state, action)
    case 'CHOOSE_CAR' :
      return mergeState(state, action)
    default: return state
  }
}

export default carType
