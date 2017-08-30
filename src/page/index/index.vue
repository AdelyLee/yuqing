<template>
  <div id="index">
    <el-col :span="24">
      <div class="card-body">
        <el-row :gutter="15">
          <date-picker :datePickerForm="datePickerForm" @data="getData"></date-picker>
        </el-row>
        <el-row :gutter="15">
          <el-col :span="12" v-loading="newsListTabLoading">
            <div class="news-list-tab">
              <article-tab v-if="newsTabData.articles.length > 0" :articleData="newsTabData"
                           @data="getData"></article-tab>
            </div>
          </el-col>
          <el-col :span="12" v-loading="bbsListTabLoading">
            <div class="news-list-tab">
              <article-tab v-if="bbsTabData.articles.length > 0" :articleData="bbsTabData"
                           @data="getData"></article-tab>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="15">
          <el-col :span="8">
            <el-card class="box-card" :body-style="{ padding: '0px' }">
              <div slot="header" class="chart-header">
                <span class="iconfont icon-emotion"></span>
                <span class="chart-text">舆情情感分析</span>
              </div>
              <el-col :span="24" v-loading="emotionAnalysisChartLoading">
                <pie-chart :chartConfig="emotionAnalysisChartConfig"></pie-chart>
              </el-col>
            </el-card>
          </el-col>
          <el-col :span="16">
            <el-card class="box-card" :body-style="{ padding: '0px' }">
              <div slot="header" class="chart-header">
                <span class="iconfont icon-media"></span><span
                class="chart-text">主流媒体分布</span>
              </div>
              <el-col :span="24" v-loading="mediaSiteChartLoading">
                <line-bar-chart :chartConfig="mediaSiteChartConfig"></line-bar-chart>
              </el-col>
            </el-card>
          </el-col>
        </el-row>
        <el-row :gutter="15">
          <el-col :span="16">
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
          <el-col :span="8">
            <el-card class="box-card" :body-style="{ padding: '0px' }">
              <div slot="header" class="chart-header">
                <span class="iconfont icon-trend"></span><span
                class="chart-text">载体分布统计</span>
              </div>
              <div class="buttons mediaTypeBarChart">
                <div class="el-tabs__header">
                  <div class="el-tabs__nav-wrap">
                    <div class="el-tabs__nav-scroll">
                      <div class="el-tabs__nav">
                        <div class="el-tabs__item" @click="handleClickBarButton('today', $event)">
                          <span><i class="el-icon-date"></i> 今天</span>
                        </div>
                        <div class="el-tabs__item" @click="handleClickBarButton('nearly', $event)">
                          <span><i class="el-icon-date"></i> 近7天</span>
                        </div>
                        <div class="el-tabs__item is-active" @click="handleClickBarButton('monthly', $event)">
                          <span><i class="el-icon-date"></i> 近30天</span>
                        </div>
                        <div class="el-tabs__item" @click="handleClickBarButton('customTime', $event)">
                          <span><i class="el-icon-date"></i> 自定义时间</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <el-col :span="24" v-loading="mediaTypeBarAnalysisLoading">
                <div class="chart">
                  <line-bar-chart :chartConfig="mediaTypeBarAnalysisConfig"></line-bar-chart>
                </div>
              </el-col>
            </el-card>
          </el-col>
        </el-row>
        <el-row :gutter="15">
          <el-col :span="24" v-loading="articlesLoading">
            <article-list v-if="articles.length > 0" :id="articleListId" :articles="articles" :pager="pager"
                          @data="getData"></article-list>
          </el-col>
        </el-row>
      </div>
    </el-col>
  </div>
</template>

