import { mergeState } from '@boluome/common-lib'

const initialState = {
  statusText: ['待寄出', '已邮寄', '已取消', '', '待支付', '取消中'],
}

const remail = (state = initialState, action) => {
  switch (action.type) {
    case 'REM_RESET':
      return mergeState(state, action)
    case 'REM_INIT':
      return initialState
    default: return state
  }
}

export default remail
