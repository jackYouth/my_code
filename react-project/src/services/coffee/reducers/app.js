import { mergeState } from '@boluome/common-lib'

const initialState = {
  title:        'coffee',
  markPopup:    true,
  goodsCartarr: [],
  isScroll:     true,
  top:          210,
  tagsClick:    true,
  tagsIndex:    0,
  nolocation:   true,
  contactData:  [],
  outRange:     false,
}

const app = (state = initialState, action) => {
  switch (action.type) {
    case 'KJIN_GOODSLIST' :
    case 'MARK_POPUP' :
    case 'GOODS_CARTARR' :
    case 'KJIN_CONTACTLIST' :
    case 'KJIN_OPTIMALCONTACT' :
    case 'CONTACTID' :
    case 'TITLE_ADDRESS' :
    case 'SCROLLTOP' :
    case 'IS_SCROLL' :
    case 'STYLE_TOP' :
    case 'TAGSCLICK' :
    case 'TAGS_INDEX' :
    case 'FOOD_SCROLL' :
    case 'FOODS_DOM' :
    case 'NOLOCATION' :
    case 'KJIN_OUTRANGE' :
      return mergeState(state, action)
    default: return state
  }
}

export default app
