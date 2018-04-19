import React from 'react'

const Service = ({ shopId, service, isConfirm, handleShowServiceDetail, handleBuyService }) => {
  const { descriptionImage, serviceName, serviceImg, description, price = 0 } = service
  return (
    <div style={{ padding: '.24rem .3rem', borderBottom: '1px solid #e5e5e5', height: '1.8rem', boxSizing: 'border-box', backgroundColor: '#fff' }} >
      <div style={{ display: 'inline-block', width: '1.4rem', marginRight: '.3rem', position: 'relative' }} onClick={ () => handleShowServiceDetail(shopId, service) } >
        {
          descriptionImage && !isConfirm
          ? (<div style={{ padding: '.08rem 0', textAlign: 'center', fontSize: '.20rem', color: '#fff', backgroundColor: 'rgba(0, 0, 0, 0.8)', position: 'absolute', bottom: 0, width: '100%' }} >查看详情</div>)
          : ''
        }
        <img src={ serviceImg } alt='' style={{ height: '100%', width: '100%' }} />
      </div>
      <div style={{ display: 'inline-block', maxWidth: '50%', verticalAlign: 'top' }} >
        <div style={{ fontSize: '.28rem', marginBottom: '.08rem' }} >{ serviceName }</div>
        <div style={{ fontSize: '.24rem', color: '#666', height: '.34rem', width: '100%', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }} >{ description }</div>
        <div style={{ fontSize: '.24rem', marginTop: '.21rem', color: '#fd6b70' }} >{ `￥${ price }` }</div>
      </div>
      {
        isConfirm ? '' : (
          <div style={{ display: 'inline-block', textAlign: 'right', float: 'right', padding: '.35rem 0', verticalAlign: 'top' }} >
            <button
              style={{ color: '#ff9a00', border: '1px solid #ff9a00', fontSize: '.26rem', padding: '.11rem .22rem', backgroundColor: '#fff', borderRadius: '.08rem' }}
              onClick={ () => handleBuyService(shopId, service) }
            >
              购买
            </button>
          </div>
        )
      }
    </div>
  )
}

export default Service
