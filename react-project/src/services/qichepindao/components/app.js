import React from 'react'
import { Carousel, List } from 'antd-mobile'
import { SlidePage, Mask, AddressSearchGaode } from '@boluome/oto_saas_web_app_component'

import '../style/app.scss'
import '../style/editCar.scss'
import AnnualComApp from './annualapp'
import AnnualCom from './annual'

import bg2 from '../img/bg2.png'
import pb from '../img/pb.png'
import jiantou from '../img/jiantou.png'
import add from '../img/jia.png'

const Item = List.Item
const App = app => {
  const { name, geopoint, bannerData, serviceData, refData, goNav,
    goDetail, goViewAll, goWeizhang, handleAddCar, handlePlateNumberCar,
    handleTimevalue, untreated, totalFine, handleEditPlate, canEditTime,
    visible,
  } = app
  let { platData = [], sindustryData = [] } = app
  platData = platData.slice(0, 5)
  sindustryData = sindustryData.slice(0, 4)
  console.log('----totalFine---', totalFine, '--untreated-', untreated)
  if (bannerData && serviceData) {
    const jdData = serviceData.length > 0 ? serviceData.slice(0, 6) : []
    const dotStyle = {
      width:      '0.72rem',
      height:     '2px',
      background: '#d0d0d0',
    }
    const dotActiveStyle = {
      ...dotStyle,
      background: '#4a90e2',
    }
    const borderStyle = {
      borderBottom: '0.01rem solid #e5e5e5',
      borderRight:  '0.01rem solid #e5e5e5',
    }
    const borderRighr = {
      borderRight: '0.01rem solid #e5e5e5',
    }
    const isShow = false
    const showdata = {
      plateNumber: '添加爱车',
      logo:        add,
    }
    return (
      <div className='appWrap'>
        <div>
          <h3 className='top'>
            <span onClick={ () => {
              Mask(
                <SlidePage target='right' type='root' showClose={ false }>
                  <AddressSearchGaode { ...geopoint }
                    onSuccess={ e => { refData(e) } }
                    noFocus={ 1 }
                  />
                </SlidePage>,
                { mask: false, style: { position: 'absolute' } }
              )
            } }
            >
              { name }
            </span>
            <img alt='^' src={ pb } />
          </h3>
          <div className='tab'>
            {
              platData && platData.length > 0 ? (
                <Carousel
                  className='my-carousel'
                  autoplay={ false }
                  infinite
                  selectedIndex={ 0 }
                  swipeSpeed={ 35 }
                  dotStyle={ dotStyle }
                  dotActiveStyle={ dotActiveStyle }
                  beforeChange={ (from, to) => handlePlateNumberCar(from, to, platData) }
                  afterChange={ index => console.log('slide to', index) }
                >
                  {
                    platData.map((o, i) => (
                      <div key={ `${ Math.random() + i }` } style={{ height: 'auto' }}>
                        <CarMessage
                          data={ o }
                          goWeizhang={ goWeizhang }
                          handleAddCar={ handleAddCar }
                          handleTimevalue={ handleTimevalue }
                          untreated={ untreated }
                          handleEditPlate={ handleEditPlate }
                          canEditTime={ canEditTime }
                          visible={ visible }
                        />
                      </div>
                    ))
                  }
                </Carousel>
              ) : (
                <div key={ `${ Math.random() }` } style={{ height: 'auto' }}>
                  <CarMessageno
                    isShow='true'
                    handleEditPlate={ handleEditPlate }
                    showdata={ showdata }
                  />
                </div>
              )
            }
          </div>
          <div className='nav'>
            {
              sindustryData.map((e, i) => {
                return (
                  <div key={ `navThum${ Math.random() + i }` } style={ i < 4 ? borderStyle : borderRighr } onClick={ () => { goNav(e.orderType) } }>
                    <img className='navThum' alt='navThum' src={ e.logo } />
                    <p>{ e.title }</p>
                  </div>
                )
              })
            }
          </div>
          <div className='navsub'>
            <div className='service_banner' style={{ backgroundImage: `url(${ bg2 })` }}>
              <div>
                <div>
                  <p>精选洗车</p>
                  <p>全面清洁 一尘不染</p>
                  <p><span onClick={ () => { goViewAll() } }>查看全部</span></p>
                </div>
              </div>
            </div>
            <div>
              {
                jdData && jdData.map((e, i) => {
                  return (
                    <div key={ `jd${ Math.random() + i }` } className='service_li' onClick={ () => { goDetail(e.shopId, e.serviceId, e.isCanService) } }>
                      <div>
                        <img alt='banner' src={ e.shopAvator } />
                        { isShow ? <div><p>不在服务范围内</p></div> : '' }
                        <span>{ e.score }分</span>
                      </div>
                      <h2>{ e.shopName }</h2>
                      <p><span>¥{ e.minPrice }<i>起</i></span><span>据您{ e.distance }km</span></p>
                    </div>
                  )
                })
              }
            </div>
          </div>
        </div>
      </div>
    )
  }
  return (
    <div />
  )
}

