import React from 'react'
import { List, WhiteSpace } from 'antd-mobile'
import Button from './Button'

const HomeManege = ({ currentBillInfo, handleNewDel, handleHomeInput, currentHomeTag, handleToAddress }) => {
  const Item = List.Item
  const { tid, address } = currentBillInfo
  return (
    <div>
      <List>
        <Item arrow='horizontal' extra={ address } onClick={ handleToAddress }>地址</Item>
        <Item arrow='horizontal' extra={ currentHomeTag } onClick={ () => handleHomeInput(currentHomeTag) }>家庭</Item>
      </List>
      <WhiteSpace size='lg' />
      <Button title='删除' handleClick={ () => handleNewDel({ tid }) } btnStyle={{ background: '#ff4848' }} />
    </div>
  )
}
export default HomeManege
