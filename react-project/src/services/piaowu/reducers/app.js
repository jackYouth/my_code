import { mergeState } from '@boluome/common-lib'

const initialState = {
  title:      'piaowu',
  filtering:  false,
  filterdata: {
    categoryCode: [
      {
        code:   0,
        text:   '全部分类',
        choose: false,
      },
    ],
    sort: [
      {
        code:   0,
        text:   '默认排序',
        choose: false,
      },
      {
        code:   'time',
        text:   '按时间',
        choose: false,
      },
      {
        code:   'hot',
        text:   '按热度',
        choose: false,
      },
    ],
    timeRange: [
      {
        code:   0,
        text:   '全部时间',
        choose: false,
      },
      {
        code:   'in_week',
        text:   '一周内',
        choose: false,
      },
      {
        code:   'in_month',
        text:   '一月内',
        choose: false,
      },
    ],
  },
  filtered: {
    categoryCode: 0,
    sort:         0,
    timeRange:    0,
  },
}

const app = (state = initialState, action) => {
  switch (action.type) {
    case 'APP_RESET':
      return mergeState(state, action)
    default: return state
  }
}

export default app
