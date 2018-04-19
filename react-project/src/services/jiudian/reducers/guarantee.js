import { mergeState } from '@boluome/common-lib'

const initialState = {
  title: 'jiudian',
}

const guarantee = (state = initialState, action) => {
  switch (action.type) {
    case 'CARD_NO' :
    case 'CARD_INFO' :
    case 'CVV_NO' :
    case 'VALID_DATE' :
    case 'USER_NAME' :
    case 'USER_ID' :
    case 'USER_PHONE' :
      return mergeState(state, action)
    default: return state
  }
}

export default guarantee
