import React from 'react'
import { Icon } from 'antd-mobile'
import { Listview, Mask, SlidePage, AddressSearchGaode, Empty, UserCenter } from '@boluome/oto_saas_web_app_component'
import { forceCheck } from 'react-lazyload'
import Shop from './shop'

const relativeStyle = {
  position: 'relative',
}
const inlineBlockStyle = {
  display: 'inline-block',
}
const headerStyle = {
  fontSize:        '.24rem',
  textAlign:       'center',
  height:          '.88rem',
  lineHeight:      '.88rem',
  verticalAlign:   'middle',
  backgroundColor: '#fff',
  borderBottom:    '1px solid #e5e5e5',
  ...relativeStyle,
}
const addressStyle = {
  margin:       '0 .1rem',
  whiteSpace:   'nowrap',
  textOverflow: 'ellipsis',
  overflow:     'hidden',
  maxWidth:     '3rem',
  ...inlineBlockStyle,
}
const iconParentStyle = {
  height:        '100%',
  verticalAlign: 'top',
  padding:       '3% 0',
  boxSizing:     'border-box',
  ...inlineBlockStyle,
}

// <div onClick={ () => handleGoderDetails() }>进入订单详情</div>
const App = ({ offset, currentAddress, fetchData, handleFetchShop, handleChangeAddress, handleShopClick, nolocation }) => {
  const { latitude, longitude } = fetchData
  // console.log('fetchData', fetchData, latitude && longitude, offset)
  if (!(latitude && longitude)) return <div />
  return (
    <div>
      <Header { ...{ currentAddress, handleChangeAddress } } />
      <div style={{ height: 'calc(100% - .88rem)', backgroundColor: '#fff' }}>
        <Listview
          limit={ 10 }
          offset={ offset }
          listItem={ <Shop { ...{ handleShopClick, nolocation } } /> }
          onScroll={ forceCheck }
          onFetch={ handleFetchShop }
          fetchData={ fetchData }
          dataList={ [] }
          noOneComponent={ <Empty imgUrl={ <Icon type={ require('../images/empty.svg') } /> } message='当前区域没有商家，换个地址试试吧' /> }
        />
      </div>
      <UserCenter categoryCode='baoyang' />
    </div>
  )
}

export default App

const Header = ({ currentAddress, handleChangeAddress }) => (
  <div style={ headerStyle }
    onClick={ () => {
      const addressComponent = (
        <SlidePage showClose={ false }>
          <AddressSearchGaode onSuccess={ reply => handleChangeAddress(reply) } />
        </SlidePage>
      )
      Mask(addressComponent, { mask: false })
    } }
  >
    <span style={ iconParentStyle }>
      <Icon type={ require('../images/location.svg') } style={{ width: '.3rem' }} />
    </span>
    <span style={ addressStyle }>{ currentAddress }</span>
    <span style={ iconParentStyle }>
      <Icon type={ require('../images/down.svg') } style={{ width: '.22rem' }} />
    </span>
  </div>
)
