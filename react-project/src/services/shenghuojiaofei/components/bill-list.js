import React from 'react'

import '../styles/bill-list.scss'

const BillList = () => {
  const billList = [
    { price: 1515, date: '2015年9月' },
    { price: 14451, date: '2015年8月' },
    { price: 7844, date: '2015年7月' },
    { price: 1455, date: '2015年6月' },
  ]
  return (
    <ul className='bill-list'>
      {
        billList.map(o => (
          <li key={ o.date }>
            <p>
              <span>{ o.date }</span>
              <span>待缴纳</span>
            </p>
            <p>{ `${ o.price }元` }</p>
          </li>
        ))
      }
    </ul>
  )
}

export default BillList
