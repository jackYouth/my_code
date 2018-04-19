import React from 'react'
import { List, WhiteSpace, Tabs, Accordion, Icon } from 'antd-mobile'
import { Mask, Evaluation } from '@boluome/oto_saas_web_app_component'
import { setStore } from '@boluome/common-lib'
import '../style/details.scss'

import svgCheng from '../img/svg_cheng.svg'
import svgEr from '../img/svg_er.svg'
import svgOld from '../img/svg_old.svg'
import svgXue from '../img/svg_xue.svg'
import svgOther from '../img/svg_you.svg'
import svgHuo from '../img/svg_huo.svg'

const Item = List.Item
const TabPane = Tabs.TabPane

const Details = props => {
  const { DetailsListDatas, DetailsList, DetailsIntroduced,
    handlePicShow, handleGoOrder, handleSuccess, handleGoaddrMap,
    close,
  } = props
  const handleOrdertrick = data => {
    Mask(<Ordertrick data={ data } handleGoOrder={ handleGoOrder } />)
  }
  // 开放时间弹窗
  const handleTimeToast = openTime => {
    const handleContainerClose = ''
    // Toast.info( <OtimeToast openTime = { openTime }/>, 100 );
    Mask(<OtimeToast openTime={ openTime } />, close === 1 ? handleContainerClose() : '')
    // Mask(<OtimeToast openTime={ openTime } />)
  }
  return (
    <div className='detailsWrap' >
      <ItemPic DetailsListDatas={ DetailsListDatas } handlePicShow={ handlePicShow } />
      <ItemNote DetailsListDatas={ DetailsListDatas } handleSuccess={ handleSuccess }
        handleGoaddrMap={ handleGoaddrMap } handleTimeToast={ handleTimeToast }
        close={ close }
      />
      <WhiteSpace size='lg' />
      <ItemTrick DetailsListDatas={ DetailsListDatas } DetailsList={ DetailsList }
        DetailsIntroduced={ DetailsIntroduced } handleOrdertrick={ handleOrdertrick }
        handleGoOrder={ handleGoOrder }
      />
    </div>
  )
}

export default Details

const ItemPic = ({ DetailsListDatas, handlePicShow }) => {
  if (DetailsListDatas) {
    const { name, level, images } = DetailsListDatas
    setStore('addrTitlename', name, 'session')
    let stararr = []
    let levelstr = 3
    let score = 7.5
    if (level === 'AAAAA') {
      stararr = '92%'; levelstr = 5; score = 9.2
    } else if (level === 'AAAA') {
      stararr = '82%'; levelstr = 4; score = 8.2
    } else if (level === 'AAA') {
      stararr = '72%'; levelstr = 3; score = 7.8
    } else if (level === 'AA') {
      stararr = '56%'; levelstr = 2; score = 7.2
    } else if (level === 'A') {
      stararr = '30%'; levelstr = 1; score = 6.9
    } else {
      stararr = '65%'; levelstr = 3
    }
    return (
      <div className='ItempicWrap'>
        <div className='picMeng' />
        <div className='itemPic'>
          <img alt='加载中' src={ images[0] } />
        </div>
        <div className='itemMain'>
          <div className='itemTitle'>
            <span className='title'>{ name }</span>
            <span className='level'>{ levelstr }A景区</span>
          </div>
          <div className='itemgount'>
            <span className='Star'>
              <Evaluation defaultValue={ stararr } width={ '1.36rem' } />
            </span>
            <span className='fenshu'>{ score }分</span>
            <span className='picshow' onClick={ () => { handlePicShow(images) } }>{ images.length }张图片</span>
          </div>
        </div>
      </div>
    )
  }
  return (<div />)
}

const ItemNote = ({ DetailsListDatas, handleGoaddrMap, handleTimeToast, close }) => {
  const arr = []
  if (DetailsListDatas) {
    const { serviceGuarantee } = DetailsListDatas

    for (let i = 0; i < serviceGuarantee.length; i++) {
      if (serviceGuarantee[i] === 'ENSURING_THE_GARDEN') {
        arr[i] = '保证入园'
      } else if (serviceGuarantee[i] === 'FAST_INTO_THE_GARDEN') {
        arr[i] = '快速入园'
      } else if (serviceGuarantee[i] === 'BACK_AT_ANY_TIME') {
        arr[i] = '随时退'
      } else if (serviceGuarantee[i] === 'YOU_WILL_LOSE') {
        arr[i] = '贵就赔'
      }
    }
    // console.log(arr)
  }
  if (DetailsListDatas) {
    const { addr, latitude, longitude } = DetailsListDatas
    let { openTime } = DetailsListDatas
    const myaddrPoint = { latitude, longitude }
    setStore('myaddrPoint', myaddrPoint, 'session')
    if (!openTime) {
      openTime = '暂无具体营业时间请联系10106060'
    }
    // console.log('close---====---',close);
    return (
      <List className='itemnoteWrap'>
        <Item arrow='horizontal' onClick={ () => { handleGoaddrMap(addr, latitude, longitude) } } >景区地址：{ addr }</Item>
        <Item arrow='horizontal' onClick={ () => { handleTimeToast(openTime, close) } }>{ `开放时间:${ openTime }` }</Item>
        {
          arr.length > 0 ?
            <Item>
              {
                arr.map((item, index) => (
                  <span key={ `${ index + item }` } className='serviceSpan'>{ item }</span>
                ))
              }
            </Item> : ('')
        }
      </List>
    )
  }
  return (<div />)
}
// 开放时间弹窗
const OtimeToast = ({ openTime }) => {
  return (
    <div className='openTimeWrap'>
      <div className='openTimeHeader'>开放时间：</div>
      <div className='openTime'>{ openTime }</div>
    </div>
  )
}

