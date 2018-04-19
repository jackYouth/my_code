import { get, getStore, setStore } from '@boluome/common-lib'

export const appReset = data => ({
  type: 'APP_RESET',
  ...data,
})

const filterdata = {
  categoryCode: [
    {
      code: 0,
      text: '全部分类',
    },
  ],
  sort: [
    {
      code: 0,
      text: '默认排序',
    },
    {
      code: 'time',
      text: '按时间',
    },
    {
      code: 'hot',
      text: '按热度',
    },
  ],
  timeRange: [
    {
      code: 0,
      text: '全部时间',
    },
    {
      code: 'in_week',
      text: '一周内',
    },
    {
      code: 'in_month',
      text: '一月内',
    },
  ],
}
const defiltered = {
  categoryCode: 0,
  sort:         0,
  timeRange:    0,
}

export const resetData = (cityArr, categoryArr, cityName, filtered) => dispatch => {
  const channel = getStore('piaowu_channel', 'session')
  const cityNow = cityArr[channel].filter(o => o.name.indexOf(cityName) >= 0)
  setStore('piaowu_cityCode', cityNow[0].channelCityId, 'session')
  filterdata.categoryCode = [
    {
      code: 0,
      text: '全部分类',
    },
    ...categoryArr[channel],
  ]
  dispatch(
    appReset({
      channel,
      cityArr,
      categoryArr,
      offset:    0,
      cityName:  cityNow[0].name,
      filtering: false,
      filtered:  filtered || defiltered,
      filterdata,
    })
  )
}
export const getActivityCategory = (cityArr, categoryArr, cityName) => dispatch => {
  const channel = getStore('piaowu_channel', 'session')
  console.log(channel, cityArr)
  if (cityArr && cityArr[channel]) {
    console.log(cityArr, categoryArr, cityName)
    dispatch(resetData(cityArr, categoryArr, cityName))
  } else {
    const getURL = (sendURL, sendData) => {
      return new Promise((resolve, reject) => {
        get(sendURL, sendData).then(({ code, data, message }) => {
          if (code === 0) {
            resolve(data)
          } else {
            reject(new Error(message))
          }
        })
      })
    }
    const request = {
      citys: () => {
        return getURL(`/basis/v1/piaowu/${ channel }/cities`)
      },
      categorys: () => {
        return getURL('/piaowu/queryActivityCategory', { channel })
      },
    }
    const main = () => {
      return Promise.all([request.citys(), request.categorys()])
    }
    // 运行示例
    main().then(value => {
      dispatch(appReset({ filtering: false }))
      console.log(value)
      cityArr = cityArr || {}
      categoryArr = categoryArr || {}
      cityArr[channel] = value[0]
      categoryArr[channel] = value[1].reduce((a, e) => {
        a.push({
          code: e.categoryCode,
          text: e.categoryName,
        })
        return a
      }, [])
      dispatch(resetData(cityArr, categoryArr, cityName))
    }).catch(error => {
      console.log(error)
    })
  }
}
