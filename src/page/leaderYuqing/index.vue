<template>
  <div id="leader-yuqing">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="领导舆情" name="leaderYuqing">
        <div class="card-body" id="content">
          <el-row :gutter="15">
            <el-col :span="5">
              <drag-tree :dragTreeList="dragTreeList" @data="getData"></drag-tree>
            </el-col>
            <el-col :span="19">
              <el-row :gutter="5" class="list">
                <el-col :span="16">
                  <div class="card-body">
                    <el-col class="search-html">
                      <div class="input-search">
                        <el-input v-model="leaderName" placeholder="请输入内容">
                        </el-input>
                      </div>
                      <el-button class="btn-search" @click.native="searchLeaderName(leaderName)"><span class="el-icon-search">搜索</span>
                      </el-button>
                    </el-col>
                  </div>
                </el-col>
              </el-row>
              <el-row :gutter="15">
                <div class="el-card box-card">
                  <div class="leader-header">
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
    <!--<el-dialog title="编辑关键词" v-model="addFormVisible" :close-on-click-modal="false">-->
    <!--<el-form :model="addForm" :rules="rules" ref="addForm" label-width="100px" class="demo-ruleForm">-->
    <!--<el-form-item  class="input-sqk" label="名称" prop="name">-->
    <!--<el-input v-model="addForm.name"></el-input>-->
    <!--</el-form-item>-->
    <!--<el-form-item  class="input-sqk" label="职务" prop="post">-->
    <!--<el-input v-model="addForm.post"></el-input>-->
    <!--</el-form-item>-->
    <!--<el-form-item  class="input-sqk" label="关键词" prop="must">-->
    <!--<el-input v-model="addForm.must"></el-input>-->
    <!--</el-form-item>-->
    <!--<el-form-item  class="input-sqk" label="同现词" prop="should">-->
    <!--<el-input v-model="addForm.should"></el-input>-->
    <!--</el-form-item>-->
    <!--</el-form>-->
    <!--<div slot="footer" class="dialog-footer">-->
    <!--<el-button type="info" @click="resetAddForm()">重置</el-button>-->
    <!--<el-button type="primary" @click.native="addFormSubmit(addForm)">添加</el-button>-->
    <!--</div>-->
    <!--</el-dialog>-->
  </div>
