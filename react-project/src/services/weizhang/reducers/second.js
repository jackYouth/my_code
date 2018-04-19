import { mergeState } from "@boluome/common-lib"


//默认数据
const initailState = {
  datalist:[]
}

const second = (state = initailState, action) => {
  switch(action.type){
    case "SEC_RESET":
      return mergeState(state, action)
    default :
      return state
  }
}


export default second
