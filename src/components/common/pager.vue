<template>
  <div class="pager">
    <el-pagination v-if="pager" @current-change="handleCurrentChange" :current-page.sync="pager.currentPage"
                   :page-size='pager.pageSize' layout="total, prev, pager, next, jumper" :total='pager.totalElements'>
    </el-pagination>
  </div>
</template>
<script>
  export default {
    props: ['pager'],
    data () {
      return {}
    },
    methods: {
      handleCurrentChange(val) {
        let self = this
        // 当改变页码时重新查询数据
        self.pager.currentPage = val
        let data = {}
        data.action = 'clickCommonPager'
        data.data = self.pager
        self.$emit('data', data)
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .el-pagination {
    width: 100%;
    white-space: nowrap;
    padding: 2px 5px;
    color: #48576a;
    float: left;
    margin: 30px 10px;
    text-align: center;
  }
</style>
