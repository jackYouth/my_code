export const handleChooseTimes = chooseTimes => {
  return {
    type: 'CHOOSE_TIMES',
    chooseTimes,
  }
}

export const returnThisData = thisData => dispatch => {
  dispatch({
    type: 'THIS_DATA',
    thisData,
  })
}
