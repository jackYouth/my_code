import { mergeState } from '@boluome/common-lib'

const initialState = {
  title: 'jiadianqingxi',
}
const getDetailsData = (state = initialState, action) => {
  switch (action.type) {
    case 'KJIN_DETAILSHOW' :
    case 'CHANGE_SELECTED_GOODS' :
      return mergeState(state, action)
    default: return state
  }
}

export default getDetailsData
