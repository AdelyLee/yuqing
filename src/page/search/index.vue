<template>
  <div id="search">
    <el-col :span="24">
      <div class="card-body">
        <el-card class="box-card">
          <!---start: 搜索输入框-->
          <el-row :gutter="20" >
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
                          <el-input type="textarea" v-model="condition.mustWord" :autosize="true" placeholder="关键词之间用@隔开"></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="同现词">
                          <el-input type="textarea" v-model="condition.shouldWord" :autosize="true"  placeholder="同现词之间用@隔开"></el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row class="srarch-screen">
                      <el-col :span="12">
                        <el-form-item label="排除词">
                          <el-input type="textarea" v-model="condition.mustNotWord" :autosize="true" placeholder="排除词之间用@隔开"></el-input>
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
          <!---end: 更多筛选-->
          <div class="search-body">
            <el-row :gutter="15">
              <el-col :span="24">
                <el-row class="article-lists" v-loading="articlesLoading">
                  <article-list :articles="articleList" @data="getData" :pager="pager"></article-list>
                </el-row>
              </el-col>
            </el-row>
          </div>
        </el-card>
      </div>
    </el-col>
  </div>
</template>

<script>
  import articleList from '@/components/common/articles'
  import {getArticles} from '@/service/article'
  import {dateUtil} from '@/utils/dateUtil'
  import {typeUtil} from '@/utils/typeUtil'
  const typeOptions = ['新闻', '微博', '贴吧', '论坛']
  const emotionOptions = ['正面', '负面', '中性']
  export default {
    name: 'search',
    data () {
      return {
        articlesLoading: true,
        condition: {
          mustWord: '安全生产',
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
        articleList: [],
        pager: {
          pageSize: 10,
          currentPage: 1,
          totalElements: 10
        },
        checkAllEmotion: false,
        checkAllMediaType: false,
        isIndeterminateMediaType: false,
        isIndeterminateEmotion: false,
        emotionArray: [],
        mediaTypeArray: [],
        mediaTypes: typeOptions,
        emotions: emotionOptions
      }
    },
    components: {
      'article-list': articleList
    },
    created () {
      // set the default date time
      let self = this
      let date = new Date()
      self.condition.startDate = dateUtil.addDate(date, 'M', -3)
      self.condition.endDate = dateUtil.addDate(date, 'd', 1)
    },
    mounted () {
      this.renderPageData()
    },
    methods: {
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
        self.condition.type = mediaTypes
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
        self.condition.type = mediaTypes
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
        self.condition.searchKv = searchKv
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
        self.condition.searchKv = searchKv
      },
      /**
       *  匹配方式
       */
      changeFiled: function () {
      },
      /**
       *  排序方式
       */
      changeSort: function () {
        this.renderPageData()
      },
      /**
       *  更改每页显示数量
       */
      changePageSize () {
      },
      /**
       * 渲染页面数据
       */
      renderPageData () {
        let self = this
        self.getSearchArticles()
      },
      /**
       * 获取子组件的参数，进行相关的操作处理
       * @param data
       */
      getData (data) {
        let self = this
        switch (data.action) {
          case 'clickArticleListPager':
            self.pager = data.data
            self.getSearchArticles()
            break
        }
      },
      /**
       *  根据搜索条件获取文章列表
       */
      getSearchArticles () {
        let self = this
        let {startDate, endDate, filed, mustWord = '', mustNotWord = '', shouldWord = ''} = self.condition
        startDate = dateUtil.formatDate(startDate, 'yyyy-MM-dd')
        endDate = dateUtil.formatDate(endDate, 'yyyy-MM-dd')
        let params = {
          date: {
            startDate: startDate,
            endDate: endDate
          },
          keyword: {
            mustWord: mustWord,
            mustNotWord: mustNotWord,
            shouldWord: shouldWord
          },
          page: {
            limit: self.pager.pageSize,
            page: self.pager.currentPage,
            orders: [{
              'direction': self.condition.direction,
              'orderBy': 'pubTime'
            }]
          },
          searchKv: self.condition.searchKv,
          type: self.condition.type
        }
        if (filed) {
          params.filed = filed
        }
        params.displayConfig = {sourceLength: 20, titleLength: 35, heightLightWords: self.condition.mustWord}
        self.articlesLoading = true
        getArticles(params).then(data => {
          self.articlesLoading = false
          self.articleList = data.content
          self.pager.totalElements = data.totalElements
        }).catch(error => {
          self.$confirm(error.message, '错误', {type: 'error'})
        })
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss">
  .el-card {
    border: none;
    background: none;
  }
  #search_box {
    .el-form-item {
      margin-bottom: 0;
      padding-top:5px;
      padding-bottom:5px;
      .el-textarea {
        vertical-align: middle;
      }
    }
    .el-form-item__content {
      text-align: left;
    }
    .collection-screen {
      margin-left: -10px;
      margin-right: -10px;
      border-bottom: 1px dashed #214bb0;
      .el-form-item__content {
        margin-left: 12px !important;
      }
    }
  }

</style>
