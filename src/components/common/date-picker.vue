<template>
  <div class="date-picker">
    <el-form :model="datePickerForm" :rules="datePickerFormRules" ref="datePickerForm">
      <el-form-item label="时间:">
        <el-form-item prop="startDate">
          <el-date-picker type="date" placeholder="选择开始时间" :editable='datePickEditable'
                          v-model="datePickerForm.startDate"></el-date-picker>
        </el-form-item>
        <el-form-item prop="endDate">
          <el-date-picker type="date" placeholder="选择结束时间" :editable='datePickEditable'
                          v-model="datePickerForm.endDate"></el-date-picker>
        </el-form-item>
        <el-button class="search-btn" type="primary" @click.native="datePickerFormSubmit(datePickerForm)">查询</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  //  import {dateUtil} from '@/utils/dateUtil'

  export default {
    props: ['datePickerForm'],
    data () {
      return {
        datePickEditable: false,
        datePickerFormRules: {
          startDate: [{type: 'date', required: true, message: '选择专题开始时间', trigger: 'change'}],
          endDate: [{type: 'date', required: true, message: '选择专题结束时间', trigger: 'change'}]
        }
      }
    },
    methods: {
      /**
       * 点击查询按钮时
       * @param datePickerForm
       */
      datePickerFormSubmit (datePickerForm) {
        let data = {}
        data.action = 'clickDatePickerSearch'
        data.data = datePickerForm
        this.$emit('data', data)
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss">
  .date-picker {
    margin: 0 20px 20px 20px;
    height: 36px;
    .el-form-item__content {
      float: left;
      margin-right: 10px !important;
    }
    .el-form-item {
      margin-bottom: 0;
      float: left;
    }
    .search-btn {
      float: left;
    }
  }
</style>
