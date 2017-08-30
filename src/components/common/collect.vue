<template>
  <div id="article">
    <el-row :gutter="5">
      <el-card class="box-card" :body-style="{ padding: '10px' }">
        <div class="content">
          <ul class="more-article-list">
            <li class="list-box" v-for="item in articles" :id="item.id">
              <el-row :gutter="1">
                <el-col :span="1">
                   <span class="checkbox" @change="getChecked(item)" style="cursor: pointer;">
                    <el-checkbox v-if="item.isChecked == false" v-model="item.isChecked"></el-checkbox>
                    <el-checkbox v-if="item.isChecked == true" v-model="item.isChecked"></el-checkbox>
               </span>
                </el-col>
                <el-col :span="19">
                  <a class="title" @click="showDetail(item.id, item.type)"><span
                    v-html="item.title">{{item.title}}</span></a>
                </el-col>
                <el-col :span="4">
                  <div v-if="item.nlp.sentiment.label=='正面'" class="positive-search">
                    <span>{{item.nlp.sentiment.label}}</span></div>
                  <div v-if="item.nlp.sentiment.label=='负面'" class="negative-search">
                    <span>{{item.nlp.sentiment.label}}</span></div>
                  <div v-if="item.nlp.sentiment.label=='中性'" class="neutral-search">
                    <span>{{item.nlp.sentiment.label}}</span></div>
                </el-col>
              </el-row>
              <el-row :gutter="1">
                <el-col :span="2" class="article-logo">
                  <div v-if="item.type=='news'" class="iconfont icon-xinwen" style="font-size: 60px"></div>
                  <div v-if="item.type=='weibo'" class="iconfont icon-weibo" style="font-size:60px"></div>
                  <div v-if="item.type=='bbs'" class="iconfont icon-luntan" style="font-size: 60px"></div>
                  <div v-if="item.type=='bar'" class="iconfont icon-tieba" style="font-size: 60px"></div>
                  <div v-if="item.type=='comments'" class="big-article-image comment-logo"></div>
                </el-col>
                <el-col :span="22" class="article-content">
                  <span v-html="item.content">{{item.content}}</span>
                </el-col>
              </el-row>
              <div class="article-bottom">
                <el-col :span="7">
                  <span><span class="time">发布时间</span>：{{item.pubTime}}</span>
                </el-col>
                <el-col :span="7">
                  <span v-if="item.type != 'weibo'">
                      <span class="sours">来源：{{item.source}}</span>
                  </span>
                  <span v-if="item.type == 'weibo'">
                      <span class="sours">来源：{{item.author}} </span>
                  </span>
                </el-col>
                <el-col :span="7">
                  <span><span>收藏时间</span>：{{item.collectTime}}</span>
                </el-col>
                <el-col :span="3">
                  <span @click="clickCollection(item)" style="cursor: pointer;" v-if="item.type != 'comments'">
                    <span v-if="item.collected==false"><i class="el-icon-star-off"></i> 收藏</span>
                    <span v-if="item.collected==true" style="color: #01a1eb"><i class="el-icon-star-on"></i> 已收藏</span>
                  </span>
                </el-col>
              </div>
            </li>
          </ul>
        </div>
        <list-page v-if="articles" :pager="pager" @data="getPager"></list-page>
      </el-card>
    </el-row>
  </div>
</template>
<script>
  import Pager from '@/components/common/pager'
  const basePath = localStorage.getItem('basePath')
  export default {
    name: 'articles',
    props: ['articles', 'pager'],
    data () {
      return {
        isSelectAll: false
      }
    },
    components: {
      'list-page': Pager
    },
    mounted () {
    },
    methods: {
      /**
       * 点击复选框
       */
      getChecked: function (item) {
        let self = this
        self.isSelectAll = false
        if (item.isChecked) {
          item.isChecked = true
        } else {
          item.isChecked = false
        }
      },
      getSimilar(similar) {
        let data = {}
        data.action = 'clickSimilarArticleList'
        data.searchKv = [{'key': 'textSimHash', 'value': similar}]
        this.$emit('data', data)
      },
      getPager () {
        let self = this
        let data = {}
        data.action = 'clickArticleListPager'
        data.data = self.pager
        this.$emit('data', data)
      },
      showDetail: function (id, type) {
        if (type !== 'comments') {
          window.open(basePath + '/#/detail?id=' + id)
        }
      },
      clickCollection: function (item) { // handle collection
        let self = this
        let params = {
          oIds: item.id
        }
        let data = {}
        data.action = 'deleteCollect'
        data.data = params
        self.$emit('data', data)
      }
    }
  }

</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "../../style/variable-default.scss";

  .more-article-list {
    padding: 0;
    margin-top: 0;
    list-style-type: none;
    .list-box {
      text-align: left;
    }
    .article-logo {
      padding-left: 20px !important;
    }
    .title {
      font-size: 20px;
      line-height: 55px;
      font-weight: 600;
      cursor: pointer;
    }
    .time {
      margin-left:20px;
    }
    .article-content {
      text-indent: 2em;
      margin-top: -8px;
      line-height: 30px;
      font-size: 16px;
    }
    .article-bottom {
      width: 100%;
      line-height: 37px;
      height: 37px;
      list-style-type: none;
      margin-top: 10px;
      span {
        font-size: 14px;
      }
    }
  }

  .el-row:last-child {
    margin-bottom: 10px;
  }

  .el-row {
    margin-left: 0px;
    margin-right: 0px;
  }
</style>
