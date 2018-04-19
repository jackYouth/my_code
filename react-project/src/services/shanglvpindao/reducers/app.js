import { mergeState } from '@boluome/common-lib'

const initialState = {
  title: 'shanglvpindao',
}

const app = (state = initialState, action) => {
  switch (action.type) {
    case 'ENTRY_ARR':
    case 'HOTEL_LIST':
    case 'SCENICS_LIST':
    case 'CURRENT_CITY':
    case 'SELECTED_ADDRESS':
      return mergeState(state, action)
    default: return state
  }
}

export default app
