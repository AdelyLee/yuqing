<template>
  <div id="leader-yuqing">
    <!---start: 搜索输入框-->
    <el-row :gutter="20">
      <el-col :span="12" :offset="6">
        <div class="card-body">
          <el-col class="search-html">
            <div class="input-search">
              <el-input placeholder="请输入内容" v-model="condition.mustWord">
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
                  <el-form-item label="关键词">
                    <el-input type="textarea" v-model="condition.mustWord" :autosize="true"
                              placeholder="关键词之间用@隔开"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="同现词">
                    <el-input type="textarea" v-model="condition.shouldWord" :autosize="true"
                              placeholder="同现词之间用@隔开"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row class="srarch-screen">
                <el-col :span="12">
                  <el-form-item label="排除词">
                    <el-input type="textarea" v-model="condition.mustNotWord" :autosize="true"
                              placeholder="排除词之间用@隔开"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="信息排序">
                    <el-radio-group v-model="condition.direction" @change="changeSort">
                      <el-radio label="DESC">时间降序</el-radio>
                      <el-radio label="ASC">时间升序</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row class="srarch-screen">
                <el-col :span="12">
                  <el-form-item label="发布时间">
                    <el-col :span="10">
                      <el-date-picker v-model="condition.startDate" type="date" placeholder="选择开始日期">
                      </el-date-picker>
                    </el-col>
                    <el-col class="line" :span="1">～</el-col>
                    <el-col :span="10">
                      <el-date-picker v-model="condition.endDate" type="date"
                                      placeholder="选择结束日期"></el-date-picker>
                    </el-col>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="匹配方式">
                    <el-radio-group v-model="condition.filed" @change="changeFiled">
                      <el-radio label="">按全文</el-radio>
                      <el-radio label="content">按正文</el-radio>
                      <el-radio label="title">按标题</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row class="srarch-screen">
                <el-col :span="12">
                  <el-form-item label="情感属性">
                    <div class="all">
                      <el-checkbox :indeterminate="isIndeterminateEmotion" v-model="checkAllEmotion"
                                   @change="handleEmotionCheckAllChange">全选
                      </el-checkbox>
                    </div>
                    <div class="single">
                      <el-checkbox-group v-model="emotionArray" @change="handleCheckedEmotionChange">
                        <el-checkbox v-for="emotion in emotions" :label="emotion" :key="emotion">{{emotion}}
                        </el-checkbox>
                      </el-checkbox-group>
                    </div>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="载体类型">
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
              <el-row class="srarch-screen-noborder">
                <el-col :span="12">
                  <el-form-item label="显示条数">
                    <el-radio-group v-model="pager.pageSize" @change="changePageSize">
                      <el-radio :label="10">10</el-radio>
                      <el-radio :label="30">30</el-radio>
                      <el-radio :label="50">50</el-radio>
                      <el-radio :label="100">100</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-collapse-item>
        </el-collapse>
      </el-col>
    </el-row>
    <el-row :gutter="15">
      <el-col :span="6">
        <el-card class="box-card">
          <div slot="header" class="chart-header">
            <span class="chart-text">事故列表</span>
          </div>
          <div>
            <p align="left">
              国家安全监管总局台风橙色预警信息：中央气象台8月26日18时发布台风橙色预警...
            </p>
            <div align="right">
              <span>2017-03-17</span>
            </div>
          </div>
          <div>
            <p align="left">
              国家安全监管总局台风橙色预警信息：中央气象台8月26日18时发布台风橙色预警
            </p>
            <div align="right">
              <span>2017-03-17</span>
            </div>
          </div>
          <div>
            <p align="left">
              国家安全监管总局台风橙色预警信息：中央气象台8月26日18时发布台风橙色预警
            </p>
            <div align="right">
              <span>2017-03-17</span>
            </div>
          </div>
          <div>
            <p align="left">
              国家安全监管总局台风橙色预警信息：中央气象台8月26日18时发布台风橙色预警
            </p>
            <div align="right">
              <span>2017-03-17</span>
            </div>
          </div>
          <div>
            <p align="left">
              国家安全监管总局台风橙色预警信息：中央气象台8月26日18时发布台风橙色预警
            </p>
            <div align="right">
              <span>2017-03-17</span>
            </div>
          </div>
          <div>
            <p align="left">
              国家安全监管总局台风橙色预警信息：中央气象台8月26日18时发布台风橙色预警
            </p>
            <div align="right">
              <span>2017-03-17</span>
            </div>
          </div>
          <div>
            <p align="left">
              国家安全监管总局台风橙色预警信息：中央气象台8月26日18时发布台风橙色预警
            </p>
            <div align="right">
              <span>2017-03-17</span>
            </div>
          </div>
          <div>
            <p align="left">
              国家安全监管总局台风橙色预警信息：中央气象台8月26日18时发布台风橙色预警
            </p>
            <div align="right">
              <span>2017-03-17</span>
            </div>
          </div>
          <div>
            <p align="left">
              国家安全监管总局台风橙色预警信息：中央气象台8月26日18时发布台风橙色预警
            </p>
            <div align="right">
              <span>2017-03-17</span>
            </div>
          </div>
          <div>
            <p align="left">
              国家安全监管总局台风橙色预警信息：中央气象台8月26日18时发布台风橙色预警
            </p>
            <div align="right">
              <span>2017-03-17</span>
            </div>
          </div>
          <div class="block">
            <el-pagination
              layout="prev, pager, next"
              :total="50">
            </el-pagination>
          </div>
        </el-card>
      </el-col>
      <el-col :span="18">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="事件详情" name="details">
            <el-row :gutter="15">
              <el-col :span="24">
                <el-card class="box-card" :body-style="{ padding: '0px' }">
                  <div>
                    <el-table
                      :data="tableData"
                      style="width: 100%">
                      <el-table-column
                        prop="content"
                        label="内容">
                      </el-table-column>
                      <el-table-column
                        prop="site"
                        label="来源"
                        width="180">
                      </el-table-column>
                      <el-table-column
                        prop="pubTime"
                        label="时间"
                        width="180">
                      </el-table-column>
                    </el-table>
                    <list-page :pager="pager"></list-page>
                  </div>
                </el-card>
              </el-col>
            </el-row>
            <el-row :gutter="15">
              <el-col :span="24">
                <el-card class="box-card" :body-style="{ padding: '0px' }">
                  <div slot="header" class="chart-header">
                    <span class="iconfont icon-areaAccident"></span><span
                    class="chart-text">地域分布</span>
                  </div>
                  <div>
                    <line-bar-chart :chartConfig="areaWarningConfig"></line-bar-chart>
                  </div>
                </el-card>
              </el-col>
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="舆情热点" name="hot"></el-tab-pane>
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
                  @data="getData">
    </article-list>
  </div>
