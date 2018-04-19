import React from 'react'
import { Link } from 'react-router'
import './css/addNewBtn.scss'

const AddNewBtn = () => {
  return (
    <div className='newBtnBox'>
      <Link to='/jiayouka/AddNewCard' className='newBtn'>新增加油卡</Link>
    </div>
  )
}

export default AddNewBtn
