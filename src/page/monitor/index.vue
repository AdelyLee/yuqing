<template>
  <div id="currentSpecial">
    <div class="subject-header">
      <el-col :span="10">
        <span class="subjectName">专题名称：{{subjectName}}</span>
      </el-col>
      <el-col :span="8">
        <span class="timeRange">专题时间 ：{{timeRange}}</span>
      </el-col>
    </div>
    <div style="height:15px;"></div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="舆论分析" name="consensus">
        <el-row :gutter="15">
          <el-col :span="8">
            <el-card class="box-card" :body-style="{ padding: '0px' }">
              <div slot="header" class="chart-header">
                <span class="iconfont icon-emotion"></span>
                <span class="chart-text">舆情情感分析</span>
              </div>
              <el-col :span="24" v-loading="emotionAnalysisLoading">
                <pie-chart :chartConfig="emotionAnalysisChartConfig"></pie-chart>
              </el-col>
            </el-card>
          </el-col>
          <el-col :span="16">
            <el-card class="box-card" :body-style="{ padding: '0px' }">
              <div slot="header" class="chart-header">
                <span class="iconfont icon-trendLine"></span>
                <span class="chart-text">话题趋势</span>
              </div>
              <div v-loading="mediaTrendLoading">
                <!--<bar-chart :chartConfig="mediaReportTrendBar"></bar-chart>-->
                <line-bar-chart :chartConfig="mediaTypeTrendAnalysisConfig"></line-bar-chart>
              </div>
            </el-card>
          </el-col>
        </el-row>
        <el-row :gutter="15">
          <el-col :span="14">
            <el-card class="box-card" :body-style="{ padding: '0px' }">
              <div slot="header" class="chart-header">
                <span class="iconfont icon-media"></span><span
                class="chart-text">主流媒体</span>
              </div>
              <div v-loading="mediaSiteLoading">
                <line-bar-chart :chartConfig="mediaSiteChartConfig"></line-bar-chart>
              </div>
            </el-card>
          </el-col>
          <el-col :span="10">
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
      </el-tab-pane>
      <el-tab-pane label="网民分析" name="netizen">
        <el-row :gutter="15">
          <el-col :span="12">
            <el-card class="box-card" :body-style="{ padding: '0px' }">
              <div slot="header" class="chart-header">
                <span class="iconfont icon-netizenTopic"></span>
                <span class="chart-text">网民话题</span>
              </div>
              <div v-loading="netizenTitleLoading">
                <line-bar-chart :chartConfig="netizenTitleBar"></line-bar-chart>
              </div>
            </el-card>
          </el-col>
          <el-col :span="12">
            <el-card class="box-card" :body-style="{ padding: '0px' }">
              <div slot="header" class="chart-header">
                <span class="iconfont icon-hotNetizen"></span>
                <span class="chart-text">热议网民</span>
              </div>
              <div v-loading="netizenNameLoading">
                <line-bar-chart :chartConfig="netizenConsensusBar"></line-bar-chart>
              </div>
            </el-card>
          </el-col>
          <!--<el-col :span="12">-->
          <!--<el-card class="box-card" :body-style="{ padding: '0px' }">-->
          <!--<div slot="header" class="clearfix">-->
          <!--<span class="chart-text">地域分布</span>-->
          <!--</div>-->
          <!--&lt;!&ndash;<div v-loading="netizenMapLoading">&ndash;&gt;-->
          <!--&lt;!&ndash;<map-chart :chartConfig="netizenMap"></map-chart>&ndash;&gt;-->
          <!--&lt;!&ndash;</div>&ndash;&gt;-->
          <!--</el-card>-->
          <!--</el-col>-->
          <el-col :span="12">
            <el-card class="box-card" :body-style="{ padding: '0px' }">
              <div slot="header" class="chart-header">
                <span class="iconfont icon-ciyun"></span>
                <span class="chart-text">热点词云</span>
              </div>
              <el-col :span="24" v-loading="hotKeywordsChartLoading">
                <keywords-chart :chartConfig="hotKeywordsChartConfig"></keywords-chart>
              </el-col>
            </el-card>
          </el-col>
        </el-row>
        <!--<el-row :gutter="15">-->
        <!--<el-col :span="12">-->
        <!--<el-card class="box-card" :body-style="{ padding: '0px' }">-->
        <!--<div slot="header" class="clearfix">-->
        <!--<span class="chart-text">网民观点</span>-->
        <!--</div>-->
        <!--<div v-loading="netizenOptionsLoading">-->
        <!--<pie-chart :chartConfig="netizenOptions"></pie-chart>-->
        <!--</div>-->
        <!--</el-card>-->
        <!--</el-col>-->
        <!--</el-row>-->
      </el-tab-pane>
      <el-tab-pane label="事件回顾" name="accidentList">
        <div class="search-param">
          <!--<search-param :subjectSearch="accidentSearchParam"-->
          <!--@data="getListSearchParam">-->
          <!--</search-param>-->
          <div @keydown="keyUpLogin($event)" class="search-box" :model="accidentSearchParam"
               ref="accidentSearchParam">
            <el-row :gutter="15" class="line-height-40 border-b">
              <el-col :span="10" align="left">
                <span class="text">信息排序:</span>
                <el-radio-group v-model="accidentSearchParam.sortType" @change="changeSort()">
                  <el-radio label="time" class="text">时间降序</el-radio>
                  <el-radio label="nexus" class="text">相关度降序</el-radio>
                </el-radio-group>
              </el-col>
              <el-col :span="10" align="left">
                <span class="text"> 匹配方式:</span>
                <el-radio-group v-model="accidentSearchParam.filed" @change="changeFiled()">
                  <el-radio label="" class="text">按全文</el-radio>
                  <el-radio label="content" class="text">按正文</el-radio>
                  <el-radio label="title" class="text">按标题</el-radio>
                </el-radio-group>
              </el-col>
            </el-row>
            <el-row :gutter="15" class="line-height-40 border-b">
              <el-col :span="10" align="left">
                <span class="text">情感属性:</span>
                <el-checkbox :indeterminate="isIndeterminateEmotion" v-model="checkAllEmotion" class="text"
                             @change="handleEmotionCheckAllChange">全部
                </el-checkbox>
                <el-checkbox-group v-model="emotionArray" @change="handleCheckedEmotionChange"
                                   class="checked-option">
                  <el-checkbox v-for="item in emotions" :label="item" :key="item" class="text">{{item}}
                  </el-checkbox>
                </el-checkbox-group>
              </el-col>
              <el-col :span="10" align="left">
                <span class="text"> 载体类型:</span>
                <el-checkbox :indeterminate="isIndeterminateMediaType" v-model="checkAllMediaType"
                             class="text"
                             @change="handleMediaTypeCheckAllChange">全部
                </el-checkbox>
                <el-checkbox-group v-model="mediaTypeArray" @change="handleCheckedMediaTypeChange"
                                   class="checked-option">
                  <el-checkbox v-for="type in mediaTypes" :label="type" :key="type" class="text">{{type}}
                  </el-checkbox>
                </el-checkbox-group>
              </el-col>
            </el-row>
            <el-row :gutter="15" class="line-height-40">
              <el-col :span="20" align="left">
                <span class="text">监测时间: </span>
                <el-date-picker
                  v-model="accidentSearchParam.startDate"
                  type="date"
                  :editable=false
                  placeholder="选择开始日期"
                >
                </el-date-picker>
                <el-date-picker
                  v-model="accidentSearchParam.endDate"
                  type="date"
                  :editable=false
                  placeholder="选择结束日期"
                >
                </el-date-picker>
                <div class="searchInput text">
                  <el-input placeholder="请输入关键词..." v-model="accidentSearchParam.searchWord">
                    <el-button slot="append" icon="search" @click="getSearchWord" class="subject-search"></el-button>
                  </el-input>
                </div>
              </el-col>
            </el-row>
          </div>
        </div>
        <div id="current">
          <article-list :articles="accidentListData" v-loading="currentList"
                        :pager="accidentListPager" @data="getPager"></article-list>
        </div>
      </el-tab-pane>
      <el-tab-pane label="历史预警" name="warningList">
        <warning-list :warningList="warningList" @data="getData"></warning-list>
      </el-tab-pane>
      <el-tab-pane label="微博分析" name="weibofx">
        <el-tabs v-model="activeNames" @tab-click="handleClick">
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
                    <span class="iconfont icon-emotion"></span>
                    <span class="chart-text">舆情情感分析</span>
                  </div>
                  <el-col :span="24" v-loading="weiboemotionAnalysisChartLoading">
                    <pie-chart :chartConfig="weiboemotionAnalysisChartConfig"></pie-chart>
                  </el-col>
                </el-card>
              </el-col>
              <el-col :span="8" class="lists">
                <el-card class="box-card" :body-style="{ padding: '0px' }">
                  <div slot="header" class="chart-header">
                    <span class="iconfont icon-trendLine"></span>
                    <span class="chart-text">趋势图</span>
                  </div>
                  <el-col :span="24" v-loading="weibomediaTypeTrendAnalysisLoading">
                    <line-bar-chart :chartConfig="weibomediaTypeTrendAnalysisConfig"></line-bar-chart>
                  </el-col>
                </el-card>
              </el-col>
              <el-col :span="8">
                <el-card class="box-card" :body-style="{ padding: '0px' }">
                  <div slot="header" class="chart-header">
                    <span class="iconfont icon-ciyun"></span>
                    <span class="chart-text">热点词云</span>
                  </div>
                  <el-col :span="24" v-loading="hotKeywordsChartLoadings">
                    <keywords-chart :chartConfig="weibohotKeywordsChartConfig"></keywords-chart>
                  </el-col>
                </el-card>
              </el-col>
            </el-row>
            <el-row :gutter="15">
              <el-col :span="15" class="lists">
                <el-card class="box-card" :body-style="{ padding: '0px' }">
                  <div slot="header" class="chart-header">
                    <span class="iconfont icon-media"></span>
                    <span class="chart-text">微博来源分布</span>
                  </div>
                  <el-col :span="24" v-loading="weibomediaBarLoading">
                    <line-bar-chart :chartConfig="weibomediaBarChart"></line-bar-chart>
                  </el-col>
                </el-card>
              </el-col>
              <el-col :span="9" class="lists">
                <el-card class="box-card" :body-style="{ padding: '0px' }">
                  <div slot="header" class="chart-header">
                    <span class="iconfont icon-trend"></span>
                    <span class="chart-text">原微博转发微博占比</span>
                  </div>
                  <el-col :span="24" v-loading="weiboProportionLoading">
                    <pie-chart :chartConfig="weiboProportionChart"></pie-chart>
                  </el-col>
                </el-card>
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
                    <line-bar-chart :chartConfig="regionDistributionChart"
                                    v-loading="regionDistributionLoading"></line-bar-chart>
                  </el-col>
                </el-card>
              </el-col>
            </el-row>
            <el-row :gutter="15">
              <el-col :span="14" class="lists">
                <el-card class="box-card" :body-style="{ padding: '0px' }">
                  <div slot="header" class="chart-header">
                    <span class="iconfont icon-device"></span>
                    <span class="chart-text">发布设备分布</span>
                  </div>
                  <pie-chart :chartConfig="publishingEquipmentChart"
                             v-loading="publishingEquipmentLoading"></pie-chart>
                </el-card>
              </el-col>
              <el-col :span="10" class="lists">
                <el-card class="box-card" :body-style="{ padding: '0px' }">
                  <div slot="header" class="chart-header">
                    <span class="iconfont icon-trend"></span>
                    <span class="chart-text">微博认证占比</span>
                  </div>
                  <pie-chart :chartConfig="weiboAuthenticationChart"
                             v-loading="weiboAuthenticationLoading"></pie-chart>
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
            <list-page :pager="hotweibopager" @data="getPager"></list-page>
          </el-tab-pane>
          <!--<el-tab-pane label="意见领袖" name="OpinionA">-->
          <!--<hot-opinions></hot-opinions>-->
          <!--</el-tab-pane>-->
        </el-tabs>
      </el-tab-pane>
    </el-tabs>
    <article-list v-if="articles.length > 0" :id="articleListId" :articles="articles"
                  v-loading="articlesLoading"
                  :pager="pager" @data="getData"></article-list>
  </div>
