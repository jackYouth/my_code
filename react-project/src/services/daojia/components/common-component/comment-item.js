import React from 'react'
import { Evaluation } from '@boluome/oto_saas_web_app_component'
import { Grid, Icon } from 'antd-mobile'

import '../../styles/comment-item.scss'

const CommentItem = ({ data }) => {
  const { userId, name, contact, comment } = data
  const { address } = contact
  const { commentTime, imgs, score, userComment, replys } = comment
  return (
    <div className='comment-item'>
      <ul className='comment-header'>
        <li className='comment-info'>
          <p className='user-icon' />
          <span>{ userId }</span>
          <Evaluation defaultValue={ `${ score / 0.05 }%` } width={ '1.6rem' } />
        </li>
        <li className='comment-time'>
          { commentTime } &nbsp;&nbsp;{ `服务：${ name }` }
        </li>
        <li className='comment-content'>
          <p className='text'>{ userComment }</p>
          <Grid
            data={ imgs }
            columnNum={ 3 }
            renderItem={ (dataItem, index) => (
              <div style={ index % 3 !== 2 ? { paddingRight: '.12rem', marginBottom: '.2rem' } : { marginBottom: '.2rem' } }>
                <img src={ dataItem } style={{ width: '100%', height: '100%' }} alt='icon' />
              </div>)
            }
          />
        </li>
        <li className='comment-address'>{ `来自于：${ address }` }</li>
      </ul>
      <div className='comment-reply'>
        {
          replys && replys.length > 0 &&
          replys.map(item => <p key={ item.value }><Icon type={ require('svg/daojia/message.svg') } size='md' />{ `${ item.key }：${ item.value }` }</p>)
        }
      </div>
    </div>
  )
}

export default CommentItem
