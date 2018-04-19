import { mergeState } from '@boluome/common-lib'
import { dissoc } from 'ramda'

const initialState = {
  title: 'jiudian',
}

const order = (state = initialState, action) => {
  switch (action.type) {
    case 'SHOW_ROOMEID' :
    case 'PLAN_ID' :
    case 'ROOM_QUANTITY' :
    case 'AVAIL_DATA' :
    case 'ARRIVE_TIME' :
    case 'HANDLE_COUPON' :
    case 'CUSTOMER_NAME' :
    case 'CUSTOMER_PHONE' :
    case 'IS_GOGUARANTEE' :
    case 'LASTEST_ARRIVETIME' :
    case 'ROOMQUANTITY_Data' :
    case 'ARRIVETIME_DATA' :
    case 'BILL_INFO' :
    case 'IS_PASS' :
      return mergeState(state, action)
    case 'CLEAN_SOME' :
      state = dissoc('lastestArriveTime', state)
      state = dissoc('choosenArriveTime', state)
      state = dissoc('choosenQuantity', state)
      state = dissoc('customerPhone', state)
      state = dissoc('customerName', state)
      state = dissoc('quantity', state)
      return state
    default: return state
  }
}

export default order
