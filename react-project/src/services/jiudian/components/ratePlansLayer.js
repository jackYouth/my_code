import React, { Component } from 'react'
import { Mask } from '@boluome/oto_saas_web_app_component'
import { Carousel }   from 'antd-mobile'
import bigEmpty from '../image/bigEmpty.png'
import closeMask from './closeMask'
import '../style/ratePlansLayer.scss'

class RatePlansLayer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      roomInfo:     this.props.datas,
      images:       this.props.images,
      showBtn:      this.props.showBtn,
      showFacility: false,
    }
  }

  componentWillMount() {}

  render() {
    const { showFacility, showBtn = true, roomInfo, images = [] } = this.state
    const { confirmId } = this.props
    const { paymentType, cancelPolicyDesc, broadband, canAddBed, bedType, breakfast, basicInfo, planId, price, name, ext = {} } = roomInfo
    const { facilities = [] } = ext
    console.log('props', this.props)
    return (
      <div className='RatePlansLayer-container'>
        <div className='layer-title-container'>
          <h3>{ name }</h3>
          <span />
          <i className='layer-title-close' onClick={ () => closeMask() } />
        </div>
        <div className='img-container'>
          {
            images.length > 0 ?
              <Carousel autoplay={ false }>
                {
                  images.map(i => {
                    return (
                      <div key={ `hotelImg${ Math.random() }` } className='RatePlansLayer-img-box'>
                        <img src={ i } alt='img' />
                      </div>
                    )
                  })
                }
              </Carousel>
            :
              <div key={ `hotelImg${ Math.random() }` } className='RatePlansLayer-img-box'>
                <img src={ bigEmpty } alt='img' style={{ width: '100%' }} />
              </div>
          }
        </div>
        <div className='main-container smooth-touch' style={{ height: !showBtn ? 'calc(55% + 1.2rem)' : '55%' }}>
          <div className='main-info-container'>
            { basicInfo ? <span className='area-box'>{ basicInfo }</span> : '' }
            { breakfast ? <p><span>早餐：</span><span>{ breakfast }</span></p> : '' }
            { bedType ? <p><span>床型：</span><span>{ bedType }</span></p> : '' }
            { canAddBed ? <p><span>加床：</span><span style={{ color: '#ffab00' }}>{ canAddBed }</span></p> : '' }
            { broadband ? <p><span>宽带：</span><span>{ broadband }</span></p> : '' }
          </div>
          {
            facilities.length > 0 ?
              <div className='facilities-container'>
                {
                  facilities.map(({ group, data }) => {
                    return (
                      <div className='facilities-box' key={ Math.random() } style={{ display: showFacility ? 'block' : 'none' }}>
                        <span className='group-box'>{ `${ group }：` }</span>
                        <p>
                          {
                            data.map(i => {
                              return (
                                <span key={ Math.random() }>{ `${ i }，` }</span>
                              )
                            })
                          }
                        </p>
                      </div>
                    )
                  })
                }
                <p className='showFacility' onClick={ () => this.setState({ showFacility: showFacility ? '' : true }) }>{ `${ showFacility ? '收起' : '查看' }更多房型设施` }</p>
              </div>
            : ''
          }
          <div className='notice'>
            <h3>预定须知</h3>
            <div className='paymentType-box'>
              <span>{ paymentType === 'Prepay' ? '在线付：' : '到店付：' }</span>
              <span>{ paymentType === 'Prepay' ? '预定酒店后立即在线支付房费' : '到达预定酒店后，向酒店支付房费，无需在线支付预付房费' }</span>
            </div>
            {
              cancelPolicyDesc ?
                <div className='cancelPolicyDesc-box'>
                  <span>取消规则：</span>
                  <span>{ cancelPolicyDesc }</span>
                </div>
              : ''
            }
          </div>
        </div>
        {
          showBtn ?
            <div className='btn-container'>
              <div className='price-box'>
                <span>¥</span>
                <span>{ price }</span>
              </div>
              <button onClick={ () => { confirmId(planId); Mask.closeAll() } }>预订</button>
            </div>
          : ''
        }
      </div>
    )
  }
}

export default RatePlansLayer

// 有线宽带、无线宽带
// {
//   amentities.length > 0 ?
//     <div>
//       {
//         amentities.map(({ text }) => {
//           return (
//             <span>{ text }</span>
//           )
//         })
//       }
//     </div>
//   : ''
// }
