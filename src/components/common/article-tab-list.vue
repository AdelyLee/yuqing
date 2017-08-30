<template>
  <div class="article-list-tab">
    <el-col :span="24" class="article-list-header">
      <div class="article-tab-title-background">{{articleData.titleText}}</div>
      <div class="sort-btn" v-if="articleData.titleText!='焦点报道'">
        <el-col :span="24">
          <el-button size="small" :class="{active: articleData.sortBy === 'score' ? true : false}"
                     @click="sortByScore(articleData.type)">相关度
          </el-button>
          <el-button size="small" :class="{active: articleData.sortBy === 'pubTime' ? true : false}"
                     @click="sortByPubTime(articleData.type)">时间
          </el-button>
        </el-col>
      </div>
    </el-col>
    <el-col :span="24">
      <ul class="article-list" v-if="articleData.titleText!='焦点报道'">
         <li v-for="item in articleData.articles" :id="item.id" :key="item.id" @click="showDetail(item.id)">
          <el-row :gutter="1">
            <el-col :span="13" style="text-align: left;">
              <el-col :span="2">
                <div v-if="item.type=='news'" class="iconfont icon-xinwen"></div>
                <div v-if="item.type=='weibo'" class="iconfont icon-weibo"></div>
                <div v-if="item.type=='bbs'" class="iconfont icon-luntan"></div>
                <div v-if="item.type=='bar'" class="iconfont icon-tieba"></div>
                <div v-if="item.type=='comments'" class="small-article-image comment-logo"></div>
              </el-col>
              <span v-html="item.title">{{item.title}}</span>
            </el-col>
            <el-col :span="5" style="text-align: left;">{{item.source}}</el-col>
            <el-col :span="4" style="text-align: left;">{{item.pubTime}}</el-col>
            <el-col :span="2" style="text-align: center">
              <div v-if="item.nlp.sentiment.label === '正面'" class="iconfont icon-positive" style="color: #41A6D8"></div>
              <div v-if="item.nlp.sentiment.label === '负面'" class="iconfont icon-negative" style="color: #E71D21"></div>
              <div v-if="item.nlp.sentiment.label === '中性'" class="iconfont icon-neutral"  style="color: #E9C95B"></div>
            </el-col>
          </el-row>
        </li>
      </ul>
      <div v-if="articleData.titleText=='焦点报道'" class="article-table-head">
        <el-row :gutter="1">
          <el-col :span="2" align='center'>排名</el-col>
          <el-col :span="13" align='center'>名称</el-col>
          <el-col :span="3" align='center'>报道数量</el-col>
          <el-col :span="3" align='center'>情感分析</el-col>
          <el-col :span="3" align='center'>时间</el-col>
        </el-row>
      </div>
      <ul class="article-list article-focus" v-if="articleData.titleText=='焦点报道'">
        <li v-for="item in articleData.articles" :titleSimHash="item.titleSimHash"
            @click="getSimilar(item.titleSimHash)">
          <el-row :gutter="1">
            <el-col :span="2" align='center'>
              <span v-html="item.index">{{item.index}}</span>
            </el-col>
            <el-col :span="13" align='left'>
              <div v-if="item.type=='news'" class="iconfont icon-xinwen type-logo"></div>
              <div v-if="item.type=='weibo'" class="iconfont icon-weibo type-logo "></div>
              <div v-if="item.type=='bbs'" class="iconfont icon-luntan type-logo"></div>
              <div v-if="item.type=='bar'" class="iconfont icon-tieba type-logo"></div>
              <div v-if="item.type=='comments'" class="small-article-image comment-logo type-logo"></div>
              <span v-html="item.title" class="title_news">{{item.title}}</span>
            </el-col>
            <el-col :span="3" align='center'>{{item.docTotal}}</el-col>
            <el-col :span="3" align='center'>
              <div v-if="item.nlp.sentiment.label === '正面'" class="iconfont icon-positive" style="color: #41A6D8"></div>
              <div v-if="item.nlp.sentiment.label === '负面'" class="iconfont icon-negative" style="color: #E71D21"></div>
              <div v-if="item.nlp.sentiment.label === '中性'" class="iconfont icon-neutral" style="color: #E9C95B"></div>
              <!--<span v-if="item.nlp.sentiment.label === '正面'" class="positive tag">{{item.nlp.sentiment.label}}</span>-->
              <!--<span v-if="item.nlp.sentiment.label === '负面'" class="negative tag">{{item.nlp.sentiment.label}}</span>-->
              <!--<span v-if="item.nlp.sentiment.label === '中性'" class="neutral tag">{{item.nlp.sentiment.label}}</span>-->
            </el-col>
            <el-col :span="3" align='center'>{{item.pubTime}}</el-col>
          </el-row>
        </li>
      </ul>
    </el-col>
    <el-col :span="24" class="table-bottom" v-if="articleData.titleText!='焦点报道'">
      <el-button type="text" class="article-more" @click="showMoreArticles(articleData.type)">{{articleData.btnText}}</el-button>
    </el-col>
  </div>
</template>

<script>
  const basePath = localStorage.getItem('basePath')
  export default {
    props: ['articleData'],
    data () {
      return {}
    },
    methods: {
      sortByScore: function (type) {
        var self = this
        var data = {}
        data.action = 'sortByScore'
        data.data = type
        data.sortBy = 'score'
        self.$emit('data', data)
      },
      sortByPubTime: function (type) {
        var self = this
        var data = {}
        data.action = 'sortByPubTime'
        data.data = type
        data.sortBy = 'pubTime'
        self.$emit('data', data)
      },
      showDetail: function (id) {
        window.open(basePath + '/#/detail?id=' + id)
      },
      getSimilar(similar) {
        var data = {}
        data.action = 'clickSimilarArticleList'
        data.searchKv = [{'key': 'titleSimHash', 'value': similar}]
        this.$emit('data', data)
      },
      showMoreArticles: function (type) {
        var self = this
        var data = {}
        data.action = 'showMoreArticle'
        data.data = type
        if (self.articleData.sortBy === 'score') {
          data.sortBy = 'score'
        } else if (self.articleData.sortBy === 'pubTime') {
          data.sortBy = 'pubTime'
        }
        self.$emit('data', data)
      }
    }

  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>