export default App

// CarMessage---车主车辆信息
const CarMessage = ({ data, goWeizhang, handleAddCar, handleTimevalue, isShow = false, handleEditPlate, canEditTime }) => {
  const { plateNumber, logo, time, chexi, chexing, isError, untreated } = data
  let { remainingTime } = data
  const hong = {}
  if (remainingTime < 7 && remainingTime >= 0) {
    remainingTime = '即将过期'
  } else if (remainingTime < 0) {
    remainingTime = '已超时'
    hong.color = '#ff484'
  } else {
    remainingTime = `${ remainingTime }天`
    hong.color = '#ffab00'
  }
  console.log('---', hong, handleTimevalue, canEditTime, hong, handleEditPlate)
  const ItemStyle = {
    width:      '0px',
    height:     '0px',
    position:   'absolute',
    top:        '20%',
    left:       '30%',
    padding:    0,
    display:    'inlineBlock',
  }
  return (
    <div className='message'>
      <div className='main'>
        <div className='otot'>
          {
            isShow ? (
              <div className='logo logoShow'><img onClick={ () => handleAddCar() } src={ logo } alt='' /></div>
            ) : (
              <div className='logo'><img src={ logo } alt='' /></div>
            )
          }
          <div className={ `${ isShow ? 'name nameShow' : 'name' }` }><span>{ plateNumber }</span><span>{ chexi }{ chexing }</span></div>
          {
            isShow ? ('') : (<div className='carbtn' onClick={ () => handleAddCar() }><span><img src={ jiantou } alt='' /></span><span>车辆管理</span></div>)
          }
        </div>
        <div className='oto'>
          {
            isError ? (
              <div className='btnL'>{ untreated ? (untreated === 0 ? (<span className={ `${ untreated ? 'span untreatedSpan' : 'span' }` }>{ `${ untreated }起` }</span>) : <span className={ `${ untreated ? 'span untreatedSpan' : 'span' }` } onClick={ () => goWeizhang(data) }>{ `${ untreated }起` }</span>) : (<img style={{ marginBottom: '0.15rem' }} src={ add } alt='' onClick={ () => handleEditPlate(plateNumber) } />) }<span>违章待缴</span></div>
            ) : (
              <div className='btnL'><span className='errorSpan' onClick={ () => handleEditPlate(plateNumber) }>信息有误</span><span>点击进行修改</span></div>
            )
          }
          <div className='btnR'>
            { time && remainingTime ? (<span className='btnRspan' style={ hong }>{ remainingTime }</span>) : (<span><img className='addtime' src={ add } alt='' /></span>) }
            <Item
              style={ ItemStyle }
              thumb=''
              arrow='empty'
            />
            {
              time && remainingTime ? (
                <AnnualComApp handleTimevalue={ handleTimevalue } isShow={ false } appdata={ data } remainingTime={ remainingTime } time={ time } />
              ) : (
                <AnnualCom handleTimevalue={ handleTimevalue } isShow={ false } appdata={ data } remainingTime={ remainingTime } time={ time } />
              )
            }
          </div>
        </div>
      </div>
    </div>
  )
}
// <span className={ `${ untreated ? 'span untreatedSpan' : 'span' }` } onClick={ () => goWeizhang() }>{ untreated ? `${ untreated }起` : (<img src={ add } alt='' />) }</span>

const CarMessageno = ({ handleEditPlate, showdata }) => {
  const { logo, plateNumber } = showdata
  return (
    <div className='message'>
      <div className='main'>
        <div className='otot'>
          <div className='logo logoShow'><img onClick={ () => handleEditPlate('') } src={ logo } alt='' /></div>
          <div className='name'><span style={{ marginTop: '0.05rem' }}>{ plateNumber }</span><span style={{ marginTop: '0.03rem' }}>享受更多服务</span></div>
        </div>
        <div className='oto'>
          <div className='btnL'><span className='span' onClick={ () => handleEditPlate('') }><img src={ add } alt='' /></span><span>违章待缴</span></div>
          <div className='btnR'>
            <span onClick={ () => handleEditPlate('') }><img className='addtime' src={ add } alt='' /></span>
            <span style={{ marginTop: '0.08rem' }}>年检提醒</span>
          </div>
        </div>
      </div>
    </div>
  )
}