const ItemTrick = ({ DetailsListDatas, DetailsList, DetailsIntroduced, handleOrdertrick, handleGoOrder }) => {
  if (DetailsListDatas && DetailsList) {
    // const { name } = DetailsListDatas
    // const { goodsList } = DetailsList
    // console.log('aaaa----', DetailsList, 'ss----', DetailsList)
    return (
      <div className='itemTabs'>
        <Tabs defaultActiveKey='1' tabBarPosition='top' swipeable={ false } >
          <TabPane tab='订票' key='1'>
            <TabItem1 itemData={ DetailsList } handleOrdertrick={ handleOrdertrick } handleGoOrder={ handleGoOrder } />
          </TabPane>
          <TabPane tab='景点特色' key='2'>
            <div className='tabItem' style={{ backgroundColor: '#fff' }}>
              <TabItem2 DetailsIntroduced={ DetailsIntroduced } />
            </div>
          </TabPane>
        </Tabs>
      </div>
    )
  }
  return (<div />)
}

const TabItem1 = ({ itemData, handleOrdertrick, handleGoOrder }) => {
  if (itemData && itemData.length > 0) {
    return (
      <div className='tabItem' style={{ backgroundColor: '#f3f3f4' }}>
        <Accordion defaultActiveKey='1' >
          {
            (itemData).map((item, index) => (
              <Accordion.Panel header={ <TabTitle item={ item.name } /> } className='header' key={ `${ index + 1 }` }>
                <List>
                  {
                    (item.goodsList).map((items, indexs) => (
                      <Item data-Id={ items.id } key={ `${ indexs + items.id }` }>
                        <div className='title'>{ items.name }</div>
                        <div className='time'>
                          <div className='timeS1'>
                            <span className='s1a'>{ items.aheadHourDesc }</span>
                            <span className='s1b' onClick={ () => { handleOrdertrick(items, handleGoOrder) } }>订票须知</span>
                          </div>
                          <div className='timeS2'>
                            <span className='s2b' onClick={ () => { handleGoOrder(items.id, items.sellPrice) } }>预定</span>
                            <span className='s2a'>￥{ items.sellPrice }<i>起</i></span>
                          </div>
                          <div className='clear' />
                        </div>
                      </Item>
                    ))
                  }
                </List>
              </Accordion.Panel>
          ))
        }
        </Accordion>
      </div>
    )
  }
  return (
    <div className='no_trickWrap'>
      <div className='no_main'>
        <img alt='加载中' src={ require('../img/huangniu.png') } />
        <p>出游的人太多啦~门票已被抢光！</p>
      </div>
    </div>
  )
}
// 分类显示
const TabTitle = ({ item }) => {
  let srcStr = ''
  if (item === '成人票') {
    // srcStr = icCheng
    srcStr = svgCheng
  } else if (item === '儿童票') {
    // srcStr = icEr
    srcStr = svgEr
  } else if (item === '老人票') {
    // srcStr = icOld
    srcStr = svgOld
  } else if (item === '其他') {
    // srcStr = icOther
    srcStr = svgOther
  } else if (item === '学生票') {
    // srcStr = icXue
    srcStr = svgXue
  } else if (item === '活动票') {
    srcStr = svgHuo
  }
  return (
    <div className='tabtitle'>
      <span><Icon type={ srcStr } /></span>
      <span>{ item }</span>
    </div>
  )
}
const TabItem2 = ({ DetailsIntroduced }) => {
  if (DetailsIntroduced) {
    const { name, intro, character, playAttractions } = DetailsIntroduced
    return (
      <div className='tabIntro'>
        <div className='introMain'>
          <p style={{ paddingTop: '20px' }}>{ name }</p>
          {
            playAttractions && playAttractions.length === 0 ? (<div dangerouslySetInnerHTML={{ __html: intro }} />) : (<p>{ intro }</p>)
          }
          {
            character ? (character.map((items, index) => (
              <p key={ `${ index + 3 }` }>{ items }</p>
            ))) : ('')
          }
          {
            playAttractions ? (playAttractions.map((item, indexs) => (
              <div key={ `${ indexs + 1 }` }>
                <p>{ item.playName }</p>
                {
                  (item.playImages.length > 0) ? ((item.playImages).map((item2, index) => (
                    <div key={ `${ index + 2 }` }>
                      <img alt='加载中' src={ item2 } />
                      <WhiteSpace size='lg' />
                    </div>
                  ))) : ('')
                }
                <p>{ item.playInfo }</p>
              </div>
            ))) : ('')
          }
        </div>
      </div>
    )
  }
}

// 订票须知

const Ordertrick = ({ data, handleGoOrder, handleContainerClose }) => {
  if (data) {
    const { name, importentPoint, id, costInclude, importantNotice, sellPrice } = data
    return (
      <div className='orderinfoWrap'>
        <div className='orderinfoMian'>
          <div className='orderinfoHeader'>
            <span className='infoclose' /><span className='infortitle'>订票须知</span>
          </div>
          <div className='orderinfo'>
            <div className='info'>
              <p className='infotop'>{ name }</p>
              <p>费用包含：{ costInclude }</p>
              <p>入园须知：</p>
              <p>{ importantNotice }</p>
              <p>重要须知：{ importentPoint }</p>
            </div>
          </div>
          <div className='infoFooter'>
            <span className='infof1'>{ `¥${ sellPrice }` }</span><span className='infof2' onClick={ () => { handleContainerClose(); handleGoOrder(id) } }>立即下单</span>
          </div>
        </div>
      </div>
    )
  }
}
