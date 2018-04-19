// import { get, send } from '@boluome/common-lib'
import { get, send } from 'business'
import { Loading } from '@boluome/oto_saas_web_app_component'

const filterdata = {
  categoryCode: [
    {
      code: 0,
      text: '全部分类',
    },
  ],
  timeRange: [
    {
      code: 0,
      text: '景区级别',
    },
    {
      code: 'A',
      text: '1A景区',
    },
    {
      code: 'AA',
      text: '2A景区',
    },
    {
      code: 'AAA',
      text: '3A景区',
    },
    {
      code: 'AAAA',
      text: '4A景区',
    },
    {
      code: 'AAAAA',
      text: '5A景区',
    },
  ],
  sort: [
    {
      code: 0,
      text: '默认排序',
    },
    {
      code: 'DistanceAsc',
      text: '距离从近到远',
    },
    {
      code: 'PriceAsc',
      text: '价格升序',
    },
    {
      code: 'PriceDesc',
      text: '价格降序',
    },
  ],
}
const defiltered = {
  categoryCode: 0,
  sort:         0,
  timeRange:    0,
}
// 城市地址的请求
export const CityData = () => dispatch => {
  const handleClose = Loading()
  const cityUrl = '/menpiao/v1/city'
  const sendData = {
    channel: 'lvmama',
  }
  get(cityUrl, sendData).then(reply => {
    const { code, data, message } = reply
    if (code === 0) { // console.log('datacity-----',data);
      const cityarr = []
      for (let i = 0; i < data.length; i++) {
        const obj = {}
        obj.name = data[i].city
        obj.py = data[i].pinyin
        obj.prov = data[i].province
        cityarr.push(obj)
      }
      dispatch({
        type:     'KJIN_CITY_DATA',
        citydata: cityarr,
      })
    } else {
      console.log('数据请求失败', message)
    }
    handleClose()
  })
}

export const fetchScenics = (datas, cb) => {
  const handleClose = Loading()
  send('/menpiao/v1/scenics', datas).then(reply => {
    const { code, data, message } = reply
    if (code === 0) {
      cb(data)
    } else {
      console.log(message)
    }
    handleClose()
  })
}

// 主题的数据请求
export const ThemeData = city => dispatch => {
  const handleClose = Loading()
  const themeUrl = `/menpiao/v1/${ city }/themes`
  const sendData = {
    channel: 'lvmama',
    city,
  }
  get(themeUrl, sendData).then(reply => {
    const { code, data, message } = reply
    if (code === 0) { // console.log('data--主题---',data);
      const theme = data.reduce((a, e) => {
        a.push({
          code: e,
          text: e,
        })
        return a
      }, [])
      filterdata.categoryCode = [
        {
          code: 0,
          text: '全部分类',
        },
        ...theme,
      ]
      console.log('test---', filterdata.categoryCode)
      dispatch({
        type:       'KJIN_THEMEDATA',
        themeDatas: filterdata,
        filtered:   defiltered,
      })
    } else {
      console.log('数据请求失败', message)
    }
    handleClose()
  })
}
