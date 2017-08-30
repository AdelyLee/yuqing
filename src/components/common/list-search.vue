<template>
  <el-form :inline="true" :model="searchForm" ref="searchForm" label-width="100px">
    <el-col :span="24" style="padding-top: 10px; text-align: left;">
      <el-form-item :label="searchForm.nameLabel">
        <el-input v-model="searchForm.name" placeholder="请输入报告名称"></el-input>
      </el-form-item>
      <el-form-item :label="searchForm.timeLabel">
        <el-form-item>
          <el-date-picker type="date" placeholder="选择开始时间" :editable='datePickEditable'
                          v-model="searchForm.startDate"></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-date-picker type="date" placeholder="选择结束时间" :editable='datePickEditable'
                          v-model="searchForm.endDate"></el-date-picker>
        </el-form-item>
      </el-form-item>
      <el-form-item>
        <el-button class = "search-btn" type="primary" @click.native="searchFormSubmit">搜索</el-button>
      </el-form-item>
    </el-col>
  </el-form>
</template>

<script>
  export default {
    props: ['searchForm'],
    data: function () {
      return {
        datePickEditable: false
      }
    },
    methods: {
      searchFormSubmit () {
        let self = this
        let data = {}
        data.action = 'searchFormSubmit'
        data.data = self.searchForm

        self.$emit('data', data)
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">
  @media screen and (min-width:1360px) and (max-width:1366px){
   .but-right {
      margin-top: -11px;
    }
  }
</style>
