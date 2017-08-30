<template>
  <div id="article">
    <el-row :gutter="5">
      <el-card class="box-card" :body-style="{ padding: '10px' }">
        <div class="content">
          <ul class="more-article-list">
            <li class="list-box" v-for="item in articles" :id="item.id" :key="item.id">
              <el-row :gutter="1">
                <el-col :span="20">
                  <a class="title" @click="showDetail(item.id, item.type)">
                    <span v-html="item.title">{{item.title}}</span>
                  </a>
                </el-col>
                <el-col :span="4">
                  <div v-if="item.nlp.sentiment.label=='正面'" class="positive-search">
                    <span>{{item.nlp.sentiment.label}}</span>
                  </div>
                  <div v-if="item.nlp.sentiment.label=='负面'" class="negative-search">
                    <span>{{item.nlp.sentiment.label}}</span>
                  </div>
                  <div v-if="item.nlp.sentiment.label=='中性'" class="neutral-search">
                    <span>{{item.nlp.sentiment.label}}</span>
                  </div>
                </el-col>
              </el-row>
              <el-row :gutter="1">
                <el-col :span="2" class="article-logo">
                  <div v-if="item.type=='news'" class="iconfont icon-xinwen" style="font-size:60px"></div>
                  <div v-if="item.type=='weibo' && item.photo==''" class="iconfont icon-weibo"
                       style="font-size: 60px"></div>
                  <div v-if="item.type=='weibo' && item.photo " class="big-article-image">
                    <img :src="item.photo" width="60px" height="60px">
                  </div>
                  <div v-if="item.type=='bbs'" class="iconfont icon-luntan" style="font-size: 60px"></div>
                  <div v-if="item.type=='bar'" class="iconfont icon-tieba" style="font-size: 60px"></div>
                  <div v-if="item.type=='comments'" class="big-article-image comment-logo"></div>
                </el-col>
                <el-col :span="22" class="article-content">
                  <span v-html="item.content">{{item.content}}</span>
                  <span v-if="item.isSearch">
                    <span v-if="item.docTotal && item.docTotal > 1" @click="getSimilar(item.textSimHash)"
                          class="similarText">共
                      <span class="similarHighLight">{{item.docTotal}}</span>条相似文章</span>
                  </span>
                </el-col>
              </el-row>
              <div class="article-bottom">
                <el-col :span="8" v-if="item.type!='weibo'">
                  <span v-if="item.type=='bbs' || item.type=='bar'|| item.type == 'comments'">
                    <span class="sours">作者</span>：{{item.author}}
                  </span>
                  <span v-else-if="item.type=='news'">
                    <span class="sours">来源</span>：{{item.site}}
                  </span>
                </el-col>
                <el-col :span="5" v-if="item.type=='weibo'">
                  <span>
                    <span class="sours">作者</span>：{{item.author}}
                  </span>
                </el-col>
                <el-col :span="6" v-if="item.type!='weibo'">
                  <span>
                    <span>发布时间</span>：{{item.pubTime}}</span>
                </el-col>
                <el-col :span="5" v-if="item.type=='weibo'">
                  <span>
                    <span>发布时间</span>：{{item.pubTime}}</span>
                </el-col>
                <el-col :span="5" v-if="item.type=='weibo'">
                  <span>
                    <span>发布设备</span>：{{item.dev}}</span>
                </el-col>
                <el-col :span="3">
                  <span v-if="item.type!='comments'">
                    <span>评论数</span>：{{item.commentNum}}</span>
                </el-col>
                <el-col :span="3" v-if="item.type=='weibo'">
                  <span>
                    <span>点赞数</span>：{{item.clickNum}}</span>
                </el-col>
                <el-col :span="3">
                  <span @click="clickCollection(item)" style="cursor: pointer;" v-if="item.type != 'comments'">
                    <span v-if="item.collected==false">
                      <i class="el-icon-star-off"></i> 收藏</span>
                    <span v-if="item.collected==true" style="color: #01a1eb">
                      <i class="el-icon-star-on"></i> 已收藏</span>
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
  import {
    addTOCollection,
    deleteFromCollection,
    hasExitInCollections
  } from '@/service/article'
  const basePath = localStorage.getItem('basePath')
  export default {
    name: 'articles',
    props: ['articles', 'pager'],
    data() {
      return {}
    },
    components: {
      'list-page': Pager
    },
    mounted() {
      this.hasExitInCollections()
    },
    methods: {
      getSimilar(similar) {
        let data = {}
        data.action = 'clickSimilarArticleList'
        data.searchKv = [{'key': 'textSimHash', 'value': similar}]
        this.$emit('data', data)
      },
      getPager() {
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
      hasExitInCollections: function () {
        let self = this
        if (self.articles && self.articles.length > 0) {
          let oIds = []
          self.articles.forEach(function (obj) {
            oIds.push(obj.id)
          })
          let params = {
            oIds: oIds.join(',')
          }
          hasExitInCollections(params).then(data => {
            self.articles.forEach(function (article) {
              data.forEach(function (item) {
                if (article.id === item.key) {
                  article.collected = item.value
                }
              })
            })
          })
        }
      },
      clickCollection: function (item) { // handle collection
        let self = this
        item.collected = !item.collected
        if (item.collected) {
          let params = {
            oId: item.id
          }
          addTOCollection(params).then(function (data) {
            if (data.parent && data.parent !== '') {
              self.$message({
                showClose: true,
                message: '添加收藏成功!',
                type: 'success'
              })
            } else {
              self.$message({
                showClose: true,
                message: '添加收藏失败!',
                type: 'error'
              })
            }
          })
        } else if (!item.collected) {
          let params = {
            oIds: item.id
          }
          deleteFromCollection(params).then(function (data) {
            if (data) {
              self.$message({
                showClose: true,
                message: '取消收藏成功!',
                type: 'info'
              })
            } else {
              self.$message({
                showClose: true,
                message: '取消收藏失败!',
                type: 'error'
              })
            }
          })
        }
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  @import "../../style/variable-default.scss";

  .sours {
    margin-left: 20px;
  }

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
      padding-left: 10px;
      line-height: 55px;
      font-weight: 600;
      cursor: pointer;
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
    .similarText {
      color: #20A0FF;
      cursor: pointer;
    }

    .similarHighLight {
      color: #FF4949;
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
