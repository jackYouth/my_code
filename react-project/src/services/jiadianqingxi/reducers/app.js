import { mergeState } from '@boluome/common-lib'

const initialState = {
  title:        'jiadianqingxi',
  selectedCIty: '上海',
}

const app = (state = initialState, action) => {
    switch (action.type) {
      case 'CHANGE_SELECTED_GOODS' :
      case 'CHANGE_SELECTED_CITY' :
        console.log('appsmarge------',return state);
        default: return state;
    }
}

export default app;
