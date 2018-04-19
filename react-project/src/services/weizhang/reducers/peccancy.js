import { mergeState, dissoc } from "@boluome/common-lib"


//默认数据
const initailState = {
  quanxuan:true,
  noQuanxuan:true
}

const peccancy = (state = initailState, action) => {
  switch(action.type){
    case "PECCANCY_LIST":
    case "PRECC_RESET":
      return mergeState(state, action)
    default :
      return state
  }
}

export default peccancy
