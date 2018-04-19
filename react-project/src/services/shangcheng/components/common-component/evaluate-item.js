import React from 'react'
import { moment } from '@boluome/common-lib'
import { NewEvaluation } from '@boluome/oto_saas_web_app_component'
import { Grid, Icon } from 'antd-mobile'

import '../../styles/comment-component/evaluate-item.scss'

const EvaluateItem = ({ data }) => {
  const { userId, createdAt, imgs, score, userComment, replys, specificationName } = data
  return (
    <div className='evaluate-item'>
      <ul className='evaluate-header'>
        <li className='evaluate-item-info'>
          <p className='user-icon' />
          <span>{ userId }</span>
          <NewEvaluation defaultValue={ score } width={ '1.85rem' } />
        </li>
        <li className='evaluate-time'>
          { moment('YYYY-MM-DD HH:mm')(createdAt) } &nbsp;&nbsp;{ specificationName ? `规格：${ specificationName }` : '' }
        </li>
        <li className='evaluate-content'>
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
      </ul>
      <div className='evaluate-reply'>
        {
          replys && replys.length > 0 &&
          replys.map(item => <p key={ item.value }><Icon type={ require('svg/daojia/message.svg') } size='md' />{ `${ item.key }：${ item.value }` }</p>)
        }
      </div>
    </div>
  )
}

export default EvaluateItem

// <li className='evaluate-address'>{ `来自于：${ address }` }</li>
