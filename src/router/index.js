const login = r => require.ensure([], () => r(require('../page/login/login')), 'login')
const home = r => require.ensure([], () => r(require('../page/home/home')), 'home')
const index = r => require.ensure([], () => r(require('../page/index/index')), 'index')
const focus = r => require.ensure([], () => r(require('../page/index/focus')), 'focus')
const leader = r => require.ensure([], () => r(require('../page/index/leader')), 'leader')
const weibo = r => require.ensure([], () => r(require('../page/index/weibo')), 'weibo')
const latestNews = r => require.ensure([], () => r(require('../page/index/latest-news')), 'latestNews')
const latestBbs = r => require.ensure([], () => r(require('../page/index/latest-bbs')), 'latestBbs')
const positiveNews = r => require.ensure([], () => r(require('../page/index/positive-news')), 'positiveNews')
const negativeNews = r => require.ensure([], () => r(require('../page/index/negative-news')), 'negativeNews')
const subject = r => require.ensure([], () => r(require('../page/subject/index')), 'subject')
const accident = r => require.ensure([], () => r(require('../page/accident/index')), 'accident')
const warning = r => require.ensure([], () => r(require('../page/warning/index')), 'warning')
const report = r => require.ensure([], () => r(require('../page/report/index')), 'report')
const reportDetail = r => require.ensure([], () => r(require('../page/report/detail')), 'reportDetail')
const search = r => require.ensure([], () => r(require('../page/search/index')), 'search')
const collection = r => require.ensure([], () => r(require('../page/collection/index')), 'collection')
const industry = r => require.ensure([], () => r(require('../page/industry/index')), 'industry')
const thesaurus = r => require.ensure([], () => r(require('../page/thesaurus/index')), 'thesaurus')
const keywords = r => require.ensure([], () => r(require('../page/setting/keywords')), 'keywords')
const focusKeywords = r => require.ensure([], () => r(require('../page/setting/focus-keywords')), 'focusKeywords')
const leaderKeywords = r => require.ensure([], () => r(require('../page/setting/leader-keywords')), 'leaderKeywords')
const industryKeywords = r => require.ensure([], () => r(require('../page/setting/industry-keywords')), 'industryKeywords')
const accidentKeywords = r => require.ensure([], () => r(require('../page/setting/accident-keywords')), 'accidentKeywords')
const contacts = r => require.ensure([], () => r(require('../page/setting/contacts')), 'contacts')
const leaderYuqing = r => require.ensure([], () => r(require('../page/leaderYuqing/index')), 'leaderYuqing')
const leaderWarning = r => require.ensure([], () => r(require('../page/setting/leader-warning')), 'leaderWarning')
const leaderKeywordsZj = r => require.ensure([], () => r(require('../page/setting/leader-keywordszj')), 'leaderKeywordsZj')
const monthlyReport = r => require.ensure([], () => r(require('../page/setting/monthly-report')), 'monthlyReport')
const weeklyReport = r => require.ensure([], () => r(require('../page/setting/weekly-report')), 'weeklyReport')
const detail = r => require.ensure([], () => r(require('../page/detail/index')), 'detail')
const monitor = r => require.ensure([], () => r(require('../page/monitor/index')), 'monitor')
const warningDetail = r => require.ensure([], () => r(require('../page/monitor/details')), 'warningDetail')
const accidentMonitor = r => require.ensure([], () => r(require('../page/monitor/accident')), 'accidentMonitor')

