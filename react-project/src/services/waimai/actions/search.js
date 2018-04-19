import { Loading } from '@boluome/oto_saas_web_app_component'
import { get } from 'business'

export const searchThis = (postdata, callback) => {
  const handleClose = Loading()
  get('/waimai/v1/restaurants_foods', postdata)
  .then(({ code, data = [], message }) => {
    if (code === 0) {
      callback(data)
    } else {
      console.log(message)
    }
    handleClose()
  }).catch(err => {
    callback(err)
    console.log('restaurants_foods', err)
    handleClose()
  })
}

export const handleScrollTop = () => {
  const oldScrollTop = document.querySelector('.dataList').scrollTop
  return {
    type: 'OLD_SCROLLTOP',
    oldScrollTop,
  }
}