</template>


<script type="text/ecmascript-6">
  import datePicker from '@/components/common/date-picker'
  import articleTab from '@/components/common/article-tab-list'
  import articleList from '@/components/common/articles'
  import warningListComponent from '@/components/common/warning-list'
  import pieChart from '@/components/common/charts/pie'
  import MapChart from '@/components/common/charts/map'
  import listSearch from '@/components/common/list-search'
  import lineBarChart from '@/components/common/charts/line-bar'
  import keywordsChart from '@/components/common/charts/keywords-cloud'
  import {pieChartOption} from '@/components/common/options/pie-chart'
  import {barChartOption} from '@/components/common/options/bar-chart'
  import {lineChartOption} from '@/components/common/options/line-chart'
  import {mapChartOption} from '@/components/common/options/map-chart'
  import Pager from '@/components/common/pager'
  import HotNew from '@/components/common/hotNews'
  import HotOpinions from '@/components/common/hotOpinion'
  import {typeUtil} from '@/utils/typeUtil'
  import {dateUtil} from '@/utils/dateUtil'
  import {utils} from '@/utils/utils'
  //  import {getKeywords} from '@/service/config'
  const typeOptions = ['新闻', '微博', '贴吧', '论坛']
  const emotionOptions = ['正面', '负面', '中性']
  import {
    getArticles,
    getFilterAndGroupBy,
    getFocusArticles,
    getHotWords,
    getFilterAndGroupByTime,
    getDeduplicationArticles,
    getWeiboFilterAndGroupBy,
    getHotWeibo
  } from '@/service/article'
  import {
    getHistoryWarnings,
    deleteHistoryWarnings
  } from '@/service/warning'
  import {
    ARTICLE_TYPE_MEDIA_TYPE_TREND,
    ARTICLE_TYPE_FOR_WEIBO
  } from '@/service/common'
  import $ from 'jquery'
  export default {
    name: 'index',
    data () {
      let self = this
      return {
        keywords: {},
        keywordsConfig: {},
        heightLightWords: '',
        datePickerForm: {},
        warningList: {// 历史预警数据和分页
          warningData: [],
          warningListLoading: false,
          pager: {
            limit: 10,
            currentPage: 1,
            totalElements: 1
          }
        },
        pager: {// 点击图表分页
          limit: 10,
          currentPage: 1,
          totalElements: 1
        },
        hotweibopager: {
          limit: 10,
          currentPage: 1,
          totalElements: 1
        },
        dataAnalysis: {// 载体类型数量
          totalSum: 0,
          typeData: []
        },
        currentList: true,
        emotionAnalysisLoading: true,
        mediaSiteLoading: true,
        mediaTrendLoading: true,
        mediaTypeLoading: true,
        netizenTitleLoading: true,
        netizenNameLoading: true,
        hotKeywordsChartLoading: true,
        articlesLoading: false,
        isComments: false,
        articleListId: 'article-list',
        accidentListData: [], // 历史回顾列表数据
        accidentListPager: { // 历史回顾列表分页
          limit: 10,
          currentPage: 1,
          totalElements: 10
        },
        accidentSearchParam: {// 获取事件回顾查询参数
          startDate: '',
          endDate: '',
          filed: '',
          searchWord: '',
          orders: [],
          sortType: 'nexus',
          searchKey: [],
          type: []
        },
        subjectName: '',
        timeRange: '',
        articles: [],
        checkAllEmotion: false,
        checkAllMediaType: false,
        isIndeterminateMediaType: false,
        isIndeterminateEmotion: false,
        emotionArray: [],
        mediaTypeArray: [],
        mediaTypes: typeOptions,
        emotions: emotionOptions,
        activeName: 'consensus',
        activeNames: 'weiboA',
        emotionAnalysisChartConfig: {
          chartId: 'emotion-pie',
          option: {},
          events: {
            'click': function (param) {
              self.pager.currentPage = 1
              self.articlesConditions = {}
              let value = typeUtil.encodeSentimentType(param.name)
              self.articlesConditions.startDate = self.keywordsConfig.startDate
              self.articlesConditions.endDate = self.keywordsConfig.endDate
              self.articlesConditions.searchKv = [{'key': 'nlp.sentiment.label', 'value': value}]
              self.articlesConditions.type = ['news', 'weibo', 'bar', 'bbs']
              self.articlesConditions.orders = []
              self.isComments = false
              self.getArticles()
            }
          }
        },
        mediaSiteChartConfig: {
          chartId: 'media-bar-chart',
          option: {},
          events: {
            'click': function (param) {
              self.pager.currentPage = 1
              self.articlesConditions = {}
              let value = param.name
              self.articlesConditions.startDate = self.keywordsConfig.startDate
              self.articlesConditions.endDate = self.keywordsConfig.endDate
              self.articlesConditions.searchKv = [{'key': 'source', 'value': value}]
              self.articlesConditions.type = ['news', 'weibo', 'bar', 'bbs']
              self.articlesConditions.orders = []
              self.isComments = false
              self.getArticles()
            }
          }
        },
        mediaTypeTrendAnalysisConfig: {
          chartId: 'media-report-trend-bar',
          option: {},
          events: {
            'click': function (param) {
              self.articlesConditions = {}
              self.pager.currentPage = 1
              let dateStr = param.name
              let type = []
              type.push(typeUtil.encodeArticleType(param.seriesName))
              let date = new Date(dateStr)
              let startDate = dateUtil.formatDate(date, 'yyyy-MM-dd')
              let endDate = dateUtil.formatDate(dateUtil.addDate(date, 'd', 1), 'yyyy-MM-dd')
              self.articlesConditions.startDate = startDate
              self.articlesConditions.endDate = endDate
              self.articlesConditions.searchKv = []
              self.articlesConditions.type = type
              self.articlesConditions.orders = []
              self.isComments = false
              self.getArticles()
            }
          }
        },
        netizenTitleBar: {
          chartId: 'accident-report-bar',
          option: {},
          events: {
            'click': function (param) {
              self.articlesConditions = {}
              self.pager.currentPage = 1
              let value = param.data.titleSimHash
              self.articlesConditions.startDate = self.keywordsConfig.startDate
              self.articlesConditions.endDate = self.keywordsConfig.endDate
              self.articlesConditions.searchKv = [{'key': 'titleSimHash', 'value': value}]
              self.articlesConditions.type = ['article']
              self.articlesConditions.orders = []
              self.isComments = false
              self.getArticles()
            }
          }
        },
        netizenConsensusBar: {
          chartId: 'netizen-consensus-bar',
          option: {},
          events: {
            'click': function (param) {
              self.articlesConditions = {}
              self.pager.currentPage = 1
              let value = param.name
              self.articlesConditions.startDate = self.keywordsConfig.startDate
              self.articlesConditions.endDate = self.keywordsConfig.endDate
              self.articlesConditions.searchKv = [{'key': 'author', 'value': value}]
              self.articlesConditions.type = ['news', 'weibo', 'bar', 'bbs']
              self.articlesConditions.orders = []
              self.isComments = false
              self.getArticles()
            }
          }
        },
        netizenMap: {
          chartId: 'netizen-map',
          option: {},
          events: {
            'click': function (param) {
//              self.articlePager.currentPage = 1
//              var value = param.name
//              self.conditions.startDate = JSON.parse(localStorage.getItem('customSubjectKeywords')).startDate
//              self.conditions.endDate = JSON.parse(localStorage.getItem('customSubjectKeywords')).endDate
//              self.conditions.searchKv = [{'key': 'area', 'value': value}]
//              self.conditions.type = ['comments']
//              self.isComments = true
//              self.getArticleList()
            }
          }
        },
        hotKeywordsChartConfig: {
          chartId: 'keywords-chart-id',
          option: {},
          events: {
            'click': function (param) {
            }
          }
        },
//        netizenOptions: {
//          chartId: 'netizen-options',
//          option: {},
//          events: {
//            'click': function (param) {
//              self.articlePager.currentPage = 1
//              var value = param.name
//              self.conditions.startDate = JSON.parse(localStorage.getItem('customSubjectKeywords')).startDate
//              self.conditions.endDate = JSON.parse(localStorage.getItem('customSubjectKeywords')).endDate
//              self.conditions.searchKv = [{'key': 'content.raw', 'value': value}]
//              self.isComments = true
//              self.getArticleList()
//            }
//          }
//        }

        newsListTabLoading: true,
        weiboemotionAnalysisChartLoading: true,
        hotKeywordsChartLoadings: true,
        weibomediaTypeTrendAnalysisLoading: true,
        weiboProportionLoading: true,
        weibomediaBarLoading: true,
        weiboListsLoading: true,
        mapregionDistributionLoading: true,
        regionDistributionLoading: true,
        publishingEquipmentLoading: true,
        weiboAuthenticationLoading: true,
        genderProportionLoading: true,
        ageDistributionLoading: true,
        articleType: '',
        newsTabData: {
          type: 'weibo',
          titleText: '热议微博',
          sortBy: 'score',
          btnText: '更多 >>',
          articles: []
        },
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
        weiboemotionAnalysisChartConfig: {
          chartId: 'emotion-chart',
          option: {},
          events: {
            'click': function (param) {
              self.articlesLoading = true
              self.articlesConditions = {}
              self.pager.currentPage = 1
              self.articlesConditions.startDate = self.keywordsConfig.startDate
              self.articlesConditions.endDate = self.keywordsConfig.endDate
              self.articlesConditions.searchKv = [{
                'key': 'nlp.sentiment.label',
                'value': typeUtil.encodeSentimentType(param.name)
              }]
              self.articlesConditions.type = ARTICLE_TYPE_FOR_WEIBO.split('@')
              self.getArticles()
            }
          }
        },
        weibohotKeywordsChartConfig: {
          chartId: 'hot-keywords-chart',
          option: {},
          events: {
            'click': function (param) {
            }
          }
        },
        weibomediaTypeTrendAnalysisConfig: {
          chartId: 'media-type-trend-chart',
          option: {},
          events: {
            'click': function (param) {
              self.articlesLoading = true
              self.articlesConditions = {}
              self.pager.currentPage = 1
              let dateStr = param.name
              let date = new Date(dateStr)
              let startDate = dateUtil.formatDate(date, 'yyyy-MM-dd')
              let endDate = dateUtil.formatDate(dateUtil.addDate(date, 'd', 1), 'yyyy-MM-dd')
              self.articlesConditions.startDate = startDate
              self.articlesConditions.endDate = endDate
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
              self.articlesLoading = true
              self.articlesConditions = {}
              self.pager.currentPage = 1
              self.articlesConditions.startDate = self.keywordsConfig.startDate
              self.articlesConditions.endDate = self.keywordsConfig.endDate
              self.articlesConditions.searchKv = [{
                'key': 'foward',
                'value': typeUtil.encodeWeiboType(param.name)
              }]
              self.articlesConditions.type = ARTICLE_TYPE_FOR_WEIBO.split('@')
              self.getArticles()
            }
          }
        },
        weibomediaBarChart: {
          chartId: 'media-bar-chart',
          option: {},
          events: {
            'click': function (param) {
              self.articlesLoading = true
              self.articlesConditions = {}
              self.pager.currentPage = 1
              self.articlesConditions.startDate = self.keywordsConfig.startDate
              self.articlesConditions.endDate = self.keywordsConfig.endDate
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
              self.articlesLoading = true
              self.articlesConditions = {}
              self.pager.currentPage = 1
              self.articlesConditions.startDate = self.keywordsConfig.startDate
              self.articlesConditions.endDate = self.keywordsConfig.endDate
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
              self.articlesLoading = true
              self.articlesConditions = {}
              self.pager.currentPage = 1
              self.articlesConditions.startDate = self.keywordsConfig.startDate
              self.articlesConditions.endDate = self.keywordsConfig.endDate
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
              self.articlesLoading = true
              self.articlesConditions = {}
              self.pager.currentPage = 1
              self.articlesConditions.startDate = self.keywordsConfig.startDate
              self.articlesConditions.endDate = self.keywordsConfig.endDate
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
              self.articlesLoading = true
              self.articlesConditions = {}
              self.pager.currentPage = 1
              self.articlesConditions.startDate = self.keywordsConfig.startDate
              self.articlesConditions.endDate = self.keywordsConfig.endDate
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
              self.articlesLoading = true
              self.articlesConditions = {}
              self.pager.currentPage = 1
              self.articlesConditions.startDate = self.keywordsConfig.startDate
              self.articlesConditions.endDate = self.keywordsConfig.endDate
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
      'list-search': listSearch,
      'warning-list': warningListComponent,
      'hot-news': HotNew,
      'hot-opinions': HotOpinions,
      'list-page': Pager
    },
    created () {
      // set the default date time
      let self = this
      // get the keywords and the heightLightWords
      self.keywordsConfig = JSON.parse(localStorage.getItem('customSubjectKeywords'))
      self.subjectName = self.keywordsConfig.name
      self.timeRange = self.keywordsConfig.startDate + ' ~ ' + self.keywordsConfig.endDate
      self.accidentSearchParam.startDate = self.keywordsConfig.startDate
      self.accidentSearchParam.endDate = self.keywordsConfig.endDate
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
      changeSort () {
        let self = this
        switch (self.accidentSearchParam.sortType) {
          case 'time':
            self.accidentSearchParam.orders = [{
              'direction': 'DESC',
              'orderBy': 'pubTime'
            }]
            break
          case 'nexus':
            self.accidentSearchParam.orders = []
            break
        }
        self.getlist()
      },
      getSearchWord () {
        this.getlist()
      },
      changeFiled () {
        let self = this
        self.getlist()
      },
      /**
       *  点击情感全选
       */
      handleEmotionCheckAllChange(event) {
        let self = this
        self.emotionArray = event.target.checked ? self.emotions : []
        self.isIndeterminateEmotion = false
        let emotions = []
        self.emotionArray.forEach(function (item) {
          emotions.push(typeUtil.encodeSentimentType(item))
        })
        let searchKv = []
        if (emotions.length > 0) {
          let item = {}
          item.key = 'nlp.sentiment.label'
          item.value = emotions.join('@')
          searchKv.push(item)
        }
        self.accidentSearchParam.searchKv = searchKv
        self.getlist()
      },
      /**
       *  点击单个情感
       */
      handleCheckedEmotionChange(value) {
        let self = this
        let checkedCount = value.length
        self.checkAllEmotion = checkedCount === self.emotions.length
        self.isIndeterminateEmotion = checkedCount > 0 && checkedCount < self.emotions.length
        let emotions = []
        self.emotionArray.forEach(function (item) {
          emotions.push(typeUtil.encodeSentimentType(item))
        })
        let searchKv = []
        if (emotions.length > 0) {
          let item = {}
          item.key = 'nlp.sentiment.label'
          item.value = emotions.join('@')
          searchKv.push(item)
        }
        self.accidentSearchParam.searchKv = searchKv
        self.getlist()
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
          mediaTypes.push(typeUtil.encodeArticleType(item))
        })
        self.accidentSearchParam.type = mediaTypes
        self.getlist()
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
          mediaTypes.push(typeUtil.encodeArticleType(item))
        })
        self.accidentSearchParam.type = mediaTypes
        self.getlist()
      },
      /**
       * 默认渲染舆论分析页面数据
       */
      renderPageData () {
        this.getEmotionAnalysisChart()
        this.getMediaSiteChart()
        this.getMediaTypeTrendAnalysisChart('day')
        this.getMediaTypeChart()
      },
      /*
       *根据点击tab来分别渲染
       */
      handleClick(tab, event) {
        switch (tab.name) {
          case 'accidentList':
            this.articles = []
            this.getlist()
            break
          case 'consensus':
            this.articles = []
            this.getEmotionAnalysisChart()
            this.getMediaSiteChart()
            this.getMediaTypeTrendAnalysisChart('day')
            this.getMediaTypeChart()
            break
          case 'netizen':
            this.articles = []
            this.getNetionTitleBar()
            this.getNetizenConsensusBar()
            this.getHotKeywordsChart()
//            this.getNetizenOptions()
//            this.getNetizenMap()
            break
          case 'warningList':
            this.articles = []
            this.getWarningList()
            break
          case 'weibofx':
            this.articles = []
            this.getTabArticles('weibo')
            this.getWeiboEmotionAnalysisChart()
            this.getWeiboHotKeywordsChart()
            this.getWeiboMediaTypeTrendAnalysisChart('customTime')
            this.getHotSourceBarChart()
            this.getWeiboProportionChart()
            break
          case 'weiboA':
            this.articles = []
            this.getTabArticles('weibo')
            this.getWeiboEmotionAnalysisChart()
            this.getWeiboHotKeywordsChart()
            this.getWeiboMediaTypeTrendAnalysisChart('customTime')
            this.getHotSourceBarChart()
            this.getWeiboProportionChart()
            break
          case 'userA':
            this.articles = []
//            this.getmapregionDistributionChart()
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
      /*
       *获取事件回顾点击页码
       */
      getPager(pager) {
        let self = this
        if (pager.action === 'clickCommonPager') {
          self.hotweibopager.currentPage = pager.data.currentPage
          self.getHotWeibo()
        } else {
          self.accidentListPager = pager.data
          self.getlist()
        }
      },
      /*
       *渲染事件回顾列表
       */
      getlist: function () {
        let self = this
        let {startDate, endDate} = self.accidentSearchParam
        startDate = dateUtil.formatDate(new Date(startDate), 'yyyy-MM-dd')
        endDate = dateUtil.formatDate(new Date(endDate), 'yyyy-MM-dd')
        let params = {
          'date': {
            'startDate': startDate,
            'endDate': endDate
          },
          'keyword': {
            'expression': '',
            'mustWord': self.keywords.mustWord + '@' + self.accidentSearchParam.searchWord,
            'shouldWord': self.keywords.shouldWord,
            'mustNotWord': self.keywords.mustNotWord
          },
          'filed': self.accidentSearchParam.filed,
          'page': {
            'limit': self.accidentListPager.limit,
            'page': self.accidentListPager.currentPage,
            'orders': self.accidentSearchParam.orders
          },
          'searchKv': self.accidentSearchParam.searchKv,
          'type': self.accidentSearchParam.type
        }
        params.displayConfig = {
          sourceLength: 20,
          titleLength: 35,
          heightLightWords: self.keywords.mustWord + '@' + self.keywords.shouldWord + '@' + self.accidentSearchParam.searchWord
        }
        self.currentList = true
        getArticles(params).then(data => {
          self.currentList = false
          self.accidentListData = data.content
          self.accidentListPager.totalElements = data.totalElements
        }).catch(error => {
          self.$confirm(error.message, '错误', {type: 'error'})
        })
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
          case 'clickWarningListPager':
            self.warningList.pager = data.warningListPager
            self.getWarningList()
            break
          case 'deleteWarning':
            this.$confirm('确认删除该记录吗?', '提示', {type: 'warning'}).then(() => {
              self.deleteWarning(data.warning)
            }).catch(() => {
            })
            break
          case
          'clickArticleListPager':
            self.pager = data.data
            self.getArticles()
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
          case
          'showMoreArticle':
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
      keyUpLogin(ev) {
        let self = this
        if (ev.keyCode === 13) {
          self.getSearchWord()
        }
      },
      /**
       * 获取情感分析正负面图
       */
      getEmotionAnalysisChart () {
        let self = this
        let params = {
          'date': {
            'startDate': self.keywordsConfig.startDate,
            'endDate': self.keywordsConfig.endDate
          },
          'keyword': self.keywords,
          'groupName': 'nlp.sentiment.label',
          'type': []
        }
        getFilterAndGroupBy(params).then(data => {
          self.emotionAnalysisLoading = false
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
       * 主流媒体
       */
      getMediaSiteChart () {
        let self = this
        let params = {
          'date': {
            'startDate': self.keywordsConfig.startDate,
            'endDate': self.keywordsConfig.endDate
          },
          'keyword': self.keywords,
          'groupName': 'source',
          'type': []
        }
        getFilterAndGroupBy(params).then(data => {
          self.mediaSiteLoading = false
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
       * 趋势图
       */
      getMediaTypeTrendAnalysisChart (type) {
        let self = this
        let params = {
          date: {
            startDate: self.keywordsConfig.startDate,
            endDate: self.keywordsConfig.endDate
          },
          keyword: self.keywords,
          groupName: 'type',
          type: ARTICLE_TYPE_MEDIA_TYPE_TREND.split('@')
        }
        let gapParams = {gap: '1', dateType: 'day'}
        getFilterAndGroupByTime(params, gapParams).then(data => {
          self.mediaTrendLoading = false
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
       * 载体类型分布数量
       * @param type
       */
      getMediaTypeChart () {
        let self = this
        let params = {
          'date': {
            'startDate': self.keywordsConfig.startDate,
            'endDate': self.keywordsConfig.endDate
          },
          'keyword': self.keywords,
          'groupName': 'type',
          'type': []
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
        self.isComments = false
        self.getArticles()
      },
      /**
       * 获取更多文章列表
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
            limit: self.pager.limit,
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
       * 网民话题
       */
      getNetionTitleBar: function () {
        let self = this
        let params = {
          'date': {
            'startDate': self.keywordsConfig.startDate,
            'endDate': self.keywordsConfig.endDate
          },
          'keyword': self.keywords,
          'groupName': 'title.raw',
          'type': ['article']
        }
        getFocusArticles(params).then(data => {
          let titleBarArray = []
          data.content.forEach(function (item) {
            let node = {}
            node.key = item.title
            node.value = item.docTotal
            node.titleSimHash = item.titleSimHash
            titleBarArray.push(node)
          })
          self.netizenTitleLoading = false
          let renderData = []
          let chartConfig = {legendData: {show: false}, xAxisData: {axisLabel: {rotate: 45}}}
          let renderItem = {}
          renderItem.name = '数目'
          if (titleBarArray.length > 0) {
            titleBarArray.forEach(function (item) {
              item.name = item.key
            })
          }
          renderItem.data = titleBarArray
          renderData.push(renderItem)
          self.netizenTitleBar.option = barChartOption.getOption(renderData, chartConfig)
        }).catch(error => {
          self.$confirm(error.message, '错误', {type: 'error'})
        })
      },
      /**
       * 热议网民
       */
      getNetizenConsensusBar: function () {
        let self = this
        let params = {
          'date': {
            'startDate': self.keywordsConfig.startDate,
            'endDate': self.keywordsConfig.endDate
          },
          'keyword': self.keywords,
          'groupName': 'author',
          'type': []
        }
        getFilterAndGroupBy(params).then(data => {
          self.netizenNameLoading = false
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
          self.netizenConsensusBar.option = barChartOption.getOption(renderData, chartConfig)
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
            startDate: self.keywordsConfig.startDate,
            endDate: self.keywordsConfig.endDate
          },
          page: {limit: 50},
          keyword: self.keywords,
          type: []
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
       * 网民观点
       */
//      getNetizenOptions: function () {
//        let self = this
//        let params = {
//          'date': {
//            'startDate': self.keywordsConfig.startDate,
//            'endDate': self.keywordsConfig.endDate
//          },
//          'groupBy': '',
//          'keyword': self.keywords,
//          'type': ''
//        }
//        getViewPort(params).then(data => {
//          self.netizenOptionsLoading = false
//          let renderData = []
//          let renderItem = {}
//          renderItem.name = '网民观点'
//          if (data.length > 0) {
//            data.forEach(function (item) {
//              item.name = typeUtil.sentimentType(item.key)
//            })
//          }
//          renderItem.data = data
//          renderData.push(renderItem)
//          self.netizenOptions.option = pieChartOption.getOption(renderData)
//        }).catch(error => {
//          self.$confirm(error.message, '错误', {type: 'error'})
//        })
//      },
      /**
       * 历史预警列表
       */
      getWarningList () {
        let self = this
        let param = {
          'limit': self.warningList.pager.limit,
          'page': self.warningList.pager.currentPage
        }
        let subjectId = self.keywordsConfig.id
        getHistoryWarnings(param, subjectId).then(data => {
          self.warningList.warningListLoading = false
          data.content.forEach(function (item, index) {
            item.dateCreated = dateUtil.formatDate(new Date(item.dateCreated), 'yyyy-MM-dd hh:mm:ss')
            item.number = index - 0 + 1
          })
          self.warningList.warningData = data.content
          self.warningList.pager.totalElements = data.totalElements
        }).catch(function () {
        })
      },
      /**
       * 删除预警
       */
      deleteWarning: function (warning) {
        let self = this
        let param = warning.id
        deleteHistoryWarnings(param).then(data => {
          self.$message({
            message: '删除成功',
            type: 'success'
          })
          self.getWarningList()
        }).catch(function () {
          self.$message.error('删除失败')
          self.getWarningList()
        })
      },

      getTabArticles (type) {
        let self = this
        let params = {
          date: {
            startDate: self.keywordsConfig.startDate,
            endDate: self.keywordsConfig.endDate
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
      getWeiboEmotionAnalysisChart () {
        let self = this
        let params = {
          date: {
            startDate: self.keywordsConfig.startDate,
            endDate: self.keywordsConfig.endDate
          },
          keyword: self.keywords,
          groupName: 'nlp.sentiment.label',
          type: ARTICLE_TYPE_FOR_WEIBO.split('@')
        }
        getFilterAndGroupBy(params).then(data => {
          self.weiboemotionAnalysisChartLoading = false
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
          self.weiboemotionAnalysisChartConfig.option = pieChartOption.getOption(renderData, chartConfig)
        }).catch(error => {
          self.$confirm(error.message, '错误', {type: 'error'})
        })
      },
      /**
       * 根据条件获取关键词云
       */
      getWeiboHotKeywordsChart () {
        let self = this
        let params = {
          date: {
            startDate: self.keywordsConfig.startDate,
            endDate: self.keywordsConfig.endDate
          },
          page: {limit: 50},
          keyword: self.keywords,
          type: ARTICLE_TYPE_FOR_WEIBO.split('@')
        }
        getHotWords(params).then(data => {
          self.hotKeywordsChartLoadings = false
          let option = {data: []}
          if (data.length > 0) {
            data.forEach(function (word) {
              let obj = {}
              obj.keyword = word.key
              obj.score = word.value
              option.data.push(obj)
            })
          }
          self.weibohotKeywordsChartConfig.option = option
        }).catch(error => {
          self.$confirm(error.message, '错误', {type: 'error'})
        })
      },
      /**
       * 获取文章各载体类型趋势图
       * @param type
       * 趋势时间段类型
       */
      getWeiboMediaTypeTrendAnalysisChart (type) {
        let self = this
        let params = {
          date: {
            startDate: self.keywordsConfig.startDate,
            endDate: self.keywordsConfig.endDate
          },
          keyword: self.keywords,
          groupName: 'type',
          type: ARTICLE_TYPE_FOR_WEIBO.split('@')
        }
        let gapParams = {gap: '1', dateType: 'day'}
        getFilterAndGroupByTime(params, gapParams).then(data => {
          self.weibomediaTypeTrendAnalysisLoading = false
          let renderData = []
          for (let name in data) {
            let renderItem = {}
            renderItem.name = typeUtil.articleType(name)
            renderItem.data = data[name]
            renderData.push(renderItem)
          }
          self.weibomediaTypeTrendAnalysisConfig.option = lineChartOption.getOption(renderData)
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
            startDate: self.keywordsConfig.startDate,
            endDate: self.keywordsConfig.endDate
          },
          'keyword': self.keywords,
          'groupName': 'author',
          'type': ARTICLE_TYPE_FOR_WEIBO.split('@')
        }
        getFilterAndGroupBy(params).then(data => {
          self.weibomediaBarLoading = false
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
          self.weibomediaBarChart.option = barChartOption.getOption(seriesData, chartConfig)
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
            startDate: self.keywordsConfig.startDate,
            endDate: self.keywordsConfig.endDate
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
            startDate: self.keywordsConfig.startDate,
            endDate: self.keywordsConfig.endDate
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
            startDate: self.keywordsConfig.startDate,
            endDate: self.keywordsConfig.endDate
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
            startDate: self.keywordsConfig.startDate,
            endDate: self.keywordsConfig.endDate
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
            startDate: self.keywordsConfig.startDate,
            endDate: self.keywordsConfig.endDate
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
            startDate: self.keywordsConfig.startDate,
            endDate: self.keywordsConfig.endDate
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
          self.hotweibopager.totalElements = data.totalElements
        }).catch(error => {
          self.$confirm(error.message, '错误', {type: 'error'})
        })
      },
      /**
       * 获取更多文章列表
       * @param deduplication
       * true or false, if the deduplication is true use the deduplication interface
       */
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
//            $('html, body').animate({scrollTop: $('#article-list').offset().top}, 500)
            $('section').animate({scrollTop: 950}, 500)
          })
        }
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .news-list-tab, .bbs-list-tab {
    height: 450px
  }
  .gender-img{
    background: url('../../assets/img/female.svg') no-repeat;
  }
  .gendermale-img{
    background: url('../../assets/img/male.svg') no-repeat;
  }
</style>
