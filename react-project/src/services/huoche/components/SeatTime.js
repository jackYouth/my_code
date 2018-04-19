import React from 'react'
import { List, Toast } from 'antd-mobile'
import { Mask, Calendar, SlidePage } from '@boluome/oto_saas_web_app_component'
import { getStore, setStore } from '@boluome/common-lib'

import AlternativeSeat from './alternative'
import AlternativeTime from './alternativetime'
import SelectTrain from './SelectTrain'
import '../style/SelectTrain.scss'

const Item = List.Item
// const Brief = Item.Brief

class SeatTime extends React.Component {
  constructor(props) {
    super(props)
    const chooseTrain = getStore('huoche_chooseTrain', 'session') ? getStore('huoche_chooseTrain', 'session') : []
    const chooseSeat = getStore('huoche_chooseSeat', 'session') ? getStore('huoche_chooseSeat', 'session') : []
    const haveChooseZuo = getStore('huoche_haveChooseZuo', 'session') ? getStore('huoche_haveChooseZuo', 'session') : []
    const chooseZuowei = getStore('huoche_chooseZuowei', 'session') ? getStore('huoche_chooseZuowei', 'session') : []
    const chooseArrtime = getStore('huoche_chooseArrtime', 'session') ? getStore('huoche_chooseArrtime', 'session') : []
    const alterTime = getStore('huoche_alterTime', 'session') ? getStore('huoche_alterTime', 'session') : []
    const details = getStore('huoche_details', 'session')
    this.state = {
      ...props.propsObj,
      chooseTrain,
      chooseSeat,
      haveChooseZuo,
      alterTime,
      chooseZuowei,
      chooseArrtime,
      details,
      colorClass: props.colorClass,
    }
    // console.log('colorClass--', props.colorClass, props.propsObj)
    // console.log('test--propsObj-', props.propsObj)
    this.handleChooseArr = this.handleChooseArr.bind(this)
    this.handleAlternativeTime = this.handleAlternativeTime.bind(this)
  }
  componentWillUnmount() {
    // Popup.hide()
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      ...nextProps.propsObj,
    })
  }
  handleSpecifiedDate() {
    const { handleCalendarDate } = this.state
    Mask(
      <SlidePage target='right' showClose={ false } >
        <Calendar pricearr={ [] } onChange={ res => handleCalendarDate(res) } untilDay={ 60 } vipDay={ 28 } />
      </SlidePage>
    , { mask: false, style: { position: 'absolute' } })
  }
  // 接受选择的备选日期
  handleChooseArr(arrTime) {
    const { handleTimeStart, chooseArrtime } = this.state
    this.setState({
      alterTime: arrTime,
    })
    handleTimeStart(arrTime, chooseArrtime)
  }
  // 备选车次
  handleSelectTrain() {
    const { chooseTime, chooseCity, chooseTrain, details } = this.state
    Mask(
      <SlidePage target='right' showClose={ false } >
        <SelectTrain
          details={ details }
          chooseCity={ chooseCity }
          chooseTime={ chooseTime }
          chooseTrain={ chooseTrain }
          handleGetchooseTrain={ (res, reply, seat, startTime, mark) => this.handleGetchooseTrain(res, reply, seat, startTime, mark) }
        />
      </SlidePage>
    , { mask: false, style: { position: 'absolute' } })
  }
  // 将备选车次传入
  handleGetchooseTrain(chooseZuowei, chooseTrain, chooseSeat, startTime, mark) {
    const { handleHavechooseTrain } = this.props.propsObj
    this.setState({
      chooseTrain,
      chooseSeat,
      chooseZuowei,
      startTime,
    })
    let arrhaveChooseZuo = []
    if (mark) {
      this.setState({
        haveChooseZuo: [],
      })
    } else {
      const { haveChooseZuo } = this.state
      const arr = haveChooseZuo.filter(e => chooseZuowei.some(o => o.name === e.name))
      this.setState({
        haveChooseZuo: arr,
      })
      arrhaveChooseZuo = arr
      this.handleOkchoose(arr)
      setStore('huoche_haveChooseZuo', arr, 'session')
    }
    handleHavechooseTrain(chooseZuowei, chooseTrain, chooseSeat, startTime, arrhaveChooseZuo)
  }
  // 修改车次的时候，自动判断做大价格坐席是否还在
  handleOkchoose(haveChooseZuo) {
    let maxprice = 0
    const arr = []
    const seatsData = getStore('huoche_seatsData_grab', 'session') ? getStore('huoche_seatsData_grab', 'session') : 0
    if (seatsData !== 0) {
      arr[0] = seatsData
    } else {
      arr[0] = haveChooseZuo[0]
    }
    if (haveChooseZuo.length > 0) {
      maxprice = haveChooseZuo.reduce((i, o) => {
        if (o.price > i.price) {
          return o
        }
        return i
      }, arr[0])
    } else {
      maxprice = seatsData
    }
    setStore('huoche_haveChooseZuo', haveChooseZuo, 'session')
    setStore('huoche_maxprice', maxprice.price, 'session')
    setStore('huoche_maxpriceObj', maxprice, 'session')
    this.handlechooseZuowei(haveChooseZuo, maxprice.price, maxprice)
  }
  // 从子组件获取到备选的坐席
  handlechooseZuowei(res, price, maxpriceObj) {
    const { handleMaxPrice } = this.props.propsObj
    let p = price
    let pObj = maxpriceObj
    const seatsData = getStore('huoche_seatsData_grab', 'session') ? getStore('huoche_seatsData_grab', 'session') : 0
    if (seatsData !== 0 && price < seatsData.price) {
      p = seatsData.price
      pObj = seatsData
    }
    this.setState({
      haveChooseZuo: res,
      maxprice:      p,
    })
    setStore('huoche_maxprice', p, 'session')
    setStore('huoche_maxpriceObj', pObj, 'session')
    handleMaxPrice(p, pObj, res)
    console.log(p, pObj, res, 'aaaaaa')
  }
  handleAlternative() {
    const { chooseZuowei, haveChooseZuo, chooseTrain } = this.state
    if (chooseTrain.length === 0) {
      Toast.info('请选择备选车次', 2, null, false)
    } else {
      Mask(<AlternativeSeat chooseZuowei={ chooseZuowei } haveChooseZuo={ haveChooseZuo } handlechooseZuowei={ (res, price, maxpriceObj) => this.handlechooseZuowei(res, price, maxpriceObj) } />, { mask: true, style: { position: 'absolute' } })
    }
  }
  handleAlternativeTime() {
    const { chooseTime, timearr, chooseArrtime } = this.state
    if (chooseArrtime.length === 0) {
      chooseArrtime.push(chooseTime)
    }
    Mask(<AlternativeTime chooseTime={ chooseTime } timearr={ timearr } handleChooseArr={ this.handleChooseArr } chooseArrtime={ chooseArrtime } />, { mask: true, style: { position: 'absolute' } })
  }
  render() {
    const { chooseTime = {}, chooseSeat, haveChooseZuo, alterTime, NotEditable, colorClass = '', details, channel } = this.state
    const { dateShow } = chooseTime
    if (NotEditable) {
      return (
        <div className='SeatTimeWrap'>
          <List>
            {
              details ? (<Item arrow='empty'>指定日期<span className='itemoto' style={ colorClass }>{ dateShow }</span></Item>) : (<Item arrow='horizontal' onClick={ () => this.handleSpecifiedDate() }>指定日期<span className='itemoto' style={ colorClass }>{ dateShow }</span></Item>)
            }
          </List>
          <List>
            <Item arrow='horizontal' onClick={ () => this.handleSelectTrain() }>备选车次<span className='itemoto'>{
              chooseSeat.map(o => (<i key={ `${ o.number + o.no }` }>{ o.number }</i>))
            }{ chooseSeat && chooseSeat.length === 0 ? '建议多选' : '' }</span></Item>
          </List>
          <List>
            <Item arrow='horizontal' onClick={ () => this.handleAlternative() }>备选坐席<span className='itemoto'>{
              haveChooseZuo.map(o => (<i key={ o.name }>{ o.name }</i>))
            }{ haveChooseZuo && haveChooseZuo.length === 0 ? '建议多选' : '' }</span></Item>
          </List>
          <List>
            {
              channel && channel === 'tongcheng' ? ('') : (
                <Item arrow='horizontal' onClick={ () => this.handleAlternativeTime() }>备选日期<span className='itemoto'>{
                  alterTime.map(e => (<i key={ e }>{ e }</i>))
                }{ alterTime && alterTime.length === 0 ? '建议多选' : '' }</span></Item>
              )
            }
          </List>
        </div>
      )
    }
    return (
      <div className='SeatTimeWrap'>
        <List>
          <Item arrow='empty'>指定日期<span className='itemoto' style={ colorClass }>{ dateShow }</span></Item>
        </List>
        <List>
          <Item arrow='empty'>备选车次<span className='itemoto'>{
            chooseSeat.map(o => (<i key={ `${ o.number + o.no }` }>{ o.number }</i>))
          }{ chooseSeat && chooseSeat.length === 0 ? '未选择' : '' }</span></Item>
        </List>
        <List>
          <Item arrow='empty'>备选坐席<span className='itemoto'>{
            haveChooseZuo.map(o => (<i key={ o.name }>{ o.name }</i>))
          }{ haveChooseZuo && haveChooseZuo.length === 0 ? '未选择' : '' }</span></Item>
        </List>
        <List>
          {
            channel && channel === 'tongcheng' ? ('') : (
              <Item arrow='empty'>备选日期<span className='itemoto'>{
                alterTime.map(e => (<i key={ e }>{ e }</i>))
              }{ alterTime && alterTime.length === 0 ? '未选择' : '' }</span></Item>
            )
          }
        </List>
      </div>
    )
  }
}

export default SeatTime
