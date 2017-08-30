<template>
  <div id="leader-yuqing">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="领导舆情" name="leaderYuqing">
        <div class="card-body" id="content">
          <el-row :gutter="15">
            <el-col :span="5">
              <drag-tree :dragTreeList="dragTreeList"></drag-tree>
            </el-col>
            <el-col :span="19">
              <el-row :gutter="5" class="list">
                <el-col :span="16">
                  <div class="card-body">
                    <el-col class="search-html">
                      <div class="input-search">
                        <el-input placeholder="请输入内容">
                        </el-input>
                      </div>
                      <el-button class="btn-search"><span class="el-icon-search">搜索</span>
                      </el-button>
                    </el-col>
                  </div>
                </el-col>
                <el-col :span="8"><el-button type="primary" icon="edit">预警规则</el-button></el-col>
              </el-row>
              <el-row :gutter="15">
                <div class="el-card box-card">
                  <div class="leader-header">
                    <li>时间</li>
                    <li>新闻数量</li>
                    <li>情感</li>
                  </div>
                  <div class="leader-content">
                  </div>
                </div>
              </el-row>
            </el-col>
          </el-row>
        </div>
      </el-tab-pane>
      <el-tab-pane label="新闻公告" name="newsNotice"></el-tab-pane>
      <el-tab-pane label="关键领域" name="cruxField">
        <el-row :gutter="15">
          <el-col :span="6">
            <el-card class="box-card">
              <div slot="header" class="chart-header">
                <span class="chart-text">关键领域提示列表</span>
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
              <div class="block">
                <el-pagination
                  layout="prev, pager, next"
                  :total="50">
                </el-pagination>
              </div>
            </el-card>
          </el-col>
          <el-col :span="18">
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
      <el-tab-pane label="关键时段" name="cruxTimes">
      </el-tab-pane>
    </el-tabs>
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
  export default {
    name: 'leaderYuqing',
    data() {
      return {
        activeName: 'leaderYuqing',
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
          case 'leaderYuqing':
//            this.articles = []
            break
          case 'newsNotice':
//            this.articles = []
            break
          case 'cruxField':
//            this.articles = []
            this.getAreaWarningBarChart()
            break
          case 'cruxTimes':
//            this.articles = []
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
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss">
  .el-input {
    position: relative;
    font-size: 14px;
    border-radius: 15px;
    margin-left: 10px;}
  .el-button--primary {
    float: right;
    color: #fff;
    background-color: #20a0ff;
    border-color: #20a0ff;
  }
  #content{
    margin-top: 20px;
  }
</style>
