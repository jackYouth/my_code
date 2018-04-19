import { connect } from 'react-redux'
import { wrap }    from '@boluome/oto_saas_web_app_component'
import App         from '../components/app'

const mapStateToProps = ({ app }) => {
  const selfInfo = [
    {
      title: '个人资料',
      sign: '：',
      list: [
        { name: '姓名', content: '苏燕东' },
        { name: '生日', content: '1993.11' },
        { name: '手机', href: 'tel://18616811254', content: '18616811254' },
        { name: '邮箱', href: 'mailto:yandong.su@icloud.com', content: 'yandong.su@icloud.com' },
        { name: '学历', content: '本科' },
        { name: '简历', href: 'https://jackyouth.github.io/resume/', content: 'https://jackyouth.github.io/resume/' },
      ],
    },
    {
      title: '我的优势',
      sign: '、',
      list: [
        { name: '1', content: '三年前端开发经验，主要开发移动端，熟悉电商、生活、金融等开发场景' },
        { name: '2', content: '良好的沟通能力，能够很好的和产品、后端完成需求、接口的沟通与对接' },
        { name: '3', content: '团队合作意识，享受组队打怪升级式的开发体验' },
        { name: '4', content: '责任心，对于公司安排的任务，能保质保量的完成' },
        { name: '5', content: '热爱编程，对技术保持强烈的求知欲，热衷于探索新技术' },
        { name: '6', content: '学习能力强，对所学技术有自己的理解，在理解的基础上快速上手新技术' },
        { name: '7', content: '代码洁癖，力求使用优雅的代码完成复杂的需求' },
      ],
    },
  ]
  const selfExperience = [
    {
      title: '技术栈',
      list: [
        {
          name: '',
          content: [
            '1、熟悉HTML、CSS、ES6、Sass、jQuery、zepto等',
            '2、熟悉React、Redux、React-router、react-thunk，有三个以上react项目的开发经验',
            '3、熟悉hybrid开发流程，有hybrid开发经验',
            '4、熟悉webpack、rollup等前端构建工具',
            '5、有Node.js开发经验，写过一些页面爬虫',
            '6、熟悉jquery-deferred、Promise、async和await等异步解决方案',
            '7、了解react中virtual dom与diff算法的内部实现',
            '8、熟悉插件的封装机制',
            '9、熟连使用Ant Design Mobile的UI组件库',
            '10、了解vue、angular等MVVM框架的实现机制',
          ],
        },
      ],
    },
    {
      title: '工作经历',
      list:  [
        {
          name:    '上海酷屏科技公司 前端开发工程师（2016.12 - 至今）',
          content: [
            '1, 前端开发系统的搭建（webpack自动化打包、客户配置流程、项目发布流程）',
            '2, 前端项目开发',
            '3, 公共组件开发',
            '4, 客户对接（hybird开发）',
          ],
        },
        {
          name: '粟米理财 前端开发工程师（2015.6 - 2016.12）',
          content: [
            '1, pc端官网开发',
            '2, 移动端app开发',
          ],
        },
      ],
    },
    {
      title: '项目经历',
      list: [
        {
          name: 'React SPA的基本开发流程',
          content: [
            '1, 使用jsx进行静态页面的开发',
            '2, 使用redux进行页面、数据等状态的管理',
            '3, 使用react-router实现页面的路由跳转',
            '4, 使用redux-thunk实现异步action',
            '5, 使用webpack进行项目的开发和打包',
            '6, 使用bundleAnalyzer进行页面打包后的文件内容占比的分析，用来优化加载速度的优化',
            '7, 使用vConsole进行移动端的调试',
            '8, 这里的所有服务均可直接嵌入任何App中，为App提供一个专属于自己的服务，如有需要欢迎联系酷屏科技',
          ],
        },
        {
          name: '商城（移动端）',
          href: 'https://dev-me.otosaas.com/shangcheng/?customerUserId=test_0&customerUserPhone=18888888888',
          content: [
            '1, 分为首页、购物车、我的三大板块',
            '2, sku多维属性状态的联动。算法实现比较复杂，通过画脑图，将需求结构话，理出一个个小目标后，分步实现，最终独立解决',
            '3, 全局购物车的实现（项目中只完成了本地购物车的实现）。将购物车中的数据保存在同一个action中，然后独立出一个操作购物车的方法handleChangeCart，当购物车中数据改变之后，就同时改变store和localStorage中的购物车数据。页面中初始的购物车数据，统一从本地中获取的，防止页面刷新后，数据丢失',
            '4, 全局tabBar的实现。将tabBar的组件写在最外层的容器组件中，然后在componentWillReceiveProps方法中，通过路由的变化来判断是否显示tabBar',
          ],
        },
        {
          name: '充值服务（移动端）',
          href: 'https://dev-me.otosaas.com/chongzhi/?customerUserId=test_0&customerUserPhone=18888888888',
          content: [
            '1, 兼容话费、流量两种充值方式',
            '2, 清除按钮点击清除，同时重新聚焦功能的实现。需要人为定制click、blur、focus、change等事件函数的执行顺序，使用了异步、eventloop相关知识点解决。',
            '3, 部分低端机中，当blur事件发生之后，虚拟键盘仍然存在。通过document.activeElement.blur()方法解决',
            '4, 两个模块可以同时访问，也可以分开访问。该功能通过路由进行实现',
          ],
        },
        {
          name: '用车服务（移动端）',
          href: 'https://dev-me.otosaas.com/yongche/shenzhou/?customerUserId=test_0&customerUserPhone=18888888888',
          content: [
            '1, 分为滴滴、神州两大供应商，一口价、实时计价两种支付模式，专车、接机、送机三种出行方式可供选择',
            '2, 兼容不同的数据源、计价模式、服务造成的页面ui显示以及流程上的区别。解决方案：通过画脑图的方式，来理清这些不同衍生出得不同的页面流程以及ui显示',
            '3, 服务模式的定制。通过路由、默认配置、接口三方面进行限制',
            '4, 服务中第三方地图插件的选择。因为开发采用了antd的高清组件方案，之前使用过的百度地图只能被抛弃，改用了同属阿里旗下的高德地图',
            '5, 针对不同服务，对第一次进入时进行默认地址的设置',
            '6, 不同的服务之间，切换之后需要保留上一次选择的相关信息。使用es6中属性名表达式，根据服务名来动态保存对应的数据',
            '7, 不同支付模式导致的页面流程不统一。因为收银台是公共的，所以支付成功之后，只会跳转到订单详情页面。而一口价模式下，支付成功之后，需要跳转到等待接单页面。解决方案是：将等待接单页面做进订单详情页中',
          ],
        },
        {
          name: '到家服务（移动端）',
          href: 'https://dev-me.otosaas.com/daojia/mms_daojiaxianhua/?customerUserId=blm_test&customerUserPhone=18787878787',
          content: [
            '1, 分为鲜花、医护、搬家、手机维修、开锁、保洁等十八种服务方式',
            '2, 预约时间坐标图的实现。使用flex进行坐标轴的布局，根据boss后台设定预约时间的最小刻度为30min的限制，对返回时间进行切割，将切割后的总时间保存在一个数组中，切割后的可预约时间保存在另一个数组中，两者比对，在总时间数组中给对应时间打上可预约标记，最终可预约时间坐标轴的绘制',
            '3, 首页列表的优化。详情页返回时，保存之前已经加载的图片以及上次浏览的位置。首先要区分首页进入还是详情页返回，针对详情页返回时，不能改变状态树中的任何其他数据，防止数据重新加载。上一次位置，通过sessionStorage获取之后，通过scrollTop属性进行定位',
            '4, 多个模块既可以同时访问，也可以单个访问，该功能通过路由进行实现',
          ],
        },
        {
          name: '生活缴费（移动端）',
          href: 'https://dev-me.otosaas.com/shenghuojiaofei/?customerUserId=test_0&customerUserPhone=18888888888',
          content: [
            '1, 分为水费、电费、燃气费、有线电视、固话宽带五种缴费模式',
            '2, 五个模块分客户输出。需求是五个模块既可以同时访问，也可以单个访问。实现方案：开放二级路由进行服务的区分',
            '3, 双首页。单服务缴费模式下，会拥有两个首页。第一次进入时，会进入直接选择缴费机构的页面，当已有账单时，则会进入账单列表页',
            '4, 首页 -> 家庭信息页 -> 家庭名称编辑页 -> 保存后 -> 家庭名称编辑页 -> 返回 -> 需要到家庭信息页。该页面跳转流程的实现，一个关键点就是保存之后，使用history.back()进行页面的跳转，保证浏览器中历史记录的连贯性',
          ],
        },
        {
          name: 'saas官网（PC端）',
          href: 'http://www.otosaas.com/',
          content: [
            '1, 使用jQuery、bootstrap完成',
            '2, 兼容PC和移动端',
          ],
        },
      ],
    },
  ]
  return {
    ...app,
    selfInfo,
    selfExperience,
  }
}


const mapDispatchToProps = dispatch => ({ dispatch })

const mapFunToComponent  = () => ({
  componentDidMount() {
    // window.onresize = () => {
    //   location.reload()
    // }
    document.querySelector('.resume-left').style.height = `${ document.querySelector('.resume-right').offsetHeight }px`
  },
})

export default
connect(mapStateToProps, mapDispatchToProps)(
  wrap(mapFunToComponent)(App)
)

