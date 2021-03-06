<template>
  <div id="latest-bbs">
    <el-col :span="24">
      <div class="card-body">
        <el-row :gutter="15">
          <date-picker :datePickerForm="datePickerForm" @data="getData"></date-picker>
        </el-row>
        <el-row :gutter="15">
          <el-col :span="24" v-loading="bbsListTabLoading">
            <div class="news-list-tab">
              <article-tab v-if="bbsTabData.articles.length > 0" :articleData="bbsTabData"
                           @data="getData"></article-tab>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="15">
          <el-col :span="12">
            <el-card class="box-card" :body-style="{ padding: '0px' }">
              <div slot="header" class="chart-header">
                <span class="iconfont icon-emotion"></span><span class="chart-text">舆情情感分析</span>
              </div>
              <el-col :span="24" v-loading="emotionAnalysisChartLoading">
                <pie-chart :chartConfig="emotionAnalysisChartConfig"></pie-chart>
              </el-col>
            </el-card>
          </el-col>
          <el-col :span="12" class="lists">
            <el-card class="box-card" :body-style="{ padding: '0px' }">
              <div slot="header" class="chart-header">
                <span class="iconfont icon-ciyun"></span><span class="chart-text">热点词云</span>
              </div>
              <el-col :span="24" v-loading="hotKeywordsChartLoading">
                <keywords-chart :chartConfig="hotKeywordsChartConfig"></keywords-chart>
              </el-col>
            </el-card>
          </el-col>
        </el-row>
        <el-row :gutter="15">
          <el-col :span="24">
            <el-card class="box-card" :body-style="{ padding: '0px' }">
              <div slot="header" class="chart-header">
                <span class="iconfont icon-trendLine"></span><span class="chart-text">载体趋势分析</span>
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
  import keywordsChart from '@/components/common/charts/keywords-cloud'
  import {pieChartOption} from '@/components/common/options/pie-chart'
  import {lineChartOption} from '@/components/common/options/line-chart'
  import {typeUtil} from '@/utils/typeUtil'
  import {dateUtil} from '@/utils/dateUtil'
  import {utils} from '@/utils/utils'
  import {getKeywords} from '@/service/config'
  import {
    getDeduplicationArticles,
    getArticles,
    getFilterAndGroupBy,
    getHotWords,
    getFilterAndGroupByTime
  } from '@/service/article'
  import {ARTICLE_TYPE_FOR_BBS} from '@/service/common'

  import $ from 'jquery'

  export default {
    name: 'latestBbs',
    data () {
      let self = this
      return {
        bbsListTabLoading: true,
        articlesLoading: false,
        emotionAnalysisChartLoading: true,
        hotKeywordsChartLoading: true,
        mediaTypeTrendAnalysisLoading: true,
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
        bbsTabData: {
          type: 'bbs',
          titleText: '最新论坛',
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
              self.articlesConditions = {}
              self.pager.currentPage = 1
              self.articlesConditions.startDate = dateUtil.formatDate(self.datePickerForm.startDate, 'yyyy-MM-dd')
              self.articlesConditions.endDate = dateUtil.formatDate(self.datePickerForm.endDate, 'yyyy-MM-dd')
              self.articlesConditions.searchKv = [{
                'key': 'nlp.sentiment.label',
                'value': typeUtil.encodeSentimentType(param.name)
              }]
              self.articlesConditions.type = ARTICLE_TYPE_FOR_BBS.split('@')
              self.getArticles()
            }
          }
        },
        hotKeywordsChartConfig: {
          chartId: 'hot-keywords-chart',
          option: {},
          events: {
            'click': function (param) {
            }
          }
        },
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
        }
      }
    },
    components: {
      'date-picker': datePicker,
      'article-tab': articleTab,
      'pie-chart': pieChart,
      'line-bar-chart': lineBarChart,
      'keywords-chart': keywordsChart,
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
        this.getTabArticles('bbs')
        this.getEmotionAnalysisChart()
        this.getHotKeywordsChart()
        this.getMediaTypeTrendAnalysisChart('customTime')
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
            self.bbsTabData.sortBy = 'score'
            self.getTabArticles(data.data)
            break
          case 'sortByPubTime':
            self.bbsTabData.sortBy = 'pubTime'
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
            self.articlesConditions.filed = 'title'
            if (data.sortBy === 'score') {
              self.articlesConditions.orders = []
            } else if (data.sortBy === 'pubTime') {
              self.articlesConditions.orders = [{direction: 'DESC', orderBy: 'pubTime'}]
            }
            self.getArticles(true)
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
        params.filed = 'content'
        if (self.bbsTabData.sortBy === 'pubTime') {
          params.page.orders = [{direction: 'DESC', orderBy: 'pubTime'}]
        } else {
          params.page.orders = []
        }
        params.displayConfig = {sourceLength: 20, titleLength: 35, heightLightWords: self.heightLightWords}
        self.bbsListTabLoading = true
        getDeduplicationArticles(params).then(data => {
          self.bbsListTabLoading = false
          self.bbsTabData.articles = data.content
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
          type: ARTICLE_TYPE_FOR_BBS.split('@')
        }
        self.emotionAnalysisChartLoading = true
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
       * 根据条件获取关键词云
       */
      getHotKeywordsChart () {
        let self = this
        let params = {
          date: {
            startDate: dateUtil.formatDate(self.datePickerForm.startDate, 'yyyy-MM-dd'),
            endDate: dateUtil.formatDate(self.datePickerForm.endDate, 'yyyy-MM-dd')
          },
          page: {limit: 50},
          keyword: self.keywords,
          type: ARTICLE_TYPE_FOR_BBS.split('@')
        }
        self.hotKeywordsChartLoading = true
        getHotWords(params).then(data => {
          self.hotKeywordsChartLoading = false
          let option = {data: []}
          if (data.length > 0) {
            data.forEach(function (word) {
              let obj = {}
              obj.keyword = word.key
              obj.score = word.value
              option.data.push(obj)
            })
          }
          self.hotKeywordsChartConfig.option = option
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
          type: ARTICLE_TYPE_FOR_BBS.split('@')
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
            $('section').animate({scrollTop: 1370}, 500)
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
