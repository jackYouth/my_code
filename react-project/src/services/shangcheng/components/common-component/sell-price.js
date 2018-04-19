import React from 'react'

const SellPrice = ({ sellPrice, maxSellPrice, textHeader = '' }) => {
  sellPrice = Number(sellPrice)
  if (maxSellPrice) maxSellPrice = Number(maxSellPrice)
  return (
    <div className='sell-price' style={{ fontSize: '.28rem', lineHeight: '.4rem', color: '#ff4848', overflow: 'hidden' }}>
      <p style={{ float: 'left' }}>
        {
          textHeader &&
          <span style={{ fontSize: '.40rem' }}>{ textHeader }</span>
        }
        &nbsp;￥
        <span style={{ fontSize: '.40rem' }}>{ sellPrice.toFixed(2).split('.')[0] }</span>
        { `.${ sellPrice.toFixed(2).split('.')[1] } ` }
      </p>
      {
        Boolean(maxSellPrice) && sellPrice !== maxSellPrice &&
        <p style={{ float: 'left' }}>
          &nbsp;-&nbsp;￥
          <span style={{ fontSize: '.40rem' }}>{ maxSellPrice.toFixed(2).split('.')[0] }</span>
          { `.${ maxSellPrice.toFixed(2).split('.')[1] }` }
        </p>
      }
    </div>
  )
}

export default SellPrice
