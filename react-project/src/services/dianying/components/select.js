import React from 'react'
import { Icon } from 'antd-mobile'
import { Focus, Empty } from '@boluome/oto_saas_web_app_component'
import SelectTab from './selectTab'
import '../style/select.scss'

import loading from '../img/loading.png'

const Select = select => {
  const { selData, filmInfo, filmData, handleFilm, keys, initNum, callback, goGetseat, goAddr, goDetail } = select
  let films = []
  let cinemaInfo = []
  if (selData) {
    films = selData.films
    cinemaInfo = selData.cinemaInfo
    const makeTabPane = (d, k) => {
      const o = d.filter(e => e.dateStr === k)[0]
      const spanList = o.plan.map(v => <PlanItem key={ `span${ Math.random() }` } filmInfo={ filmInfo } selData={ selData } keys={ keys } plan={ v } goGetseat={ goGetseat } />)
      return (
        <div>
          { (o.plan.length && cinemaInfo.endbuyMinute) ? <p
            style={{ background: '#fffad8', color: '#ffab00', paddingLeft: '0.24rem', fontSize: '0.28rem', lineHeight: '0.7rem', height: '0.7rem' }}
          >
            <Icon style={{ position: 'relative', top: '0.06rem', width: '0.32rem', height: '0.32rem', marginRight: '0.1rem' }} type={ require('svg/dianying/laba.svg') } />
            开场前{ cinemaInfo.endbuyMinute }分钟关闭在线售票
          </p> : ''
          }
          { o.plan.length ? spanList : '' }
          { !o.plan.length && <Empty style={{ height: 'calc(100% - 7.2rem)', minHeight: '5rem' }} message='无可定场次' imgUrl={ <Icon type={ require('svg/dianying/NO.svg') } /> } /> }
        </div>
      )
    }
    const result = filmData && makeTabPane(filmData, keys)

    return (
      <div className='selects'>
        <div className='nav' onClick={ () => { goAddr(cinemaInfo) } }>
          <div>
            <h4>{ cinemaInfo && cinemaInfo.name }</h4>
            <p>{ cinemaInfo && cinemaInfo.address }</p>
          </div>
          <Icon type={ require('svg/dianying/arrowright.svg') } />
        </div>

        <div className='focusPic' >
          <Focus style={{ zIndex: '10' }} dataList={ films } initNum={ initNum } onNow={ res => goDetail(res, keys, filmInfo) } onChange={ res => { handleFilm(res, keys) } } />
          <div className='focusPicbg' style={{ backgroundImage: `url(${ filmInfo && filmInfo.pic })`, backgroundSize: '2000%', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundAttachment: 'fixed' }} />
          <div className='focusPicbgg' />
        </div>

        <div className='filmTitle'>
          <h4>{ filmInfo && filmInfo.name }{ (filmInfo && filmInfo.score * 1) ? <span style={{ color: '#ffab00' }}>{ `${ filmInfo.score }分` }</span> : <span>暂无评分</span> }</h4>
          <div>{ `${ filmInfo && filmInfo.length }分钟` }<span>{ filmInfo && filmInfo.type }</span>{ filmInfo && filmInfo.actor }</div>
        </div>

        { filmData ? <div className='spanTabs'>
          <SelectTab keys={ keys } dataList={ filmData } selectSub={ res => callback(res) } />
          { result }
        </div> : <div className='loading'>
          <div>
            <img alt='loading' src={ loading } />
            <p>加载中...</p>
          </div>
        </div> }

      </div>
    )
  }
  return (
    <div />
  )
}

// 排片列表组件
const PlanItem = ({ plan, selData, filmInfo, keys, goGetseat }) => {
  const { endTime, hallName, isFull, isExpire, language, price, screenType, startTime } = plan

  return (
    <div className='spanItem' onClick={ () => { if (!isExpire && !isFull) { goGetseat(plan, selData, filmInfo, keys) } } }>
      <div className='spanInfo'>
        <p><span className='timeInfo'>{ startTime }</span><span className='typeInfo'>{ language }{ screenType }</span></p>
        <p><span>{ endTime }散场</span><span>{ hallName }</span></p>
      </div>

      <span className='price'>{ price }元</span>

      <div className='buyBtn'>
        { isExpire ? <span style={{ borderColor: '#999999', color: '#999999' }}>停售</span> : isFull ? <span style={{ borderColor: '#999999', color: '#999999' }}>满场</span> : <span>购票</span> }
      </div>
    </div>
  )
}

export default Select
