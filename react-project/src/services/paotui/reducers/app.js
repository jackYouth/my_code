import { mergeState } from '@boluome/common-lib'

const initialState = {
  title:       'paotui',
  textareaStr: '',
  files:       [],
  CUSTOMER:    true,
  chooseTime:  {},
}

const app = (state = initialState, action) => {
  switch (action.type) {
    case 'KJIN_GOODSLIST' :
    case 'TEATAREA' :
    case 'IMGSRC_FILES' :
    case 'SAAS_CUSTOMER' :
    case 'CALENDAR_TIME' :
      return mergeState(state, action)
    default: return state
  }
}

export default app
