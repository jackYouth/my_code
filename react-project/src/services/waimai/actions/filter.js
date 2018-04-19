import { get }  from 'business'

export const fetchResturants = (postdata, callback) => {
  // console.log('postdata-=-==--==-=-=-', postdata)
  get('/waimai/v1/restaurants', postdata)
  .then(({ code, data = [], message }) => {
    if (code === 0) {
      callback(data)
    } else {
      console.log(message)
    }
  }).catch(err => {
    console.log(err)
  })
}

export const handleShowFilter = showFilter => {
  return {
    type: 'HANDLE_SHOWFILTER',
    showFilter,
  }
}

export const handleIsInvoiceChange = checked => {
  console.log('checked0', checked)
  return {
    type:     'INVOICE_CHANGE',
    bInvoice: checked ? 1 : 0,
  }
}
export const handleIsVipDelivery = checked => {
  return {
    type:         'VIPDELIVERY_CHANGE',
    bVipDelivery: checked ? 1 : 0,
  }
}

export const handleCheckdInvoice = (trueInvoice, trueVipDelivery) => {
  return {
    type:         'HANDLE_CHECKED',
    trueInvoice,
    trueVipDelivery,
    offset:       0,
    showFilter:   0,
    bInvoice:     trueInvoice,
    bVipDelivery: trueVipDelivery,
  }
}

export const handleOrderbyChange = orderByChoose => {
  return {
    type: 'ORDERBY_CHANGE',
    orderByChoose,
  }
}

export const handleCategoryChange = categoryId => {
  return {
    type: 'GO_FILTER',
    categoryId,
  }
}
