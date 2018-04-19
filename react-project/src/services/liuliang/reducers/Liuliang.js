import { mergeState, setStore } from '@boluome/common-lib'

const liuliang = (state = {}, action) => {
  switch (action.type) {
    case 'SET_CZ':    // 充值页面使用
      return {}
    case 'SET_LL_CURPHONE':
      setStore('chongzhiPhone', action.curPhone, 'session')
      return mergeState(state, action)
    case 'QUERY_Liuliang':
    case 'SET_LL_NUMBER_INFO':
    case 'SELECTED_LL':
    case 'SHOW_LL_HISTORY':
    case 'PHONE_LL_HISTORY':
    case 'SET_LL_IPT_CLICK':
    case 'SET_LL_FOCUS_CONDITION':
    case 'SET_LL_CURRENT_DISCOUNT':
      return mergeState(state, action)
    default :
      return state
  }
}

export default liuliang
