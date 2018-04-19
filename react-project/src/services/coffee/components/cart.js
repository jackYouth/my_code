import React from 'react'
import { Icon, Popup } from 'antd-mobile'
import CartPopup from './cartpopup.js'

import '../style/cart.scss'
import iconcartf from '../img/cart_fff.svg'
// import iconadd from '../img/jia.svg'
// import iconjian from '../img/jian.svg'

// const Item = List.Item
class CartListCom extends React.Component {
  constructor(props) {
    super(props)
    // const newState = merge(state)(props)
    this.state = {
      close: false,
      ...props,
    }
    this.handleCartPopup = this.handleCartPopup.bind(this)
    this.onMaskClose = this.onMaskClose.bind(this)
    this.onClose = this.onClose.bind(this)
  }
  componentWillUnmount() {
    Popup.hide()
  }
  componentWillReceiveProps(nextProps) {
    // console.log('nextProps---', nextProps)
    this.setState({
      goodsCartarr: nextProps.goodsCartarr,
    })
  }
  onMaskClose() {
    this.setState({
      close: false,
    })
  }
  onClose() {
    const { handleOnClose } = this.state
    handleOnClose()
    this.setState({
      goodsCartarr: [],
      close:        false,
    })
    Popup.hide()
  }
  handleCartPopup(goodsCartarr) {
    const { close, handleReduceNum, Notice } = this.state
    if (close) {
      Popup.hide()
      this.setState({
        close: false,
      })
    } else {
      this.setState({
        close: true,
      })
      Popup.show(<CartPopup goodsCartarr={ goodsCartarr } onClose={ this.onClose } handleReduceNum={ handleReduceNum } Notice={ Notice } />, {
        animationType: 'slide-up',
        maskProps:     { className: 'am-popup-mask myselfam-popup-mask' },
        onMaskClose:   this.onMaskClose,
      })
    }
  }
  render() {
    const { onChange } = this.props
    const { goodsCartarr } = this.state
    // console.log('cart,js----', goodsCartarr)
    let Sum = 0
    let SumPrice = 0.00
    for (let s = 0; s < goodsCartarr.length; s++) {
      Sum += goodsCartarr[s].quantity
      SumPrice += (goodsCartarr[s].quantity * goodsCartarr[s].oprice)
    }
    return (
      <div className='cartListWrap'>
        <div className='cart' onClick={ () => { this.handleCartPopup(goodsCartarr) } }>
          <div className={ `cart_l ${ Sum === 0 ? '' : 'cart_has' }` }>
            <span><Icon type={ iconcartf } /></span>
            {
              Sum === 0 ? ('') : (<span className='marknum'>{ Sum }</span>)
            }
          </div>
          <div className='cart_r'>
            <span className='cart_price'>¥ { Sum === 0 ? '0.00' : SumPrice.toFixed(2) }</span>
            <span>不含配送费</span>
          </div>
        </div>
        {
          Sum > 0 ? (<div className='Settlement' onClick={ onChange }>结算</div>) : (<div className='Settlement Settlement_no'>结算</div>)
        }
      </div>
    )
  }
}

export default CartListCom
// class CartPopupComponent extends React.Component {
//   constructor(props) {
//     super(props)
//     this.state = {
//       initialGoodsCartarr: this.props.goodsCartarr,
//       copyNoticeBar:       this.props.Notice,
//     }
//     this.handleReduceNum = this.onReduceNum.bind(this)
//   }
//   onReduceNum(id, num) {
//     const { handleReduceNum } = this.props
//     this.setState({
//       initialGoodsCartarr: handleReduceNum(id, num),
//     })
//   }
//   render() {
//     const { onClose } = this.props
//     const { initialGoodsCartarr, copyNoticeBar } = this.state
//     return (
//       <div className='cartWrap'>
//         <List >
//           { copyNoticeBar ? (<NoticeBar />) : ('') }
//           <Item className='cartTitle'>
//             <div className='cartDeteleWrap' style={{ position: 'relative' }}>
//               已选商品
//               <div className='deteleBtn' />
//               <span
//                 style={{ position: 'absolute', right: 3, top: -5 }}
//                 onClick={ () => onClose() }
//               >
//                 <Icon type={ icondelete } />清空
//               </span>
//             </div>
//           </Item>
//         </List>
//         <div className='cartList'>
//           <CartlistItem goodsCartarr={ initialGoodsCartarr } handleReduceNum={ this.handleReduceNum } />
//         </div>
//       </div>
//     )
//   }
// }

// const CartlistItem = ({ goodsCartarr, handleReduceNum }) => {
//   if (goodsCartarr) {
//     return (
//       <div>
//         {
//           goodsCartarr.map((o, i) => (
//             <Item key={ `${ i + 1 }` }>
//               <div className='cartItem'>
//                 <div className='pic'>
//                   <img alt='' src={ o.data.photoUrl } />
//                 </div>
//                 <div className='name'>
//                   <p>{ o.data.productName }</p>
//                   {
//                     o.standard.map(s => (
//                       <span key={ `${ s.value }` }>{ `${ s.value } ` }</span>
//                     ))
//                   }
//                 </div>
//                 <div className='price'>¥ <span>{ o.oprice }</span></div>
//                 <div className='num'>
//                   <span onClick={ () => handleReduceNum(o.markId, -1) }><Icon type={ iconjian } /></span>
//                   <span className='Sum'>{ o.quantity }</span>
//                   <span onClick={ () => handleReduceNum(o.markId, 1) }><Icon type={ iconadd } /></span>
//                 </div>
//               </div>
//             </Item>
//           ))
//         }
//       </div>
//     )
//   }
//   return (<div />)
// }