export default [
  {
    path: '/login',
    name: '登录',
    component: login
  },
  {
    path: '/',
    name: '全景舆情',
    component: home,
    redirect: '/index',
    menuShow: true,
    iconCls: 'iconfont icon-index', // 图标样式class
    children: [
      {path: '/index', component: index, name: '舆情概况', menuShow: true},
      {path: '/focus', component: focus, name: '焦点报道', menuShow: true},
      {path: '/leader', component: leader, name: '领导动态', menuShow: true},
      {path: '/weibo', component: weibo, name: '热议微博', menuShow: true},
      {path: '/latestNews', component: latestNews, name: '事故报道', menuShow: true},
      {path: '/latestBbs', component: latestBbs, name: '最新论坛', menuShow: true},
      {path: '/positiveNews', component: positiveNews, name: '正面新闻', menuShow: true},
      {path: '/negativeNews', component: negativeNews, name: '负面新闻', menuShow: true}
    ]
  },
  {
    path: '/',
    component: home,
    name: '专题分析 ',
    menuShow: true,
    leaf: true, // 只有一个节点
    iconCls: 'iconfont icon-subject', // 图标样式class
    children: [
      {path: '/subject', component: subject, name: '专题分析', menuShow: true}
    ]
  },
  {
    path: '/',
    component: home,
    name: '事故分析 ',
    menuShow: true,
    leaf: true, // 只有一个节点
    iconCls: 'iconfont icon-accidentAnalysis', // 图标样式class
    children: [
      {path: '/accident', component: accident, name: '事故分析', menuShow: true}
    ]
  },
  {
    path: '/',
    component: home,
    name: '舆情预警 ',
    menuShow: true,
    leaf: true, // 只有一个节点
    iconCls: 'iconfont icon-warning', // 图标样式class
    children: [
      {path: '/warning', component: warning, name: '舆情预警', menuShow: true}
    ]
  },
  {
    path: '/',
    component: home,
    name: '舆情报告 ',
    menuShow: true,
    leaf: true, // 只有一个节点
    iconCls: 'iconfont icon-report', // 图标样式class
    children: [
      {path: '/report', component: report, name: '舆情报告', menuShow: true}
    ]
  },
  {
    path: '/',
    component: home,
    name: '舆情搜索 ',
    menuShow: true,
    leaf: true, // 只有一个节点
    iconCls: 'iconfont icon-search', // 图标样式class
    children: [
      {path: '/search', component: search, name: '舆情搜索', menuShow: true}
    ]
  },
  {
    path: '/',
    component: home,
    name: '行业舆情',
    menuShow: true,
    leaf: true, // 只有一个节点
    iconCls: 'iconfont icon-industry', // 图标样式class
    children: [
      {path: '/industry', component: industry, name: '行业舆情', menuShow: true}
    ]
  },
  {
    path: '/',
    component: home,
    name: '事故监测 ',
    menuShow: true,
    leaf: true, // 只有一个节点
    iconCls: 'iconfont icon-industry', // 图标样式class
    children: [
      {path: '/accidentMonitor', component: accidentMonitor, name: '事故监测', menuShow: true}
    ]
  },
  {
    path: '/',
    component: home,
    name: '词库管理',
    menuShow: true,
    leaf: true, // 只有一个节点
    iconCls: 'iconfont icon-thesaurus', // 图标样式class
    children: [
      {path: '/thesaurus', component: thesaurus, name: '词库管理', menuShow: true}
    ]
  },
  {
    path: '/',
    component: home,
    name: '综合监测',
    menuShow: true,
    leaf: true, // 只有一个节点
    iconCls: 'iconfont icon-thesaurus', // 图标样式class
    children: [
      {path: '/leaderYuqing', component: leaderYuqing, name: '综合监测', menuShow: true}
    ]
  },
  {
    path: '/',
    component: home,
    name: '我的收藏 ',
    menuShow: true,
    leaf: true, // 只有一个节点
    iconCls: 'iconfont icon-collection', // 图标样式class
    children: [
      {path: '/collection', component: collection, name: '我的收藏', menuShow: true}
    ]
  },
  {
    path: '/',
    name: '后台设置',
    component: home,
    menuShow: true,
    iconCls: 'iconfont icon-manage', // 图标样式class
    children: [
      {path: '/keywords', component: keywords, name: '基础关键词设置', menuShow: true},
      {path: '/focusKeywords', component: focusKeywords, name: '焦点关键词设置', menuShow: true},
      {path: '/leaderKeywords', component: leaderKeywords, name: '领导关键词设置', menuShow: true},
      {path: '/industryKeywords', component: industryKeywords, name: '行业关键词设置', menuShow: true},
      {path: '/accidentKeywords', component: accidentKeywords, name: '事故关键词设置', menuShow: true},
      {path: '/contacts', component: contacts, name: '联系人设置', menuShow: true},
      {path: '/leaderKeywordsZj', component: leaderKeywordsZj, name: '领导新闻关键词设置', menuShow: true},
      {path: '/leaderWarning', component: leaderWarning, name: '领导预警设置', menuShow: true},
      {path: '/monthlyReport', component: monthlyReport, name: '月报设置', menuShow: true},
      {path: '/weeklyReport', component: weeklyReport, name: '周报设置', menuShow: true}
    ]
  },
  {
    path: '/',
    name: '非导航菜单',
    component: home,
    menuShow: false,
    iconCls: 'iconfont icon-trend', // 图标样式class
    children: [
      {path: '/detail', component: detail, name: '文章详情', menuShow: false},
      {path: '/monitor', component: monitor, name: '实时监测', menuShow: false},
      {path: '/reportDetail', component: reportDetail, name: '报告详情', menuShow: false},
      {path: '/warningDetail', component: warningDetail, name: '预警查看', menuShow: false}
    ]
  }
]
