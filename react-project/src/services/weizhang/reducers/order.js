import { mergeState, getStore } from "@boluome/common-lib"

const initialState = {
  curDiscountData:{
    coupon:'',
    activity: '',
    discount:0
  }
}

const order = (state = initialState, action) => {
  switch(action.type){
    case "ORDER_RESET":
      return mergeState(state, action)
    default :
      return state
  }
}


export default order
