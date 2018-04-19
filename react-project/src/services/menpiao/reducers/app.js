import { mergeState } from '@boluome/common-lib'

const initialState = {
  title:     'menpiao',
  offset:    0,
  theme:     '',
  level:     '',
  sort:      '',
  themeMark: false,
  levelMark: false,
  sortMark:  false,
  themePic:  false,
  levelPic:  false,
  sortPic:   false,
  width:     170,
  height:    210,
  Gocity:    false,
  filtered:  {},
  filtering: false,
}

const app = (state = initialState, action) => {
  switch (action.type) {
    case 'KJIN_INDEXLISTDATA' :
    case 'KJIN_THEMEDATA' :
    case 'CHANGE_SELECTED_CITY' :
    case 'KJIN_CITY_DATA' :
    case 'CITY' :
    case 'PROV' :
    case 'LAT' :
    case 'LNG' :
    case 'OFFSET' :
    case 'THEME' :
    case 'LEVEL' :
    case 'SORT' :
    case 'THEME_MARK' :
    case 'LEVEL_MARK' :
    case 'SORT_MARK' :
    case 'THEME_PIC' :
    case 'LEVEL_PIC' :
    case 'SORT_PIC' :
    case 'DIV_WIDTH' :
    case 'DIV_HEIGHT' :
    case 'GOCHOOSE_CIYTNAME' :
    case 'FILTERING' :
      return mergeState(state, action)
    default: return state
  }
}

export default app
