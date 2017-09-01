<template>
  <div id="leader-yuqing">
    <!---start: 搜索输入框-->
    <el-row :gutter="20">
      <el-col :span="12" :offset="6">
        <div class="card-body">
          <el-col class="search-html">
            <div class="input-search">
              <el-input placeholder="请输入内容" v-model="condition.companyName" type="text" @change = "renderPageData">
              </el-input>
            </div>
            <el-button class="btn-search" @click="renderPageData"><span class="el-icon-search">搜索</span>
            </el-button>
          </el-col>
        </div>
      </el-col>
    </el-row>
    <!---end: 搜索输入框-->
    <!---start: 更多筛选-->
    <el-row :gutter="15" id="search_box">
      <el-col :span="24">
        <el-collapse accordion>
          <el-collapse-item title="更多筛选">
            <el-form :model="condition" ref="condition" label-width="80px">
              <el-row class="srarch-screen">
                <el-col :span="12">
                  <el-form-item label="信息排序" align="left">
                    <el-radio-group v-model="condition.direction">
                      <el-radio label="adate">时间降序</el-radio>
                      <el-radio label="deathnumber">死亡人数降序</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="发布时间">
                    <el-col :span="10">
                      <el-date-picker v-model="condition.startDate"
                                      type="date"
                                      @change="changeStartDate"
                                      placeholder="选择开始日期">
                      </el-date-picker>
                    </el-col>
                    <el-col class="line" :span="1">～</el-col>
                    <el-col :span="10">
                      <el-date-picker v-model="condition.endDate"
                                      type="date"
                                      @change="changeEndDate"
                                      placeholder="选择结束日期"></el-date-picker>
                    </el-col>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row class="srarch-screen">
                <el-col :span="12">
                  <el-form-item label="事故等级">
                    <div class="all">
                      <el-checkbox :indeterminate="isIndeterminateMediaType" v-model="checkAllMediaType"
                                   @change="handleMediaTypeCheckAllChange">全选
                      </el-checkbox>
                    </div>
                    <div class="single">
                      <el-checkbox-group v-model="mediaTypeArray" @change="handleCheckedMediaTypeChange">
                        <el-checkbox v-for="type in mediaTypes" :label="type" :key="type">{{type}}</el-checkbox>
                      </el-checkbox-group>
                    </div>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-collapse-item>
        </el-collapse>
      </el-col>
    </el-row>
    <el-row :gutter="15">
      <el-col :span="8">
        <el-card class="box-card">
          <div slot="header" class="chart-header">
            <span class="chart-text">事故列表</span>
          </div>
          <div v-loading="accidentsLoading">
            <div v-if="accidentData.accidents.length === 0">
              暂无数据
            </div>
            <div v-if="accidentData.accidents.length > 0" class="accidentListBox">
              <div v-for="item in accidentData.accidents" @click="getAccidentSelected(item)"
                   :class="item.isAccidentSelected===true?'isAccidentSelected':''"
                   style="margin-bottom: 10px;padding-bottom:10px;">
                <el-row>
                  <el-col :span="20">
                    <div align="left" v-html="item.companyFullName"></div>
                  </el-col>
                  <el-col :span="4" v-if="item.from === '网络爬虫'">
                    <span><i class="el-icon-star-off"></i></span>
                  </el-col>
                  <el-col :span="24">
                    <div align="left" v-html="item.content"></div>
                  </el-col>
                  <el-col :span="24">
                    <div align="right">
                      <span>{{item.originaltime}}</span>
                    </div>
                  </el-col>
                </el-row>
              </div>
            </div>
            <div class="block">
              <el-pagination
                layout="prev, pager, next"
                :total=accidentData.pager.totalElements
                @current-change="getAccidentsListPager">
              </el-pagination>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="16">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="事件详情" name="details">
            <el-row :gutter="15">
              <el-col :span="24">
                <el-card class="box-card" :body-style="{ padding: '0px' }">
                  <div slot="header" class="chart-header">
                    <span class="iconfont icon-emotion"></span>
                    <span class="chart-text">事故简介</span>
                  </div>
                  <el-col :span="24" v-loading="accidentContentLoading">
                    <div><p v-html="accidentContent"></p></div>
                  </el-col>
                </el-card>
              </el-col>
            </el-row>
            <el-row :gutter="15">
              <el-col :span="24">
                <el-card class="box-card" :body-style="{ padding: '0px' }">
                  <div slot="header" class="chart-header">
                    <span class="iconfont icon-trendLine"></span><span
                    class="chart-text">载体趋势分析</span>
                  </div>
                  <div class="buttons mediaTypeTrendChart">
                    <div class="el-tabs__header">
                      <div class="el-tabs__nav-wrap">
                        <div class="el-tabs__nav-scroll">
                          <div class="el-tabs__nav">
                            <div class="el-tabs__item" @click="handleClickTrendButton('today', $event)">
                              <span><i class="el-icon-date"></i> 今天</span></div>
                            <div class="el-tabs__item" @click="handleClickTrendButton('nearly', $event)">
                              <span><i class="el-icon-date"></i> 近7天</span></div>
                            <div class="el-tabs__item is-active" @click="handleClickTrendButton('monthly', $event)">
                              <span><i class="el-icon-date"></i> 近30天</span></div>
                            <div class="el-tabs__item" @click="handleClickTrendButton('customTime', $event)">
                              <span><i class="el-icon-date"></i> 自定义时间</span></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <el-col :span="24" v-loading="mediaTypeTrendAnalysisLoading">
                    <div class="chart">
                      <line-bar-chart :chartConfig="mediaTypeTrendAnalysisConfig"></line-bar-chart>
                    </div>
                  </el-col>
                </el-card>
              </el-col>
            </el-row>
            <el-row :gutter="15">
              <el-col :span="24">
                <el-card class="box-card" :body-style="{ padding: '0px' }">
                  <div slot="header" class="chart-header">
                    <span class="iconfont icon-trend"></span>
                    <span class="chart-text">媒体来源占比</span>
                  </div>
                  <div v-loading="mediaTypeLoading" id="media-article-type-pie">
                    <div v-if="dataAnalysis.totalSum>0"
                         @click="getTypeArticle(['news','weibo','bar','bbs'])"
                         class="all-type">
                      <p>各类型媒体报道</p>
                      <p>{{dataAnalysis.totalSum}}</p>
                    </div>
                    <div v-for="item in dataAnalysis.typeData">
                      <div :class="item.className" v-if="item.value>0"
                           @click="getTypeArticle([item.type])">
                        <p>{{item.name}}</p>
                        <p>{{item.value}}</p>
                        <p>{{item.percent}}</p>
                      </div>
                    </div>
                  </div>
                </el-card>
              </el-col>
            </el-row>
            <el-row :gutter="15">
              <el-col :span="24">
                <el-card class="box-card my-card" style="margin-top:5px; height:430px">
                  <div slot="header" class="chart-header">
                    <span class="chart-text">事件走势</span>
                  </div>
                  <div v-loading="netizenTimeLine" style="height:400px; overflow:scroll;"
                       class="mybox">
                    <time-line :timeData="timeLineData" @data="getData"></time-line>
                  </div>
                </el-card>
              </el-col>
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="舆情热点" name="hot">
            <el-row :gutter="15">
              <el-col :span="24" v-loading="newsListTabLoading">
                <div class="news-list-tab">
                  <article-tab v-if="newsTabData.articles.length > 0" :articleData="newsTabData"
                               @data="getData"></article-tab>
                </div>
                <div class="clearfix table-bottom" align='center'>
                  <div class="block">
                    <el-pagination v-if="newsTabData.articles.length > 0"
                                   @current-change="handleCurrentChange"
                                   :current-page.sync="newsTabData.pager.currentPage"
                                   :page-size='newsTabData.pager.pageSize'
                                   layout="prev, pager, next, jumper"
                                   :total='newsTabData.pager.totalElements'>
                    </el-pagination>
                  </div>
                </div>
              </el-col>
            </el-row>
            <el-row :gutter="15">
              <el-col :span="12">
                <el-card class="box-card" :body-style="{ padding: '0px' }">
                  <div slot="header" class="chart-header">
                    <span class="iconfont icon-emotion"></span><span
                    class="chart-text">舆情情感分析</span>
                  </div>
                  <el-col :span="24" v-loading="emotionLoading">
                    <pie-chart :chartConfig="emotionConfig"></pie-chart>
                  </el-col>
                </el-card>
              </el-col>
              <el-col :span="12" class="lists">
                <el-card class="box-card" :body-style="{ padding: '0px' }">
                  <div slot="header" class="chart-header">
                    <span class="iconfont icon-ciyun"></span><span
                    class="chart-text">热点词云</span>
                  </div>
                  <el-col :span="24" v-loading="keywordsLoading">
                    <keywords-chart :chartConfig="keywordsConfig"></keywords-chart>
                  </el-col>
                </el-card>
              </el-col>
            </el-row>
            <el-row :gutter="15">
              <el-col :span="24">
                <el-card class="box-card" :body-style="{ padding: '0px' }">
                  <div slot="header" class="chart-header">
                    <span class="iconfont icon-trendLine"></span><span
                    class="chart-text">载体趋势分析</span>
                  </div>
                  <el-col :span="24" v-loading="trendLoading">
                    <div class="chart">
                      <line-bar-chart :chartConfig="trendConfig"></line-bar-chart>
                    </div>
                  </el-col>
                </el-card>
              </el-col>
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="传播路径" name="path">
          </el-tab-pane>
          <el-tab-pane label="网民猜测" name="netizen">
          </el-tab-pane>
          <el-tab-pane label="新闻观点" name="news">
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>

    <article-list v-if="articles.length > 0"
                  :id="articleListId"
                  :articles="articles"
                  v-loading="articlesLoading"
                  :pager="pager"
                  @data="getData"
    >
    </article-list>
  </div>