<script>
  import datePicker from '@/components/common/date-picker'
  import articleTab from '@/components/common/article-tab-list'
  import articleList from '@/components/common/articles'
  import pieChart from '@/components/common/charts/pie'
  import lineBarChart from '@/components/common/charts/line-bar'
  import {pieChartOption} from '@/components/common/options/pie-chart'
  import {barChartOption} from '@/components/common/options/bar-chart'
  import {lineChartOption} from '@/components/common/options/line-chart'
  import {typeUtil} from '@/utils/typeUtil'
  import {dateUtil} from '@/utils/dateUtil'
  import {utils} from '@/utils/utils'
  import {getKeywords} from '@/service/config'
  import {
    getDeduplicationArticles,
    getArticles,
    getFilterAndGroupBy,
    getFilterAndGroupByTime
  } from '@/service/article'
  import {
    ARTICLE_TYPE_EMOTION_CHART,
    ARTICLE_TYPE_MEDIA_SITE,
    ARTICLE_TYPE_MEDIA_TYPE_TREND,
    ARTICLE_TYPE_MEDIA_TYPE_BAR
  } from '@/service/common'

  import $ from 'jquery'

  export default {
    name: 'index',
    data () {
      let self = this
      return {
        newsListTabLoading: true,
        bbsListTabLoading: true,
        articlesLoading: false,
        emotionAnalysisChartLoading: true,
        mediaSiteChartLoading: true,
        mediaTypeTrendAnalysisLoading: true,
        mediaTypeBarAnalysisLoading: true,
        articles: [],
        articleListId: 'article-list',
        pager: {
          pageSize: 10,
          currentPage: 1,
          totalElements: 1
        },
        datePickerForm: {
          startDate: dateUtil.addDate(new Date(), 'M', -1),
          endDate: dateUtil.addDate(new Date(), 'd', 1)
        },
        newsTabData: {
          type: 'news',
          titleText: '新闻',
          sortBy: 'score',
          btnText: '更多 >>',
          articles: []
        },
        bbsTabData: {
          type: 'bbs',
          titleText: '论坛',
          sortBy: 'score',
          btnText: '更多 >>',
          articles: []
        },
        keywordsConfig: {},
        keywords: {},
        heightLightWords: '',
        articlesConditions: {},
        emotionAnalysisChartConfig: {
          chartId: 'emotion-chart',
          option: {},
          events: {
            'click': function (param) {
              self.articlesLoading = true
              self.articlesConditions = {}
              self.pager.currentPage = 1
              self.articlesConditions.startDate = dateUtil.formatDate(self.datePickerForm.startDate, 'yyyy-MM-dd')
              self.articlesConditions.endDate = dateUtil.formatDate(self.datePickerForm.endDate, 'yyyy-MM-dd')
              self.articlesConditions.searchKv = [{
                'key': 'nlp.sentiment.label',
                'value': typeUtil.encodeSentimentType(param.name)
              }]
              self.articlesConditions.type = ARTICLE_TYPE_EMOTION_CHART.split('@')
              self.getArticles()
            }
          }
        },
        mediaSiteChartConfig: {
          chartId: 'media-site-chart',
          option: {},
          events: {
            'click': function (param) {
              self.articlesLoading = true
              self.articlesConditions = {}
              self.pager.currentPage = 1
              self.articlesConditions.startDate = dateUtil.formatDate(self.datePickerForm.startDate, 'yyyy-MM-dd')
              self.articlesConditions.endDate = dateUtil.formatDate(self.datePickerForm.endDate, 'yyyy-MM-dd')
              self.articlesConditions.searchKv = [{'key': 'source', 'value': param.name}]
              self.articlesConditions.type = ARTICLE_TYPE_MEDIA_SITE.split('@')
              self.getArticles()
            }
          }
        },
        mediaTypeTrendAnalysisConfig: {
          chartId: 'media-type-trend-chart',
          option: {},
          events: {
            'click': function (param) {
              self.articlesLoading = true
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
        mediaTypeBarAnalysisConfig: {
          chartId: 'media-type-bar-chart',
          option: {},
          events: {
            'click': function (param) {
              self.articlesConditions = {}
              self.pager.currentPage = 1
              self.articlesConditions.startDate = self.getConditionDate('monthly').startDate
              self.articlesConditions.endDate = self.getConditionDate('monthly').endDate
              self.articlesConditions.type = [typeUtil.encodeArticleType(param.name)]
              self.getArticles()
            }
          }
        }
      }
    },
    components: {
      'date-picker': datePicker,
      'article-tab': articleTab,
      'pie-chart': pieChart,
      'line-bar-chart': lineBarChart,
      'article-list': articleList
    },
    created () {
      // set the default date time
      let self = this
      // get the keywords and the heightLightWords
      if (!localStorage.getItem('baseKeywords')) {
        let baseKeywordsParams = {type: 'BASIC'}
        getKeywords(baseKeywordsParams).then(baseKeywords => {
          self.keywordsConfig = baseKeywords
          localStorage.setItem('baseKeywords', JSON.stringify(baseKeywords))
        })
      } else {
        self.keywordsConfig = JSON.parse(localStorage.getItem('baseKeywords'))
      }
      if (self.keywordsConfig.mode === 'ADVANCED') {
        self.keywords = {expression: self.keywordsConfig.expression}
      } else {
        self.keywords = {
          mustWord: self.keywordsConfig.mustWord,
          shouldWord: self.keywordsConfig.shouldWord,
          mustNotWord: self.keywordsConfig.mustNotWord
        }
      }
      self.heightLightWords = utils.getHeightLightKeywords(self.keywordsConfig)
    },
    mounted () {
      this.renderPageData()
    },
    methods: {
      /**
       * 渲染页面数据
       */
      renderPageData () {
        this.articles = []
        this.getTabArticles('news')
        this.getTabArticles('bbs')
        this.getEmotionAnalysisChart()
        this.getMediaSiteChart()
        this.getMediaTypeTrendAnalysisChart('monthly')
        this.getMediaTypeBarAnalysisChart('monthly')
      },
      /**
       * 获取子组件的参数，进行相关的操作处理
       * @param data
       */
      getData (data) {
        let self = this
        switch (data.action) {
          case 'clickDatePickerSearch':
            self.datePickerForm = data.data
            self.renderPageData()
            break
          case 'sortByScore':
            if (data.data === 'news') {
              self.newsTabData.sortBy = 'score'
              self.newsListTabLoading = true
            } else if (data.data === 'bbs') {
              self.bbsTabData.sortBy = 'score'
              self.bbsListTabLoading = true
            }
            self.getTabArticles(data.data)
            break
          case 'sortByPubTime':
            if (data.data === 'news') {
              self.newsTabData.sortBy = 'pubTime'
              self.newsListTabLoading = true
            } else if (data.data === 'bbs') {
              self.bbsTabData.sortBy = 'pubTime'
              self.bbsListTabLoading = true
            }
            self.getTabArticles(data.data)
            break
          case 'clickArticleListPager':
            self.pager = data.data
            self.getArticles()
            break
          case 'showMoreArticle':
            self.pager.currentPage = 1
            self.articlesConditions.startDate = dateUtil.formatDate(self.datePickerForm.startDate, 'yyyy-MM-dd')
            self.articlesConditions.endDate = dateUtil.formatDate(self.datePickerForm.endDate, 'yyyy-MM-dd')
            self.articlesConditions.type = [data.data]
            self.articlesConditions.searchKv = []
            if (data.data === 'news') {
              self.articlesConditions.filed = 'title'
            } else if (data.data === 'bbs') {
              self.articlesConditions.filed = 'content'
            }
            if (data.sortBy === 'score') {
              self.articlesConditions.orders = []
            } else if (data.sortBy === 'pubTime') {
              self.articlesConditions.orders = [{direction: 'DESC', orderBy: 'pubTime'}]
            }
            self.getArticles()
            break
        }
      },

      /** 获取文章标题列表
       * @param type
       * 文章类型
       */
      getTabArticles (type) {
        let self = this
        let params = {
          date: {
            startDate: dateUtil.formatDate(self.datePickerForm.startDate, 'yyyy-MM-dd'),
            endDate: dateUtil.formatDate(self.datePickerForm.endDate, 'yyyy-MM-dd')
          },
          keyword: self.keywords,
          page: {
            limit: 10,
            orders: [],
            page: 1
          },
          type: [type]
        }
        if (type === 'news') {
          self.newsListTabLoading = true
          params.filed = 'title'
          if (self.newsTabData.sortBy === 'pubTime') {
            params.page.orders = [{direction: 'DESC', orderBy: 'pubTime'}]
          } else {
            params.page.orders = []
          }
        } else if (type === 'bbs') {
          self.bbsListTabLoading = true
          params.filed = ''
          if (self.bbsTabData.sortBy === 'pubTime') {
            params.page.orders = [{direction: 'DESC', orderBy: 'pubTime'}]
          } else {
            params.page.orders = []
          }
        }
        params.displayConfig = {heightLightWords: self.heightLightWords}
        getArticles(params).then(data => {
          if (type === 'news') {
            self.newsListTabLoading = false
            self.newsTabData.articles = data.content
          } else if (type === 'bbs') {
            self.bbsListTabLoading = false
            self.bbsTabData.articles = data.content
          }
        }).catch(error => {
          self.$confirm(error.message, '错误', {type: 'error'})
        })
      },
      /**
       * 获取情感分析正负面图
       */
      getEmotionAnalysisChart () {
        let self = this
        let params = {
          date: {
            startDate: dateUtil.formatDate(self.datePickerForm.startDate, 'yyyy-MM-dd'),
            endDate: dateUtil.formatDate(self.datePickerForm.endDate, 'yyyy-MM-dd')
          },
          keyword: self.keywords,
          groupName: 'nlp.sentiment.label',
          type: ARTICLE_TYPE_EMOTION_CHART.split('@')
        }
        getFilterAndGroupBy(params).then(data => {
          self.emotionAnalysisChartLoading = false
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
          self.emotionAnalysisChartConfig.option = pieChartOption.getOption(renderData, chartConfig)
        }).catch(error => {
          self.$confirm(error.message, '错误', {type: 'error'})
        })
      },
      /**
       * 主流媒体站点图，文章类型为‘new’
       */
      getMediaSiteChart () {
        let self = this
        let params = {
          date: {
            startDate: dateUtil.formatDate(self.datePickerForm.startDate, 'yyyy-MM-dd'),
            endDate: dateUtil.formatDate(self.datePickerForm.endDate, 'yyyy-MM-dd')
          },
          keyword: self.keywords,
          groupName: 'source',
          type: ARTICLE_TYPE_MEDIA_SITE.split('@')
        }
        getFilterAndGroupBy(params).then(data => {
          self.mediaSiteChartLoading = false
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
          self.mediaSiteChartConfig.option = barChartOption.getOption(renderData, chartConfig)
        }).catch(error => {
          self.$confirm(error.message, '错误', {type: 'error'})
        })
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
          keyword: self.keywords,
          groupName: 'type',
          type: ARTICLE_TYPE_MEDIA_TYPE_TREND.split('@')
        }
        let gapParams = {gap: conditionDate.gap, dateType: conditionDate.dateType}
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
       * 获取文章各载体类型数量分布图
       * @param type
       * 趋势时间段类型
       */
      getMediaTypeBarAnalysisChart (type) {
        let self = this
        let conditionDate = self.getConditionDate(type, false)
        let params = {
          date: {
            startDate: conditionDate.startDate,
            endDate: conditionDate.endDate
          },
          keyword: self.keywords,
          groupName: 'type',
          type: ARTICLE_TYPE_MEDIA_TYPE_BAR.split('@')
        }
        getFilterAndGroupBy(params).then(data => {
          self.mediaTypeBarAnalysisLoading = false
          let renderData = []
          let chartConfig = {
            legendData: {show: false},
            gridData: {top: '10%', bottom: '10%'},
            xAxisData: {type: 'value'},
            yAxisData: {type: 'category'}
          }
          let renderItem = {}
          renderItem.name = '数目'
          if (data.length > 0) {
            data.forEach(function (item) {
              item.name = typeUtil.articleType(item.key)
            })
          }
          data.reverse()
          renderItem.data = data
          renderData.push(renderItem)
          self.mediaTypeBarAnalysisConfig.option = barChartOption.getOption(renderData, chartConfig)
        }).catch(error => {
          self.$confirm(error.message, '错误', {type: 'error'})
        })
      },
      /**
       * 获取更多文章列表
       * @param deduplication
       * true or false, if the deduplication is true use the deduplication interface
       */
      getArticles (deduplication) {
        let self = this
        let {startDate, endDate, filed} = self.articlesConditions
        let params = {
          date: {
            startDate: startDate,
            endDate: endDate
          },
          keyword: self.keywords,
          page: {
            limit: self.pager.pageSize,
            page: self.pager.currentPage,
            orders: self.articlesConditions.orders
          },
          searchKv: self.articlesConditions.searchKv,
          type: self.articlesConditions.type
        }
        if (filed) {
          params.filed = filed
        }
        params.displayConfig = {sourceLength: 20, titleLength: 35, heightLightWords: self.heightLightWords}
        self.articlesLoading = true
        // 如果需要调用去重接口，deduplication值为true
        if (deduplication) {
          getDeduplicationArticles(params).then(data => {
            self.articlesLoading = false
            self.articles = data.content
            self.pager.totalElements = data.totalElements
          }).catch(error => {
            self.$confirm(error.message, '错误', {type: 'error'})
          })
        } else {
          getArticles(params).then(data => {
            self.articlesLoading = false
            self.articles = data.content
            self.pager.totalElements = data.totalElements
          }).catch(error => {
            self.$confirm(error.message, '错误', {type: 'error'})
          })
        }
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
        self.mediaTypeTrendAnalysisLoading = true
        self.getMediaTypeTrendAnalysisChart(trendTimesType)
      },
      /**
       * 点击文章各载体类型趋势图时，根据时间载体类型数量分布图
       * @param barTimesType
       * @param item
       */
      handleClickBarButton (barTimesType, item) {
        var self = this
        $('.buttons.mediaTypeBarChart').find('.el-tabs__item').removeClass('is-active')
        $(item.currentTarget).addClass('is-active')
        self.mediaTypeBarAnalysisLoading = true
        self.getMediaTypeBarAnalysisChart(barTimesType)
      },

      /**
       * 通过选择的时间返回趋势图条件
       * @param timeType
       * @param isTrendChart
       * @returns {{}}
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
            endDate = dateUtil.formatDate(self.datePickerForm.endDate, 'yyyy-MM-dd')
            startDate = dateUtil.formatDate(self.datePickerForm.startDate, 'yyyy-MM-dd')
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
      }
    },
    watch: {
      articles: function (val, oldVal) {
        var self = this
        if (val.length > 0) {
          self.$nextTick(function () {
            // DOM 现在更新了
            // `this` 绑定到当前实例
            // 页面滚动到指定位置
            $('section').animate({scrollTop: 1420}, 500)
          })
        }
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .news-list-tab {
    height: 510px;
  }
</style>
