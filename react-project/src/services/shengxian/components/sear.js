import React from 'react'
import { Icon } from 'antd-mobile'
import { Empty, Search } from '@boluome/oto_saas_web_app_component'
import Cart from './cart'
import '../style/sear.scss'

const Sear = sear => {
  const { search, cartdata = [], goBack, goOrder, delBuycart } = sear
  return (
    <div className='sear'>
      <div className='searWarp'>
        <Search inputPlaceholder={ '请输入商品名称' }
          listItem={ <Listviewli sear={ sear } /> }
          noResult={ <Empty message='哎呀，没有找到相关商品哦 换个关键字试试吧~' imgUrl={ <Icon type={ require('svg/shengxian/nosearch.svg') } /> } /> }
          onFeach={ search }
          rightComponent={ <Cancel goBack={ goBack } /> }
          handleResult={ res => { console.log(res) } }
        />
      </div>

      {
        cartdata.length > 0 && <div>
          <Cart
            listItem={ <Listviewli cart={ 1 } sear={ sear } /> }
            cartdata={ cartdata }
            submit={ goOrder }
            delBuycart={ delBuycart }
          />
        </div>
      }
    </div>
  )
}

const Listviewli = ({ data, sear, cart }) => {
  const { areaId, goDetail, cartdata, setBuycart } = sear
  return (
    <div className='listitem' onClick={ () => goDetail(areaId, data) }>
      <div className='pic' style={ cart ? { width: '0.8rem', height: '0.8rem' } : {} }><img alt='生鲜' style={ cart ? { width: '0.8rem', height: '0.8rem' } : {} } src={ data.commodityPicList[0].picUrl } /></div>

      <div className='info' style={ cart ? { width: 'calc(100% - 0.8rem)', padding: '0 0 0 0.28rem' } : {} }>
        <h1>{ data.commodityName }</h1>
        { !cart && <p>{ data.spec }</p> }

        <div className='bottomPart'>
          <p>¥{ data.price }</p>
          <Buybtn cartdata={ cartdata } setBuycart={ setBuycart } data={ data } />
        </div>
      </div>
    </div>
  )
}

const Buybtn = ({ cartdata, data, setBuycart }) => {
  let index = ''
  for (let i = 0; i < cartdata.length; i++) {
    if ((cartdata[i].commodityCode).split(',')[0] === (data.commodityCode).split(',')[0]) {
      index = i
      break
    }
  }
  const buyQuantity = (typeof index === 'number') ? cartdata[index].buyQuantity : ''
  return (
    <div className='buyBtn'>
      <Icon type={ (buyQuantity === 20) ? require('svg/shengxian/addh.svg') : require('svg/shengxian/add.svg') } onClick={ e => setBuycart(e, data, 'add') } />
      <span>{ buyQuantity }</span>
      { (typeof index === 'number') && <Icon type={ require('svg/shengxian/sub.svg') } onClick={ e => setBuycart(e, data, 'sub') } /> }
    </div>
  )
}

// 取消组件
const Cancel = props => {
  const { goBack } = props
  return (
    <span className='cancel' onClick={ () => goBack() }>取消</span>
  )
}

export default Sear
