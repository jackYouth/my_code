import React from 'react'
import { Mask, SlidePage, Search, Empty } from '@boluome/oto_saas_web_app_component'
import '../style/carType.scss'

import CarDetails from './CarDetails'
import img from '../img/empty.png'

const CarType = props => {
  const { hotBrandList = [], brands = [] } = props
  const { handleChooseCar } = props // handleChooseId
  const letterIndex = []
  letterIndex.push('hot')
  // let showBrandName

  const showDetail = (brandId, brandIcon, brandName) => {
    Mask(
      <SlidePage target='right'
        closeComponent={ <div style={{ width: '15%', height: '100%', position: 'fixed', left: '0' }} /> }
        style={{ width: '100%', backgroundColor: 'transparent', boxSizing: 'border-box', paddingLeft: '15%', right: '0', left: 'inherit' }}
      >
        <CarDetails brandId={ brandId } brandIcon={ brandIcon } brandName={ brandName } onSuccess={ result => handleChooseCar(result) } />
      </SlidePage>
   , { mask: true, maskClosable: false })
  }

  const searchShowDetail = result => {
    const { brandId, brandIcon, brandName } = result
    // showBrandName = brandName
    setTimeout(() => showDetail(brandId, brandIcon, brandName), 500)
  }

  const handleLetterIndex = index => {
    // console.log(document.getElementById(`letter${ index }`))
    document.getElementById(`letter${ index }`).scrollIntoView()
  }

  // 搜索请求通过组件方式传入
  const searchFn = (searchKey, brandsarr, cb) => {
    // const handleClose = Loading()
    if (!searchKey) return
    cb(null, brandsarr.reduce((arr, curr) => [...arr, ...curr.data], [])
                   .filter(b => b.brandName.indexOf(searchKey) >= 0))
    // handleClose()
  }

  return (
    <div>
      <div className='brandTitle'>
        <div id='searchInput'
          onClick={ () =>
            Mask(
              <SlidePage target='right' showClose={ false } >
                <Search
                  inputPlaceholder={ '请输入品牌' }
                  listItem={ <ListItem /> }
                  noResult={ <Empty message='找不到我～～～' imgUrl={ img } /> }
                  onFeach={ (searchKey, cb) => searchFn(searchKey, brands, cb) }
                  handleResult={ result => searchShowDetail(result) }
                  rightComponent={ <Cancel /> }
                />
              </SlidePage>
           , { mask: false }) }
        >请输入品牌／车系</div>
      </div>
      <div className='mainContainer'>
        <div className='hotBrand' id={ `letterhot${ Math.random() }` }>
          <h3>热门品牌</h3>
          <div className='hotBrandContainer'>
            {
              hotBrandList.map(({ brandIcon, brandId, brandName }) => (
                <div key={ `hotBrandKey${ brandId }` } className='hotBrandBox' onClick={ () => showDetail(brandId, brandIcon, brandName) }>
                  <img src={ brandIcon } alt='' />
                  <span>{ brandName }</span>
                </div>
              ))
            }
          </div>
        </div>
        <div className='normalBrands'>
          {
            brands.length > 0 ? (
              brands.map(({ key, data }, index) => {
                const letter = key
                letterIndex.push(key)
                return (
                  <div key={ `brandKey${ Math.random() + index }` } id={ `letter${ letter }` } className='brandContainer'>
                    <div className='brandsKey'>{ letter }</div>
                    <ul>
                      {
                        data.map(({ brandIcon, brandId, brandName }) => (
                          <li key={ `brandIdKey${  Math.random() }` } className='brandBox' onClick={ () => showDetail(brandId, brandIcon, brandName) }>
                            <img src={ brandIcon } alt='' />
                            <span>{ brandName }</span>
                          </li>
                        ))
                      }
                    </ul>
                  </div>
                )
              })
            ) : ''
          }
        </div>
        <div>
          <ul className='letterIndex' >
            {
              letterIndex.map((item, index) => (
                <li key={ `letterKey ${ Math.random() + index }` }>
                  <span onClick={ () => handleLetterIndex(item) } id>{ item === 'hot' ? '热门' : item }</span>
                </li>
              ))
            }
          </ul>
        </div>
      </div>
    </div>
  )
}

export default CarType

// 通过组件传入搜索项的显示内容、样式等
const ListItem = ({ data }) => {
  // console.log('searchKey----',searchKey)
  const { brandName } = data
  return (
    <div className='itemBox'>
      { brandName }
    </div>
  )
}

const Cancel = props => {
  const { handleContainerClose } = props
  return (
    <span className='cancel' onClick={ () =>  handleContainerClose()  }>取消</span>
  )
}
