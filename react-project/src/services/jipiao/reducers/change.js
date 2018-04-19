import { mergeState } from '@boluome/common-lib'

const initialState = {
  refundCauseId: [1],
  changeArr:     [
    {
      value: 1,
      label: '我要改变行程计划、我要改航班',
    },
    {
      value: 2,
      label: '选错日期、选错航班',
    },
    {
      value: 3,
      label: '航班延误或取消、航班时刻变更',
    },
  ],
}

const change = (state = initialState, action) => {
  switch (action.type) {
    case 'CHE_RESET':
      return mergeState(state, action)
    case 'CHE_INIT':
      return initialState
    default: return state
  }
}

export default change
