import { mergeState } from '@boluome/common-lib'

const initialState = {
  title:       'coffee',
  ChooseGoods: '',
}

const details = (state = initialState, action) => {
  switch (action.type) {
    case 'GOODSDETAILS' :
    case 'MARK_POPUP' :
      return mergeState(state, action)
    default: return state
  }
}

export default details
