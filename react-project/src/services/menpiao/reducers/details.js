import { mergeState } from '@boluome/common-lib'

const initialState = {
  title: 'menpiao',
  close: 0,
}

const Details = (state = initialState, action) => {
  switch (action.type) {
    case 'KJIN_DETAILSLISTDATA' :
    case 'KJIN_DETAILSLIS' :
    case 'KJIN_DETAILSINTRODUCED' :
    case 'KJIN_PICSHOWDATA' :
    case 'CHOOSE_IMGINDEX' :
    case 'ISORNO_SHOWPIC' :
    case 'kJIN_ORDERLISTDATA' :
    case 'kJIN_TOURISTLISTDATA' :
    case 'kJIN_ORDERTIMEDATA' :
    case 'MARKE_CLOSE' :
      return mergeState(state, action)
    default: return state
  }
}

export default Details
