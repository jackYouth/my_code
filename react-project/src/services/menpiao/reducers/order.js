import { mergeState } from '@boluome/common-lib'

const initialState = {
  title:           'menpiao',
  goodsCardata:    [],
  sum:             1,
  chooseType:      0,
  name:            '',
  phone:           '',
  curDiscountData: { coupon: {}, activity: {}, discount: 0 },
  discount:        0,
  orderHeight:     '100%',
  countPrice:      0,
  emailVal:        '',
}

const Order = (state = initialState, action) => {
  switch (action.type) {
    case 'kJIN_ORDERLISTDATA' :
    case 'kJIN_TOURISTLISTDATA' :
    case 'kJIN_ORDERTIMEDATA' :
    case 'LINITE_UP' :
    case 'SUM' :
    case 'LINITE_DOWN' :
    case 'GOODSCARDATA' :
    case 'COUNTPTICES' :
    case 'CHOOSE_TYPE' :
    case 'KJIN_MORENPRICE' :
    case 'ORDER_NAME' :
    case 'ORDER_PHONE' :
    case 'KJIN_PROMOTION' :
    case 'DISCOUNT' :
    case 'ORDERHEIGHT' :
    case 'EMAIL_VALUE' :
      return mergeState(state, action)
    default: return state
  }
}

export default Order
