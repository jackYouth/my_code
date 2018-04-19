import React from 'react'
import { WhiteSpace, Icon } from 'antd-mobile'
import { Empty } from '@boluome/oto_saas_web_app_component'
import SlideTab from './SlideTab'
import '../style/select.scss'
import noticket from '../img/noticket.png'

const Select = sel => {
  const { num, datali, ticketList, data, dataList, handleSelectsub, handleSelectpri, handleChangenum, handleSubmit } = sel
  const qto = [3, 4, 5]
  const qte = [2, 4, 6]
  if (dataList) {
    return (
      <div className='select'>
        <SlideTab data={ data } dataList={ dataList } selectSub={ res => handleSelectsub(res) } />
        <div className='slist_wrap' style={ (!ticketList || ticketList.length === 0) ? { height: 'calc(100% - 0.9rem)' } : {} }>
          {
            (!ticketList || ticketList.length === 0) && <Empty message='票已经被黄牛哥哥吃掉了，下次小觅绝对不会容忍' imgUrl={ noticket } />
          }
          {
            ticketList && ticketList.length > 0 && <div>
              <WhiteSpace size='lg' />
              <div className='pri_list' style={ ticketList && ticketList.length ? { background: '#ffffff' } : {} }>
                {
                  ticketList.map(o => {
                    return (
                      <span
                        className='pri_li'
                        key={ `list${ o.dealPrice * Math.random() }` }
                        onClick={ () => handleSelectpri(o) }
                        style={ o.quantity === 0 ? { color: '#e5e5e5', border: '1px solid #e5e5e5' } : (o.ticketsId === datali.ticketsId) ? { color: '#ffab00', background: '#fffbf2', border: '1px solid #ffab00' } : {} }
                      >
                        { `¥${ o.dealPrice }` }{ o.quantity === 0 ? '（售完）' : '（预定）' }<br />
                        { o.info }
                      </span>
                    )
                  })
                }
              </div>
            </div>
          }
        </div>
        {
          ticketList && ticketList.length > 0 && <div className='select_bottom'>
            <p>选择张数</p>
            <div className='sebt_select'>
              { (datali.quantity > 5 && datali.splitStyle !== 4 && datali.splitStyle !== 2) && <div className='select_indeirect'>
                {
                  qto.map(e => <span key={ `a${ Math.random() }` } onClick={ () => handleChangenum(e) }>{ e }张</span>)
                }
              </div> }
              { (datali.quantity > 6 && datali.splitStyle === 4) && <div className='select_indeirect'>
                {
                  qte.map(e => <span key={ `b${ Math.random() }` } onClick={ () => handleChangenum(e) }>{ e }张</span>)
                }
              </div> }
              <div className='select_deirect'>
                <p>
                  <Icon onClick={ () => { if (datali.splitStyle !== 2) { handleChangenum(num, 0, datali) } } }
                    type={ datali.splitStyle === 2 ? require('svg/piaowu/subh.svg') : require('svg/piaowu/sub.svg') }
                  />
                  <span>{ num }</span>
                  <Icon onClick={ () => { if (datali.splitStyle !== 2) { handleChangenum(num, 1, datali) } } }
                    type={ datali.splitStyle === 2 ? require('svg/piaowu/addh.svg') : require('svg/piaowu/add.svg') }
                  />
                </p>
              </div>
            </div>
            <div className='sebt_bt'>
              <p className='real_pri'>实付:<i>¥{ datali ? (datali.dealPrice * num).toFixed(2) : '0.0' }</i></p>
              <p className='real_go' onClick={ () => { handleSubmit(data.id, datali.ticketsId, num) } }>选好了</p>
            </div>
          </div>
        }
      </div>
    )
  }
  return (
    <div />
  )
}

export default Select
