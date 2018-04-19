import { mergeState } from '@boluome/common-lib'

const initialState = {
  searchKey: '',
}

const selectOrg = (state = initialState, action) => {
  switch (action.type) {
    case 'CHANGE_SERVER_DATA':
    case 'CHANGE_CURRENT_ORG':
    case 'CHANGE_SEARCH_KEY' :
      return mergeState(state, action)
    default:
      return state
  }
}

export default selectOrg
