import { mergeState } from '@boluome/common-lib'

const initialState = {
  title:         'paotui',
  orderTimeDate: [],
  deliverFees:   0,
  tipsPrice:     0,
  serviceDate:   '',
  contact:       '',
  shoppingAddr:  '',
  Promotion:     {},
  textareaStr:   '',
  focused:       false,
  files:         [],
}

const order = (state = initialState, action) => {
  switch (action.type) {
    case 'DATA' :
    case 'KJIN_DELIVERTIME' :
    case 'CONTACT' :
    case 'SHOPPING_ADDR' :
    case 'DISPLAYTAG' :
    case 'KJIN_OPTIMALCONTACT' :
    case 'DELIVERFEE' :
    case 'TEATAREAOrder' :
    case 'IMGSRC_FILES' :
    case 'TIPSPRICE' :
    case 'PROMOTION' :
    case 'FOCUSED' :
      return mergeState(state, action)
    default: return state
  }
}

export default order
