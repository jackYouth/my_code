import { mergeState } from "@boluome/common-lib"


//默认数据
const initailState = {
}

const mycar = (state = initailState, action) => {
  const merged = mergeState(state, action)

  switch(action.type){
    case "FLATE_LIST":
      return mergeState(state, action)
    default :
      return state
  }
}


export default mycar
