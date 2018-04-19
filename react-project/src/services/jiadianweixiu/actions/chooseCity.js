export const chooseCity = result => {
  return {
    type: 'GET_CITIES',
    city: result,
  }
}