</template>
<script>
  import Pager from '@/components/common/pager'
  import lineBarChart from '@/components/common/charts/line-bar'
  import articleList from '@/components/common/articles'
  import {barChartOption} from '@/components/common/options/bar-chart'
  import {utils} from '@/utils/utils'
  import {getKeywords} from '@/service/config'
  import {
    getArticles,
    getFilterAndGroupBy
  } from '@/service/article'
  import dragTree from '@/components/common/drag-tree'
  export default {
    name: 'leaderYuqing',
    data() {
      return {
        activeName: 'leaderYuqing',
        leaderName: '',
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
        dragTreeList: [],
        keywordsConfig: {},
        keywords: {},
        heightLightWords: ''
      }
    },
    components: {
      'list-page': Pager,
      'line-bar-chart': lineBarChart,
      'article-list': articleList,
      'drag-tree': dragTree
    },
    created () {
      // set the default date time
      let self = this
      // get the keywords and the heightLightWords
      if (!localStorage.getItem('leaderKeywords')) {
        let leaderKeywordsParams = {type: 'LEADER'}
        getKeywords(leaderKeywordsParams).then(leaderKeywords => {
          self.keywordsConfig = leaderKeywords
          localStorage.setItem('leaderKeywords', JSON.stringify(leaderKeywords))
        })
      } else {
        self.keywordsConfig = JSON.parse(localStorage.getItem('leaderKeywords'))
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
      this.getAreaWarningBarChart()
      this.getLeaderNews('news')
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
      },
      getLeaderNews (type) {
        let self = this
        var params = {}
        if (self.leaderName !== '') {
          params = {
            keyword: {
              expression: '',
              mustNotWord: '',
              mustWord: '',
              shouldWord: self.leaderName
            },
            page: {
              limit: 10,
              orders: [],
              page: 1
            },
            type: [type]
          }
        } else {
          params = {
            keyword: self.keywords,
            page: {
              limit: 10,
              orders: [],
              page: 1
            },
            type: [type]
          }
        }
        getArticles(params).then(data => {
          self.articlesLoading = false
          self.articles = data.content
        }).catch(error => {
          self.$confirm(error.message, '错误', {type: 'error'})
        })
      },
      searchLeaderName (name) {
        this.getLeaderNews('news')
      },
      getData (data) {
        switch (data.action) {
          case 'Words':
            break
        }
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
  input.radio {margin: 0 2px 0 8px;}
  input.radio.first {margin-left:0;}
  input.empty {color: lightgray;}
  code {color: #2f332a;}
  .highlight_red {color:#A60000;}
  .highlight_green {color:#A7F43D;}
  li {list-style: circle;font-size: 12px;}
  li.title {list-style: none;}
  ul.list {margin-left: 17px;}

  div.content_wrap {width: 600px;height:380px;}
  div.content_wrap div.left{float: left;width: 250px;}
  div.content_wrap div.right{float: right;width: 340px;}
  div.zTreeDemoBackground {width:250px;height:362px;text-align:left;}

  ul.log {border: 1px solid #617775;background: #f0f6e4;width:300px;height:170px;overflow: hidden;}
  ul.log.small {height:45px;}
  ul.log li {color: #666666;list-style: none;padding-left: 10px;}
  ul.log li.dark {background-color: #E3E3E3;}

  /* ruler */
  div.ruler {height:20px; width:220px; background-color:#f0f6e4;border: 1px solid #333; margin-bottom: 5px; cursor: pointer}
  div.ruler div.cursor {height:20px; width:30px; background-color:#3C6E31; color:white; text-align: right; padding-right: 5px; cursor: pointer}
  .ztree * {padding:0; margin:0; font-size:12px; font-family: Verdana, Arial, Helvetica, AppleGothic, sans-serif}
  .ztree {margin:0; padding:5px; color:#333}
  .ztree li{padding:0; margin:0; list-style:none; line-height:17px; text-align:left; white-space:nowrap; outline:0}
  .ztree li ul{ margin:0; padding:0 0 0 18px}
  .ztree li ul.line{ background:url(../../../src/assets/img/line_conn.gif) 0 0 repeat-y;}

  .ztree li a {padding-right:3px; margin:0; cursor:pointer; height:21px; color:#333; background-color: transparent; text-decoration:none; vertical-align:top; display: inline-block}
  .ztree li a:hover {text-decoration:underline}
  .ztree li a.curSelectedNode {padding-top:0px; color:black; height:21px; opacity:0.8;}
  .ztree li a.curSelectedNode_Edit {padding-top:0px; background-color:#e5e5e5; color:black; height:21px; border:1px #666 solid; opacity:0.8;}
  .ztree li a.tmpTargetNode_inner {padding-top:0px; background-color:#aaa; color:white; height:21px; border:1px #666 solid;
    opacity:0.8; filter:alpha(opacity=80)}
  .ztree li a.tmpTargetNode_prev {}
  .ztree li a.tmpTargetNode_next {}
  .ztree li a input.rename {height:14px; width:80px; padding:0; margin:0;
    font-size:12px; border:1px #585956 solid; *border:0px}
  .ztree li span {line-height:21px; margin-right:2px}
  .ztree li span.button {line-height:0; margin:0; padding: 0; width:21px; height:21px; display: inline-block; vertical-align:middle;
    border:0 none; cursor: pointer;outline:none;
    background-color:transparent; background-repeat:no-repeat; background-attachment: scroll;
    background-image:url("../../../src/assets/img/metro.png"); *background-image:url("../../../src/assets/img/metro.gif")}

  .ztree li span.button.chk {width:13px; height:13px; margin:0 2px; cursor: auto}
  .ztree li span.button.chk.checkbox_false_full {background-position: -5px -5px;}
  .ztree li span.button.chk.checkbox_false_full_focus {background-position: -5px -26px;}
  .ztree li span.button.chk.checkbox_false_part {background-position: -5px -48px;}
  .ztree li span.button.chk.checkbox_false_part_focus {background-position: -5px -68px;}
  .ztree li span.button.chk.checkbox_false_disable {background-position: -5px -89px;}
  .ztree li span.button.chk.checkbox_true_full {background-position: -26px -5px;}
  .ztree li span.button.chk.checkbox_true_full_focus {background-position: -26px -26px;}
  .ztree li span.button.chk.checkbox_true_part {background-position: -26px -48px;}
  .ztree li span.button.chk.checkbox_true_part_focus {background-position: -26px -68px;}
  .ztree li span.button.chk.checkbox_true_disable {background-position: -26px -89px;}
  .ztree li span.button.chk.radio_false_full {background-position: -47px -5px;}
  .ztree li span.button.chk.radio_false_full_focus {background-position: -47px -26px;}
  .ztree li span.button.chk.radio_false_part {background-position: -47px -47px;}
  .ztree li span.button.chk.radio_false_part_focus {background-position: -47px -68px;}
  .ztree li span.button.chk.radio_false_disable {background-position: -47px -89px;}
  .ztree li span.button.chk.radio_true_full {background-position: -68px -5px;}
  .ztree li span.button.chk.radio_true_full_focus {background-position: -68px -26px;}
  .ztree li span.button.chk.radio_true_part {background-position: -68px -47px;}
  .ztree li span.button.chk.radio_true_part_focus {background-position: -68px -68px;}
  .ztree li span.button.chk.radio_true_disable {background-position: -68px -89px;}

  .ztree li span.button.switch {width:21px; height:21px}
  .ztree li span.button.root_open{background-position:-105px -63px}
  .ztree li span.button.root_close{background-position:-126px -63px}
  .ztree li span.button.roots_open{background-position: -105px 0;}
  .ztree li span.button.roots_close{background-position: -126px 0;}
  .ztree li span.button.center_open{background-position: -105px -21px;}
  .ztree li span.button.center_close{background-position: -126px -21px;}
  .ztree li span.button.bottom_open{background-position: -105px -42px;}
  .ztree li span.button.bottom_close{background-position: -126px -42px;}
  .ztree li span.button.noline_open{background-position: -105px -84px;}
  .ztree li span.button.noline_close{background-position: -126px -84px;}
  .ztree li span.button.root_docu{ background:none;}
  .ztree li span.button.roots_docu{background-position: -84px 0;}
  .ztree li span.button.center_docu{background-position: -84px -21px;}
  .ztree li span.button.bottom_docu{background-position: -84px -42px;}
  .ztree li span.button.noline_docu{ background:none;}

  .ztree li span.button.ico_open{margin-right:2px; background-position: -147px -21px; vertical-align:top; *vertical-align:middle}
  .ztree li span.button.ico_close{margin-right:2px; margin-right:2px; background-position: -147px 0; vertical-align:top; *vertical-align:middle}
  .ztree li span.button.ico_docu{margin-right:2px; background-position: -147px -42px; vertical-align:top; *vertical-align:middle}
  .ztree li span.button.edit {margin-left:2px; margin-right: -1px; background-position: -189px -21px; vertical-align:top; *vertical-align:middle}
  .ztree li span.button.edit:hover {
    background-position: -168px -21px;
  }
  .ztree li span.button.remove {margin-left:2px; margin-right: -1px; background-position: -189px -42px; vertical-align:top; *vertical-align:middle}
  .ztree li span.button.remove:hover {
    background-position: -168px -42px;
  }
  .ztree li span.button.add {margin-left:2px; margin-right: -1px; background-position: -189px 0; vertical-align:top; *vertical-align:middle}
  .ztree li span.button.add:hover {
    background-position: -168px 0;
  }
  .ztree li span.button.ico_loading{margin-right:2px; background:url(../../../src/assets/img/loading.gif) no-repeat scroll 0 0 transparent; vertical-align:top; *vertical-align:middle}

  ul.tmpTargetzTree {background-color:#FFE6B0; opacity:0.8; filter:alpha(opacity=80)}

  span.tmpzTreeMove_arrow {width:16px; height:21px; display: inline-block; padding:0; margin:2px 0 0 1px; border:0 none; position:absolute;
    background-color:transparent; background-repeat:no-repeat; background-attachment: scroll;
    background-position:-168px -84px; background-image:url("../../../src/assets/img/metro.png"); *background-image:url("../../../src/assets/img/metro.gif")}

  ul.ztree.zTreeDragUL {margin:0; padding:0; position:absolute; width:auto; height:auto;overflow:hidden; background-color:#cfcfcf; border:1px #00B83F dotted; opacity:0.8; filter:alpha(opacity=80)}
  .ztreeMask {z-index:10000; background-color:#cfcfcf; opacity:0.0; filter:alpha(opacity=0); position:absolute}

</style>
