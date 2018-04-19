import '../style/result.scss'

import React from 'react'
import { Tabs } from 'antd-mobile'
import ic_loc from '../img/bmapLoc.png'

const TabPane = Tabs.TabPane;

const result = (props) => {

  // console.log('Cprops================',props);

  const { area , cx , floor , sumFloor , residentialareaName , dyVal , information = {} , building } = props
  const { feachFacility , facilityInfor } = props

  let tabArr = [{name:'基本信息'},
                {name:'交通'},
                {name:'超市'},
                {name:'医院'},
                {name:'酒店'}]


  let tabInfo =  [{
    name: '基本信息',
    key : 'baseinfo'
  }, {
    name: '交通',
    key : ['subwayLine', 'busLine']
  }, {
    name: '超市',
    key : 'supermarket'
  }, {
    name: '医院',
    key : 'hospital'
  }, {
    name: '酒店',
    key : 'hotel'
  }]

  return(
    <div>
      <div className='title'>{ residentialareaName }</div>
      <div className='mainInfor'>
        <div className='infor'>
          <p className='area'>
            <span>{ area + '㎡' }</span>
            <span>面积</span>
          </p>
          <p className='orientation'>
            <span>{ cx }</span>
            <span>朝向</span>
          </p>
          <p className='floor'>
            <span>{ floor + '/' + sumFloor }</span>
            <span>楼层</span>
          </p>
          <p className='orientation'>
            <span>{ building + '号' }</span>
            <span>楼栋</span>
          </p>
        </div>
        <div className='detailsBox'>
          <div className='details'>
            <div className='priceBox'>
              <div className='sumPrice'>
                <span>评估总价</span>
                <span>{ information.totalPrice }</span>
                <span>万</span>
              </div>
              <div className='price'>
                <div className='lineOne'>
                  <span>评估单价</span>
                  <span>{ information.price ? information.price : 0 }</span>
                  <span>元／平</span>
                </div>
                <div className='lineTwo'>
                  <span>出租单价</span>
                  <span>{ information.rentPrice ? information.rentPrice : 0 }</span>
                  <span>元／平</span>
                </div>
              </div>
            </div>
            <p className='comparison'>
              <span>小区均价：{ information.unitPrice ? information.unitPrice : 0 }元／平</span>
              <span>同比去年：{ information.ratioByLastYearForPrice ? Number(information.ratioByLastYearForPrice*100).toFixed(2) : 0 }% </span>
              <span>环比上月：{ information.ratioByLastMonthForPrice ? Number(information.ratioByLastMonthForPrice*100).toFixed(2) : 0 }% </span>
            </p>
          </div>
        </div>
        <div className='bMapBox'>
          <div id='bMap' ref={ node => {
            if(node) {
              const { Map, Point, Marker, Icon, Size } = window.BMap
              let point    = new Point(information.longitude, information.latitude)
              const map    = new Map(node)
              const marker = new Marker(point, { icon: new Icon(ic_loc, new Size(86, 97) ) })
              map.centerAndZoom(point, 26)
              map.addOverlay(marker)
              map.panTo(point)
            }
          }}>
        </div>

        </div>
        <div className='facility'>
          <Tabs swipeable = {false} defaultActiveKey = '0' >
              {

                tabInfo.map(({ name, key }, index) => {

                  let component
                  if(!facilityInfor) {
                    return
                  }
                  if(key === 'baseinfo') {
                    component = <div className='baseinfoBox'>
                        <p className='basisInfor'>
                          <span>小区名称：</span>
                          <span>{ facilityInfor[key].residentialAreaName }</span>
                        </p>
                        <p className='basisInfor'>
                          <span>小区地址：</span>
                          <span>{ facilityInfor[key].address }</span>
                        </p>
                        {
                          facilityInfor[key].school ?
                            <p className='basisInfor'>
                              <span>划片学校：</span>
                              <span>{ facilityInfor[key].school }</span>
                            </p> : ''
                        }
                        {
                          facilityInfor[key].subwayLine > 0 ?
                          <p className='basisInfor'>
                            <span>轨道交通：</span>
                            <span>{ facilityInfor[key].subwayLine }</span>
                          </p> : ''
                        }
                        <p className='basisInfor'>
                          <span>建筑类型：</span>
                          <span>住宅</span>
                        </p>
                       </div>
                  } else if(Array.isArray(key)) {
                    component = (
                      <div>
                        {
                          key.map((k, index) => (
                            <div key={ `${ key }-${ index }` } className='trifficBox'>
                              <div style={{ color:'#606060' ,fontSize:'0.26rem' }} className='trifficTitle'>{ facilityInfor[k][0] ? facilityInfor[k][0].querytype : '' }</div>
                              <div className='trifficMain'>
                                {
                                  facilityInfor[k].map(
                                    ({ address , distance , name }, index) => (
                                      <div key={ `${ key }-${ Math.random() }` }>
                                        <h2 style={{fontSize:'0.3rem'}}>
                                          <span className='orangeBack'></span>{name}<span style={{marginLeft:'40px'}} >{ distance + 'm' }</span>
                                        </h2>
                                        <p style={{ marginTop:'20px' ,color: '#999' ,fontSize:'0.28rem' }}>{ address }</p>
                                      </div>
                                    )
                                  )
                                }
                              </div>
                            </div>
                          ))
                        }
                      </div>
                    )
                  } else {
                    component = (
                      <div>
                        {
                          facilityInfor[key].length > 0 ? facilityInfor[key].map(({ address , distance , name }, index) => (
                            <div key={ `${ key }-${ Math.random()+1 }` } className='inforBox'>
                              <h2>
                                <span className='orangeBack'></span>{ name } <span> { distance + 'm'} </span>
                              </h2>
                              <p><span>地址：</span><span>{ address }</span></p>
                            </div>))
                            : <div className='noInfor'>
                                <span>未找到相关信息</span>
                              </div>
                        }
                      </div>
                    )
                  }
                  return (
                    <TabPane tab={ name } key={ index } >
                      { component }
                    </TabPane>
                  )
                })
              }
          </Tabs>
        </div>
      </div>
    </div>
  )
}

export default result
