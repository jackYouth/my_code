import React from 'react'
// import { getStore } from '@boluome/common-lib'
// import { Mask, SlidePage } from '@boluome/oto_saas_web_app_component'
// 样式引入
import '../style/details.scss'

const Details = props => {
  const { goBackPage, detailsData = { introduction: '', note: '' } } = props
  let introductions = detailsData.introduction
  let notes = detailsData.note
  if (!introductions) {
    introductions = []
  }
  if (!notes) {
    notes = []
  }
  return (
    <div className='detailsWrap'>
      <div className='detailsMain'>
        <div className='detailsPic'>
          <div className='details_img'><img alt='' src={ detailsData.banner } /></div>
          <div className='details_price'>
            <div className='title'>{ detailsData.categoryName }</div>
            <div className='price'>￥<span>{ detailsData.price } / { detailsData.unit }</span></div>
          </div>
        </div>
        <div className='detailsSer otm '>
          <div className='iconTitle'>
            <img alt='' className='icon' src={ require('../img/jieshao.png') } />
            <span>服务介绍</span>
          </div>
          <div className='detailsPrice'>
            {
              introductions.map((item, index) => (
                <p key={ `${ index + 1 }` }>{ item }</p>
              ))
            }
          </div>
        </div>
        <div className='detailsSer otm '>
          <div className='iconTitle'>
            <img alt='' className='icon' src={ require('../img/jiage.png') } />
            <span>价格说明</span>
          </div>
          <div className='detailsPrice'>
            <img alt='' src={ detailsData.serviceDescription } />
          </div>
        </div>
        <div className='detailsSer otm '>
          <div className='iconTitle'>
            <img alt='' className='icon'src={ require('../img/liucheng.png') } />
            <span>服务流程</span>
          </div>
          <div className='detailsPrice'>
            <img alt='' src={ detailsData.flow } />
          </div>
        </div>
        <div className='detailsSer otm '>
          <div className='iconTitle'>
            <img alt='' className='icon'src={ require('../img/sever.png') } />
            <span>服务承诺</span>
          </div>
          <div className='detailsPrice'>
            <img alt='' src={ detailsData.guarantee } />
          </div>
        </div>
        <div className='detailsSer otm '>
          <div className='iconTitle'>
            <img alt='' className='icon'src={ require('../img/xuzhi.png') } />
            <span>预约须知</span>
          </div>
          <div className='detailsPrice'>
            {
            notes.map((item, index) => (
              <p key={ `${ index + 1 }` }>{ item }</p>
            ))
            }
          </div>
        </div>
      </div>
      <div className='orderBtnWrap'>
        <div className='orderBtn'onClick={ () => {
          goBackPage(detailsData.cityId, detailsData.categoryId)
        } }
        >立即预约</div>
      </div>
    </div>
  )
}

export default Details
