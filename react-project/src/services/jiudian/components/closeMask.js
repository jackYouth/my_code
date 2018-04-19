const closeMask = () => {
  const mask = document.querySelector('.mask-container')
  if (mask) {
    const myMask = document.querySelector('.mask-container').parentNode
    if (myMask) {
      myMask.parentNode.removeChild(myMask)
      document.body.style.overflow = ''
      document.documentElement.style.overflow = ''
    }
  }
}
export default closeMask
