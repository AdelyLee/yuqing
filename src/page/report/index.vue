<template>
  <div id="report">
    <el-col :span="24">
      <div class="card-body">
        <el-row :gutter="15">
          <el-col :span="24">
            <div class="button-list">
              <div class="subject-gl"  @click="showMonthlyReportList">
                <img src="../../assets/img/ztgl.svg" style="float:left;width:33px;height: 31px;margin-left: 30px;margin-top: 10px;">月报
                <el-row>
                  <div class="border-left-top"></div>
                  <div class="border-right-top"></div>
                </el-row>
                <el-row>
                  <div class="border-left-bottom"></div>
                  <div class="border-right-bottom"></div>
                </el-row>
              </div>
              <div class="subject-bg" @click="showWeeklyReportList">
                <img src="../../assets/img/reports.svg" style="float:left;width:33px;height: 31px;margin-left: 30px;margin-top: 10px;">周报
                <el-row>
                  <div class="border-left-top"></div>
                  <div class="border-right-top"></div>
                </el-row>
                <el-row>
                  <div class="border-left-bottom"></div>
                  <div class="border-right-bottom"></div>
                </el-row>
              </div>
            </div>
          </el-col>
          <el-col :span="24">
            <!---start: 报告模块---->
            <el-card v-loading="reportListLoading" class="box-card report-list">
              <el-row>
                <list-search :searchForm="searchForm" @data="getData"></list-search>
              </el-row>
              <el-row>
                <report-list :reportList="reportListData" @data="getData"></report-list>
              </el-row>
              <list-page :pager="reportListPager" @data="getData"></list-page>
            </el-card>
            <!---end: 报告模块---->
          </el-col>
        </el-row>
      </div>
    </el-col>
  </div>
</template>

<script>
  import Pager from '@/components/common/pager'
  import reportList from '@/components/common/report-list'
  import listSearch from '@/components/common/list-search'
  import {getReports} from '@/service/report'
  import {dateUtil} from '@/utils/dateUtil'
  import $ from 'jquery'
  export default {
    name: 'report',
    data () {
      return {
        reportListLoading: true,
        activeName: 'monthlyReportList',
        reportListHeader: '往期月报',
        searchForm: {
          nameLabel: '报告名称',
          timeLabel: '报告生成时间',
          name: '',
          startDate: '',
          endDate: ''
        },
        reportType: 'MONTHLY',
        reportListData: [],
        reportListPager: {
          pageSize: 10,
          currentPage: 1,
          totalElements: 1
        }
      }
    },
    components: {
      'list-page': Pager,
      'report-list': reportList,
      'list-search': listSearch
    },
    mounted () {
      this.renderPageData()
    },
    methods: {
      /**
       * 渲染页面数据
       */
      renderPageData () {
        let self = this
        self.getReportList()
      },
      /**
       * 获取子组件的参数，进行相关的操作处理
       * @param data
       */
      getData (data) {
        let self = this
        switch (data.action) {
          case 'clickCommonPager':
            self.pager = data.data
            self.getReportList()
            break
          case 'searchFormSubmit':
            self.searchForm = data.data
            self.getReportList()
            break
        }
      },

      showMonthlyReportList () {
        $('.subject-bg').css('background-color', '#0e64a1')
        $('.subject-gl').css('background-color', '#af7507')
        let self = this
        self.reportType = 'MONTHLY'
        self.reportListHeader = '往期月报'
        self.getReportList()
      },

      showWeeklyReportList () {
        $('.subject-gl').css('background-color', '#0e64a1')
        $('.subject-bg').css('background-color', '#af7507')
        let self = this
        self.reportType = 'WEEKLY'
        self.reportListHeader = '往期周报'
        self.getReportList()
      },
      /** 获取文章标题列表
       * @param type
       * 文章类型
       */
      getReportList() {
        let self = this
        self.reportListLoading = true
        let {startDate, endDate, name} = self.searchForm
        if (startDate !== '') {
          startDate = dateUtil.formatDate(startDate, 'yyyy-MM-dd')
        }
        if (endDate !== '') {
          endDate = dateUtil.formatDate(endDate, 'yyyy-MM-dd')
        }
        let params = {
          date: {
            startDate: startDate,
            endDate: endDate
          },
          page: {
            limit: self.reportListPager.pageSize,
            orders: [{direction: 'DESC', orderBy: 'dateCreated'}],
            page: self.reportListPager.currentPage
          },
          title: name,
          type: self.reportType
        }
        getReports(params).then(data => {
          self.reportListLoading = false
          self.reportListData = data.content
          self.reportListPager.totalElements = data.totalElements
        }).catch(error => {
          self.$confirm(error.message, '错误', {type: 'error'})
        })
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss">
  #report {
    .el-card__body {
      padding: 0;
    }
    .el-card {
      border: none;
      background:none;
    }
    .report-list{
      margin-top: 20px;
      border: none;
      border-radius: 0;
      border-top: 1px solid #2d65f0;
    }
  }
</style>