</template>
<script>
  import Pager from '@/components/common/pager'
  import lineBarChart from '@/components/common/charts/line-bar'
  import articleList from '@/components/common/articles'
  import {barChartOption} from '@/components/common/options/bar-chart'
  import {
//    getArticles,
    getFilterAndGroupBy
  } from '@/service/article'
  import dragTree from '@/components/common/drag-tree'
  const typeOptions = ['新闻', '微博', '贴吧', '论坛']
  const emotionOptions = ['正面', '负面', '中性']
  export default {
    name: 'accidentMonitor',
    data() {
      return {
        condition: {
          mustWord: '',
          mustNotWord: '',
          shouldWord: '',
          startDate: '',
          endDate: '',
          direction: 'DESC', // 排序方式ASC DESC
          filed: '',
          orders: [],
          searchKv: [],
          type: []
        },
        emotionArray: [],
        mediaTypeArray: [],
        mediaTypes: typeOptions,
        emotions: emotionOptions,
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
        articles: [
          {
            'url': 'http://toutiao.com/group/6452467538755322381/?iid=0&app=news_article',
            'type': 'news',
            'title': '<font style="color: red"><font style="color: red">九寨沟</font></font>美景，加油<font style="color: red"><font style="color: red">九寨沟</font></font>',
            'source': '今日头条',
            'site': '今日头条',
            'pubTime': '2017/08/10',
            nlp: {
              sentiment: {
                'label': '中性'
              }
            },
            'id': 'fd66f2a9f26c08ca3e2e1e200a508421',
            'content': '<font style="color: red"><font style="color: red">九寨沟</font></font>',
            'commentNum': 0,
            'collected': 'false'
          }
        ],
        articleListId: 'article-list',
        areaWarningConfig: {
          chartId: 'areaWarning',
          option: {},
          events: {
            'click': function (param) {
              self.articlesConditions = {}
              self.pager.currentPage = 1
              self.articlesConditions.startDate = '2017-01-01'
              self.articlesConditions.endDate = '2017-08-28'
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
      'drag-tree': dragTree
    },
    mounted () {
      this.getAreaWarningBarChart()
    },
    methods: {
      /*
       *根据点击tab来分别渲染
       */
      handleClick(tab, event) {
        switch (tab.name) {
          case 'details':
//            this.articles = []
            break
          case 'hot':
//            this.articles = []
            break
          case 'path':
//            this.articles = []
            this.getAreaWarningBarChart()
            break
          case 'netizen':
//            this.articles = []
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
          debugger
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
      }
    }
  }
</script>
