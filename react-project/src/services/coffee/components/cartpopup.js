import React from 'react'
import { List, Icon, NoticeBar } from 'antd-mobile'

import icondelete from '../img/delete.svg'
import iconadd from '../img/jia.svg'
import iconjian from '../img/jian.svg'

const Item = List.Item

class CartPopup extends React.Component {
  constructor(props) {
    super(props)
    // console.log('goodsCartarr---', this.props)
    this.state = {
      initialGoodsCartarr: this.props.goodsCartarr,
      copyNoticeBar:       this.props.Notice,
    }
    this.handleReduceNum = this.onReduceNum.bind(this)
  }
  onReduceNum(id, num) {
    const { handleReduceNum } = this.props
    this.setState({
      initialGoodsCartarr: handleReduceNum(id, num),
    })
  }
  render() {
    const { onClose } = this.props
    const { initialGoodsCartarr, copyNoticeBar } = this.state
    return (
      <div className='cartWrap'>
        <List >
          { copyNoticeBar ? (<NoticeBar />) : ('') }
          <Item className='cartTitle'>
            <div className='cartDeteleWrap' style={{ position: 'relative' }}>
              已选商品
              <div className='deteleBtn' />
              <span
                style={{ position: 'absolute', right: 3, top: -5 }}
                onClick={ () => onClose() }
              >
                <Icon type={ icondelete } />清空
              </span>
            </div>
          </Item>
        </List>
        <CartlistItem goodsCartarr={ initialGoodsCartarr } handleReduceNum={ this.handleReduceNum } />
      </div>
    )
  }
}
export default CartPopup

const CartlistItem = ({ goodsCartarr, handleReduceNum }) => {
  if (goodsCartarr) {
    return (
      <div className='list'>
        {
          goodsCartarr.map((o, i) => (
            <Item key={ `${ i + 1 }` }>
              <div className='cartItem'>
                <div className='pic'>
                  <img alt='' src={ o.data.photoUrl } />
                </div>
                <div className='name'>
                  <p>{ o.data.productName }</p>
                  {
                    o.standard.map(s => (
                      <span key={ `${ s.value }` }>{ `${ s.value } ` }</span>
                    ))
                  }
                </div>
                <div className='price'>¥ <span>{ o.oprice }</span></div>
                <div className='num'>
                  <span onClick={ () => handleReduceNum(o.markId, -1) }><Icon type={ iconjian } /></span>
                  <span className='Sum'>{ o.quantity }</span>
                  <span onClick={ () => handleReduceNum(o.markId, 1) }><Icon type={ iconadd } /></span>
                </div>
              </div>
            </Item>
          ))
        }
      </div>
    )
  }
  return (<div />)
}
