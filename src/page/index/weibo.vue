<template>
  <div id="weibo">
    <el-col :span="24">
      <div class="card-body">
        <el-row :gutter="15">
          <date-picker :datePickerForm="datePickerForm" @data="getData"></date-picker>
        </el-row>
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="微博分析" name="weiboA">
            <el-row :gutter="15">
              <el-col :span="24" v-loading="newsListTabLoading">
                <div class="news-list-tab">
                  <article-tab v-if="newsTabData.articles.length > 0" :articleData="newsTabData"
                               @data="getData"></article-tab>
                </div>
              </el-col>
            </el-row>
            <el-row :gutter="15">
              <el-col :span="8">
                <el-card class="box-card" :body-style="{ padding: '0px' }">
                  <div slot="header" class="chart-header">
                    <div class="chart-header-focus"></div>
                    <span class="iconfont icon-emotion"></span><span
                    class="chart-text">舆情情感分析</span>
                  </div>
                  <el-col :span="24" v-loading="emotionAnalysisChartLoading">
                    <pie-chart :chartConfig="emotionAnalysisChartConfig"></pie-chart>
                  </el-col>
                </el-card>
              </el-col>
              <el-col :span="8" class="lists">
                <el-card class="box-card" :body-style="{ padding: '0px' }">
                  <div slot="header" class="chart-header">
                    <span class="iconfont icon-trendLine"></span><span class="chart-text">趋势图</span>
                  </div>
                  <el-col :span="24" v-loading="mediaTypeTrendAnalysisLoading">
                    <line-bar-chart :chartConfig="mediaTypeTrendAnalysisConfig"></line-bar-chart>
                  </el-col>
                </el-card>
              </el-col>
              <el-col :span="8">
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
              <el-col :span="15" class="lists">
                <el-card class="box-card" :body-style="{ padding: '0px' }">
                  <div slot="header" class="chart-header">
                    <span class="iconfont icon-weiboSource"></span><span
                    class="chart-text">微博来源分布</span>
                  </div>
                  <el-col :span="24" v-loading="mediaBarLoading">
                    <line-bar-chart :chartConfig="mediaBarChart"></line-bar-chart>
                  </el-col>
                </el-card>
              </el-col>
              <el-col :span="9" class="lists">
                <el-card class="box-card" :body-style="{ padding: '0px' }">
                  <div slot="header" class="chart-header">
                    <span class="iconfont icon-forward"></span><span
                    class="chart-text">原微博转发微博占比</span>
                  </div>
                  <el-col :span="24" v-loading="weiboProportionLoading">
                    <pie-chart :chartConfig="weiboProportionChart"></pie-chart>
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
          </el-tab-pane>
          <el-tab-pane label="用户分析" name="userA">
            <el-row :gutter="15">
              <el-col :span="24" class="lists">
                <el-card class="box-card" :body-style="{ padding: '0px' }">
                  <div slot="header" class="chart-header">
                    <span class="iconfont icon-areaAccident"></span>
                    <span class="chart-text">地域分布</span>
                  </div>
                  <el-col :span="10">
                    <map-chart :chartConfig="mapregionDistributionChart" v-loading="mapregionDistributionLoading"></map-chart>
                  </el-col>
                  <el-col :span="14">
                    <line-bar-chart :chartConfig="regionDistributionChart" v-loading="regionDistributionLoading"></line-bar-chart>
                  </el-col>
                </el-card>
              </el-col>
            </el-row>
            <el-row :gutter="15">
              <el-col :span="14" class="lists">
                <el-card class="box-card" :body-style="{ padding: '0px' }">
                  <div slot="header" class="chart-header"">
                    <span class="iconfont icon-device"></span>
                    <span class="chart-text">发布设备分布</span>
                  </div>
                  <pie-chart :chartConfig="publishingEquipmentChart" v-loading="publishingEquipmentLoading"></pie-chart>
                </el-card>
              </el-col>
              <el-col :span="10" class="lists">
                <el-card class="box-card" :body-style="{ padding: '0px' }">
                  <div slot="header" class="chart-header">
                    <span class="iconfont icon-weiboForward"></span>
                    <span class="chart-text">微博认证占比</span>
                  </div>
                  <pie-chart :chartConfig="weiboAuthenticationChart" v-loading="weiboAuthenticationLoading"></pie-chart>
                </el-card>
              </el-col>
            </el-row>
            <el-row :gutter="15">
              <el-col :span="12" class="lists" v-loading="genderProportionLoading">
                <el-card class="box-card" :body-style="{ padding: '0px' }">
                  <div slot="header" class="chart-header">
                    <span class="iconfont icon-MFmaleRatio"></span>
                    <span class="chart-text">男女比例</span>
                  </div>
                  <el-col :span="4">
                    <div v-for="item in gender">
                      <el-row v-if="item.key ==='2'">
                        <div class="gender gender-img"></div>
                        <div class="gender-fb">
                          <p>女性</p>
                          <p class="gender-text" id="emale">{{item.value}}</p>
                        </div>
                      </el-row>
                      <el-row v-if="item.key ==='1'">
                        <div class="gendermale gendermale-img"></div>
                        <div class="gendermale-fb">
                          <p>男性</p>
                          <p class="gender-text" id="male">{{item.value}}</p>
                        </div>
                      </el-row>
                    </div>
                  </el-col>
                  <el-col :span="20">
                    <pie-chart :chartConfig="genderProportionChart"></pie-chart>
                  </el-col>
                </el-card>
              </el-col>
              <!--<el-col :span="12" class="lists">-->
              <!--<el-card class="box-card" :body-style="{ padding: '0px' }">-->
              <!--<div slot="header" class="clearfix">-->
              <!--<span class="chart-text">年龄段分布</span>-->
              <!--</div>-->
              <!--<bar-chart :chartConfig="ageDistributionChart" v-loading="ageDistributionLoading"></bar-chart>-->
              <!--</el-card>-->
              <!--</el-col>-->
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="热点微博" name="hotWeiboA">
            <hot-news :hotWeiboData="hotWeibo" v-loading="weiboListsLoading"></hot-news>
            <list-page :pager="pager" @data="getPager"></list-page>
          </el-tab-pane>
          <!--<el-tab-pane label="意见领袖" name="OpinionA">-->
          <!--<hot-opinions></hot-opinions>-->
          <!--</el-tab-pane>-->
        </el-tabs>
      </div>
    </el-col>
  </div>
