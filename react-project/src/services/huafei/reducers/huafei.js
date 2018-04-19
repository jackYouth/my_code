import { mergeState, setStore } from '@boluome/common-lib'

const huafei = (state = {}, action) => {
  switch (action.type) {
    case 'SET_CZ':   // 充值页面使用
      return {}
    case 'SET_CURPHONE':
      setStore('chongzhiPhone', action.curPhone, 'session')
      return mergeState(state, action)
    case 'QUERY_HUAFEI':
    case 'SET_NUMBER_INFO':
    case 'SELECTED_HF':
    case 'SHOW_HISTORY':
    case 'PHONE_HISTORY':
    case 'SET_IPT_CLICK':
    case 'SET_FOCUS_CONDITION':
    case 'SET_CURRENT_DISCOUNT':
      return mergeState(state, action)
    default :
      return state
  }
}


export default huafei
