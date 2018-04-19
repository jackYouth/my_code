import { getStore, parseLocName, setStore } from '@boluome/common-lib';
import { Loading }   from '@boluome/oto_saas_web_app_component'
import { get } from 'business'

export const featchCarBrands = () => dispatch => {
  const handleClose = Loading()
  get( '/chegu/v1/car/brands' )
  .then(({ code, data = {}, message }) => {
    if(code === 0) {
      if (data.hotBransList && data.hotBransList.length > 0){
        dispatch({
          type: 'HOT_BRANDLIST',
          hotBrandList: data.hotBransList
        })
      }
      if (data.brands && data.brands.length > 0){
        let reply = []
        let index = 0
        let mapedData = data.brands.sort((a, b) => a.brandFl.charCodeAt() - b.brandFl.charCodeAt() ).reduce((nameMap, current) => {
          let { brandFl } = current
          if(nameMap[brandFl]) {
            nameMap[brandFl].push(current)
          } else {
            nameMap[brandFl] = [ current ]
          }
          return nameMap
        }, {})
        for(let k in mapedData) {
          reply[index++] = {
            key : k,
            data: mapedData[k]
          }
        }
        dispatch({
          type: 'BRAND_LIST',
          brands: reply
        })
      }
    } else {
      console.log(message)
    }
    handleClose()
  }).catch(err => {
    handleClose()
    console.log(err);
  })
}


export const handleChooseCar = (result) => {
  return {
    type: 'CHOOSE_CAR',
    chooseResult: result
  }
}
