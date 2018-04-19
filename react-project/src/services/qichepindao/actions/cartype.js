import { keys } from 'ramda'
import { Loading }   from '@boluome/oto_saas_web_app_component'
import { get } from 'business'

export const featchCarBrands = () => dispatch => {
  const handleClose = Loading()
  get('/chegu/v1/car/brands')
  .then(({ code, data = {}, message }) => {
    if (code === 0) {
      if (data.hotBransList && data.hotBransList.length > 0) {
        dispatch({
          type:         'HOT_BRANDLIST',
          hotBrandList: data.hotBransList,
        })
      }
      if (data.brands && data.brands.length > 0) {
        const reply = []
        const mapedData = data.brands.sort((a, b) => a.brandFl.charCodeAt() - b.brandFl.charCodeAt()).reduce((nameMap, current) => {
          const { brandFl } = current
          if (nameMap[brandFl]) {
            nameMap[brandFl].push(current)
          } else {
            nameMap[brandFl] = [current]
          }
          return nameMap
        }, {})
        const keysmap = keys(mapedData)
        for (let i = 0; i < keysmap.length; i++) {
          reply[i] = {
            key:  keysmap[i],
            data: mapedData[keysmap[i]],
          }
        }
        dispatch({
          type:   'BRAND_LIST',
          brands: reply,
        })
      }
    } else {
      console.log(message)
    }
    handleClose()
  }).catch(err => {
    handleClose()
    console.log(err)
  })
}

export const handleChooseCar = result => {
  return {
    type:         'CHOOSE_CAR',
    chooseResult: result,
  }
}