</template>
<script>
  import Pager from '@/components/common/pager'
  import Time from '@/components/common/timeLine'
  import {dateUtil} from '@/utils/dateUtil'
  import {typeUtil} from '@/utils/typeUtil'
  import pieChart from '@/components/common/charts/pie'
  import lineBarChart from '@/components/common/charts/line-bar'
  import keywordsChart from '@/components/common/charts/keywords-cloud'
  import {barChartOption} from '@/components/common/options/bar-chart'
  import {pieChartOption} from '@/components/common/options/pie-chart'
  import {lineChartOption} from '@/components/common/options/line-chart'
  import articleList from '@/components/common/articles'
  import {
    getFocusArticles,
    getDeduplicationArticles,
    getArticles,
    getFilterAndGroupBy,
    getHotWords,
    getFilterAndGroupByTime
  } from '@/service/article'
  import articleTab from '@/components/common/article-tab-list'
  const typeOptions = ['一般事故', '较大事故', '重大事故', '特大事故']
  import {
    getAccidentsList,
    getAccidentsCompanyName,
    getAccidentMonitorKeyWords,
    getAccidentContent
  } from '@/service/accident'
  import {
    ARTICLE_TYPE_EMOTION_CHART,
    ARTICLE_TYPE_MEDIA_TYPE_HOT_WORDS,
    ARTICLE_TYPE_MEDIA_TYPE_TREND
  } from '@/service/common'

  import $ from 'jquery'
  export default {
    name: 'accidentMonitor',
    data() {
      let self = this
      return {
        condition: { // 事故列表参数
          mustWord: '',
          mustNotWord: '',
          shouldWord: '',
          startDate: '',
          endDate: '',
          companyName: '',
          direction: 'adate', // 排序方式
          searchKv: [],
          type: []
        },
        newsTabData: { // 舆情热点数据和分页
          type: 'news',
          titleText: '舆情热点',
          sortBy: 'score',
          btnText: '更多 >>',
          articles: [],
          pager: {
            pageSize: 10,
            currentPage: 1,
            totalElements: 10
          }
        },
        accidentParam: {// 单个事故的参数
          mustWord: '',
          shouldWord: '',
          mustNotWord: '',
          startDate: '',
          endDate: ''
        },
        articlesConditions: {},
        heightLightWords: '',
        keywords: {},
        timeLineData: [],
        timeLinePager: {
          limit: 10,
          page: 1
        },
        isIndeterminateMediaType: false,
        emotionLoading: false,
        trendLoading: false,
        keywordsLoading: false,
        checkAllMediaType: false,
        articlesLoading: false,
        accidentsLoading: false,
        newsListTabLoading: false,
        mediaTypeTrendAnalysisLoading: true,
        accidentContentLoading: true,
        mediaTypeLoading: true,
        netizenTimeLine: false,
        dataAnalysis: {// 载体类型数量
          totalSum: 0,
          typeData: []
        },
        accidentData: {// 事故列表和分页
          accidents: [],
          pager: {
            pageSize: 10,
            currentPage: 1,
            totalElements: 10
          }
        },
        articles: [],
        accidentContent: '',
        mediaTypeArray: [],
        mediaTypes: typeOptions,
        activeName: 'details',
        tableData: [
          {
            pubTime: '2016-05-02',
            site: '大众网',
            content: '国家安全监管总局台风橙色预警信息：中央气象台8月26日18时发布台...'
          }, {
            pubTime: '2016-05-02',
            site: '大众网',
            content: '国家安全监管总局台风橙色预警信息：中央气象台8月26日18时发布台...'
          }, {
            pubTime: '2016-05-02',
            site: '大众网',
            content: '国家安全监管总局台风橙色预警信息：中央气象台8月26日18时发布台...'
          }, {
            pubTime: '2016-05-02',
            site: '大众网',
            content: '国家安全监管总局台风橙色预警信息：中央气象台8月26日18时发布台...'
          }, {
            pubTime: '2016-05-02',
            site: '大众网',
            content: '国家安全监管总局台风橙色预警信息：中央气象台8月26日18时发布台...'
          }, {
            pubTime: '2016-05-02',
            site: '大众网',
            content: '国家安全监管总局台风橙色预警信息：中央气象台8月26日18时发布台...'
          }, {
            pubTime: '2016-05-02',
            site: '大众网',
            content: '国家安全监管总局台风橙色预警信息：中央气象台8月26日18时发布台...'
          }, {
            pubTime: '2016-05-02',
            site: '大众网',
            content: '国家安全监管总局台风橙色预警信息：中央气象台8月26日18时发布台...'
          }, {
            pubTime: '2016-05-02',
            site: '大众网',
            content: '国家安全监管总局台风橙色预警信息：中央气象台8月26日18时发布台...'
          }, {
            pubTime: '2016-05-02',
            site: '大众网',
            content: '国家安全监管总局台风橙色预警信息：中央气象台8月26日18时发布台...'
          }
        ],
        articleListId: 'article-list',
        mediaTypeTrendAnalysisConfig: {
          chartId: 'media-type-trend-chart',
          option: {},
          events: {
            'click': function (param) {
              self.articlesConditions = {}
              self.pager.currentPage = 1
              let date = dateUtil.parseDate(param.name)
              self.articlesConditions.startDate = dateUtil.formatDate(date, 'yyyy-MM-dd')
              self.articlesConditions.endDate = dateUtil.formatDate(dateUtil.addDate(date, 'd', 1), 'yyyy-MM-dd')
              self.articlesConditions.type = [typeUtil.encodeArticleType(param.seriesName)]
              self.getArticles()
            }
          }
        },
        emotionConfig: {
          chartId: 'emotion-chart',
          option: {},
          events: {
            'click': function (param) {
              self.articlesConditions = {}
              self.pager.currentPage = 1
              self.articlesConditions.startDate = self.accidentParam.startDate
              self.articlesConditions.endDate = self.accidentParam.endDate
              self.articlesConditions.searchKv = [{
                'key': 'nlp.sentiment.label',
                'value': typeUtil.encodeSentimentType(param.name)
              }]
              self.articlesConditions.type = ARTICLE_TYPE_EMOTION_CHART.split('@')
              self.getArticles()
            }
          }
        },
        keywordsConfig: {
          chartId: 'hot-keywords-chart',
          option: {},
          events: {
            'click': function (param) {
            }
          }
        },
        trendConfig: {
          chartId: 'trend-chart',
          option: {},
          events: {
            'click': function (param) {
              self.articlesConditions = {}
              self.pager.currentPage = 1
              let date = dateUtil.parseDate(param.name)
              self.articlesConditions.startDate = dateUtil.formatDate(date, 'yyyy-MM-dd')
              self.articlesConditions.endDate = dateUtil.formatDate(dateUtil.addDate(date, 'd', 1), 'yyyy-MM-dd')
              self.articlesConditions.type = [typeUtil.encodeArticleType(param.seriesName)]
              self.getArticles()
            }
          }
        },
        areaWarningConfig: {
          chartId: 'areaWarning',
          option: {},
          events: {
            'click': function (param) {
              self.articlesConditions = {}
              self.pager.currentPage = 1
              self.articlesConditions.startDate = self.accidentParam.startDate
              self.articlesConditions.endDate = self.accidentParam.endDate
              self.articlesConditions.searchKv = [{
                'key': 'location',
                'value': param.name
              }]
              self.articlesConditions.type = ['article']
            }
          }
        },
        pager: {
          pageSize: 10,
          currentPage: 1,
          totalElements: 1
        },
        dragTreeList: []
      }
    },
    components: {
      'list-page': Pager,
      'line-bar-chart': lineBarChart,
      'article-list': articleList,
      'article-tab': articleTab,
      'pie-chart': pieChart,
      'time-line': Time,
      'keywords-chart': keywordsChart
    },
    created () {
      let self = this
      let date = new Date()
      self.condition.startDate = dateUtil.formatDate(dateUtil.addDate(date, 'M', -3), 'yyyy-MM-dd')
      self.condition.endDate = dateUtil.formatDate(dateUtil.addDate(date, 'd', 1), 'yyyy-MM-dd')
    },
    mounted () {
//      require('static/plugin/jquery-1.10.2.min')
//      require('static/plugin/bootstrap.min')
//      require('static/plugin/main')
      this.renderPageData()
    },
    methods: {
      changeStartDate: function (time) {
        this.condition.startDate = time
      },
      changeEndDate: function (time) {
        this.condition.endDate = time
      },
      watchScroll: function () {
        let self = this
        $('.mybox').scroll(function () {
          let scrollTop = $('.mybox').scrollTop()
          let scrollTopHeight = $('.timeLime').height()
          let timeLineHeight = $(this).height()
          if (scrollTop + timeLineHeight - 40 >= scrollTopHeight) {
            self.getMoreTimeLine()
          }
        })
      },
      getMoreTimeLine: function () {
        let self = this
        self.timeLinePager.page = self.timeLinePager.page + 1
        self.getNetizenTimeLine(self.timeLinePager)
      },
      /**
       * 点击文章各载体类型数量分布图时，根据时间重新渲染趋势图
       * @param trendTimesType
       * @param item
       */
      handleClickTrendButton (trendTimesType, item) {
        var self = this
        $('.buttons.mediaTypeTrendChart').find('.el-tabs__item').removeClass('is-active')
        $(item.currentTarget).addClass('is-active')
        self.getMediaTypeTrendAnalysisChart(trendTimesType)
      },
      getAnimate () {

      },
      /*
       * 获取时间轴数据
       * */
      getNetizenTimeLine: function () {
        let self = this
        let param = {
          date: {
            startDate: self.accidentParam.startDate,
            endDate: self.accidentParam.endDate
          },
          keyword: {
            'mustWord': self.accidentParam.mustWord,
            'shouldWord': self.accidentParam.shouldWord,
            'mustNotWord': self.accidentParam.mustNotWord
          },
          page: {
            limit: self.timeLinePager.limit,
            orders: [{
              'direction': 'DESC',
              'orderBy': 'pubTime'
            }],
            page: self.timeLinePager.page
          },
          type: ['news', 'bar', 'bbs', 'bar']
        }
        self.netizenTimeLine = true
        getFocusArticles(param).then(data => {
          debugger
          self.netizenTimeLine = false
          if (data.content.length > 0) {
            self.timeLineData = data.content
          }
        }).catch({})
      },
      /**
       * 载体类型分布数量
       * @param type
       */
      getMediaTypeChart () {
        let self = this
        let params = {
          'date': {
            'startDate': self.accidentParam.startDate,
            'endDate': self.accidentParam.endDate
          },
          'keyword': {
            'mustWord': self.accidentParam.mustWord,
            'shouldWord': self.accidentParam.shouldWord,
            'mustNotWord': self.accidentParam.mustNotWord
          },
          'groupName': 'type',
          'type': ['news', 'bar', 'bbs', 'weibo']
        }
        getFilterAndGroupBy(params).then(data => {
          self.mediaTypeLoading = false
          let seriesData = []
          let totalSum = 0
          $.each(data, function (i, item) {
            if (item.key !== '' && item.key !== 'blog') {
              let node = {}
              node.name = typeUtil.articleType(item.key)
              node.value = item.value
              node.type = item.key
              totalSum += item.value
              seriesData.push(node)
            }
          })
          $.each(seriesData, function (i, item) {
            item.percent = (item.value * 100 / totalSum).toFixed(2) + '%'
            item.className = 'type' + i
          })
          self.dataAnalysis.typeData = seriesData
          self.dataAnalysis.totalSum = totalSum
        }).catch(error => {
          self.$confirm(error.message, '错误', {type: 'error'})
        })
      },
      /**
       * 载体类型分布数量Click点击事件
       */
      getTypeArticle: function (type) {
        let self = this
        self.articlesConditions = {}
        self.pager.currentPage = 1
        self.articlesConditions.startDate = self.keywordsConfig.startDate
        self.articlesConditions.endDate = self.keywordsConfig.endDate
        self.articlesConditions.searchKv = []
        self.articlesConditions.orders = []
        self.articlesConditions.type = type
        self.getArticles()
      },
      /**
       * 获取文章各载体类型趋势图
       * @param type
       * 趋势时间段类型
       */
      getMediaTypeTrendAnalysisChart (type) {
        let self = this
        let conditionDate = self.getConditionDate(type, true)
        let params = {
          date: {
            startDate: conditionDate.startDate,
            endDate: conditionDate.endDate
          },
          keyword: {
            'mustWord': self.accidentParam.mustWord,
            'shouldWord': self.accidentParam.shouldWord,
            'mustNotWord': self.accidentParam.mustNotWord
          },
          groupName: 'type',
          type: ARTICLE_TYPE_MEDIA_TYPE_TREND.split('@')
        }
        let gapParams = {gap: conditionDate.gap, dateType: conditionDate.dateType}
        self.mediaTypeTrendAnalysisLoading = true
        getFilterAndGroupByTime(params, gapParams).then(data => {
          self.mediaTypeTrendAnalysisLoading = false
          let renderData = []
          for (let name in data) {
            let renderItem = {}
            renderItem.name = typeUtil.articleType(name)
            renderItem.data = data[name]
            renderData.push(renderItem)
          }
          self.mediaTypeTrendAnalysisConfig.option = lineChartOption.getOption(renderData)
        }).catch(error => {
          self.$confirm(error.message, '错误', {type: 'error'})
        })
      },
      /**
       * 通过选择的时间返回趋势图条件
       */
      getConditionDate: function (timeType, isTrendChart) {
        let self = this
        let conditionDate = {}
        let {startDate = '', endDate = '', dateType = '', gap = ''} = conditionDate
        let date = new Date()
        switch (timeType) {
          case 'today':
            endDate = dateUtil.formatDate(dateUtil.addDate(date, 'd', 1), 'yyyy-MM-dd')
            startDate = dateUtil.formatDate(date, 'yyyy-MM-dd')
            dateType = 'hour'
            gap = '5'
            break
          case 'nearly':
            endDate = dateUtil.formatDate(dateUtil.addDate(date, 'd', 1), 'yyyy-MM-dd')
            startDate = dateUtil.formatDate(dateUtil.addDate(date, 'd', -7), 'yyyy-MM-dd')
            dateType = 'day'
            gap = '1'
            break
          case 'monthly':
            endDate = dateUtil.formatDate(dateUtil.addDate(date, 'd', 1), 'yyyy-MM-dd')
            startDate = dateUtil.formatDate(dateUtil.addDate(date, 'M', -1), 'yyyy-MM-dd')
            dateType = 'day'
            gap = '1'
            break
          case 'customTime':
            endDate = self.accidentParam.endDate
            startDate = self.accidentParam.startDate
            dateType = 'day'
            gap = '1'
            break
          default:
            break
        }
        conditionDate.startDate = startDate
        conditionDate.endDate = endDate
        if (isTrendChart) {
          conditionDate.dateType = dateType
          conditionDate.gap = gap
        }
        return conditionDate
      },
      /**
       * 获取子组件的参数，进行相关的操作处理
       * @param data
       */
      getData (data) {
        let self = this
        switch (data.action) {
          case 'clickArticleListPager':
            self.pager = data.data
            self.getArticles()
            break
          case 'clickSimilarArticleList':
            self.pager.currentPage = 1
            self.articlesConditions.searchKv = data.searchKv
            self.articlesConditions.startDate = self.accidentParam.startDate
            self.articlesConditions.endDate = self.accidentParam.endDate
            self.getArticles()
        }
      },
      /**
       * 点击图表获得列表
       */
      getArticles (deduplication) {
        let self = this
        let {startDate, endDate} = self.articlesConditions
        let params = {
          date: {
            startDate: startDate,
            endDate: endDate
          },
          keyword: {
            'mustWord': self.accidentParam.mustWord,
            'shouldWord': self.accidentParam.shouldWord,
            'mustNotWord': self.accidentParam.mustNotWord
          },
          page: {
            limit: self.pager.pageSize,
            page: self.pager.currentPage,
            orders: self.articlesConditions.orders
          },
          searchKv: self.articlesConditions.searchKv,
          type: self.articlesConditions.type
        }
        params.displayConfig = {sourceLength: 20, titleLength: 35, heightLightWords: self.heightLightWords}
        // 如果需要调用去重接口，deduplication值为true
        if (deduplication) {
          self.articlesLoading = true
          getDeduplicationArticles(params).then(data => {
            self.articlesLoading = false
            self.articles = data.content
            self.pager.totalElements = data.totalElements
          }).catch(error => {
            self.$confirm(error.message, '错误', {type: 'error'})
          })
        } else {
          self.articlesLoading = true
          getArticles(params).then(data => {
            self.articlesLoading = false
            self.articles = data.content
            self.pager.totalElements = data.totalElements
          }).catch(error => {
            self.$confirm(error.message, '错误', {type: 'error'})
          })
        }
      },
      /*
       * 更改左侧事故列表页码
       * */
      getAccidentsListPager (page) {
        this.accidentData.pager.currentPage = page
        this.getAccidentList()
      },
      /**
       * 点击焦点列表分页
       */
      handleCurrentChange: function (currentPage) {
        let self = this
        self.newsTabData.pager.currentPage = currentPage
        self.getTabArticles()
      },
      /** 获取文章标题列表
       */
      getTabArticles () {
        let self = this
        let params = {
          date: {
            startDate: self.accidentParam.startDate,
            endDate: self.accidentParam.endDate
          },
          keyword: {
            'mustWord': self.accidentParam.mustWord,
            'shouldWord': self.accidentParam.shouldWord,
            'mustNotWord': self.accidentParam.mustNotWord
          },
          page: {
            limit: self.newsTabData.pager.pageSize,
            orders: [],
            page: self.newsTabData.pager.currentPage
          },
          type: ['news', 'bar', 'bbs', 'bar']
        }
//        if (type === 'news') {
//          params.filed = 'title'
//          params.page.orders = []
//        }
        params.displayConfig = {sourceLength: 20, titleLength: 20, heightLightWords: self.heightLightWords}
        self.newsListTabLoading = true
        getFocusArticles(params).then(data => {
          if (params.page.page > 9) {
            data.content.splice(9)
          }
          self.newsListTabLoading = false
          data.content.forEach(function (item, index) {
            switch (self.changeSortSum(params.page.page, params.page.limit, index)) {
              case 1:
                item.index = '<span class = "first sortText">' + self.changeSortSum(params.page.page, params.page.limit, index) + '</span>'
                break
              case 2:
                item.index = '<span class = "second sortText">' + self.changeSortSum(params.page.page, params.page.limit, index) + '</span>'
                break
              case 3:
                item.index = '<span class = "third sortText">' + self.changeSortSum(params.page.page, params.page.limit, index) + '</span>'
                break
              default:
                item.index = '<span class = "other sortText">' + self.changeSortSum(params.page.page, params.page.limit, index) + '</span>'
                break
            }
          })
          self.newsTabData.articles = data.content
          self.newsTabData.pager.totalElements = (data.totalPages * data.size) > 99 ? 99 : data.totalPages * data.size
        }).catch(error => {
          self.$confirm(error.message, '错误', {type: 'error'})
        })
      },
      /**
       * 改变焦点新闻列表数量
       */
      changeSortSum: function (page, limit, index) {
        return parseInt((page - 1) * limit) + parseInt(index) + 1
      },
      /*
       * 根据选中获取关键词以及时间范围
       * */
      getAccidentKeyWords () {
        let self = this
        self.accidentData.accidents.forEach(function (item) {
          if (item.isAccidentSelected === true) {
            let id = item.id
            self.accidentParam.startDate = dateUtil.formatDate(dateUtil.addDate(new Date(item.adate), 'd', -1), 'yyyy-MM-dd')
            self.accidentParam.endDate = dateUtil.formatDate(dateUtil.addDate(new Date(), 'd', 1), 'yyyy-MM-dd')
            self.accidentContentLoading = true
            getAccidentContent(id).then(data => {
              self.accidentContentLoading = false
              self.accidentContent = data.content
            })
            getAccidentMonitorKeyWords(id).then(data => {
              self.accidentParam.mustWord = data.mustWord
            }).then(function () {
              self.getTabArticles()
              self.getEmotionChart()
//              self.getKeywordsChart()
              self.getTrendChart()
              self.getMediaTypeTrendAnalysisChart('monthly')
              self.getMediaTypeChart()
              self.getNetizenTimeLine()
              self.watchScroll()
            })
          }
        })
      },
      /*
       * 点击改变列表选中
       * */
      getAccidentSelected (item) {
        let self = this
        self.accidentData.accidents.forEach(function (item) {
          item.isAccidentSelected = false
        })
        item.isAccidentSelected = true
        self.getAccidentKeyWords()
      },
      /**
       * 获取情感分析正负面图
       */
      getEmotionChart () {
        let self = this
        let params = {
          date: {
            startDate: self.accidentParam.startDate,
            endDate: self.accidentParam.endDate
          },
          keyword: {
            'mustWord': self.accidentParam.mustWord,
            'shouldWord': self.accidentParam.shouldWord,
            'mustNotWord': self.accidentParam.mustNotWord
          },
          groupName: 'nlp.sentiment.label',
          type: ARTICLE_TYPE_EMOTION_CHART.split('@')
        }
        self.emotionLoading = true
        getFilterAndGroupBy(params).then(data => {
          self.emotionLoading = false
          let renderData = []
          let renderItem = {}
          renderItem.name = '情感分析'
          if (data.length > 0) {
            data.forEach(function (item) {
              item.name = typeUtil.sentimentType(item.key)
            })
          }
          renderItem.data = data
          renderData.push(renderItem)
          let chartConfig = {pieForEmotion: true}
          self.emotionConfig.option = pieChartOption.getOption(renderData, chartConfig)
        }).catch(error => {
          self.$confirm(error.message, '错误', {type: 'error'})
        })
      },
      /**
       * 根据条件获取关键词云
       */
      getKeywordsChart () {
        let self = this
        let params = {
          date: {
            startDate: self.accidentParam.startDate,
            endDate: self.accidentParam.endDate
          },
          page: {
            'limit': 50,
            'page': 1
          },
          keyword: {
            'mustWord': self.accidentParam.mustWord,
            'shouldWord': self.accidentParam.shouldWord,
            'mustNotWord': self.accidentParam.mustNotWord
          },
          type: ARTICLE_TYPE_MEDIA_TYPE_HOT_WORDS.split('@')
        }
        self.keywordsLoading = true
        getHotWords(params).then(data => {
          self.keywordsLoading = false
          let option = {data: []}
          if (data.length > 0) {
            data.forEach(function (word) {
              let obj = {}
              obj.keyword = word.key
              obj.score = word.value
              option.data.push(obj)
            })
          }
          self.keywordsConfig.option = option
        }).catch(error => {
          self.$confirm(error.message, '错误', {type: 'error'})
        })
      },
      /**
       * 载体类型趋势图
       */
      getTrendChart (type) {
        let self = this
        let params = {
          date: {
            startDate: self.accidentParam.startDate,
            endDate: self.accidentParam.endDate
          },
          keyword: {
            'mustWord': self.accidentParam.mustWord,
            'shouldWord': self.accidentParam.shouldWord,
            'mustNotWord': self.accidentParam.mustNotWord
          },
          groupName: 'type',
          type: ARTICLE_TYPE_MEDIA_TYPE_TREND.split('@')
        }
        let gapParams = {gap: 1, dateType: 'day'}
        self.trendLoading = true
        getFilterAndGroupByTime(params, gapParams).then(data => {
          self.trendLoading = false
          let renderData = []
          for (let name in data) {
            let renderItem = {}
            renderItem.name = typeUtil.articleType(name)
            renderItem.data = data[name]
            renderData.push(renderItem)
          }
          self.trendConfig.option = lineChartOption.getOption(renderData)
        }).catch(error => {
          self.$confirm(error.message, '错误', {type: 'error'})
        })
      },
      /*
       * 默认渲染
       * */
      renderPageData() {
        this.accidentData.pager.currentPage = 1
        this.getAreaWarningBarChart()
        this.getAccidentList()
        this.getAccidentKeyWords()
      },
      /**
       *  点击类型全选
       */
      handleMediaTypeCheckAllChange(event) {
        let self = this
        self.mediaTypeArray = event.target.checked ? self.mediaTypes : []
        self.isIndeterminateMediaType = false

        let mediaTypes = []
        self.mediaTypeArray.forEach(function (item) {
          mediaTypes.push(item)
        })
        self.condition.type = mediaTypes
      },
      /**
       *  点击单个类型
       */
      handleCheckedMediaTypeChange(value) {
        let self = this
        let checkedCount = value.length
        self.checkAllMediaType = checkedCount === this.mediaTypes.length
        self.isIndeterminateMediaType = checkedCount > 0 && checkedCount < self.mediaTypes.length
        let mediaTypes = []
        self.mediaTypeArray.forEach(function (item) {
          mediaTypes.push(item)
        })
        self.condition.type = mediaTypes
      },
      /*
       *根据点击tab来分别渲染
       */
      handleClick(tab, event) {
        switch (tab.name) {
          case 'details':
            this.articles = []
            this.getAccidentKeyWords()
            break
          case 'hot':
            this.articles = []
            this.getAccidentKeyWords()
            break
          case 'path':
            this.articles = []
            this.getAreaWarningBarChart()
            break
          case 'netizen':
            this.articles = []
            break
          case 'news':
            break
        }
      },
      getAreaWarningBarChart () {
        let self = this
        let params = {
          'date': {
            'startDate': '2017-01-01',
            'endDate': '2017-08-28'
          },
//          'keyword': self.keywords,
          'groupName': 'source',
          'type': []
        }
        getFilterAndGroupBy(params).then(data => {
          data = [
            {'value': 263, 'key': '北京'},
            {'value': 123, 'key': '山东'},
            {'value': 140, 'key': '安徽'},
            {'value': 180, 'key': '四川'},
            {'value': 200, 'key': '辽宁'},
            {'value': 240, 'key': '山西'},
            {'value': 290, 'key': '河南'},
            {'value': 360, 'key': '上海'},
            {'value': 190, 'key': '广东'},
            {'value': 157, 'key': '重庆'}
          ]
          let renderData = []
          let chartConfig = {legendData: {show: false}, xAxisData: {axisLabel: {rotate: 45}}}
          let renderItem = {}
          renderItem.name = '数目'
          if (data.length > 0) {
            data.forEach(function (item) {
              item.name = item.key
            })
          }
          renderItem.data = data
          renderData.push(renderItem)
          self.areaWarningConfig.option = barChartOption.getOption(renderData, chartConfig)
        }).catch(error => {
          self.$confirm(error.message, '错误', {type: 'error'})
        })
      },
      /**
       * 根据条件获取事故列表
       */
      getAccidentList () {
        let self = this
        if (self.condition.companyName) {
          let param = {
            'limit': self.accidentData.pager.pageSize,
            'orders': [
              {
                'direction': 'DESC',
                'orderBy': self.condition.direction
              }
            ],
            'page': self.accidentData.pager.currentPage
          }
          let companyName = self.condition.companyName
          self.accidentsLoading = true
          getAccidentsCompanyName(param, companyName).then(data => {
            self.accidentsLoading = false
            if (data.content) {
              data.content.forEach(function (item) {
                item.isAccidentSelected = false
              })
              data.content[0].isAccidentSelected = true
              self.accidentData.accidents = data.content
              self.accidentData.pager.totalElements = data.totalElements
              self.getAccidentKeyWords()
            }
          }).catch(error => {
            self.$confirm(error.message, '错误', {type: 'error'})
          })
        } else {
          let param = {
            'dateParam': {
              'endDate': self.condition.endDate,
              'startDate': self.condition.startDate
            },
            'page': {
              'limit': self.accidentData.pager.pageSize,
              'orders': [
                {
                  'direction': 'DESC',
                  'orderBy': self.condition.direction
                }
              ],
              'page': self.accidentData.pager.currentPage
            },
            'sgjb': self.condition.type
          }
          self.accidentsLoading = true
          getAccidentsList(param).then(data => {
            debugger
            self.accidentsLoading = false
            if (data.content) {
              data.content.forEach(function (item) {
                item.isAccidentSelected = false
              })
              data.content[0].isAccidentSelected = true
              self.accidentData.accidents = data.content
              self.accidentData.pager.totalElements = data.totalElements
              self.getAccidentKeyWords()
            }
          }).catch(error => {
            self.$confirm(error.message, '错误', {type: 'error'})
          })
        }
      }
    },
    watch: {
      articles: function (val, oldVal) {
        let self = this
        if (val.length > 0) {
          self.$nextTick(function () {
            // DOM 现在更新了
            // `this` 绑定到当前实例
            // 页面滚动到指定位置
            $('section').animate({scrollTop: 1400}, 500)
          })
        }
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .news-list-tab {
    height: 470px;
  }

  .accidentListBox > div {
    cursor: pointer;
  }
</style>
