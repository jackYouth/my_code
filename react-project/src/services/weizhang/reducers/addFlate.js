import { mergeState, getStore } from "@boluome/common-lib"

//默认数据
const initailState = {
  id:'',
  vin:'',
  engineNo:'',
  plateNumber:['京','','','','','',''],
  currentIndex:'',
  carName:'',
  carPhone:getStore('userPhone', 'session')||'',
  CardNo:'',
  FileNumber:'',
  FilePhone:'',
  XingShiZhengHao:'',
  readOnly:false,
  vinLength:0,
  engineNoLength:0
}

const addFlate = (state = initailState, action) => {
  switch(action.type){
    case "ADD_INIT":
      return initailState
    case "ADD_PREFIX":
    case "ADD_RESET":
      return mergeState(state, action)
    default :
      return state
  }
}


export default addFlate
