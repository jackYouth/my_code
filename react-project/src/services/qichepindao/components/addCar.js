
import React from 'react'
// import { Icon } from 'antd-mobile'
// import { Mask, SlidePage } from '@boluome/oto_saas_web_app_component'

import '../style/addCar.scss'

import edit from '../img/edit.png'
import detele from '../img/detele.png'

const AddCar = addCar => {
  const { platData = [], handleEditCar, handleDetelePlate, handleEditPlate } = addCar
  return (
    <div className='addWrap'>
      <div className='addcarlist'>
        {
          platData.map(e => (
            <ItemList key={ `${ Math.random() + e }` } data={ e } handleDetelePlate={ handleDetelePlate } handleEditPlate={ handleEditPlate } />
          ))
        }
      </div>
      {
        platData.length > 4 ? ('') : (<div className='addcarBtn' onClick={ () => handleEditCar() }>新增车辆</div>)
      }
    </div>
  )
}

export default AddCar

const ItemList = ({ data, handleDetelePlate, handleEditPlate }) => {
  const { plateNumber, logo, chexi, chexing, isError } = data
  console.log('--data--', plateNumber, logo)
  return (
    <div className='item'>
      <div className='logo'><img src={ logo } alt='' /></div>
      <div className='name'><span>{ plateNumber }</span><span className='vinmodel'>{ chexi }{ chexing }</span></div>
      {
        isError ? ('') : (<span className='tipSpan'>违章信息有误</span>)
      }
      <div className='btn'><span onClick={ () => handleDetelePlate(plateNumber) }><img src={ detele } alt='' /></span><span onClick={ () => handleEditPlate(plateNumber) }><img src={ edit } alt='' /></span></div>
    </div>
  )
}
