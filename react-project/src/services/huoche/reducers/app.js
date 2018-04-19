import { mergeState } from '@boluome/common-lib'


// 默认值设置
const initialState = {
  title:        'huoche',
  chooseCity:   { from: '上海', to: '北京' },
  chooseTime:   '',
  LocationAddr: '上海',
  channel:      'tieyou',
  cityHot:      [
    { id: '1', name: '北京', py: 'beijing' },
    { id: '11', name: '上海', py: 'shanghai' },
    { id: '7', name: '重庆', py: 'chongqingbei' },
    { id: '46', name: '昆明', py: 'kunming' },
    { id: '22', name: '成都', py: 'chengdudong' },
    { id: '67', name: '西安', py: 'xianbei' },
    { id: '40', name: '杭州', py: 'hangzhoudong' },
    { id: '32', name: '哈尔滨', py: 'haerbin' },
    { id: '72', name: '郑州', py: 'zhengzhou' },
    { id: '32', name: '海口', py: 'haikoudong' },
    { id: '29', name: '贵阳', py: 'guiyang' },
    { id: '66', name: '乌鲁木齐', py: 'wulumuqi' },
    { id: '43', name: '济南', py: 'jinan' },
    { id: '64', name: '武汉', py: 'wuhan' },
    { id: '15', name: '天津', py: 'tianjinbei' },
    { id: '53', name: '南京', py: 'nanjing' },
  ],
}

const app = (state = initialState, action) => {
  switch (action.type) {
    case 'NOWCHECHED' :
    case 'HUOCHE_HISTORICAL' :
    case 'CHOOSE_CITY' :
    case 'CALENDAR_TIME' :
    case 'LOCATION_ADDR' :
    case 'HUOCHE_CHANNEL' :
      return mergeState(state, action)
    default: return state
  }
}

export default app
