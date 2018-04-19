import { mergeState } from "@boluome/common-lib"


//默认数据
const initailState = {
  vin:'',
  engineNo:'',
  plateNumber:['京','','','','','',''],
  currentIndex:'',
  vinLength:0,
  engineNoLength:0,
  goSecond:false,
  carPhone:'',
}

const home = (state = initailState, action) => {
  switch(action.type){
    case "FIRST":
    case "HOME_RESET":
      return mergeState(state, action)
    default :
      return state
  }
}


export default home
