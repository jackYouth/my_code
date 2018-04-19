import { mergeState } from '@boluome/common-lib'

const initialState = {
  refundCauseId: [16],
  refundArr:     [
    {
      value: 16,
      label: '我要改变行程计划、我不想飞了',
    },
    {
      value: 17,
      label: '填错名字、选错日期、选错航班',
    },
    {
      value: 18,
      label: '航班延误或取消、航班时刻变更',
    },
    {
      value: 19,
      label: '身体原因且有二级甲等医院<含>以上的医院证明',
    },
  ],
}

const refund = (state = initialState, action) => {
  switch (action.type) {
    case 'REF_RESET':
      return mergeState(state, action)
    case 'REF_INIT':
      return initialState
    default: return state
  }
}

export default refund
