import { mergeState } from '@boluome/common-lib'

const initialState = {
  title:  'menpiao',
  offset: 0,
  theme:  '',
  level:  '',
  sort:   '',
}

const Search = (state = initialState, action) => {
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
    case 'KEYWORD_ARR' :
      return mergeState(state, action)
    default: return state
  }
}

export default Search
