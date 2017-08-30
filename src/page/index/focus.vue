<template>
  <div id="focus">
    <el-col :span="24">
      <div class="card-body">
        <el-row :gutter="15">
          <date-picker :datePickerForm="datePickerForm" @data="getData"></date-picker>
        </el-row>
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
              <el-col :span="24" v-loading="emotionAnalysisChartLoading">
                <pie-chart :chartConfig="emotionAnalysisChartConfig"></pie-chart>
              </el-col>
            </el-card>
          </el-col>
          <el-col :span="12" class="lists">
            <el-card class="box-card" :body-style="{ padding: '0px' }">
              <div slot="header" class="chart-header">
                <span class="iconfont icon-ciyun"></span><span
                class="chart-text">热点词云</span>
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
                <span class="iconfont icon-trendLine"></span><span
                class="chart-text">载体趋势分析</span>
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
    getFocusArticles,
    getDeduplicationArticles,
    getArticles,
    getFilterAndGroupBy,
    getHotWords,
    getFilterAndGroupByTime
  } from '@/service/article'
  import {
    ARTICLE_TYPE_EMOTION_CHART,
    ARTICLE_TYPE_MEDIA_TYPE_HOT_WORDS,
    ARTICLE_TYPE_MEDIA_TYPE_TREND
  } from '@/service/common'

  import $ from 'jquery'

  export default {
    name: 'focus',
    data () {
      let self = this
      return {
        newsListTabLoading: true,
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
        newsTabData: {
          type: 'news',
          titleText: '焦点报道',
          sortBy: 'score',
          btnText: '更多 >>',
          articles: [],
          pager: {
            pageSize: 10,
            currentPage: 1,
            totalElements: 10
          }
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
      if (!localStorage.getItem('focusKeywords')) {
        let focusKeywordsParams = {type: 'FOCUS'}
        getKeywords(focusKeywordsParams).then(focusKeywords => {
          self.keywordsConfig = focusKeywords
          localStorage.setItem('focusKeywords', JSON.stringify(focusKeywords))
        })
      } else {
        self.keywordsConfig = JSON.parse(localStorage.getItem('focusKeywords'))
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
       * 点击焦点列表分页
       */
      handleCurrentChange: function (currentPage) {
        let self = this
        self.newsTabData.pager.currentPage = currentPage
        self.getTabArticles('news')
      },
      /**
       * 渲染页面数据
       */
      renderPageData () {
        this.articles = []
        this.newsTabData.pager.currentPage = 1
        this.getTabArticles('news')
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
          case 'clickArticleListPager':
            self.pager = data.data
            self.getArticles()
            break
          case 'clickSimilarArticleList':
            self.pager.currentPage = 1
            self.articlesConditions.searchKv = data.searchKv
            self.articlesConditions.startDate = dateUtil.formatDate(self.datePickerForm.startDate, 'yyyy-MM-dd')
            self.articlesConditions.endDate = dateUtil.formatDate(self.datePickerForm.endDate, 'yyyy-MM-dd')
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
            limit: self.newsTabData.pager.pageSize,
            orders: [],
            page: self.newsTabData.pager.currentPage
          },
          type: [type]
        }
        if (type === 'news') {
          params.filed = 'title'
          params.page.orders = []
        }
        params.displayConfig = {sourceLength: 20, titleLength: 35, heightLightWords: self.heightLightWords}
        self.newsListTabLoading = true
        getFocusArticles(params).then(data => {
          if (type === 'news') {
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
          }
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
          type: ARTICLE_TYPE_MEDIA_TYPE_HOT_WORDS.split('@')
        }
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
            $('section').animate({scrollTop: 1400}, 500)
          })
        }
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .news-list-tab {
    height: 500px;
  }
</style>
