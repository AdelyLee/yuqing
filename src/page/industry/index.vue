<template>
  <div id="industryYuqing">
    <div class="card-body" id="contents">
      <div class="buttons mediaTypeTrendChart">
        <div class="el-tabs__header">
          <div class="el-tabs__nav-wrap">
            <div class="el-tabs__nav-scroll">
              <div class="el-tabs__nav">
                <div class="el-tabs__item is-active"
                     @click="handleClickTrendButton('COLLIERY', $event)"><span>
                                                             煤矿</span></div>
                <div class="el-tabs__item"
                     @click="handleClickTrendButton('NONCOAL', $event)"><span>
                                                            金属非金属</span></div>
                <div class="el-tabs__item"
                     @click="handleClickTrendButton('CHEMICALS', $event)"><span>
                                                            危险化学品</span></div>
                <div class="el-tabs__item"
                     @click="handleClickTrendButton('BUSINESS', $event)"><span>
                                                            工商贸</span></div>
                <div class="el-tabs__item"
                     @click="handleClickTrendButton('FIREWORKS', $event)"><span>
                                                            烟花爆竹</span></div>
                <div class="el-tabs__item"
                     @click="handleClickTrendButton('BUILDINGS', $event)"><span>
                                                            建筑</span></div>
                <div class="el-tabs__item"
                     @click="handleClickTrendButton('TRANSPORTATION', $event)"><span>
                                                            交通运输</span></div>
                <div class="el-tabs__item"
                     @click="handleClickTrendButton('OTHERS', $event)"><span>
                                                            其他</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <el-row :gutter="15">
        <date-picker :datePickerForm="datePickerForm" @data="getData"></date-picker>
      </el-row>
      <el-row :gutter="15">
        <el-col :span="12" v-loading="newsListTabLoading">
          <div class="news-list-tab">
            <article-tab v-if="newsTabData.articles.length > 0" :articleData="newsTabData" @data="getData"></article-tab>
          </div>
        </el-col>
        <el-col :span="12" v-loading="bbsListTabLoading">
          <div class="news-list-tab">
            <article-tab v-if="bbsTabData.articles.length > 0" :articleData="bbsTabData" @data="getData"></article-tab>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="15">
        <el-col :span="12">
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
        <el-col :span="12">
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
        <el-col :span="24" v-loading="articlesLoading">
          <article-list v-if="articles.length > 0" :id="articleListId" :articles="articles" :pager="pager"
                        @data="getData"></article-list>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import datePicker from '@/components/common/date-picker'
  import articleTab from '@/components/common/article-tab-list'
  import articleList from '@/components/common/articles'
  import pieChart from '@/components/common/charts/pie'
  import lineBarChart from '@/components/common/charts/line-bar'
  import {pieChartOption} from '@/components/common/options/pie-chart'
  import {barChartOption} from '@/components/common/options/bar-chart'
  import {typeUtil} from '@/utils/typeUtil'
  import {dateUtil} from '@/utils/dateUtil'
  import {utils} from '@/utils/utils'
  import {getKeywords} from '@/service/config'
  import {
    getDeduplicationArticles,
    getArticles,
    getFilterAndGroupBy
  } from '@/service/article'
  import {
    ARTICLE_TYPE_EMOTION_CHART,
    ARTICLE_TYPE_MEDIA_SITE
  } from '@/service/common'

  import $ from 'jquery'
  export default {
    name: 'industry',
    data () {
      let self = this
      return {
        activeName: 'mk',
        newsListTabLoading: true,
        bbsListTabLoading: true,
        articlesLoading: false,
        emotionAnalysisChartLoading: true,
        mediaSiteChartLoading: true,
        articles: [],
        articleListId: 'article-list',
        pager: {
          pageSize: 10,
          currentPage: 1,
          totalElements: 1
        },
        datePickerForm: {},
        newsTabData: {
          type: 'news',
          titleText: '最新新闻',
          sortBy: 'score',
          btnText: '更多 >>',
          articles: []
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
      let date = new Date()
      self.datePickerForm.startDate = dateUtil.addDate(date, 'M', -1)
      self.datePickerForm.endDate = dateUtil.addDate(date, 'd', 1)
    },
    mounted () {
      let self = this
      self.getIndustryKeyword('COLLIERY')
    },
    methods: {
      /**
       * 渲染页面数据
       */
      getIndustryKeyword (types) {
        let self = this
        // get the keywords and the heightLightWords
        let industryKeywordsParams = {type: types}
        getKeywords(industryKeywordsParams).then(data => {
          self.keywordsConfig = data
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
          self.getTabArticles('news')
          self.getTabArticles('bbs')
          self.getEmotionAnalysisChart()
          self.getMediaSiteChart()
        }).catch(error => {
          self.$confirm(error.message, '错误', {type: 'error'})
        })
      },
      getData (data) {
        let self = this
        switch (data.action) {
          case 'clickDatePickerSearch':
            self.datePickerForm = data.data
            self.getTabArticles('news')
            self.getTabArticles('bbs')
            self.getEmotionAnalysisChart()
            self.getMediaSiteChart()
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
      handleClickTrendButton: function (trendTimesType, item) {
        let self = this
        $('.buttons.mediaTypeTrendChart').find('.el-tabs__item').removeClass('is-active')
        $(item.currentTarget).addClass('is-active')
        self.newsListTabLoading = true
        self.bbsListTabLoading = true
        self.emotionAnalysisChartLoading = true
        self.mediaSiteChartLoading = true
        self.getIndustryKeyword(trendTimesType)
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
            $('section').animate({scrollTop: 1200}, 500)
          })
        }
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss">
  .news-list-tab {
    height: 510px;
  }
  .el-tabs__header{
    border-bottom: none;
    margin-bottom: 10px;
  }
</style>
