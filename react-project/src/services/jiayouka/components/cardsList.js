import React from 'react'
import { browserHistory } from 'react-router'
import { Modal, Icon } from 'antd-mobile'
import './css/cardsList.scss'

const alert = Modal.alert

const CardsList = props => {
  // console.log('props', props)
  const { cardsList = [] } = props

  if (cardsList.length <= 0) {
    // browserHistory.push('/jiayouka')
    window.history.back(-1)
    return false
  }

  const { handleClick } = props

  const { editCards } = props

  const { handleDeleteContact } = props

  let { currId }  = props.ShowInfo
  // console.log(currId)
  if (!currId) {
    currId = cardsList[0].id
  }
  // if(currId != cardsList[0].id){
  //   cardsList.forEach((currentValue, index, arr) => {
  //     if( currentValue.id != currId ) {
  //       // currId = currentValue.id
  //     }
  //   })
  // }

  // console.log('cardsListProps======',props);

  // console.log('currId======',currId);

  return (
    <div>
      <div className='listContainer'>
        <div className='addNewItem' onClick={ () => browserHistory.push('/jiayouka/AddNewCard') }>
          <span>
            <Icon type={ require('./img/ic_add.svg') } />
          </span>
          <p className='addWords'>新增加油卡</p>
        </div>
        <div className='cardsContainer'>
          <ul>
            {
              cardsList.map(({ userName, cardId, id }) => (
                <li key={ `arr-${ Math.random() }` }>
                  <div className='icon-box'>
                    <Icon type={ currId === id ? require('./img/choosen.svg') : require('./img/notChoose.svg') } />
                  </div>
                  <div data-id={ id } onClick={ () => handleClick(id) } className={ currId === id ? 'choose cardInfo' : 'cardInfo' } >
                    <span>{ userName }</span>
                    <p>{ cardId }</p>
                  </div>
                  <div className='btn'>
                    <span className='delete' onClick={ () => alert('删除加油卡', '确认删除该加油卡吗？', [
                                                          { text: '取消', onPress: () => console.log('cancel') },
                                                          { text: '确定', onPress: () => handleDeleteContact(id), style: { fontWeight: 'bold' } },
                    ]) }
                    />
                    <p />
                    <span className='edit' onClick={ () => editCards(id) } />
                  </div>
                </li>
              ))
            }
          </ul>
        </div>
      </div>
    </div>
  )
}
export default CardsList
