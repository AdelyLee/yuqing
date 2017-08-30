<template>
  <div id="detail">
    <el-row :gutter="5" class="list">
      <el-col :span="3">
      </el-col>
      <el-col :span="23">
        <div class="card-body" id="content">
          <el-row :gutter="5" class="list">
            <!--新闻-->
            <div v-loading="contentLoading" style="min-height:400px">
              <el-col v-if="articleDetail && type=='news'" :span="20" class="m_l10">
                <!--标题-->
                <el-row :gutter="1" class="list border_1">
                  <el-col :span="22" class="font_style">
                    <div class="title" v-if="articleDetail.title">{{articleDetail.title}}</div>
                    <div class="new">
                      <el-col :span="8" class="m_t20">文章来源：<span
                        v-if="articleDetail.source">{{articleDetail.source}}</span>
                      </el-col>
                      <el-col :span="7" class="m_t20">发布时间：<span v-if="articleDetail.pubTime">{{new Date(articleDetail.pubTime).toLocaleString().substr(0,9)}}</span>
                      </el-col>
                      <el-col :span="6" class="m_t20">作者：<span
                        v-if="articleDetail.author">{{articleDetail.author}}</span>
                      </el-col>
                      <el-col :span="3" class="m_t20"><a :href="articleDetail.url" class="title_a"
                                                         target="_blank"><span></span>原文链接</a>
                      </el-col>

                    </div>
                  </el-col>
                </el-row>
                <!--内容-->
                <el-row :gutter="1" class="list border_1">
                  <el-col :span="24">
                    <div class="key"><span class="field">关键字</span>：<span
                                                                          v-if="articleDetail.nlp.keywords">{{articleDetail.nlp.keywords}}</span>
                    </div>
                  </el-col>
                  <el-col :span="24">
                    <div class="content">
                      <div v-if="articleDetail.content" v-html="articleDetail.content"></div>
                    </div>
                  </el-col>
                  <el-col :span="24">
                    <el-col :span="17" style="text-align: left">
                      <div class="entity fiex_entity ">
                        <dt class="dt_entity"> 实体类别图示</dt>
                        <dd class="person_name_label"><b>人名</b></dd>
                        <dd class="area_label"><b>地名</b></dd>
                        <dd class="org_name_label"><b>机构名</b></dd>
                      </div>
                    </el-col>
                    <el-col :span="7" class="m_l10 share">
                      <div class="share_font">分享到：</div>
                      <div class="share-area"></div>
                    </el-col>
                  </el-col>
                </el-row>
              </el-col>
              <!--论坛-->
              <el-col v-if="type=='bbs'" :span="20" class="m_l10">
                <!--标题-->
                <el-row :gutter="1" class="list border_1">
                  <el-col :span="22" class="font_style">
                    <div class="title" v-if="articleDetail.title">{{articleDetail.title}}</div>

                    <div class="new">
                      <el-col :span="8" class="m_t20">文章来源：<span
                        v-if="articleDetail.source">{{articleDetail.source}}</span>
                      </el-col>
                      <el-col :span="7" class="m_t20">发布时间：<span v-if="articleDetail.pubTime">{{new Date(articleDetail.pubTime).toLocaleString().substr(0,9)}}</span>
                      </el-col>
                      <el-col :span="6" class="m_t20"><a :href="articleDetail.userUrl" target="_blank"
                                                         class="a_text">作者：<span
                        v-if="articleDetail.author">{{articleDetail.author}}</span></a>
                      </el-col>
                      <el-col :span="3" class="m_t20"><a :href="articleDetail.url" class="title_a"
                                                         target="_blank"><span></span>原文链接</a>
                      </el-col>
                    </div>
                  </el-col>
                </el-row>
                <!--内容-->
                <el-row :gutter="2" class="list border_1">
                  <el-col :span="24">
                    <div class="key"><span
                      class="field">关键字</span>：<span
                                                     v-if="articleDetail.nlp.keywords">{{articleDetail.nlp.keywords}}</span>
                    </div>
                  </el-col>
                  <el-col :span="24">
                    <div class="content">
                      <div v-if="articleDetail.content" v-html="articleDetail.content"></div>
                    </div>
                  </el-col>
                  <el-col :span="24">
                    <el-col :span="17" style="text-align: left">
                      <div class="panel-footer text-left entity fiex_entity ">
                        <dt class="dt_entity"> 实体类别图示</dt>
                        <dd class="person_name_label"><b>人名</b></dd>
                        <dd class="area_label"><b>地名</b></dd>
                        <dd class="org_name_label"><b>机构名</b></dd>
                      </div>
                    </el-col>
                    <el-col :span="7" class="m_l10 share">
                      <div class="share_font">分享到：</div>
                      <div class="share-area"></div>
                    </el-col>
                  </el-col>
                </el-row>
              </el-col>
              <!--贴吧-->
              <el-col v-if="type=='bar'" :span="20" class="m_l10">
                <!--标题-->
                <el-row :gutter="1" class="list border_1">
                  <el-col :span="22" class="font_style">
                    <div class="title" v-if="articleDetail.title">{{articleDetail.title}}</div>
                    <div class="new">
                      <el-col :span="8" class="m_t20">文章来源：<span
                        v-if="articleDetail.source">{{articleDetail.source}}</span>
                      </el-col>
                      <el-col :span="7" class="m_t20">发布时间：<span v-if="articleDetail.pubTime">{{new Date(articleDetail.pubTime).toLocaleString().substr(0,9)}}</span>
                      </el-col>
                      <el-col :span="6" class="m_t20">作者：<span
                        v-if="articleDetail.author">{{articleDetail.author}}</span>
                      </el-col>
                      <el-col :span="3" class="m_t20"><a :href="articleDetail.url" class="title_a"
                                                         target="_blank"><span></span>原文链接</a>
                      </el-col>

                    </div>
                  </el-col>
                </el-row>
                <!--内容-->
                <el-row :gutter="2" class="list border_1">
                  <el-col :span="24">
                    <div class="key"><span
                      class="field">关键字</span>：<span
                                                     v-if="articleDetail.nlp.keywords">{{articleDetail.nlp.keywords}}</span>
                    </div>
                  </el-col>
                  <el-col :span="24">
                    <div class="content">
                      <div v-if="articleDetail.content" v-html="articleDetail.content"></div>
                    </div>
                  </el-col>
                  <el-col :span="24">
                    <el-col :span="17" style="text-align: left">
                      <div class="panel-footer text-left entity fiex_entity ">
                        <dt class="dt_entity"> 实体类别图示</dt>
                        <dd class="person_name_label"><b>人名</b></dd>
                        <dd class="area_label"><b>地名</b></dd>
                        <dd class="org_name_label"><b>机构名</b></dd>
                      </div>
                    </el-col>
                    <el-col :span="7" class="m_l10 share">
                      <div class="share_font">分享到：</div>
                      <div class="share-area"></div>
                    </el-col>
                  </el-col>
                </el-row>
              </el-col>
              <!--微博-->
              <el-col v-if="type=='weibo'" :span="20" class="m_l10">
                <!--标题-->
                <el-row :gutter="1" class="list border_1">
                  <el-col :span="22" class="font_style">
                    <div class="title" v-if="articleDetail.title">{{articleDetail.title}}</div>
                    <div class="new">
                      <!--<el-col :span="9" class="m_t20">文章来源：<span v-if="articleDetail.source">{{articleDetail.source}}</span>-->
                      <!--</el-col>-->
                      <el-col :span="8" class="m_t20">发布时间：<span v-if="articleDetail.pubTime">{{new Date(articleDetail.pubTime).toLocaleString().substr(0,9)}}</span>
                      </el-col>
                      <el-col :span="8" class="m_t20"><a :href="articleDetail.userUrl"
                                                         target="_blank"
                                                         class="a_text">作者：<span
                        v-if="articleDetail.author">{{articleDetail.author}}</span></a>
                      </el-col>
                      <el-col :span="8" class="m_t20"><a :href="articleDetail.url" class="title_a"
                                                         target="_blank"><span></span>原文链接</a>
                      </el-col>
                    </div>
                  </el-col>
                </el-row>
                <!--内容-->
                <el-row :gutter="2" class="list border_1">
                  <el-col :span="24">
                    <div class="key"><span
                      class="field">关键字</span>：<span
                                                     v-if="articleDetail.nlp.keywords">{{articleDetail.nlp.keywords}}</span>
                    </div>
                  </el-col>
                  <el-col :span="24">
                    <div class="articleContent">
                      <div v-if="articleDetail.content" v-html="articleDetail.content"></div>
                    </div>
                  </el-col>
                  <el-col :span="24">
                    <el-col :span="17" style="text-align: left">
                      <div class="panel-footer text-left entity fiex_entity ">
                        <dt class="dt_entity"> 实体类别图示</dt>
                        <dd class="person_name_label"><b>人名</b></dd>
                        <dd class="area_label"><b>地名</b></dd>
                        <dd class="org_name_label"><b>机构名</b></dd>
                      </div>
                    </el-col>
                    <el-col :span="7" class="m_l10 share">
                      <div class="share_font">分享到：</div>
                      <div class="share-area"></div>
                    </el-col>
                  </el-col>
                </el-row>
              </el-col>
            </div>
            <!--情感-->
            <el-col :span="20" class="m_l10" style="height: 330px" v-loading="sentimentAnalysisLoading">
              <el-row :gutter="2" class="list border_1">
                <el-col style="height:330px; text-align: left;" :span="12">
                  <el-col :span="1">
                    <div class="enootionImg"></div>
                  </el-col>
                  <div class="emotionTitle">情感分析</div>
                  <gauge-chart :chartConfig="emotionAnalysisChartConfig"

                  ></gauge-chart>
                </el-col>
                <el-col style="height:330px; text-align: left;" :span="12">
                  <el-col :span="1">
                    <div class="hotImg"></div>
                  </el-col>
                  <div class="emotionTitle">热点词云</div>
                  <keywords-chart :chartConfig="articlehotWords"></keywords-chart>
                </el-col>
              </el-row>
            </el-col>

            <!--评论-->
            <el-row :gutter="5" v-if="commentListHtml==true" class="list">
              <el-col :span="12" class="m_l10" style="text-align: left">
                <el-row :gutter="2" class="list">
                  <el-col :span="24">
                    <el-col :span="1">
                      <div class="comments"></div>
                    </el-col>
                    <div class="emotionTitle">评论分析</div>
                  </el-col>
                </el-row>
              </el-col>
              <el-col :span="20" class="m_l10" style="margin-top: 30px">
                <el-row :gutter="2" class="list">
                  <el-col :span="15">
                    <comment-list :articles="commentList.content" :pager="pager"
                                  @data="getData" v-loading=" commentLists"></comment-list>
                  </el-col>
                  <el-col style="height: 320px;" :span="9">
                    <div class="emotionTitle">评论情感分析</div>
                    <pie-chart :chartConfig="sentimentAnalysis"
                               v-loading="sentimentCommentLoading"></pie-chart>
                  </el-col>
                  <el-col style="height: 320px;" :span="9">
                    <div class="emotionTitle">热议网民</div>
                    <line-bar-chart v-loading="mediaSiteChartLoading" :chartConfig="netizenConsensusBar"
                    ></line-bar-chart>
                  </el-col>
                </el-row>
              </el-col>
              <el-col :span="20" class="m_l10">
                <el-row :gutter="2" class="list ">
                  <el-col style="height: 400px;" :span="12">
                    <div class="emotionTitle">评论热点词云</div>
                    <el-card class="box-card" :body-style="{ padding: '10px' }"
                             style="height: 400px;margin-top: 10px;margin-right: 10px">
                      <keywords-chart :chartConfig="commentKeywordsChart"
                                      v-loading="keywordsCloude"></keywords-chart>
                    </el-card>
                  </el-col>
                  <el-col style="height: 400px;" :span="12">
                    <div class="emotionTitle">评论地域分布</div>
                    <el-card class="box-card" :body-style="{ padding: '10px' }"
                             style="height: 400px;margin-right: 10px;margin-top: 10px;">
                      <map-chart :chartConfig="netizenMap"
                                 v-loading="netizenMapLoading"></map-chart>
                    </el-card>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </el-row>
        </div>
        <!--</el-card>-->
      </el-col>
    </el-row>
  </div>
