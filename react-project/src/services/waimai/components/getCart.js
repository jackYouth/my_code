const getCart = shoppingCart => {
  const realCart = shoppingCart.reduce((arr, curr) => {
    if (!curr.foods) {
      return arr.concat(curr)
    }
    return arr.concat(curr.foods)
  }, []).sort((a, b) => { return b.discountPrice - a.discountPrice })
  realCart.forEach((o, i) => {
    const discountObj = realCart[0]
    // console.log('realCart i', o, discountObj)
    if (i > 0) {
      // console.log('in if')
      realCart[i].realPrice = ''
    } else if (o.activity && o.activity.fixedPrice === -1) {
      // console.log('in else if')
      realCart[i].realPrice = (discountObj.originalPrice * discountObj.quantity) - (discountObj.originalPrice - (discountObj.originalPrice * discountObj.discount))
    } else {
      // console.log('in else ', discountObj)
      realCart[i].realPrice = (discountObj.originalPrice * discountObj.quantity) - (discountObj.originalPrice - discountObj.price)
    }
  })
  return realCart
}
export default getCart
