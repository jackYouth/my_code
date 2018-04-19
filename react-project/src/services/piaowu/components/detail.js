import React from 'react'
// import { getStore, parseLocName } from '@boluome/common-lib'
import { Mask, SlidePage } from '@boluome/oto_saas_web_app_component'
import { Icon, WhiteSpace, Popup } from 'antd-mobile'
import '../style/detail.scss'
import seat from '../img/seat.png'

const Detail = detail => {
  const { data, goAddr, goSel } = detail
  const onMaskClose = () => {
    console.log('onMaskClose')
  }
  if (data) {
    const { code, lowPrice, begin, end, name, imgUrlv, seatmapUrl, desc, venuesName, venuesAddr, status } = data
    return (
      <div className='detail'>
        <div className='detailmain'>
          <div className='focusPic' style={{ backgroundImage: `url(${ imgUrlv })`, backgroundSize: '2000%', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundAttachment: 'fixed' }}>
            <div className='focusPicbg' />
            <img alt='票务' src={ imgUrlv } />
            <p>{ name }</p>
          </div>

          <div className='statusShow'>
            <span style={ status ? {} : { color: '#ffa600', border: '1px solid #ffa600' } }>{ status ? '预售' : '售票中' }</span>
            <p><span>¥{ lowPrice }</span>起</p>
          </div>

          <div className='detinfo'>
            <p><span>演出时间：</span><span>{ begin === end ? begin : `${ begin } - ${ end }` }</span></p>
          </div>

          <WhiteSpace size='lg' />

          <div className='detinfo'>
            <p>演出场馆：{ venuesName }</p>
            <img alt='seat' src={ seat } onClick={ () => { Popup.show(<img style={{ width: '100%' }} alt='seat' src={ seatmapUrl } />, { animationType: 'slide-up', onMaskClose }) } } />
          </div>
          <div className='detinfo' style={{ borderTop: 'none' }} onClick={ () => { goAddr(venuesName, venuesAddr) } }>
            <p><span>演出地址：</span><span>{ venuesAddr }</span></p>
            <Icon type={ require('svg/piaowu/arrowright.svg') } />
          </div>

          <WhiteSpace size='lg' />

          <div className='detinfo' onClick={ () => {
            Mask(
              <SlidePage target='right'>
                <div className='zhuyi'>
                  <p>a)演出详情仅供参考，具体信息以现场为准；</p>

                  <p>b)1.2米以下儿童谢绝入场，1.2米以上儿童需持票入场；</p>

                  <p>c)演出票品具有唯一性、时效性等特殊属性，如非活动变
                  更、活动取消、票品错误的原因外，不提供退换票品服务，
                  购票时请务必仔细核对并审慎下单。</p>

                  <p>d)需要开具发票的购票客户，请您在演出/活动开始5天前
                  提供相关发票信息至在线客服，演出/活动结束后将统一
                  由演出/活动主办单位开具增值税发票</p>
                </div>
              </SlidePage>, { mask: false, style: { position: 'absolute' } })
          } }
          >
            <p>注意事项</p>
            <Icon type={ require('svg/piaowu/arrowright.svg') } />
          </div>

          <WhiteSpace size='lg' />

          <div className='detinfo'>
            <p className='flexinfo'><span className='rodtip' />演出详情</p>
          </div>
          <div className='descinfo'>{ desc }</div>
        </div>
        <div className='buyBtn' onClick={ () => { goSel(code) } }><span>选座购票</span></div>
      </div>
    )
  }
  return <div />
}


export default Detail
