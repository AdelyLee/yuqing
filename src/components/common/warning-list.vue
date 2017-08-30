<template>
  <div id="warning">
    <div class="card-body">
      <el-card class="box-card">
        <el-col v-loading="warningList.warningListLoading">
          <el-table ref="multipleTable" :data="warningList.warningData" border tooltip-effect="dark"
                    style="width: 100%;overflow:hidden">
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
            <el-table-column label="操作" width="200">
              <template scope="scope">
                <el-button class="see" @click="showWarning(scope.row)"><span class="el-icon-picture"></span>查看
                </el-button>
                <el-button class="delete" @click="deleteWarning(scope.row)"><span class="el-icon-delete2"></span> 删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <list-page :pager="warningList.pager" @data="getPager"></list-page>
        </el-col>
      </el-card>
    </div>
  </div>
</template>

<script>
  import Pager from '@/components/common/pager'
  const basePath = localStorage.getItem('basePath')
  import {dateUtil} from '@/utils/dateUtil'
  import {
    getWarningKeyWords
  } from '@/service/subject'
  export default {
    props: ['warningList'],
    data () {
      return {}
    },
    components: {
      'list-page': Pager
    },
    methods: {
      getPager (pager) {
        let data = {}
        data.action = 'clickWarningListPager'
        data.warningListPager = pager
        this.$emit('data', data)
      },
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
      deleteWarning(row) {
        let data = {}
        data.action = 'deleteWarning'
        data.warning = row
        this.$emit('data', data)
      }
    }
  }
</script>