</template>

<script type="text/ecmascript-6">
  import datePicker from '@/components/common/date-picker'
  import articleTab from '@/components/common/article-tab-list'
  import articleList from '@/components/common/articles'
  import pieChart from '@/components/common/charts/pie'
  import MapChart from '@/components/common/charts/map'
  import lineBarChart from '@/components/common/charts/line-bar'
  import keywordsChart from '@/components/common/charts/keywords-cloud'
  import {pieChartOption} from '@/components/common/options/pie-chart'
  import {lineChartOption} from '@/components/common/options/line-chart'
  import {barChartOption} from '@/components/common/options/bar-chart'
  import Pager from '@/components/common/pager'
  import {mapChartOption} from '@/components/common/options/map-chart'
  import HotNew from '@/components/common/hotNews'
  import HotOpinions from '@/components/common/hotOpinion'
  import {typeUtil} from '@/utils/typeUtil'
  import {dateUtil} from '@/utils/dateUtil'
  import {utils} from '@/utils/utils'
  import {getKeywords} from '@/service/config'
  import {
    getDeduplicationArticles,
    getArticles,
    getFilterAndGroupBy,
    getHotWords,
    getFilterAndGroupByTime,
    getWeiboFilterAndGroupBy,
    getHotWeibo
  } from '@/service/article'
  import {ARTICLE_TYPE_FOR_WEIBO} from '@/service/common'

  import $ from 'jquery'

  export default {
    name: 'weibo',
    data () {
      let self = this
      return {
        activeName: 'weiboA',
        newsListTabLoading: true,
        articlesLoading: false,
        emotionAnalysisChartLoading: true,
        hotKeywordsChartLoading: true,
        mediaTypeTrendAnalysisLoading: true,
        weiboProportionLoading: true,
        mediaBarLoading: true,
        weiboListsLoading: true,
        mapregionDistributionLoading: true,
        regionDistributionLoading: true,
        publishingEquipmentLoading: true,
        weiboAuthenticationLoading: true,
        genderProportionLoading: true,
        ageDistributionLoading: true,
        articles: [],
        articleListId: 'article-list',
        pager: {
          pageSize: 10,
          currentPage: 1,
          totalElements: 1
        },
        articleType: '',
        datePickerForm: {
          startDate: dateUtil.addDate(new Date(), 'M', -1),
          endDate: dateUtil.addDate(new Date(), 'd', 1)
        },
        newsTabData: {
          type: 'weibo',
          titleText: '热议微博',
          sortBy: 'score',
          btnText: '更多 >>',
          articles: []
        },
        keywordsConfig: {},
        keywords: {},
        heightLightWords: '',
        articlesConditions: {},
        hotWeibo: [],
        handleCollect: [],
        searchForm: {
          startDate: '',
          endDate: '',
          page: {
            'limit': 10,
            'page': 1,
            'orders': []
          }
        },
        gender: [],
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
              self.articlesConditions.type = ARTICLE_TYPE_FOR_WEIBO.split('@')
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
        },
        weiboProportionChart: {
          chartId: 'weiboProportionChart',
          option: {},
          events: {
            'click': function (param) {
              self.articlesConditions = {}
              self.pager.currentPage = 1
              self.articlesConditions.startDate = dateUtil.formatDate(self.datePickerForm.startDate, 'yyyy-MM-dd')
              self.articlesConditions.endDate = dateUtil.formatDate(self.datePickerForm.endDate, 'yyyy-MM-dd')
              self.articlesConditions.searchKv = [{
                'key': 'foward',
                'value': typeUtil.encodeWeiboType(param.name)
              }]
              self.articlesConditions.type = ARTICLE_TYPE_FOR_WEIBO.split('@')
              self.getArticles()
            }
          }
        },
        mediaBarChart: {
          chartId: 'media-bar-chart',
          option: {},
          events: {
            'click': function (param) {
              self.articlesConditions = {}
              self.pager.currentPage = 1
              self.articlesConditions.startDate = dateUtil.formatDate(self.datePickerForm.startDate, 'yyyy-MM-dd')
              self.articlesConditions.endDate = dateUtil.formatDate(self.datePickerForm.endDate, 'yyyy-MM-dd')
              self.articlesConditions.searchKv = [{
                'key': 'author',
                'value': param.name
              }]
              self.articlesConditions.type = ARTICLE_TYPE_FOR_WEIBO.split('@')
              self.getArticles()
            }
          }
        },
        mapregionDistributionChart: {
          chartId: 'mapregionDistributionChart',
          option: {},
          events: {
            'click': function (param) {
              self.articlesConditions = {}
              self.pager.currentPage = 1
              self.articlesConditions.startDate = dateUtil.formatDate(self.datePickerForm.startDate, 'yyyy-MM-dd')
              self.articlesConditions.endDate = dateUtil.formatDate(self.datePickerForm.endDate, 'yyyy-MM-dd')
              self.articlesConditions.searchKv = [{
                'key': 'location',
                'value': param.name
              }]
              self.articlesConditions.type = ARTICLE_TYPE_FOR_WEIBO.split('@')
              self.getArticles()
            }
          }
        },
        regionDistributionChart: {
          chartId: 'regionDistributionChart',
          option: {},
          events: {
            'click': function (param) {
              self.articlesConditions = {}
              self.pager.currentPage = 1
              self.articlesConditions.startDate = dateUtil.formatDate(self.datePickerForm.startDate, 'yyyy-MM-dd')
              self.articlesConditions.endDate = dateUtil.formatDate(self.datePickerForm.endDate, 'yyyy-MM-dd')
              self.articlesConditions.searchKv = [{
                'key': 'location',
                'value': param.name
              }]
              self.articlesConditions.type = ARTICLE_TYPE_FOR_WEIBO.split('@')
              self.getArticles()
            }
          }
        },
        publishingEquipmentChart: {
          chartId: 'publishingEquipmentChart',
          option: {},
          events: {
            'click': function (param) {
              self.articlesConditions = {}
              self.pager.currentPage = 1
              self.articlesConditions.startDate = dateUtil.formatDate(self.datePickerForm.startDate, 'yyyy-MM-dd')
              self.articlesConditions.endDate = dateUtil.formatDate(self.datePickerForm.endDate, 'yyyy-MM-dd')
              self.articlesConditions.searchKv = [{
                'key': 'dev',
                'value': param.name
              }]
              self.articlesConditions.type = ARTICLE_TYPE_FOR_WEIBO.split('@')
              self.getArticles()
            }
          }
        },
        weiboAuthenticationChart: {
          chartId: 'weiboAuthenticationChart',
          option: {},
          events: {
            'click': function (param) {
              self.articlesConditions = {}
              self.pager.currentPage = 1
              self.articlesConditions.startDate = dateUtil.formatDate(self.datePickerForm.startDate, 'yyyy-MM-dd')
              self.articlesConditions.endDate = dateUtil.formatDate(self.datePickerForm.endDate, 'yyyy-MM-dd')
              self.articlesConditions.searchKv = [{
                'key': 'verifyType',
                'value': typeUtil.encodeVerifyType(param.name)
              }]
              self.articlesConditions.type = ARTICLE_TYPE_FOR_WEIBO.split('@')
              self.getArticles()
            }
          }
        },
        genderProportionChart: {
          chartId: 'genderProportionChart',
          option: {},
          events: {
            'click': function (param) {
              self.articlesConditions = {}
              self.pager.currentPage = 1
              self.articlesConditions.startDate = dateUtil.formatDate(self.datePickerForm.startDate, 'yyyy-MM-dd')
              self.articlesConditions.endDate = dateUtil.formatDate(self.datePickerForm.endDate, 'yyyy-MM-dd')
              self.articlesConditions.searchKv = [{
                'key': 'gender',
                'value': typeUtil.encodeGender(param.name)
              }]
              self.articlesConditions.type = ARTICLE_TYPE_FOR_WEIBO.split('@')
              self.getArticles()
            }
          }
        },
        ageDistributionChart: {
          chartId: 'ageDistributionChart',
          option: {},
          events: {
            'click': function (param) {

            }
          }
        }
      }
    },
    components: {
      'date-picker': datePicker,
      'article-tab': articleTab,
      'pie-chart': pieChart,
      'map-chart': MapChart,
      'line-bar-chart': lineBarChart,
      'keywords-chart': keywordsChart,
      'article-list': articleList,
      'hot-news': HotNew,
      'hot-opinions': HotOpinions,
      'list-page': Pager
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
        this.getTabArticles('weibo')
        this.getEmotionAnalysisChart()
        this.getHotKeywordsChart()
        this.getMediaTypeTrendAnalysisChart('customTime')
        this.getHotSourceBarChart()
        this.getWeiboProportionChart()
      },
      handleClick(tab, event) {
        switch (tab.name) {
          case 'weiboA':
            this.articles = []
            this.getTabArticles('weibo')
            this.getEmotionAnalysisChart()
            this.getHotKeywordsChart()
            this.getMediaTypeTrendAnalysisChart('customTime')
            this.getHotSourceBarChart()
            this.getWeiboProportionChart()
            break
          case 'userA':
            this.articles = []
            this.getregionDistributionChart()
            this.getpublishingEquipmentChart()
            this.getweiboAuthenticationChart()
            this.getgenderProportionChart()
//            this.getageDistributionChart()
            break
          case 'hotWeiboA':
            this.articles = []
            this.getHotWeibo()
            break
        }
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
            self.newsTabData.sortBy = 'score'
            self.newsListTabLoading = true
            self.getTabArticles(data.data)
            break
          case 'sortByPubTime':
            self.newsTabData.sortBy = 'pubTime'
            self.newsListTabLoading = true
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
            self.getArticles()
            break
        }
      },
      getPager: function (data) {
        var self = this
        self.pager.currentPage = data.data.currentPage
        self.getHotWeibo()
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
        if (self.newsTabData.sortBy === 'pubTime') {
          params.page.orders = [{direction: 'DESC', orderBy: 'pubTime'}]
        } else {
          params.page.orders = []
        }
        params.displayConfig = {sourceLength: 20, titleLength: 35, heightLightWords: self.heightLightWords}
        getArticles(params).then(data => {
          self.newsListTabLoading = false
          self.newsTabData.articles = data.content
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
          type: ARTICLE_TYPE_FOR_WEIBO.split('@')
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
          type: ARTICLE_TYPE_FOR_WEIBO.split('@')
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
          type: ARTICLE_TYPE_FOR_WEIBO.split('@')
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
       * 微博来源分布
       */
      getHotSourceBarChart () {
        let self = this
        let params = {
          'date': {
            startDate: dateUtil.formatDate(self.datePickerForm.startDate, 'yyyy-MM-dd'),
            endDate: dateUtil.formatDate(self.datePickerForm.endDate, 'yyyy-MM-dd')
          },
          'keyword': self.keywords,
          'groupName': 'author',
          'type': ARTICLE_TYPE_FOR_WEIBO.split('@')
        }
        getFilterAndGroupBy(params).then(data => {
          self.mediaBarLoading = false
          let seriesData = []
          let chartConfig = {legendData: {show: false}, xAxisData: {axisLabel: {rotate: 45}}}
          let renderItem = {}
          renderItem.name = '数目'
          if (data.length > 0) {
            data.forEach(function (item) {
              item.name = item.key
            })
          }
          renderItem.data = data
          seriesData.push(renderItem)
          self.mediaBarChart.option = barChartOption.getOption(seriesData, chartConfig)
        }).catch(error => {
          self.$confirm(error.message, '错误', {type: 'error'})
        })
      },
      /**
       * 微博占比
       */
      getWeiboProportionChart () {
        let self = this
        let params = {
          date: {
            startDate: dateUtil.formatDate(self.datePickerForm.startDate, 'yyyy-MM-dd'),
            endDate: dateUtil.formatDate(self.datePickerForm.endDate, 'yyyy-MM-dd')
          },
          keyword: self.keywords,
          groupName: 'foward',
          type: ARTICLE_TYPE_FOR_WEIBO.split('@')
        }
        getFilterAndGroupBy(params).then(data => {
          self.weiboProportionLoading = false
          let renderData = []
          let renderItem = {}
          renderItem.name = '原微博转发微博占比'
          if (data.length > 0) {
            data.forEach(function (item) {
              item.name = typeUtil.weiboType(item.key)
            })
          }
          renderItem.data = data
          renderData.push(renderItem)
          let chartConfig = {pieForEmotion: true}
          self.weiboProportionChart.option = pieChartOption.getOption(renderData, chartConfig)
        }).catch(error => {
          self.$confirm(error.message, '错误', {type: 'error'})
        })
      },
      /**
       * 用户分析图表
       */
      getregionDistributionChart () {
        let self = this
        let params = {
          'date': {
            startDate: dateUtil.formatDate(self.datePickerForm.startDate, 'yyyy-MM-dd'),
            endDate: dateUtil.formatDate(self.datePickerForm.endDate, 'yyyy-MM-dd')
          },
          'keyword': self.keywords,
          'groupName': 'location',
          'page': {
            'limit': 10
          },
          'type': ARTICLE_TYPE_FOR_WEIBO.split('@')
        }
        getWeiboFilterAndGroupBy(params).then(data => {
          self.regionDistributionLoading = false
          self.mapregionDistributionLoading = false
          let seriesData = []
          let chartConfig = {legendData: {show: false}, xAxisData: {axisLabel: {rotate: 45}}}
          let renderItem = {}
          let maxCount = 0
          maxCount = seriesData[0] === undefined ? 10 : seriesData[0].value
          let chartConfigMap = {legendData: {show: false}, visualMap: {min: 0, max: maxCount, left: 'left', top: 'bottom', text: ['高', '低'], calculable: true, inRange: {color: ['#B7EEEB', '#FEFDC7', '#FCC171', '#F27449', '#DB3B29']}}}         // 文本，默认为数值文本
          renderItem.name = '数目'
          if (data.length > 0) {
            data.forEach(function (item) {
              item.name = item.key
            })
          }
          renderItem.data = data
          seriesData.push(renderItem)
          self.regionDistributionChart.option = barChartOption.getOption(seriesData, chartConfig)
          self.mapregionDistributionChart.option = mapChartOption.getOption(seriesData, chartConfigMap)
        }).catch(error => {
          self.$confirm(error.message, '错误', {type: 'error'})
        })
      },
      getpublishingEquipmentChart () {
        let self = this
        let params = {
          date: {
            startDate: dateUtil.formatDate(self.datePickerForm.startDate, 'yyyy-MM-dd'),
            endDate: dateUtil.formatDate(self.datePickerForm.endDate, 'yyyy-MM-dd')
          },
          keyword: self.keywords,
          groupName: 'dev',
          type: ARTICLE_TYPE_FOR_WEIBO.split('@')
        }
        getFilterAndGroupBy(params).then(data => {
          self.publishingEquipmentLoading = false
          let renderData = []
          let renderItem = {}
          renderItem.name = '发布设备'
          if (data.length > 0) {
            data.forEach(function (item) {
              item.name = item.key
            })
          }
          renderItem.data = data
          renderData.push(renderItem)
          let chartConfig = {legendData: {show: false}, pieForEmotion: false}
          self.publishingEquipmentChart.option = pieChartOption.getOption(renderData, chartConfig)
        }).catch(error => {
          self.$confirm(error.message, '错误', {type: 'error'})
        })
      },
      getweiboAuthenticationChart () {
        let self = this
        let params = {
          date: {
            startDate: dateUtil.formatDate(self.datePickerForm.startDate, 'yyyy-MM-dd'),
            endDate: dateUtil.formatDate(self.datePickerForm.endDate, 'yyyy-MM-dd')
          },
          keyword: self.keywords,
          groupName: 'verifyType',
          'page': {
            'limit': 10
          },
          type: ARTICLE_TYPE_FOR_WEIBO.split('@')
        }
        getWeiboFilterAndGroupBy(params).then(data => {
          self.weiboAuthenticationLoading = false
          let renderData = []
          let renderItem = {}
          renderItem.name = '微博认证占比'
          if (data.length > 0) {
            data.forEach(function (item) {
              item.name = typeUtil.verifyType(item.key)
            })
          }
          renderItem.data = data
          renderData.push(renderItem)
          let chartConfig = {pieForEmotion: false}
          self.weiboAuthenticationChart.option = pieChartOption.getOption(renderData, chartConfig)
        }).catch(error => {
          self.$confirm(error.message, '错误', {type: 'error'})
        })
      },
      getgenderProportionChart () {
        let self = this
        let params = {
          date: {
            startDate: dateUtil.formatDate(self.datePickerForm.startDate, 'yyyy-MM-dd'),
            endDate: dateUtil.formatDate(self.datePickerForm.endDate, 'yyyy-MM-dd')
          },
          keyword: self.keywords,
          groupName: 'gender',
          'page': {
            'limit': 10
          },
          type: ARTICLE_TYPE_FOR_WEIBO.split('@')
        }
        getWeiboFilterAndGroupBy(params).then(data => {
          self.genderProportionLoading = false
          let renderData = []
          let renderItem = {}
          renderItem.name = '性别占比'
          if (data.length > 0) {
            data.forEach(function (item) {
              item.name = typeUtil.gender(item.key)
            })
          }
          renderItem.data = data
          self.gender = data
          renderData.push(renderItem)
          let chartConfig = {pieForEmotion: false}
          self.genderProportionChart.option = pieChartOption.getOption(renderData, chartConfig)
        }).catch(error => {
          self.$confirm(error.message, '错误', {type: 'error'})
        })
      },
      /**
       * 热点微博
       */
      getHotWeibo () {
        let self = this
        let params = {
          date: {
            startDate: dateUtil.formatDate(self.datePickerForm.startDate, 'yyyy-MM-dd'),
            endDate: dateUtil.formatDate(self.datePickerForm.endDate, 'yyyy-MM-dd')
          },
          keyword: self.keywords,
          page: {
            limit: self.pager.pageSize,
            page: self.pager.currentPage
          }
        }
        params.filed = 'content'
        getHotWeibo(params).then(data => {
          self.weiboListsLoading = false
          self.hotWeibo = data.content
          self.pager.totalElements = data.totalElements
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
            $('section').animate({scrollTop: 1480}, 500)
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
