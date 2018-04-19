import React from 'react'
import { Icon, Carousel } from 'antd-mobile'
import { Evaluation } from '@boluome/oto_saas_web_app_component'
import noneSrc from '../images/none.jpg'
import Service from './service'

const circleTagStyle = {
  display:       'inline-block',
  border:        '1px solid #ffab00',
  padding:       '.05rem .15rem',
  borderRadius:  '0.2rem',
  color:         '#ffab00',
  marginRight:   '.13rem',
  height:        '.3rem',
  lineHeight:    '.3rem',
  verticalAlign: 'middle',
}

const addressStyle = {
  fontSize:     '.28rem',
  color:        '#333',
  width:        '90%',
  display:      'inline-block',
  whiteSpace:   'nowrap',
  textOverflow: 'ellipsis',
  overflow:     'hidden',
}

const Detail = ({ shop = {}, handleShowLicense, handleShowServiceDetail, handleBuyService, handleToMap }) => {
  const { shopId, shopTel, time, serviceList = [], shopAvatorImg = [], shopAddress = '', shopName = '', distance = 0, score = 0, businessLicenseUrl } = shop
  return (
    <div style={{ backgroundColor: '#fff', overflow: 'scroll', height: '100%' }}>
      <div style={{ height: '4rem', width: '100%', textAlign: 'center', overflow: 'hidden' }} >
        {
          shopAvatorImg.length > 0 ? (
            <Carousel infinite style={{ height: '4rem' }} dotStyle={{ marginBottom: '.14rem' }} dotActiveStyle={{ marginBottom: '.14rem' }}>
              {
                shopAvatorImg.map(imgSrc => (<img key={ `carousel-img-${ Math.random() }` } src={ imgSrc } alt='' onLoad={ e => (e.target.parentNode.parentNode.style.overflow = 'visible') } style={{ width: '100%', height: '4rem' }} />))
              }
            </Carousel>
          ) : <img src={ noneSrc } alt='' style={{ height: '4rem' }} />
        }
      </div>
      <div style={{ padding: '.24rem .3rem', borderBottom: '1px solid #e5e5e5' }} >
        <span style={{ fontSize: '.32rem', color: '#333' }}>{ shopName }</span>
      </div>
      <div style={{ padding: '.24rem .3rem', borderBottom: '1px solid #e5e5e5', whiteSpace: 'nowrap' }} >
        <div style={{ float: 'right' }} >
          {
            businessLicenseUrl ? (
              <div style={{ display: 'inline-block', fontSize: '.2rem' }} onClick={ () => handleShowLicense(shopId) } >
                <div style={{ textAlign: 'center', marginBottom: '.07rem' }} >
                  <Icon type={ require('../images/license.svg') } style={{ width: '.7rem', height: '.7rem' }} />
                </div>
                <div>营业执照</div>
              </div>
            ) : ''
          }
          <div style={{ display: 'inline-block', fontSize: '.2rem', marginLeft: '.5rem' }} onClick={ () => (location.href = `tel://${ shopTel }`) }>
            <div style={{ textAlign: 'center', marginBottom: '.07rem' }} >
              <Icon type={ require('../images/phone.svg') } style={{ width: '.7rem', height: '.7rem' }} />
            </div>
            <div>联系商家</div>
          </div>
        </div>
        <div>
          <div style={{ fontSize: '.2rem', marginBottom: '.3rem' }}>
            <span style={ circleTagStyle }>
              <Icon type={ require('../images/crown.svg') } style={{ height: '.32rem', width: '.32rem', position: 'relative', top: '-.03rem', marginRight: '.1rem' }} />
              <span style={{ verticalAlign: 'top' }}>典典养车认证店</span>
            </span>
            <span style={ circleTagStyle }>{ time }</span>
          </div>
          <div style={{ fontSize: '.24rem' }}>
            <Evaluation defaultValue={ `${ parseInt((score / 5) * 100, 10) }%` } width='1.2rem' />
            <span style={{ fontSize: '.24rem', marginLeft: '.14rem', color: '#666' }}>{ `${ score }分` }</span>
          </div>
        </div>
      </div>
      <div style={{ padding: '.24rem .3rem', borderBottom: '1px solid #e5e5e5' }} onClick={ () => handleToMap(shopId) } >
        <span style={{ float: 'right', fontSize: '.28rem', color: '#999', padding: '0.07rem 0' }} >
          <Icon type={ require('../images/right.svg') } style={{ height: '.25rem', width: '.25rem' }} />
        </span>
        <span style={ addressStyle }>{ `${ distance }km ${ shopAddress }` }</span>
      </div>
      <div>
        {
          Array.isArray(serviceList) && serviceList.length > 0 ? (
            serviceList.map(service => {
              const { lv1ServiceTypeId, lv2ServiceTypeId } = service
              return (
                <Service key={ `service-list-${ lv1ServiceTypeId }-${ lv2ServiceTypeId }` } { ...{ shopId, service, handleShowServiceDetail, handleBuyService } } />
              )
            })
          ) : ''
        }
      </div>
    </div>
  )
}

export default Detail


// const freeStyle = {
//   width:    '33%',
//   fontSize: '.20rem',
//   color:    '#999',
//   display:  'inline-block',
// }
// const freeIconStyle = {
//   width:       '.3rem',
//   height:      '.3rem',
//   marginRight: '.05rem',
//   position:    'relative',
//   top:         '.05rem',
// }
// const Free = () => (
//   <div style={{ padding: '.24rem .3rem', borderBottom: '1px solid #e5e5e5' }} >
//     <div style={ merge(freeStyle, { textAlign: 'left' }) } >
//       <Icon type={ require('../images/wifi.svg') } style={ freeIconStyle } />
//       <span>免费上网</span>
//     </div>
//     <div style={ merge(freeStyle, { textAlign: 'center' }) }>
//       <Icon type={ require('../images/p.svg') } style={ freeIconStyle } />
//       <span>免费停车</span>
//     </div>
//     <div style={ merge(freeStyle, { textAlign: 'right' }) }>
//       <Icon type={ require('../images/sofa.svg') } style={ freeIconStyle } />
//       <span>休息等候</span>
//     </div>
//   </div>
// )
