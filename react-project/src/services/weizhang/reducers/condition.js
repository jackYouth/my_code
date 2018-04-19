import { mergeState, getStore } from "@boluome/common-lib"



const condition = (state = {yanzheng:true}, action) => {
  switch(action.type){
    case "CON_RESET":
      return mergeState(state, action)
    default :
      return state
  }
}


export default condition
