import React from 'react'
import { Tabs, Picker } from 'antd-mobile'
import { Mask, SlidePage, UserCenter } from '@boluome/oto_saas_web_app_component'
import { getStore } from '@boluome/common-lib'
// import vconsole from 'vconsole'
import AirportList from './airportList'
import '../style/index.scss'
import notFound from '../image/noairport.png'

const TabPane = Tabs.TabPane
const App = props => {
  console.log('index props-------', props)
  const { handleChooseAirport, airportInfo = {}, handleChooseInternational, chooseInternational = ['全部出发区域'],
          chooseTerminal = ['全部航站楼'], handleChooseTerminal, channel, areaInfo = [], handleAirport,
        } = props
  const { airportName } = airportInfo
  const airportTerminalArray = []
  const internationalArray = [
    { label: '全部出发区域', value: '全部出发区域' },
    { label: '国内出发', value: '国内出发' },
    { label: '国际出发', value: '国际出发' },
  ]
  airportTerminalArray.push({ label: '全部航站楼', value: '全部航站楼' })
  areaInfo.forEach(item => {
    const test = airportTerminalArray.filter(i => {
      return item.airportTerminal === i.value
    })
    if (!test[0]) {
      airportTerminalArray.push({ label: item.airportTerminal, value: item.airportTerminal })
    }
  })

  return (
    <div className='konggang-index-container'>
      <div className='index-main-container'>
        <Tabs defaultActiveKey={ getStore('serverType', 'session') === 'aisle' ? '2' : '1' } onChange={ v => handleAirport(v, channel, props) } swipeable={ false }>
          <TabPane tab='休息室' key='1'>
            <div>
              <Areainfo data={ props } />
            </div>
          </TabPane>
          <TabPane tab='通道' key='2'>
            <div>
              <Areainfo data={ props } />
            </div>
          </TabPane>
        </Tabs>
      </div>
      <div className='index-bottom-container'>
        <span className='airport' onClick={ () =>
          Mask(
            <SlidePage target='right' showClose={ false }>
              <AirportList props={ props } chooseAirport={ r => handleChooseAirport(r, channel) } />
            </SlidePage>
          , { mask: false }) }
        >
          { airportName }
        </span>
        <div className='airportTerminal-box'>
          <Picker mode='time' className='airportTerminal' style={{ display: 'inline-block' }}
            data={ airportTerminalArray }
            title='航站楼'
            onChange={ t => handleChooseTerminal(t) }
            value={ chooseTerminal }
            cols={ 1 }
          >
            <span className='airportTerminal'>{ chooseTerminal }</span>
          </Picker>
        </div>
        <div className='airportTerminal-box'>
          <Picker mode='time' className='airportTerminal' style={{ display: 'inline-block' }}
            data={ internationalArray }
            title='出发区域'
            onChange={ t => handleChooseInternational(t) }
            value={ chooseInternational }
            cols={ 1 }
          >
            <span className='international'>{ chooseInternational }</span>
          </Picker>
        </div>
      </div>
      <UserCenter categoryCode='dengjifuwu' />
    </div>
  )
}

export default App

// tab内的内容
const Areainfo = props => {
  const { data = {} } = props
  console.log('areainfo data', data)
  const { handleThisData, areaInfo = [], chooseTerminal = [], chooseInternational = [], firstFetch = true } = data
  let newAreaInfo = areaInfo
  const filterArr = chooseTerminal.concat(chooseInternational)
  // console.log('filterArr', filterArr)
  if (chooseInternational.length > 0 && chooseInternational[0] === '全部出发区域' && chooseTerminal.length > 0 && chooseTerminal[0] === '全部航站楼') {
    newAreaInfo = areaInfo
  } else if (chooseInternational.length === 0 && chooseTerminal.length === 0) {
    newAreaInfo = areaInfo
  } else if (chooseInternational.length > 0 && chooseInternational[0] !== '全部出发区域' && chooseTerminal.length > 0 && chooseTerminal[0] !== '全部航站楼') {
    newAreaInfo = areaInfo.filter(i => {
      return i.airportTerminal === filterArr[0] && i.internationalCN === filterArr[1]
    })
  } else if (chooseInternational.length > 0 && chooseTerminal.length === 0 && chooseInternational[0] !== '全部出发区域') {
    newAreaInfo = areaInfo.filter(i => {
      return i.internationalCN === filterArr[0]
    })
  } else if (chooseTerminal.length > 0 && chooseInternational.length === 0 && chooseTerminal[0] !== '全部航站楼') {
    newAreaInfo = areaInfo.filter(i => {
      return i.airportTerminal === filterArr[0]
    })
  } else if (chooseInternational[0] === '全部出发区域' || chooseTerminal[0] === '全部航站楼') {
    if (chooseInternational[0] === '全部出发区域') {
      if (chooseTerminal[0]) {
        newAreaInfo = areaInfo.filter(i => {
          return i.airportTerminal === chooseTerminal[0]
        })
      } else {
        newAreaInfo = areaInfo
      }
    } else if (chooseTerminal[0] === '全部航站楼') {
      if (chooseInternational[0]) {
        newAreaInfo = areaInfo.filter(i => {
          return i.internationalCN === chooseInternational[0]
        })
      } else {
        newAreaInfo = areaInfo
      }
    } else {
      newAreaInfo = areaInfo
    }
  }
  console.log('newAreaInfo------>', newAreaInfo.length)
  return (
    <div className='areaInfo-container'>
      {
        newAreaInfo.length > 0 ?
          <div>
            {
              newAreaInfo.map(item => {
                return (
                  <div className='areaInfo-box' key={ `areaInfoArr${ item.areaId }` } onClick={ () => handleThisData(item) }>
                    <div className='areaInfo-img-box'>
                      <img src={ item.image[0] } alt={ item.airportName } />
                      {
                        item.type === 4 ?
                          <span className='typeFour'>组合套餐</span>
                        : ''
                      }
                    </div>
                    <div className='areaInfo-info-box'>
                      <h3>{ item.areaName }</h3>
                      <span className='hoursSection'>{ item.hoursSection }</span>
                      <span className='airportTerminal'>{ item.airportTerminal }</span>
                      <div className='price'>
                        <span>¥</span>
                        <span>{ item.price }</span>
                      </div>
                    </div>
                  </div>
                )
              })
            }
          </div>
        :
          <div style={{ display: firstFetch ? 'none' : 'block', textAlign: 'center', fontSize: '.3rem', marginTop: '50%' }}>
            <img src={ notFound } alt={ '图片飞了～～' } />
            <div style={{ fontSize: '0.3rem', textAlign: 'center', padding: '0.3rem 0', color: '#999' }}>暂无服务，敬请期待</div>
          </div>
      }
    </div>
  )
}
