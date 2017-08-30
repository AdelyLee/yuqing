<template>
  <div id="collection">
    <el-col :span="24">
      <div class="card-body">
        <el-card>
          <el-row :gutter="20" id="search_box">
            <el-col :span="12" :offset="6">
              <div class="card-body">
                <el-col class="search-html">
                  <div class="input-search">
                    <el-input placeholder="请输入内容" v-model="condition.mustWord" @change="queryWords">
                    </el-input>
                  </div>
                  <el-button class="btn-search" @click="queryWords"><span class="el-icon-search">查询</span>
                  </el-button>
                </el-col>
              </div>
            </el-col>
            <!---start: 更多筛选---->
            <el-col :span="24">
              <el-collapse accordion>
                <el-collapse-item title="更多筛选">
                  <el-form :model="condition" ref="condition" label-width="80px">
                    <el-row class="srarch-screen">
                      <el-col :span="12">
                        <el-form-item label="关键词">
                          <el-input type="textarea" :autosize="true" v-model="condition.mustWord"
                                    placeholder="关键词之间用@隔开"></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="同现词">
                          <el-input type="textarea" :autosize="true" v-model="condition.shouldWord"
                                    placeholder="同现词之间用@隔开"></el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row class="srarch-screen">
                      <el-col :span="12">
                        <el-form-item label="排除词">
                          <el-input type="textarea" :autosize="true" v-model="condition.mustNotWord"
                                    placeholder="排除词之间用@隔开"></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="收藏时间">
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
                    </el-row>
                    <el-row class="srarch-screen">
                      <el-col :span="12">
                        <el-form-item label="信息排序">
                          <el-radio-group v-model="condition.direction" @change="changeSort">
                            <el-radio label="DESC">时间降序</el-radio>
                            <el-radio label="ASC">时间升序</el-radio>
                          </el-radio-group>
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
                    <el-row class="srarch-screen">
                      <el-col :span="24">
                        <el-form-item label="显示条数">
                          <el-radio-group v-model="pager.pageSize" @change="changePageSize">
                            <el-radio :label=10>10</el-radio>
                            <el-radio :label=30>30</el-radio>
                            <el-radio :label=50>50</el-radio>
                            <el-radio :label=100>100</el-radio>
                          </el-radio-group>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row class="collection-screen">
                      <el-col :span="12">
                        <el-form-item>
                          <el-button class="collection-all" @click="selectAll"><span class="el-icon-document"></span> 全选
                          </el-button>
                          <el-button class="collection-delete" @click='deleteMultipleCollections'><span
                            class="el-icon-delete2"></span> 删除
                          </el-button>
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </el-form>
                </el-collapse-item>
              </el-collapse>
            </el-col>
            <!---end: 更多筛选---->
          </el-row>
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
  import articleList from '@/components/common/collect'
  import {
    getCollections,
    deleteFromCollection,
    deleteBatchCollection
  } from '@/service/article'
  import {getKeywords} from '@/service/config'
  import {dateUtil} from '@/utils/dateUtil'
  import {typeUtil} from '@/utils/typeUtil'
  import {utils} from '@/utils/utils'
  const typeOptions = ['新闻', '微博', '贴吧', '论坛']
  const emotionOptions = ['正面', '负面', '中性']
  export default {
    name: 'collection',
    data () {
      return {
        articlesLoading: true,
        condition: {
          mustWord: '',
          mustNotWord: '',
          shouldWord: '',
          startDate: '',
          endDate: '',
          direction: 'DESC', // 排序方式ASC DESC
          filed: '',
          searchKv: [],
          type: []
        },
        checkedArray: [],
        articleList: [],
        isSelectAll: false,
        pager: {
          pageSize: 10,
          currentPage: 1,
          totalElements: 1
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
      this.getCollectionArticles()
    },
    methods: {
      queryWords: function () {
        this.isSelectAll = false
        this.getCollectionArticles()
      },
      /**
       * 点击全选
       */
      selectAll: function () {
        let self = this
        if (self.isSelectAll === false) {
          self.articleList.forEach(function (item) {
            item.isChecked = true
          })
          self.isSelectAll = true
        } else {
          self.articleList.forEach(function (item) {
            item.isChecked = false
          })
          self.isSelectAll = false
        }
      },
      /**
       * 点击删除
       */
      deleteMultipleCollections: function () {
        let self = this
        self.checkedArray = []
        self.articleList.forEach(function (item) {
          if (item.isChecked === true) {
            self.checkedArray.push(item.id)
          }
        })
        if (self.checkedArray.length > 0) {
          self.$confirm('确认删除收藏文章吗?', '提示', {type: 'warning'}).then(() => {
            let param = self.checkedArray
            deleteBatchCollection(param).then(function (data) {
              if (data) {
                self.$message({
                  showClose: true,
                  message: '取消收藏成功!',
                  type: 'success'
                })
              } else {
                self.$message({
                  showClose: true,
                  message: '取消收藏失败!',
                  type: 'error'
                })
              }
            }).then(() => {
              self.articlesLoading = true
              self.getCollectionArticles()
//              setTimeout(self.getCollectionArticles, 4000)
              self.isSelectAll = false
            })
          }).catch(() => {
          })
        }
      },
      /**
       * 获取子组件的参数，进行相关的操作处理
       * @param data
       */
      getData (data) {
        let self = this
        switch (data.action) {
          case 'deleteCollect':
            let params = data.data
            deleteFromCollection(params).then(function (data) {
              if (data) {
                self.$message({
                  showClose: true,
                  message: '取消收藏成功!',
                  type: 'success'
                })
                self.getCollectionArticles()
              } else {
                self.$message({
                  showClose: true,
                  message: '取消收藏失败!',
                  type: 'error'
                })
                self.getCollectionArticles()
              }
            })
            break
          case 'clickArticleListPager':
            self.isSelectAll = false
            self.pager = data.data
            self.getCollectionArticles()
            break
        }
      },
      /**
       *  更改每页显示数量
       */
      changePageSize () {
        this.isSelectAll = false
        this.getCollectionArticles()
      },
      /**
       *  点击类型全选
       */
      handleMediaTypeCheckAllChange(event) {
        let self = this
        self.isSelectAll = false
        self.mediaTypeArray = event.target.checked ? self.mediaTypes : []
        self.isIndeterminateMediaType = false

        let mediaTypes = []
        self.mediaTypeArray.forEach(function (item) {
          mediaTypes.push(typeUtil.encodeArticleType(item))
        })
        self.condition.type = mediaTypes
        self.getCollectionArticles()
      },
      /**
       *  点击单个类型
       */
      handleCheckedMediaTypeChange(value) {
        let self = this
        self.isSelectAll = false
        let checkedCount = value.length
        self.checkAllMediaType = checkedCount === this.mediaTypes.length
        self.isIndeterminateMediaType = checkedCount > 0 && checkedCount < self.mediaTypes.length
        let mediaTypes = []
        self.mediaTypeArray.forEach(function (item) {
          mediaTypes.push(typeUtil.encodeArticleType(item))
        })
        self.condition.type = mediaTypes
        self.getCollectionArticles()
      },
      /**
       *  点击情感全选
       */
      handleEmotionCheckAllChange(event) {
        let self = this
        self.isSelectAll = false
        self.emotionArray = event.target.checked ? self.emotions : []
        self.isIndeterminateEmotion = false
        let emotions = []
        self.emotionArray.forEach(function (item) {
          emotions.push(typeUtil.encodeSentimentType(item).toLowerCase())
        })
        let searchKv = []
        if (emotions.length > 0) {
          let item = {}
          item.key = 'nlp.sentiment.label'
          item.value = emotions.join('@')
          searchKv.push(item)
        }
        self.condition.searchKv = searchKv
        self.getCollectionArticles()
      },
      /**
       *  点击单个情感
       */
      handleCheckedEmotionChange(value) {
        let self = this
        self.isSelectAll = false
        let checkedCount = value.length
        self.checkAllEmotion = checkedCount === self.emotions.length
        self.isIndeterminateEmotion = checkedCount > 0 && checkedCount < self.emotions.length
        let emotions = []
        self.emotionArray.forEach(function (item) {
          emotions.push(typeUtil.encodeSentimentType(item).toLowerCase())
        })
        let searchKv = []
        if (emotions.length > 0) {
          let item = {}
          item.key = 'nlp.sentiment.label'
          item.value = emotions.join('@')
          searchKv.push(item)
        }
        self.condition.searchKv = searchKv
        self.getCollectionArticles()
      },
      /**
       *  匹配方式
       */
      changeFiled: function () {
        this.isSelectAll = false
        this.getCollectionArticles()
      },
      /**
       *  排序方式
       */
      changeSort: function () {
        this.isSelectAll = false
        this.getCollectionArticles()
      },
      /**
       *  根据搜索条件获取收藏文章列表
       */
      getCollectionArticles () {
        let self = this
        let {startDate, endDate, mustWord, shouldWord, mustNotWord} = self.condition
        startDate = dateUtil.formatDate(startDate, 'yyyy-MM-dd')
        endDate = dateUtil.formatDate(endDate, 'yyyy-MM-dd')
        let params = {
          date: {
            startDate: startDate,
            endDate: endDate
          },
          keyword: {
            mustWord: mustWord,
            shouldWord: shouldWord,
            mustNotWord: mustNotWord
          },
          filed: self.condition.filed,
          page: {
            limit: self.pager.pageSize,
            page: self.pager.currentPage,
            orders: [{
              'direction': self.condition.direction,
              'orderBy': 'dateCreated'
            }]
          },
          searchKv: self.condition.searchKv,
          type: self.condition.type
        }
        params.displayConfig = {
          sourceLength: 20,
          titleLength: 35,
          heightLightWords: self.heightLightWords + '@' + mustWord + '@' + shouldWord
        }
        self.articlesLoading = true
        getCollections(params).then(data => {
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
      padding-top: 5px;
      padding-bottom: 5px;
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
      .collection-all {
        background: #2d65f0;
        color: #fff;
        padding: 8px 15px;
        border: none;
      }
      .collection-delete {
        background: #d0300b;
        color: #fff;
        padding: 8px 15px;
        border: none;
      }
    }
  }
</style>
