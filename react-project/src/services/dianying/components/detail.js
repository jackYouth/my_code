import React from 'react'
import { Icon } from 'antd-mobile'
import { Mask, SlidePage } from '@boluome/oto_saas_web_app_component'
import { CarouselImg } from './picture.js'
import '../style/detail.scss'


import emp from '../img/empstar.png'
import fill from '../img/fillstar.png'
import part from '../img/partstar.png'
import imax from '../img/imax.png'
import imaxs from '../img/imaxs.png'
import sand from '../img/sand.png'


const Detail = detail => {
  const {  channel, flag, more, detailData, goPic, goCinema, handleMore } = detail
  if (detailData) {
    const { actor, images, performers, director, name, type, length, pic, score, publishTime, dimension, description, hasImax } = detailData
    let tip
    if (dimension === '3D' && hasImax) {
      tip = <img alt='3Dimax' style={{ width: '1rem', height: '0.3rem' }} src={ imax } />
    } else if (dimension === '2D' && hasImax) {
      tip = <img alt='2Dimax' style={{ width: '1rem', height: '0.3rem' }} src={ imaxs } />
    } else if (dimension === '3D') {
      tip = <img alt='3D' style={{ width: '0.4rem', height: '0.3rem' }} src={ sand } />
    } else {
      tip = <i />
    }
    return (
      <div className='detailWrap'>
        <div className='detail'>
          <div className='detailTitle'>
            <div className='detailTitlebg' style={{ background: `url(${ pic }) center center`, backgroundSize: '100% 100%', backgroundRepeat: 'no-repeat', backgroundAttachment: 'fixed' }} />
            <div className='detailTitlebgg' />

            <div className='pic'><img alt='影片' src={ pic } /></div>

            <div className='info'>

              <h1><span>{ name }</span>{ tip }</h1>
              <Star score={ score } />
              <div className='rightBot'>
                <div className='actorInfo'>
                  <p>{ length ? `${ length }分钟` : '' }</p>
                  <p><span>{ type }</span></p>
                  <p>{ publishTime }{ channel === 'kou' ? '上映' : '' } </p>
                </div>
              </div>

            </div>
          </div>

          {
            channel === 'kou' ? <div className='detailInfo'>
              { director && <h4><span>导演：</span><span>{ director }</span></h4> }
              { actor && <h4><span>主演：</span><span>{ actor }</span></h4> }
              <h4> 剧情：</h4>
              <p style={{ textIndent: '2em' }}>{ description.replace(/\s/g, '') }</p>
            </div>
            : <div className='infoWrap'>
              <div className='maoyandetailInfo'>
                <h4>剧情简介</h4>
                <p style={ more ? { height: '1.26rem' } : { height: 'auto' } }>
                  { description.replace(/\s/g, '') }
                </p>
                <p className='tex_center' onClick={ () => { handleMore(more) } }>
                  <Icon style={ more ? { transform: 'rotate(180deg)' } : {} } type={ require('svg/dianying/more.svg') } />
                </p>
              </div>
              <div className='maoyandetailInfo'>
                <h4>演职人员</h4>
                <div className='felmList' onTouchMove={ e => { e.stopPropagation() } } onTouchEnd={ e => { e.stopPropagation() } } onTouchStart={ e => { e.stopPropagation() } }>
                  {
                    performers.map((o, i) => {
                      return (<div key={ `my${ i * Math.random() }` }>
                        <img alt='img' src={ `${ o.avatar }` } />
                        <h4>{ o.name }</h4>
                        <p>{ o.role }</p>
                      </div>)
                    })
                  }
                </div>
              </div>
              <div className='maoyandetailInfo'>
                <h4>影片剧照<span onClick={ () => { goPic(images) } }>查看全部</span></h4>
                <div className='felmList' onTouchMove={ e => { e.stopPropagation() } } onTouchEnd={ e => { e.stopPropagation() } } onTouchStart={ e => { e.stopPropagation() } }>
                  {
                    images.map((o, i) => {
                      return (<div className='allimg' onClick={ () => { console.log(o) } } key={ `img${ i + Math.random() }` }>
                        <img alt='img' src={ o } onClick={
                            () => { Mask(<SlidePage><CarouselImg PicshowData={ images } PicshowIndex={ i } /></SlidePage>, { selfClass: 'juzhao' }) }
                          }
                        />
                      </div>)
                    })
                  }
                </div>
              </div>
            </div>
          }

        </div>
        <div className='buyBtn' onClick={ () => { if (!flag) { goCinema(detailData) } } }><span style={ flag ? { background: 'rgb(204, 204, 204)' } : {} }>选座购票</span></div>
      </div>
    )
  }
  return (<p style={{ display: 'none' }}>数据为空</p>)
}


// 星级评分组件
const Star = ({ score }) => {
  const dnum = Math.round(score)
  const list = []
  for (let i = 1; i <= 5; i++) {
    const num = i * 2
    let typeNum
    if (dnum >= num) {
      typeNum = fill
    } else if (dnum > (num - 2)) {
      typeNum = part
    } else {
      typeNum = emp
    }
    list.push(<img alt='星星' key={ `star${ Math.random() }` } src={ typeNum } />)
  }
  return (
    <div className='star'>
      { (score * 1) ? list : '暂无评分' }
      { (score * 1) ? <span>{ score }</span> : '' }
    </div>
  )
}

// 个人信息组件
// const Modalhead = props => {
//   const { handleContainerClose, info } = props
//   const { name, role, avatar } = info
//   return (
//     <div className='modalheadwarp' onClick={ () => { handleContainerClose() } }>
//       <div className='modalhead' onClick={ e => { e.stopPropagation() } }>
//         <div>
//           <h4>{ name }</h4>
//           <p>饰:{ role }</p>
//         </div>
//         <img alt='img' src={ avatar } />
//       </div>
//     </div>
//   )
// }

export default Detail

// <div className='detailInfo'>
//   { director && <h4><span>导演：</span><span>{ director }</span></h4> }
//   { actor && <h4><span>主演：</span><span>{ actor }</span></h4> }
//   <h4> 剧情：</h4>
//   <p style={{ textIndent: '2em' }}>{ description.replace(/\s/g, '') }</p>
// </div>
