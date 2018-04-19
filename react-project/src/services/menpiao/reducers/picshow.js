import { mergeState } from '@boluome/common-lib'

const initialState = {
  title:  'menpiao',
  width:  315,
  height: 180,
}

const Picshow = (state = initialState, action) => {
  switch (action.type) {
    case 'CHOOSE_IMGINDEX' :
    case 'ISORNO_SHOWPIC' :
    case 'DIV_WIDTH' :
    case 'DIV_HEIGHT' :
      return mergeState(state, action)
    default: return state
  }
}

export default Picshow
