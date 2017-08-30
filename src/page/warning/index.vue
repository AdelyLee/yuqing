<template>
  <div id="warning">
    <div class="card-body">
      <el-row :gutter="15">
        <el-col :span="24">
          <el-card class="box-card">
            <el-col :span="24">
              <list-search :searchForm="searchForm" @data="getData"></list-search>
            </el-col>
            <el-col v-loading="warningListLoading">
              <el-table ref="multipleTable" :data="warningData" border tooltip-effect="dark"
                        style="width: 100%;min-height:300px;">
                <el-table-column prop="number" label="编号" width="80"></el-table-column>
                <el-table-column prop="subjectName" label="专题名称" width="150" show-overflow-tooltip></el-table-column>
                <el-table-column prop="shouldWord" label="关键词" show-overflow-tooltip></el-table-column>
                <el-table-column label="预警时间范围" width="350">
                  <template scope="scope">
                    <span>{{ scope.row.startDate }}</span> ～
                    <span>{{ scope.row.endDate }}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="dateCreated" label="预警生成时间" width="200"></el-table-column>
                <el-table-column label="操作" show-overflow-tooltip width="150">
                  <template scope="scope">
                    <el-button class="see" @click="showWarning(scope.row)"><span class="el-icon-picture"></span>查看
                    </el-button>
                    <el-button class="delete" @click="deleteWarning(scope.row)"><span class="el-icon-delete2"></span> 删除
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
              <list-page :pager="pager" @data="getData"></list-page>
            </el-col>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
  const basePath = localStorage.getItem('basePath')
  import Pager from '@/components/common/pager'
  import listSearch from '@/components/common/list-search'
  import {getWarnings, deleteHistoryWarnings} from '@/service/warning'
  import {dateUtil} from '@/utils/dateUtil'
  import {
    getWarningKeyWords
  } from '@/service/subject'
  export default {
    name: 'warning',
    data () {
      return {
        searchForm: {
          nameLabel: '专题名称',
          timeLabel: '预警生成时间',
          name: '',
          startDate: '',
          endDate: ''
        },
        warningListLoading: true,
        warningData: [],
        pager: {
          pageSize: 10,
          currentPage: 1,
          totalElements: 1
        }
      }
    },
    components: {
      'list-page': Pager,
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
        self.getWarningList()
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
            self.getWarningList()
            break
          case 'searchFormSubmit':
            self.searchForm = data.data
            self.getWarningList()
            break
        }
      },
      /**
       * 预警查看
       */
      showWarning: function (row) {
        let subjectId = row.id
        getWarningKeyWords(subjectId).then(function (data) {
          let config = {}
          if (data.content && data.content.length > 1) {
            data = data.content[0]
          }
          data.startDate = dateUtil.formatDate(new Date(data.startDate), 'yyyy-MM-dd')
          data.endDate = dateUtil.formatDate(new Date(data.endDate), 'yyyy-MM-dd')
          config = data
          localStorage.setItem('warningKeywords', JSON.stringify(config))
          window.open(basePath + '/#/warningDetail?id=' + row.id)
        })
      },
      /**
       * 预警删除
       */
      deleteWarning(row) {
        let self = this
        self.$confirm('确认删除该记录吗?', '提示', {type: 'warning'}).then(() => {
          let param = row.id
          deleteHistoryWarnings(param).then(data => {
            self.$message({
              message: '删除成功',
              type: 'success'
            })
            self.getWarningList()
          }).catch(function () {
            self.$message.error('删除失败')
            self.getWarningList()
          })
        }).catch(() => {
        })
      },
      /**
       * 根据条件获取预警列表
       */
      getWarningList () {
        let self = this
        let {startDate, endDate} = self.searchForm
        if (startDate !== '') {
          startDate = dateUtil.formatDate(startDate, 'yyyy-MM-dd')
        }
        if (endDate !== '') {
          endDate = dateUtil.formatDate(endDate, 'yyyy-MM-dd')
        }
        let param = {
          date: {
            startDate: startDate,
            endDate: endDate
          },
          page: {
            limit: self.pager.pageSize,
            page: self.pager.currentPage
          },
          subjectName: self.searchForm.name
        }
        getWarnings(param).then(data => {
          self.warningListLoading = false
          self.warningData = data.content
          self.pager.totalElements = data.totalElements
        })
      }
    }
  }
</script>

