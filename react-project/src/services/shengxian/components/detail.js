import React from 'react'
import { Carousel, WhiteSpace, Icon } from 'antd-mobile'
import Cart from './cart'
import '../style/detail.scss'

const Detail = detail => {
  const { picDatiles, detailData, specData, cartdata, setBuycart, num, detMask, handleSwitchmask, setpreBuy, setpreCart, handleSelectspec, goOrder, delBuycart } = detail
  if (detailData) {
    return (
      <div className='detail'>
        { detMask && <div className='deMask' onClick={ () => { handleSwitchmask(detMask) } } /> }
        { detMask && <div className='deInfo'>
          <h2>{ specData.value.commodityName }</h2>
          <p>规格</p>
          <p className='specInfo'>{
            detailData.specifications.map((o, i) => (
              <span key={ `spec${ i + 1 }` } onClick={ () => { handleSelectspec(o) } } className={ (o.value.commodityCode === specData.value.commodityCode) && 'selectSpec' }>
                { o.name }
              </span>
            )) }</p>
          <div className='specNum'>购买数量
            <div className='buyBtn'>
              <Icon onClick={ e => setpreBuy(e, num, true) } type={ (num === 20) ? require('svg/shengxian/addh.svg') : require('svg/shengxian/add.svg') } />
              <span>{ num }</span>
              <Icon onClick={ e => setpreBuy(e, num, false) } type={ (num === 1) ? require('svg/shengxian/subh.svg') : require('svg/shengxian/sub.svg') } />
            </div>
          </div>
          <div className='addSpec'>￥{ specData.value.price }<span onClick={ () => { setpreCart(specData.value, num) } }>加入购物车</span></div>
        </div> }
        <div className='detailWrap'>
          <Carousel
            className='my-carousel'
            autoplay={ false }
            infinite
            selectedIndex={ 1 }
            swipeSpeed={ 35 }
            beforeChange={ (from, to) => console.log(`slide from ${ from } to ${ to }`) }
            afterChange={ index => console.log('slide to', index) }
          >
            { specData.value.commodityPicList.map((o, i) => (
              <a key={ `pic${ i + 1 }` } style={{ height: 750 }}>
                <img
                  style={{ height: '7.5rem', width: '100%' }}
                  src={ o.picUrl }
                  alt='icon'
                />
              </a>
            )) }
          </Carousel>
          <div className='detailInfo'>
            <h2>{ specData.value.commodityName }{ (detailData.specifications.length > 1) && <span className='specTip'>多规格</span> }</h2>
            <div>￥{ specData.value.price }{ (detailData.specifications.length > 1) ? <span className='addCart' onClick={ () => { handleSwitchmask(detMask) } }>加入购物车</span> : <Buybtn cartdata={ cartdata } setBuycart={ setBuycart } data={ detailData } /> }</div>
          </div>

          <div className='otherInfo'>
            <p className='place'>产地<span>{ specData.value.placeOfOrigin }</span></p>
            <p dangerouslySetInnerHTML={{ __html: specData.value.deliveryTips }} />
          </div>
          <WhiteSpace size='lg' />
          { picDatiles && <div className='picDatiles'>
            <p>商品详情</p>
            <div dangerouslySetInnerHTML={{ __html: picDatiles }} />
          </div> }
        </div>
        <Cart listItem={ <Listviewli cart={ 1 } app={ detail } /> } cartdata={ cartdata } submit={ goOrder } delBuycart={ delBuycart } />
      </div>
    )
  }
  return (<p style={{ display: 'none' }}>数据为空</p>)
}

const Listviewli = ({ data, app, cart }) => {
  const { areaId, goDetail, cartdata, setBuycart } = app
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

export default Detail
