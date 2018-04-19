import React from 'react'
import { merge } from 'ramda'

const Button = ({ title = '查询账单', handleClick, btnStyle = {} }) => {
  const btnDefaultStyle = {
    background:   '#ffab00',
    borderRadius: '12px',
    width:        '85%',
    height:       '98px',
    lineHeight:   '98px',
    fontSize:     '36px',
    textAlign:    'center',
    color:        '#fff',
    fontWeight:   'normal',
    margin:       '0 auto',
  }
  return (
    <div>
      <h1 onClick={ handleClick } style={ merge(btnDefaultStyle, btnStyle) }>{ title }</h1>
    </div>
  )
}

export default Button
