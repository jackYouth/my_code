import React from 'react'
import { Icon, Modal } from 'antd-mobile'
import SelectSeat from './selectSeat'
import '../style/getseat.scss'
import yixuan from '../img/seatbgY.png'
import yishou from '../img/seatbgR.png'
import kexuan from '../img/seatbgW.png'
import seatip from '../img/seatip.png'

const alert = Modal.alert
const showAlert = () => {
  alert('', '已满场，请选择其他场次', [
    {
      text: '知道了',
      onPress: () => {
        console.log('0.0')
      },
    },
  ])
}
// <Modal className='getseatTip' transparent maskClosable={ false } visible={ dateTip } onClose={ () => handleTip(dateTip) } footer={ [{ text: '我知道了', onPress: () => { handleTip(dateTip) } }] }>
//   <p>您选择的是<span>{ filmDate }</span>的场次，请看仔细哦</p>
// </Modal>
const Getseat = ({ allfill, channel, dateTip, seatData, divWidth, divHeight, seatNo, origin, cinemaInfo = {}, plan, filmDate, getSeat, goOder }) => {
  const { buyNumLimit = 4 } = cinemaInfo
  if (allfill) showAlert()
  if (seatData) {
    return (
      <div className='getseat'>

        <div className='header'>
          <p className='maskmodal' style={ dateTip ? { top: '0' } : { top: '-0.7rem' } }><Icon type={ require('svg/dianying/laba.svg') } />您选择的是<span>{ filmDate }</span>的场次，请仔细核对哦</p>
          <h4>{ cinemaInfo.name }</h4>
          <p>{ `${ filmDate }   ${ plan.startTime }    ${ plan.language }${ plan.screenType }` }</p>
        </div>
        <div className='selectSeat'>
          <span className='hallName'>{ plan.hallName }</span>
          <SelectSeat divWidth={ divWidth } divHeight={ divHeight } seatData={ seatData } origin={ origin } innerComponent={ <Seat seatData={ seatData } seatNo={ seatNo } getSeat={ getSeat } /> } />
          <p className='seatStatus'><span><img alt='已选' src={ yixuan } />已选</span><span><img alt='已售' src={ yishou } />已售</span><span><img alt='可选' src={ kexuan } />可选</span></p>
          <p className='seatServices'>{ channel === 'kou' ? '服务来自 抠电影' : '' }</p>
        </div>
        <div className='bottomDiv'>
          <SeatDown seatNo={ seatNo } getSeat={ getSeat } buyNumLimit={ buyNumLimit } />
          <div className='bottomInfo'>
            <SeatPrice seatNo={ seatNo } plan={ plan } />
            <div className={ JSON.parse(seatNo).length ? 'btn' : 'btnh' } onClick={ () => { goOder(seatData, seatNo) } }>确认选座</div>
          </div>
        </div>
      </div>
    )
  }
  return (
    <div />
  )
}

// 价格显示组件
const SeatPrice = ({ seatNo, plan }) => {
  const seatData = JSON.parse(seatNo)
  if (seatData.length) {
    return (
      <div className='info'>
        <p><span>票价：￥{ (seatData.length * plan.price).toFixed(2) }</span><i>(￥{ plan.price }/张)</i></p>
      </div>
    )
  }
  return (
    <div className='info'>
      <p><span>票价：￥0</span><i>(￥{ plan.price }/张)</i></p>
    </div>
  )
}

// 已选组件
const SeatDown = ({ seatNo, buyNumLimit, getSeat }) => {
  const seatData = JSON.parse(seatNo)
  const seatAry = seatData.length ? seatData.map((o, i) => <span key={ `seat${ Math.random() + i }` }>{ o.seatRow }排{ o.seatCol }座<Icon onClick={ () => { getSeat(seatNo, o) } } type={ require('svg/dianying/chahao.svg') } /></span>) : <i />
  if (seatData.length) {
    return (
      <div className='bottomTip' style={ (buyNumLimit > 4 && seatData.length > 4) ? { top: '-0.4rem' } : {} }>
        <h5>已选座位</h5>
        <p>
          { seatAry }
        </p>
      </div>
    )
  }
  return (
    <div className='bottomTip' style={{ top: '0.6rem' }}>
      <p className='tip'>温馨提示：您最多可选{ buyNumLimit }个座位</p>
    </div>
  )
}

// 座位组件
const Seat = ({ seatData = [], seatNo, getSeat }) => {
  let seatTabs = <div />
  const maxCol = seatData[0].length
  const maxRow = seatData.length
  if (seatData.length) {
    seatTabs = seatData.map((o, i) => {
      const seatCols = o.map(v => {
        let spanName = ''
        if (v.status < 0) {
          spanName = 'no'
        } else if (v.status) {
          spanName = 'seatN'
        } else if (seatNo.indexOf(JSON.stringify(v)) >= 0) {
          spanName = 'seatI'
        } else {
          spanName = 'yes'
        }
        return (
          <div key={ `seat${ Math.random() }` }
            className='seatContainer'
            onClick={
              () => {
                if (v.status === 0) {
                  getSeat(seatNo, v, maxCol, maxRow)
                }
              }
            }
          >
            <span className={ spanName }>
              { (v.status === 0) && `${ v.seatRow }排` }<br />{ (v.status === 0) && `${ v.seatCol }座` }
            </span>
          </div>
        )
      })
      return (
        <div key={ `seatcol${ i * Math.random() }` }>{ seatCols }</div>
      )
    })
  }
  return (
    <div className={ (seatData[0].length % 2) ? 'seatTabs' : 'seatTab' }>
      { seatTabs }
    </div>
  )
}

export const Tipimg = () => {
  return (
    <div>
      <img style={{ width: '2rem', height: '1.2rem', margin: '0 0.3rem 0.2rem' }} alt='tip' src={ seatip } />
      <p>座位旁边不要留空</p>
    </div>
  )
}

export default Getseat
