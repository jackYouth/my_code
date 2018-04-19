import { mergeState, getStore } from '@boluome/common-lib'

const initialState = {
  cityName:   '上海',
  keys:       getStore('keys', 'session') || 'hot',
  regionWrap: false,
  regionCon:  '',
  cityHot:    [
    { py: 'beijing', jp: 'bj', name: '北京', channelCityId: '1' },
    { py: 'chongqing', jp: 'cq', name: '重庆', channelCityId: '45' },
    { py: 'chengdu', jp: 'cd', name: '成都', channelCityId: '59' },
    { py: 'guangzhou', jp: 'gz', name: '广州', channelCityId: '20' },
    { py: 'hangzhou', jp: 'hz', name: '杭州', channelCityId: '50' },
    { py: 'nanjing', jp: 'nj', name: '南京', channelCityId: '55' },
    { py: 'shanghai', jp: 'sh', name: '上海', channelCityId: '10' },
    { py: 'shenzhen', jp: 'sz', name: '深圳', channelCityId: '30' },
    { py: 'tianjin', jp: 'tj', name: '天津', channelCityId: '40' },
    { py: 'wuhan', jp: 'wh', name: '武汉', channelCityId: '57' },
    { py: 'xian', jp: 'xa', name: '西安', channelCityId: '42' },
  ],
}

const app = (state = initialState, action) => {
  switch (action.type) {
    case 'ADD_RESET':
      return mergeState(state, action)
    default: return state
  }
}

export default app
