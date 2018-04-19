import { mergeState } from '@boluome/common-lib'
const initialState = {}

const feachDistrictPrice = (state = initialState, action) => {
  switch (action.type) {
    case 'FEACH_DISTRICTPRICE':
        return mergeState(state, action)
    default: return state
  }
}

export default feachDistrictPrice
