import { connect } from 'react-redux'
import { parseQuery }  from '@boluome/common-lib'
import { wrap } from '@boluome/oto_saas_web_app_component'
import { Modal } from 'antd-mobile'
import Addr from '../components/addr'
import { addrReset } from '../actions/addr.js'

const alert = Modal.alert

const mapStateToProps = state => {
  const { addr } = state
  return {
    ...addr,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    dispatch,
  }
}

const mapFunToComponent  = dispatch => {
  return {
    componentWillMount: () => {
      const search = parseQuery(location.search)
      const { addrTitlename, addrnameStr } = search
      const { AMap } = window
      console.log(addrTitlename, addrnameStr)
      AMap.service('AMap.Geocoder', () => {
        const geocoder = new AMap.Geocoder()
        geocoder.getLocation(addrTitlename, (status, result) => {
          if (status === 'complete' && result.info === 'OK') {
            console.log(result)
            const { geocodes } = result
            const { lat, lng } = geocodes[0].location
            dispatch(
              addrReset({
                addrTitlename,
                addrnameStr,
                longitude: lng,
                latitude:  lat,
              })
            )
          } else {
            geocoder.getLocation(addrnameStr, (sta, res) => {
              if (sta === 'complete' && res.info === 'OK') {
                console.log('二次搜索', res, addrTitlename)
                const { geocodes } = res
                const { lat, lng } = geocodes[0].location
                dispatch(
                  addrReset({
                    addrTitlename: addrTitlename || '演出场馆',
                    addrnameStr,
                    longitude:     lng,
                    latitude:      lat,
                  })
                )
              } else {
                console.log('二次搜索', sta, res)
                alert('', '此地址没有解析到结果', [
                  {
                    text:    '确定',
                    onPress: () => {
                      window.history.go(-1)
                    },
                  },
                ])
              }
            })
            // console.log(status, result)
            // alert('', '此地址没有解析到结果', [
            //   {
            //     text:    '确定',
            //     onPress: () => {
            //       window.history.go(-1)
            //     },
            //   },
            // ])
          }
        })
      })
      // const { BMap } = window
      // const myGeo = new BMap.Geocoder()
      // myGeo.getPoint(`${ addrTitlename }${ addrnameStr }`, e => {
      //   if (e) {
      //     console.log(e.lng, e.lat)
      //     dispatch(
      //       addrReset({
      //         addrTitlename,
      //         addrnameStr,
      //         longitude: e.lng,
      //         latitude:  e.lat,
      //       })
      //     )
      //   } else {
      //     alert('', '此地址没有解析到结果', [
      //       {
      //         text:    '确定',
      //         onPress: () => {
      //           window.history.go(-1)
      //         },
      //       },
      //     ])
      //   }
      // })
    },
  }
}

export default
  connect(mapStateToProps, mapDispatchToProps)(
    wrap(mapFunToComponent)(Addr)
  )
