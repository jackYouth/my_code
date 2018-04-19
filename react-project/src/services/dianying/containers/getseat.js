import React from 'react'
import { connect } from 'react-redux'
import { wrap, Loading } from '@boluome/oto_saas_web_app_component'
import { getStore, setStore } from '@boluome/common-lib'
import { browserHistory } from 'react-router'
import { Toast, Modal } from 'antd-mobile'
import { get } from 'business'
import { getReset } from '../actions/getseat.js'
import Getseat, { Tipimg } from '../components/getseat'

const alert = Modal.alert

const mapStateToProps = state => {
  const { getseat } = state
  return {
    ...getseat,
  }
}

const mapDispatchToProps = (dispatch, props) => {
  return {
    dispatch,

    handleTip: tip => {
      dispatch(
        getReset({
          dateTip: !tip,
        })
      )
    },

    goOder: (seatData, seatNo) => {
      const checkSeatIsValid = (seats, selectedSeat) => {
        // 复制座位列表
        const cloneSeats = JSON.parse(JSON.stringify(seats))
        let hasStep = 0
        let hasSpace = false

        // 将当前选中的座位赋值到列表中
        cloneSeats.forEach((row, rowIdx) => row.forEach(col => {
          selectedSeat.forEach(seat => {
            if (seat.seatRow === col.seatRow && seat.seatCol === col.seatCol) {
              seat.rowIdx = rowIdx
              col.selected = true
            }
          })
        }))
        // 遍历已选座位并判断是否有间隔
        selectedSeat.forEach(seat => {
          const rowData = cloneSeats[seat.rowIdx]
          // console.log(rowData)
          let currentIdx = 0
          rowData.forEach((o, idx) => { if (o.seatCol === seat.seatCol) currentIdx = idx })
          // 判断座位是否被选中
          const checkSeat = o => typeof o !== 'undefined' && (o.selected || o.status === 1)
          // 判断相对座位是否有间隔
          const checkStep = (cur, rel) => Math.abs(cur.seatCol - rel.seatCol) === 2
          // 判断相邻座位是否有间隔
          const checkHasStep = (near1, near2) => {
            if ((!!near1 && near1.status !== -1) && !checkSeat(near1) &&
                (!!near2 && near2.status !== -1) && !checkSeat(near2)) {
              hasSpace = true
            }
            return (!!near1 && near1.status !== -1) && !checkSeat(near1) &&
                   ((checkSeat(near2) && checkStep(seat, near2)) || ((!!near2 && near2.status === -1) || !near2))
          }
          const a = checkHasStep(rowData[currentIdx + 1], rowData[currentIdx + 2])
          const b = checkHasStep(rowData[currentIdx - 1], rowData[currentIdx - 2])
          if (a) hasStep++
          if (b) hasStep++
        })
        return (hasStep > 1) || ((hasStep === 1) && hasSpace)
      }
      if (!JSON.parse(seatNo).length) {
        Toast.info('未选座', 1)
      } else if (checkSeatIsValid(seatData, JSON.parse(seatNo))) {
        Toast.info(<Tipimg />, 1)
      } else {
        setStore('seatNo', JSON.stringify(seatNo), 'session')
        const { routeParams } = props
        const { channel } = routeParams
        browserHistory.push(`/dianying/${ channel }/order`)
      }
    },

    getSeat: (seatNo, seatInfo, maxCol, maxRow) => {
      const cinemaInfo = getStore('cinemaInfo', 'session')
      const { buyNumLimit = 4 } = cinemaInfo
      const { col, row } = seatInfo
      const origin = {
        colRatio: parseInt((col / maxCol) * 100, 10),
        rowRatio: parseInt((row / maxRow) * 100, 10),
      }

      const newSeat = JSON.stringify(seatInfo)
      const seatArr = JSON.parse(seatNo)
      let seat
      if (seatNo.indexOf(newSeat) >= 0) {
        let index
        seatArr.forEach((v, i) => { if (JSON.stringify(v) === JSON.stringify(seatInfo)) { index = i } })
        seatArr.splice(index, 1)
        seat = JSON.stringify(seatArr)
      } else if (seatArr.length < buyNumLimit) {
        seatArr.push(seatInfo)
        seat = JSON.stringify(seatArr)
      } else {
        Toast.info(`您最多可选${ buyNumLimit }个座位`, 1)
        seat = seatNo
      }
      if (maxCol) {
        dispatch(
          getReset({
            seatNo: seat,
            origin,
          })
        )
      } else {
        dispatch(
          getReset({
            seatNo: seat,
          })
        )
      }
    },
  }
}

const mapFunToComponent  = (dispatch, state) => {
  return {
    componentWillMount: () => {
      const cinemaInfo = getStore('cinemaInfo', 'session')
      const plan = getStore('plan', 'session')
      const filmInfo = getStore('filmInfo', 'session')
      const filmDate = getStore('filmDate', 'session')
      document.title = cinemaInfo.name
      const { OTO_SAAS = {} } = window
      const { customer = {} } = OTO_SAAS
      const { customize = {} } = customer
      if (customize.default.type === 'banner')  document.getElementById('root').firstChild.firstChild.firstChild.lastChild.innerHTML = cinemaInfo.name
      const { routeParams } = state
      const { channel, cinemaId, planId, hallId } = routeParams
      const handleClose = Loading()
      const dateTip = filmDate.indexOf('今天') < 0
      if (dateTip) {
        setTimeout(() => {
          dispatch(
            getReset({
              dateTip: false,
            })
          )
        }, 5000)
      }
      // 获取座位列表
      get(`/dianying/v1/cinema/${ cinemaId }/hall/${ hallId }/plan/${ planId }/seats`, { channel, cinemaId, planId, hallId }).then(({ code, data, message }) => {
        if (code === 0 && data.length) {
          handleClose()
          const divWidth = parseFloat(((data[0].length * (0.55 + 0.14)) + 1).toFixed(2), 10)
          const divHeight = parseFloat(((data.length * (0.58 + 0.14)) + 0.2).toFixed(2), 10)
          const allfill = data.reduce((p, n) => {
            return n.some(e => e.status === 0) ? false : p
          }, true)
          dispatch(
            getReset({
              allfill,
              channel,
              seatData: data,
              divWidth,
              divHeight,
              cinemaInfo,
              plan,
              filmInfo,
              filmDate,
              dateTip,
            })
          )
        } else {
          handleClose()
          const msg = message || '获取座位状态失败，请稍后再试~'
          const showAlert = info => {
            alert('温馨提示', info, [
              {
                text:    '确定',
                onPress: () => {
                  window.history.back()
                },
              },
            ])
          }
          showAlert(msg)
          console.log(msg)
        }
      })
    },
  }
}

export default
  connect(mapStateToProps, mapDispatchToProps)(
    wrap(mapFunToComponent)(Getseat)
  )