</template>
<script>
  import datePicker from '@/components/common/date-picker'
  import articleTab from '@/components/common/article-tab-list'
  import articleList from '@/components/common/articles'
  import Comment from '@/components/common/comment'
  import pieChart from '@/components/common/charts/pie'
  import MapChart from '@/components/common/charts/map'
  import gaugeChart from '@/components/common/charts/gauge'
  import lineBarChart from '@/components/common/charts/line-bar'
  import keywordsChart from '@/components/common/charts/keywords-cloud'
  import {gaugeChartOption} from '@/components/common/options/gauge-chart'
  import {pieChartOption} from '@/components/common/options/pie-chart'
  import {mapChartOption} from '@/components/common/options/map-chart'
  import {barChartOption} from '@/components/common/options/bar-chart'
  import {typeUtil} from '@/utils/typeUtil'
  import {dateUtil} from '@/utils/dateUtil'
  import {utils} from '@/utils/utils'
  import {
    getArticleDetail,
    getDetailHotWords,
    getArticleComment,
    getCommentTypeChart,
    getCommentHotwords
  } from '@/service/article'
  import $ from 'jquery'
  import '../../../static/plugin/social-share.min.js'
  export default {
    name: 'index',
    data () {
      return {
        id: '',
        type: '',
        contentLoading: true,
        sentimentAnalysisLoading: true,
        mediaSiteChartLoading: true,
        commentListHtml: false,
        commentLists: true,
        pager: {
          pageSize: 10,
          currentPage: 1,
          totalElements: 1
        },
        article: {
          url: '',
          title: ''
        },
        articleDetail: {
          author: '',
          nameEntitys: [],
          title: '',
          source: '',
          pubTime: '',
          nlp: {
            keywords: [],
            nameEntity: {
              org: [],
              people: [],
              place: []
            },
            sentiment: {
              lable: '',
              value: 0
            }
          },
          url: ''
        },
        datePickerForm: {},
        emotionAnalysisChartConfig: {
          chartId: 'emotion-chart',
          option: {},
          events: {
            'click': function (param) {
            }
          }
        },
        articlehotWords: {
          chartId: 'hotLists',
          option: {},
          events: {
            'click': function (param) {
            }
          }
        },
        sentimentAnalysis: {
          chartId: 'sentimentAnalysis',
          option: {},
          events: {}
        },
        netizenConsensusBar: {
          chartId: 'netizen-comments-bar',
          option: {},
          events: {}
        },
        commentKeywordsChart: {
          chartId: 'keywords-comment-chart',
          option: {}
        },
        netizenMap: {
          chartId: 'netizen-map',
          option: {
            mapType: 'china'
          },
          events: {}
        },
        keywordsConfig: {},
        keywords: {},
        heightLightWords: '',
        commentList: {
          content: [{
            author: '',
            content: '',
            title: ''
          }]
        }
      }
    },
    components: {
      'date-picker': datePicker,
      'article-tab': articleTab,
      'comment-list': Comment,
      'pie-chart': pieChart,
      'line-bar-chart': lineBarChart,
      'keywords-chart': keywordsChart,
      'article-list': articleList,
      'gauge-chart': gaugeChart,
      'map-chart': MapChart
    },
    created () {
      // set the default date time
      let self = this
      let date = new Date()
      self.datePickerForm.startDate = dateUtil.addDate(date, 'M', -1)
      self.datePickerForm.endDate = dateUtil.addDate(date, 'd', 1)
      self.id = utils.getQueryVariable('id')
      // get the keywords and the heightLightWords
      self.keywordsConfig = JSON.parse(localStorage.getItem('baseKeywords'))
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
        this.getArticlesDetails()
        this.getDetailHotWords()
        this.getArticleComment()
        this.getCommentSentimentTypeChart()
        this.getCommentNetizenBar()
        this.getCommentKeywordsChart()
        this.getNetizenMap()
      },
      /**
       * 共享插件方法
       * @param data
       */
      shareArticle: function () {
        var self = this
        var el = $('.share-area')
        var options = {
          sites: ['qzone', 'qq', 'weibo', 'wechat'],
          url: self.article.url,
          title: self.article.title
        }
        window.socialShare(el, options)
      },
      /** 获取文章标题列表
       * @param type
       * 文章类型
       */
      getArticlesDetails () {
        let self = this
        let params = {
          id: self.id
        }
        params.displayConfig = {}
        getArticleDetail(params).then(data => {
          self.contentLoading = false
          if (data) {
            data.content = utils.heightLightKeywords(data.content, data.content.length, '...', '', '')
            if (data.nlp.nameEntity.org) {
              data.content = utils.detailHeightLightKeywords(data.content, data.content.length, '...', data.nlp.nameEntity.org, '', 'org_name')
            }
            if (data.nlp.nameEntity.place) {
              data.content = utils.detailHeightLightKeywords(data.content, data.content.length, '...', data.nlp.nameEntity.place, '', 'area')
            }
            if (data.nlp.nameEntity.people) {
              data.content = utils.detailHeightLightKeywords(data.content, data.content.length, '...', data.nlp.nameEntity.people, '', 'person_name')
            }
            self.type = data.type
            self.articleDetail = data
            self.article.url = data.url
            self.article.title = data.title
          }
          self.getEmotionAnalysisChart(self.articleDetail.nlp.sentiment)
        }).catch(error => {
          self.$confirm(error.message, '错误', {type: 'error'})
        })
      },
      /**
       * 获取情感分析正负面图
       */
      getEmotionAnalysisChart (sentiment) {
        let self = this
        let data = {}
        data.name = sentiment.label
        data.value = parseInt(sentiment.value * 100)
        self.sentimentAnalysisLoading = false
        let renderData = []
        let renderItem = {}
//        renderItem.name = '情感分析'
        renderItem.data = data
        renderData.push(renderItem)
        let chartConfig = {}
        self.emotionAnalysisChartConfig.option = gaugeChartOption.getOption(renderData, chartConfig)
      },
      /**
       * 主流媒体站点图，文章类型为‘new’
       */
      getCommentNetizenBar () {
        let self = this
        let params = {
          groupName: 'author',
          articleType: 'comments',
          kv: 'parent' + self.id
        }
        getCommentTypeChart(params).then(data => {
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
          self.netizenConsensusBar.option = barChartOption.getOption(renderData, chartConfig)
        }).catch(error => {
          self.$confirm(error.message, '错误', {type: 'error'})
        })
      },
      /**
       * 根据条件获取关键词云
       */
      getDetailHotWords () {
        let self = this
        let params = {
          'id': self.id,
          'count': 50
        }
        getDetailHotWords(params).then(data => {
//          self.hotKeywordsChartLoading = false
          let option = {data: []}
          if (data.length > 0) {
            data.forEach(function (word) {
              let obj = {}
              obj.keyword = word.key
              obj.score = word.score
              option.data.push(obj)
            })
          }
          self.articlehotWords.option = option
        }).catch(error => {
          self.$confirm(error.message, '错误', {type: 'error'})
        })
      },
      getArticleComment () {
        let self = this
        self.pager.pageSize = 5
        let params = {
//          'keyword': self.keywords,
          'page': {
            'limit': self.pager.pageSize,
            'page': self.pager.currentPage
          },
          'searchKv': [
            {
              'key': 'parent',
              'value': self.id
            }
          ],
          'type': [
            'comments'
          ]
        }
        getArticleComment(params).then(data => {
          if (data.content.length > 0) {
            data.content.forEach(function (item) {
              item.pubTime = dateUtil.formatDate(new Date(item.pubTime), 'yyyy/MM/dd')
              item.content = item.content.substring(0, 20) + '...'
            })
            self.commentLists = false
            if (data.content.length > 0 && self.commentListHtml === false) {
              self.commentListHtml = true
            }
            self.commentList = data
            self.pager.totalElements = data.totalElements
          }
        }).catch(error => {
          self.$confirm(error.message, '错误', {type: 'error'})
        })
      },
      getData (data) {
        let self = this
        self.pager = data.commentPager
        self.getArticleComment()
      },
      getCommentSentimentTypeChart () {
        let self = this
        let params = {
          groupName: 'nlp.sentiment.label',
          mustWord: self.keywords.mustWord,
          shouldWord: self.keywords.shouldWord,
          mustNotWord: self.keywords.mustNotWord,
          articleType: 'comments',
          kv: 'parent,' + self.id
        }
        getCommentTypeChart(params).then(data => {
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
          self.sentimentAnalysis.option = pieChartOption.getOption(renderData, chartConfig)
//          self.hotKeywordsChartLoading = false
        }).catch(error => {
          self.$confirm(error.message, '错误', {type: 'error'})
        })
      },
      getCommentKeywordsChart () {
        let self = this
        let params = {
          limit: 50,
          kv: 'parent,' + self.id
        }
        getCommentHotwords(params).then(data => {
//          self.hotKeywordsChartLoading = false
          let option = {data: []}
          if (data.length > 0) {
            data.forEach(function (word) {
              let obj = {}
              obj.keyword = word.key
              obj.score = word.value
              option.data.push(obj)
            })
          }
          self.commentKeywordsChart.option = option
        }).catch(error => {
          self.$confirm(error.message, '错误', {type: 'error'})
        })
      },
      getNetizenMap () {
        let self = this
        let params = {
          groupName: 'area',
          articleType: 'comments',
          kv: 'parent,' + self.id
        }
        getCommentTypeChart(params).then(data => {
          if (data && data.length > 0) {
            let renderData = []
            let seriesData = []
            let renderItem = {}
            let maxCount = 0
            $.each(data, function (i, item) {
              var node = {}
              node.name = item.key.substring(0, 2)
              node.value = item.value
              seriesData.push(node)
            })
            seriesData.sort(function (a, b) {
              return b.value - a.value
            })
            maxCount = seriesData[0].value === undefined ? 10 : seriesData[0].value
            renderItem.data = seriesData
            renderData.push(renderItem)
            let chartConfig = {visualMapData: {max: maxCount}}
            self.netizenMap.option = mapChartOption.getOption(renderData, chartConfig)
          }
        }).catch(error => {
          self.$confirm(error.message, '错误', {type: 'error'})
        })
      }
    },
    watch: {
      article: {
        handler: function (val, oldVal) {
          var self = this
          if (val) {
            self.$nextTick(function () {
              // DOM 现在更新了
              // `this` 绑定到当前实例
              self.shareArticle()
            })
          }
        },
        deep: true
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss">
  #detail {
    height: 100%;
    .box-tablist {
      padding: 0px 20px;
      background: -webkit-linear-gradient(top, #00b7ed 0, #00b8ec 100%);
      background: -moz-linear-gradient(top, #00b7ed 0, #00b8ec 100%);
      background: -o-linear-gradient(top, #00b7ed 0, #00b8ec 100%);
      background: linear-gradient(to bottom, #00b7ed 0, #00b8ec 100%);
      -webkit-filter: blur(10px); /* Chrome, Opera */
      -moz-filter: blur(10px);
      -ms-filter: blur(10px);
      filter: blur(10px);
      filter: progid:DXImageTransform.Microsoft.Blur(PixelRadius=10, MakeShadow=false);
      color: #000000;
    }

    .row-bg {
      padding: 10px 0;
    }

    .list-header {
      text-align: center;
      .title {
        color: #ffffff;
        font-size: 30px;
        line-height: 78px;
        width: 371px;
        height: 78px;
        margin: auto;
        background-image: url('../../assets/img/bgbj.png');
      }
    }

    .m_l10 {
      margin-left: 10%;
    }

    .border_1 {
      border-bottom: 1px solid #ddd;
    }

    .font_style {
      margin-top: 20px;
      font-size: 18px;
      font-family: '微软雅黑';
    }

    .entity {
      display: inline-block;
    }

    .dt_entity {
      font-family: 'Microsoft Yahei', 'SimSun';
      margin-bottom: 15px;
      font-size: 20px;
      opacity: 0.9;
    }

    .person_name_label {
      background-color: #99CC67;
      color: #fff;
      font-family: 'Microsoft Yahei', 'SimSun';
    }

    .person_name {
      color: #99CC67;
      font-family: 'Microsoft Yahei', 'SimSun';

    }

    .area_label {
      background-color: #488fce;
      color: #fff;
      font-family: 'Microsoft Yahei', 'SimSun';;
    }

    .area {
      color: #488fce;
      font-family: 'Microsoft Yahei', 'SimSun';;
    }

    .red_name {
      color: #ff0000;
      font-family: 'Microsoft Yahei', 'SimSun';;
    }

    .org_name {
      color: rgb(255, 127, 14);
      font-family: 'Microsoft Yahei', 'SimSun';;
    }

    .org_name_label {
      background-color: rgb(255, 127, 14);
      color: #fff;
      font-family: 'Microsoft Yahei', 'SimSun';;
    }

    dd {
      display: inline-block;
      font-size: 14px;
      height: 26px;
      line-height: 26px;
      margin: 0 5px 5px 0;
      padding: 0 11px;
      color: black;
    }

    #emotion-chart {
      width: 100%;
      height: 300px;
    }

    #bbs-emotion-gauge {
      width: 100%;
      height: 300px;
    }

    .field {
      color: #3A92C4;
      font-weight: 700;
    }

    .title {
      min-height: 110px;
      line-height: 50px;
      font-size: 24px;
      text-align: center;
      color: #fff;
      font-family: '微软雅黑';
    }

    .title_a {
      color: #999 !important;
      font-size: 16px;
      font-weight: 700;
      font-family: '微软雅黑';
      vertical-align: middle;
      text-decoration: none;
    }

    .title_a span {
      display: inline-block;
      width: 14%;
      height: 25px;
      margin-top: -6px;
      background: url("../../assets/img/reader.svg") center no-repeat;
      background-size: contain;

    }

    .main {
      min-height: 200px;
      /*padding: 0px 40px 0px 40px !important;*/
    }

    .new {
      height: 50px;
      font-size: 16px;
      font-family: '微软雅黑';
      font-weight: 700;
      text-align: center;
      color: #999
    }

    .a_text {
      text-decoration: none;
      color: #999;
    }

    .articleContent {
      text-align: left;
      margin-bottom: 20px;
      text-indent: 2em;
      margin-top: 10px;
      font-size: 16px;
      font-family: '微软雅黑';
    }
    .content {
      text-align: left;
      text-indent: 2em;
      margin-bottom: 10px;
    }

    #hotLists {
      width: 100%;
      height: 300px;
    }

    #sentimentAnalysis {
      width: 100%;
      height: 290px;
    }

    #netizen-comments-bar {
      width: 100%;
      height: 290px;
    }

    #netizen-map {
      width: 100%;
      height: 400px;
    }

    #keywords-comment-chart {
      width: 100%;
      height: 400px;
    }

    .share_font {
      float: left;
      display: inline-block;
      vertical-align: middle;
      font-size: 16px;
      padding-top: 8px;
      font-family: '微软雅黑';
      font-weight: 500;
      color: #999;
    }

    .share_icon {
      display: inline-block;
    }

    .share {
      margin-top: -50px;
      float: right;
      vertical-align: top;
    }

    .key {
      height: auto;
      line-height: 30px;
      text-align: left;
      font-size: 14px;
      font-family: '\5FAE\8F6F\96C5\9ED1';
      font-weight: 700;
      text-indent: 2em;
      color: #666;
    }

    .m_t20 {
      margin-top: 20px;
    }

    .enootionImg {
      display: inline-block;
      width: 40px;
      height: 25px;
      margin-top: 12px;
      margin-left: -2px;
      background: url("../../assets/img/xinxin.png") center no-repeat;
      background-size: cover;

    }

    .comments {
      display: inline-block;
      width: 40px;
      height: 30px;
      margin-top: 12px;
      margin-left: -2px;
      background: url("../../assets/img/comment.png") center no-repeat;
      background-size: contain;

    }

    .hotImg {
      display: inline-block;
      width: 40px;
      height: 25px;
      margin-top: 12px;
      margin-left: -2px;
      background: url("../../assets/img/huohuo.png") center no-repeat;
      background-size: cover;
    }

    .emotionTitle {
      display: inline-block;
      margin-left: 12px;
      margin-top: 11px;
      font-size: 22px;
      font-family: '微软雅黑';
      font-weight: 700;
      color: #3295AC;

    }

    .p_t {
      padding-top: 80px;
    }

    .el-pagination {
      margin: 0 !important;
    }

    /*@media screen and (min-width: 1361px) and (min-width: 1366px) {*/
    /*.key {*/
    /*min-height: 80px;*/
    /*line-height: 80px;*/
    /*font-size: 14px;*/
    /*font-family: '\5FAE\8F6F\96C5\9ED';*/
    /*font-weight: 700;*/
    /*text-indent: 2em;*/
    /*}*/
    /*.new {*/
    /*height: 43px;*/
    /*}*/
    /*}*/
  }
</style>
