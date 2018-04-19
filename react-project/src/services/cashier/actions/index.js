import { afterOrdering, get } from 'business'

export const togglePageLoading = data => {
  return {
    type: 'TOGGLE_PAGE_LOADING',
    ...data,
  }
}

export const fetchOrderLite = (id, subId, orderType) => dispatch => {
  get(`/order/v1/lite/${ id }`, { id, subId, orderType })
  .then(({ code, data, message }) => {
    if (code === 0) {
      afterOrdering(data)
      dispatch(togglePageLoading({ loading: false }))
      dispatch({ type: 'FETCH_ORDER_LITE_SUCCESS', orderlite: data })
    } else {
      console.log(message)
    }
  })
}
