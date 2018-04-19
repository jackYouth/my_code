import px2rem       from 'postcss-pxtorem'

export default (
  [
    px2rem({
      rootValue    : 100,
      propWhiteList: [],
    })
  ]
)
