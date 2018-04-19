import { mergeState } from '@boluome/common-lib'

const initialState = {
  title: 'jiadianqingxi',
}
const getListData = (state = initialState, action) => {
  switch (action.type) {
    case 'KJIN_LISTSHOW':
    case 'CHANGE_SELECTED_CITY':
      return mergeState(state, action)
    default: return state
  }
}

export default getListData
