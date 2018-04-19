import { mergeState } from '@boluome/common-lib'

const d = new Date()
const dstr = d.toLocaleDateString()
const initialState = {
  fromCity: '太仓',
  toCity:   '北京',
  date:     dstr.replace(/\//g, '-'),
}

const app = (state = initialState, action) => {
  switch (action.type) {
    case 'ADD_RESET':
      return mergeState(state, action)
    default: return state
  }
}

export default app
