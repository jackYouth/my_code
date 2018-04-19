import { send }  from 'business'

export const fetchHotels = (postData, callback) => {
  // console.log('postData-------------', postData)
  // const handleClose = Loading()
  send('/jiudian/v1/hotels', postData)
  .then(({ code, data = {}, message }) => {
    if (code === 0) {
      const { hotels } = data
      callback(hotels)
    } else {
      console.log(message)
    }
    // handleClose()
  }).catch(err => {
    // handleClose()
    console.log('handleHotels', err)
  })
}

export const handleScrollTop = () => {
  // console.log('fehwfweaiufehuiwfehufhuaewfeuhwaoewfafijeowajefiowajovjiaer')
  const oldScrollTop = document.querySelector('.list').scrollTop
  // console.log('e in handleScrollTop-=-=-==--=-=-=-=', oldScrollTop)
  return {
    type: 'OLD_SCROLLTOP',
    oldScrollTop,
  }
}

export const handlePaixuChange = Sort => {
  return {
    type:      'SORT_DATA',
    Sort,
    offset:    0,
    PageIndex: 1,
  }
}

export const handleShaixuan = ({ BrandId = [], Facilities = [], ThemeIds = [] }) => {
  return {
    type:      'SHAIXUAN_DATA',
    BrandId,
    Facilities,
    ThemeIds,
    offset:    0,
    PageIndex: 1,
  }
}

export const handleWeizhi = ({ Zone = '', DistrictId = '' }) => {
  return {
    type:      'WEIZHI_DATA',
    Zone,
    DistrictId,
    offset:    0,
    PageIndex: 1,
  }
}
