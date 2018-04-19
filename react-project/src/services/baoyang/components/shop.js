import React from 'react'
import { Evaluation } from '@boluome/oto_saas_web_app_component'
import LazyLoad from 'react-lazyload'

const tagStyle = {
  fontSize:     '.26rem',
  display:      'inline-block',
  textAlign:    'center',
  color:        '#fff',
  borderRadius: '10px',
  padding:      '0.03rem 0.06rem',
}
const nameStyle = {
  whiteSpace:   'nowrap',
  textOverflow: 'ellipsis',
  overflow:     'hidden',
  width:        '70%',
  display:      'inline-block',
  fontSize:     '.28rem',
  color:        '#333',
}
const iconStyle = {
  display:     'inline-block',
  width:       '27%',
  boxSizing:   'border-box',
  marginRight: '3%',
  height:      '1.6rem',
  lineHeight:  '1.6rem',
  border:      '1px solid #f5f5f6',
}
const Shop = ({ data, handleShopClick, nolocation }) => {
  // console.log('shop--', nolocation)
  const { shopAvator, shopName, distance, score, minPrice, shopType } = data
  return (
    <div onClick={ () => handleShopClick(data) } style={{ padding: '.2rem .3rem', backgroundColor: '#fff', borderBottom: '1px solid #e5e5e5', position: 'relative' }}>
      <div style={ iconStyle }>
        <LazyLoad
          throttle={ 200 }
          placeholder={ <img style={{ height: '100%', width: '100%', border: '1px solid #f5f5f6' }} alt='' /> }
        >
          <img src={ shopAvator } alt='' style={{ width: '100%', height: '100%' }} />
        </LazyLoad>
      </div>
      <div style={{ display: 'inline-block', width: '70%', verticalAlign: 'top' }}>
        <div>
          <div style={{ float: 'right' }}>
            <span style={{ backgroundColor: '#ffab00', ...tagStyle }}>洗</span>
            {
              shopType === 0 && (<span style={{ backgroundColor: '#4990e2', marginLeft: '.1rem', ...tagStyle }}>养</span>)
            }
          </div>
          <span style={ nameStyle }>{ shopName }</span>
        </div>
        <div style={{ fontSize: '.20rem', color: '#666', marginTop: '.14rem' }}>{ `${ !nolocation ? '距离您' : '距离市中心' } ${ distance }km` }</div>
        <div style={{ paddingRight: '.4rem', position: 'absolute', bottom: '.2rem', width: 'inherit', textAlign: 'right', lineHeight: '.34rem', boxSizing: 'border-box' }}>
          <div style={{ float: 'left' }}>
            <span>
              <Evaluation defaultValue={ `${ parseInt((score / 5) * 100, 10) }%` } width='1.2rem' />
              <span style={{ fontSize: '.24rem', marginLeft: '.14rem', color: '#666' }}>{ `${ score }分` }</span>
            </span>
          </div>
          <span style={{ color: '#fd676a', fontSize: '.34rem' }}>
            { `￥${ minPrice }` }
          </span>
          <span style={{ color: '#a9a9a9', fontSize: '.24rem' }}>起</span>
        </div>
      </div>
    </div>
  )
}
export default Shop
