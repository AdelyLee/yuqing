<template>
  <div id="warningList">
    <el-row :gutter="5">
      <el-col :span="24">
        <div v-loading="warningDetailLoading">
          <div class="detail-title">
            <span class="small">{{warningDetailsList.timeChange}}</span>,您的预警方案<span
            style="color:#20A0FF">[{{warningDetailsList.subjectName}}]</span>,关键字:<span
            class="small">{{warningDetailsList.keyWord}}</span>,新增数据<span
            style="color:#FF4949">{{warningDetailsList.totalCount}}</span>条
          </div>
          <article-list v-if="articles.length > 0"
                        :articles="articles"
                        :pager="pager"
                        @data="getData">
          </article-list>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  import articleList from '@/components/common/articles'
  import {utils} from '@/utils/utils'
  import {
    getWarningDetails
  } from '@/service/article'
  const subject = JSON.parse(localStorage.getItem('warningKeywords'))
  export default {
    name: 'presentationList',
    data () {
      return {
        articles: [],
        warningDetailLoading: true,
        warningDetailsList: {
          totalCount: 0,
          timeChange: '',
          keyWord: '',
          subjectName: ''
        },
        pager: {
          pageSize: 10,
          currentPage: 1,
          totalElements: 10
        }
      }
    },
    components: {
      'article-list': articleList
    },
    mounted () {
      this.getWarningDetailsList()
    },
    methods: {
      getData: function (data) {
        let self = this
        switch (data.action) {
          case 'clickArticleListPager':
            self.pager = data.data
            self.getWarningDetailsList()
            break
        }
      },
      getWarningDetailsList: function () {
        let self = this
        let id = utils.getQueryVariable('id')
        let params = {
          limit: self.pager.pageSize,
          page: self.pager.currentPage
        }
        params.displayConfig = {
          sourceLength: 20,
          titleLength: 35,
          heightLightWords: subject.mustWord + '@' + subject.shouldWord
        }
        self.warningDetailLoading = true
        getWarningDetails(params, id).then(data => {
          self.warningDetailLoading = false
          self.articles = data.content
          self.warningDetailsList.subjectName = subject.subjectName
          self.warningDetailsList.timeChange = subject.startDate + '~' + subject.endDate
          self.warningDetailsList.totalCount = data.totalElements
          self.warningDetailsList.keyWord = subject.mustWord + '@' + subject.shouldWord
          self.pager.totalElements = data.totalElements
        }).catch(error => {
          self.$confirm(error.message, '错误', {type: 'error'})
        })
      }
    }
  }
</script>

