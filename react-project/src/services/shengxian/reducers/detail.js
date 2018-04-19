import { mergeState } from '@boluome/common-lib'

const initialState = {
  data:          ['AiyWuByWklrrUDlFignR', 'TekJlZRVCjLFexlOCuWn', 'IJOtIlfsYdTyaDTRVrLI'],
  initialHeight: 200,
  num:           1,
  detMask:       false,
}
const detail = (state = initialState, action) => {
  switch (action.type) {
    case 'DET_INIT':
      return initialState
    case 'DET_RESET':
      return mergeState(state, action)
    default: return state
  }
}

export default detail
