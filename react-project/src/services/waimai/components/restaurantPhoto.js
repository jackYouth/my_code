import React, { Component } from 'react'
import { Mask } from '@boluome/oto_saas_web_app_component'
import { Carousel } from 'antd-mobile'
import '../style/restaurantPhoto.scss'

// 商家资质
class RestaurantPhoto extends Component {
  constructor(props) {
    super(props)
    this.state = {
      nameArrIndex: 0,
    }
  }

  showRestPhoto(currIndex) {
    const { datas } = this.props
    const { nameArrIndex } = this.state
    // console.log('nameArrIndex', nameArrIndex)
    const imgArr = []
    const nameArr = []
    Object.keys(datas).forEach(i => {
      if (datas[i].url.length > 0) {
        imgArr.push(datas[i].url)
        nameArr.push(datas[i].typeName)
      }
    })
    const newArr = imgArr.reduce((am, c) => { return am.concat(c) }, [])
    const newNameArr = nameArr.reduce((ams, cs) => { return ams.concat(cs) }, [])
    // console.log('newNameArr', nameArr, newNameArr)
    Mask(
      <div className='RestaurantPhoto-layer-container'>
        {
          newNameArr.length > 0 ?
            <div style={{ position: 'fixed', color: '#fff', display: 'none', width: '100%', zIndex: '20', top: '0.3rem', textAlign: 'center' }}>
              { newNameArr[nameArrIndex] }
            </div>
          : ''
        }
        <Carousel autoplay={ false } selectedIndex={ currIndex } dots={ false } afterChange={ v => this.setState({ nameArrIndex: v }) }>
          {
            newArr.map(i => {
              return (
                <div key={ `restaurantPhotoKey${ Math.random() }` } className='RestaurantPhoto-box'>
                  <img src={ i } alt='img' />
                </div>
              )
            })
          }
        </Carousel>
      </div>
      , { mask: true, style: { backgroundColor: '#262626' } }
    )
  }

  render() {
    const { datas } = this.props
    const { menMian, daTang, chuFang, qiTa } = datas
    // console.log('RestaurantPhoto', this.props, datas)
    return (
      <div className='RestaurantPhoto-container'>
        {
          menMian.url.length > 0 ?
            <div className='photo-box' key={ `photoListKey${ Math.random() }` }>
              <img src={ menMian.url[0] } alt='' onClick={ () => this.showRestPhoto(0, 0) } />
              <span>{ menMian.typeName }</span>
            </div>
          : ''
        }
        {
          daTang.url.length > 0 ?
            <div className='photo-box' key={ `daTang${ Math.random() }` }>
              <img src={ daTang.url[0] } alt='' onClick={ () => this.showRestPhoto(menMian.url.length, 1) } />
              <span>{ daTang.typeName }</span>
            </div>
          : ''
        }
        {
          chuFang.url.length > 0 ?
            <div className='photo-box' key={ `chuFang${ Math.random() }` }>
              <img src={ chuFang.url[0] } alt='' onClick={ () => this.showRestPhoto(menMian.url.length + daTang.url.length, 2) } />
              <span>{ chuFang.typeName }</span>
            </div>
          : ''
        }
        {
          qiTa.url.length > 0 ?
            <div className='photo-box' key={ `qiTa${ Math.random() }` }>
              <img src={ qiTa.url[0] } alt='' onClick={ () => this.showRestPhoto(menMian.url.length + daTang.url.length + chuFang.url.length, 3) } />
              <span>{ qiTa.typeName }</span>
            </div>
          : ''
        }
      </div>
    )
  }
}

export default RestaurantPhoto

// datas.map(({ type, url, typeName }, index) => {
//   return (
//     <div className='photo-box' key={ `photoListKey${ Math.random() + type }` }>
//       <img src={ url } alt='' onClick={ () => this.showRestPhoto(index) } />
//       <span>{ typeName }</span>
//     </div>
//   )
// })

// <div className='RestaurantPhoto-layer-container'>
//   <Carousel autoplay={ false } selectedIndex={ currIndex } dots={ false }>
//     {
//       datas.map(({ url }) => {
//         return (
//           <div key={ `restaurantPhotoKey${ Math.random() }` } className='RestaurantPhoto-box'>
//             <img src={ url } alt='img' />
//           </div>
//         )
//       })
//     }
//   </Carousel>
// </div>
