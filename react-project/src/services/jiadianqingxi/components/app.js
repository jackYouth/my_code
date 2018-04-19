import React from 'react'
// import { setStore } from '@boluome/common-lib'
import { Mask, SlidePage, CitySearch, UserCenter } from '@boluome/oto_saas_web_app_component'
import '../style/index.scss'

const App = props => {
  const { listData, getListDataHandle, selectedCIty, goDetails } = props
  if (listData) {
    // console.log('listData', listData, selectedCIty)
    return (
      <div className='listMain'>
        <UserCenter categoryCode='jiadianqingxi' />
        <div className='headerWrap'>
          <div className='header_l' />
          <div className='header_c' onClick={ () =>
            Mask(
              <SlidePage target='left' showClose={ false }>
                <CitySearch localCity='上海' api='/basis/v1/jiadianqingxi/zmn/cities' handleCityData={ result => getListDataHandle(result) } />
              </SlidePage>
              , { mask: false, style: { position: 'absolute' } }
            ) }
          >
            <span>{ selectedCIty }</span>
            <span><img alt='' className='jiaoPic' src={ require('../img/jiao.png') } /></span>
          </div>
          <div className='header_r' />
        </div>
        <div className='contentWrap'>
          {
          listData && listData.map(item => (
            <div key={ item.categoryId } className='listItem' onClick={ () =>
                goDetails(item.cityId, item.categoryId)
              }
            >
              <div className='itemPic'><img alt='' src={ item.categoryIcon } /></div>
              <div className='item'>
                <span className='title'>{ item.categoryName }</span>
                <span className='theme'>{ item.description }</span>
                <span className='price'>￥{ item.price } / { item.unit }</span>
                <span className='channel'>啄木鸟</span>
              </div>
            </div>
          ))
          }
        </div>
        {
          (listData && listData.length === 0) && (
            <div className='kongWrap'>
              <img alt='' src={ require('../img/noUse.png') } />
              <div className='tips'>该城市尚未提供家电清洗服务敬请期待</div>
            </div>
          )
        }
      </div>
    )
  }
  return (<div />)
}

export default App
