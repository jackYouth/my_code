import { mergeState } from '@boluome/common-lib'

const initialState = {
  title: 'jiadianweixiu'
}

const app = (state = initialState, action) => {
    switch (action.type) {
      case 'CHANGE_SELECTED_GOODS' :
        console.log('appsmarge------',return state);
        default: return state;
    }
}

export default app;
