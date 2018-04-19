import { mergeState } from '@boluome/common-lib'

const initialState = {
  title:       'coffee',
  tipsPrice:   0,
  deliverFees: 0,
  Promotion:   {},
  visible:     false,
  noteText:    '口味，偏好等',
}

const order = (state = initialState, action) => {
  switch (action.type) {
    case 'KJIN_GOODSLIST' :
    case 'MARK_POPUP' :
    case 'TIPSPRICE' :
    case 'KJIN_DELIVERTIME' :
    case 'AVAILABLETIME' :
    case 'MERCHANT' :
    case 'GOODS_CARTARR' :
    case 'ORDER_CONTACT' :
    case 'DELIVERFEE' :
    case 'NOTESTEXT' :
    case 'PROMOTION' :
    case 'VISIBLE' :
      return mergeState(state, action)
    default: return state
  }
}

export default order
