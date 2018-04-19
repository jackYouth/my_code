import React from 'react'
import { moment } from '@boluome/common-lib'

import '../../styles/message/index.scss'

// 当前时间在今天
const judgeToday = time => {
  const t = ((new Date()).getTime() / 1000) - time
  // 是今天之内：时间差在24小时，且日期相等
  if (t < 24 * 60 * 60 && moment('YYYY-MM-DD')(time * 1000) === moment('YYYY-MM-DD')(new Date())) return true
  return false
}

const conversionTimeFuc = time => {
  if (judgeToday(time)) {
    return moment('HH:mm:ss')(time * 1000)
  }
  // 昨天：传入时间加上24小时，在今天之内
  if (judgeToday(time + (24 * 60 * 60))) {
    return '昨天'
  }
  return moment('YYYY/MM/DD')(time * 1000)
}

const Message = ({
  recentContact, unreadMsg, handleChangeDialog,
}) => {
  if (!recentContact || !unreadMsg) return <div />
  const contactList = recentContact.map(o => {
    const { type, uid, msg } = o
    // 获取最后一条信息
    let lastMsg = msg[0][1]
    if (type === 1) lastMsg = '[图片]'
    if (type === 2) lastMsg = '[语音]'
    delete o.type
    o.lastMsg = lastMsg
    unreadMsg.forEach(oo => {
      if (oo.contact === uid) o.noreadNum = oo.msgCount
    })
    return o
  })
  return (
    <div className='message'>
      {
        recentContact.length >= 0 &&
        <ul className='message-list'>
          {
            contactList.map(o => {
              const { avator, nickname, time, lastMsg, noreadNum } = o
              const uid = o.uid.substring(8)
              const conversionTime = conversionTimeFuc(time)
              return (
                <li key={ time } onClick={ () => handleChangeDialog(uid, nickname) }>
                  {
                    noreadNum &&
                    <span className='sc-badge-icon'>{ noreadNum > 99 ? '99+' : noreadNum }</span>
                  }
                  <dl>
                    <dt>
                      <img src={ avator } alt={ nickname } />
                    </dt>
                    <dd>
                      <p>{ uid }</p>
                      <p>{ conversionTime }</p>
                    </dd>
                    <dd className='line-1'>{ lastMsg }</dd>
                  </dl>
                </li>
              )
            })
          }
        </ul>
      }
    </div>
  )
}

export default Message
