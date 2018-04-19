import React from 'react';
import { Picker, WingBlank, Button, Flex, Modal, List, WhiteSpace } from 'antd-mobile';
import { createForm } from 'rc-form';
import bianji from '../img/bianji.png'
import shanchu from '../img/shanchu.png'

import "../style/mycar.scss"

const Item = List.Item;
const alert = Modal.alert;

const Mycar = ({ handleGoadd ,handleEdit ,handleDelet ,flateList=[] }) =>{
  let listItems = flateList.map((value,index) =>{
    return(
  	  <li key={index}><WhiteSpace size="lg" />
        <List className="my-list">
          <Item
            extra={<div>
                    <span onClick={ () => handleEdit(index,flateList) }>
                      <img src={bianji}/><span>编辑</span>
                    </span>&nbsp;&nbsp;
                    <span onClick={() => alert('删除', '确认删除车牌信息？', [
                        { text: '取消', onPress: () => console.log('cancel') },
                        { text: '确定', onPress: () => handleDelet(index,flateList), style: { fontWeight: 'bold' } },
                      ])}>
                      <img src={shanchu}/><span>删除</span>
                    </span>
                  </div>}
            ><span>{value.plateNumber.substr(0,2)}·{value.plateNumber.substr(2)}</span></Item>
        </List>
      </li>
  	)
  });
  return (
    <div className="mycar">
      <WhiteSpace size="lg" />
      <WingBlank size="lg"><Button className="btn" onClick={ () => handleGoadd() } >+&nbsp;点击添加车牌</Button></WingBlank>
      <ul>{listItems}</ul>
    </div>
  )
}

export default Mycar
