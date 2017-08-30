<template>
  <div id="weekly-report">
    <el-col :span="24">
      <div class="card-body">
        <div class="model">
          <p class="pTitle manage-title-img">周报设置</p>
          <!-- start: 周报设置模块 -->
          <el-col :span="20" :offset="2" style="text-align: left">
            <el-form :model="addForm" ref="addForm" label-width="100px" class="monthly-report-form">
              <el-form-item label="是否启用" class="from-item off">
                <el-radio-group v-model="addForm.enable" style="margin-left: 20px">
                  <el-radio :label="true">是</el-radio>
                  <el-radio :label="false">否</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="选择联系人" class="from-item select-contacts" style=" margin-bottom: 20px">
                <!-- start: 添加联系人 -->
                <el-form :inline="true" ref="contactForm" :model="contactForm" :rules="rules" label-width="80px"
                         class="contact-form">
                  <el-col :span="11">
                    <el-form-item label="联系人" prop="name">
                      <el-input :disabled="addForm.enable ? false : true" v-model="contactForm.name"
                                placeholder="请输入联系人"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="11">
                    <el-form-item label="邮箱" prop="account">
                      <el-input :disabled="addForm.enable ? false : true" v-model="contactForm.account"
                                placeholder="请输入联系人邮箱"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="2">
                    <el-button class="contact-add-btn" type="primary" @click.native="createUserContacts">添加
                    </el-button>
                  </el-col>
                </el-form>
                <!-- end: 添加联系人 -->
              </el-form-item>
              <el-form-item label=" " :span="18">
                <el-table ref="multipleTable" :data="contacts" border height="200" tooltip-effect="dark"
                          @selection-change="handleSelectionChange">
                  <el-table-column type="selection" :selectable="checkSelectable" width="55"></el-table-column>
                  <el-table-column prop="name" label="联系人" width="180"></el-table-column>
                  <el-table-column prop="type" label="联系方式" width="180" :formatter="formatType"
                                   sortable></el-table-column>
                  <el-table-column prop="account" label="邮箱" min-width="180"></el-table-column>
                  <el-table-column label="操作">
                    <template scope="scope">
                      <el-button size="small" type="danger" @click="deleteUserContacts(scope.row)">删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
                <list-page :pager="pager" @data="getData"></list-page>
              </el-form-item>
              <el-form-item label="报告接收日期" class="from-item">
                <el-col :span="12">
                  <el-select :disabled="addForm.enable ? false : true" v-model="addForm.cronExpression.week"
                             placeholder="请选择(星期几)">
                    <el-option v-for="item in options" :key="item.value" :label="item.label"
                               :value="item.value"></el-option>
                  </el-select>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="报告接收小时" class="from-item hour">
                    <el-time-select :disabled="addForm.enable ? false : true" placeholder="报告接收小时"
                                    v-model="addForm.cronExpression.hour"
                                    :picker-options="{start: '00:00', step: '01:00',end: '23:00',minTime: startTime}">
                    </el-time-select>
                  </el-form-item>
                </el-col>
              </el-form-item>
              <el-form-item class="dialog-footer" style="text-align: center;">
                <el-button type="primary" @click.native="addFormSubmit">保存</el-button>
              </el-form-item>
            </el-form>
          </el-col>
        </div>
        <!-- end: 周报设置模块 -->
      </div>
    </el-col>
  </div>
</template>
<script>
  import Pager from '@/components/common/pager'
  import {getReportSetting, editReportSetting} from '@/service/report'
  import {getContacts, addContact, deleteContact} from '@/service/contact'

  const optionData = []
  optionData.push({value: '2', label: '星期一'})
  optionData.push({value: '3', label: '星期二'})
  optionData.push({value: '4', label: '星期三'})
  optionData.push({value: '5', label: '星期四'})
  optionData.push({value: '6', label: '星期五'})
  optionData.push({value: '7', label: '星期六'})
  optionData.push({value: '1', label: '星期日'})
  export default {
    name: 'weeklyReport',
    data () {
      return {
        contactForm: {name: '', account: ''},
        rules: {
          name: [{required: true, message: '请输入联系人名称', trigger: 'blur'}],
          account: [{required: true, message: '请输入邮箱地址', trigger: 'blur'},
            {type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur,change'}]
        },
        concatSelectedClick: true,
        multipleSelection: [],
        pager: {
          pageSize: 50,
          currentPage: 1,
          totalElements: 1
        },
        addForm: {
          enable: false,
          briefingType: '',
          contacts: [],
          cronExpression: {hour: '', week: ''}
        },
        contacts: [], // 所有联系人
        options: optionData
      }
    },
    components: {
      'list-page': Pager
    },
    mounted () {
      // 获取周报设置
      let self = this
      self.getReportSetting()
      self.getUserContacts()
    },
    methods: {
      /**
       * 获取当前用户的周报设置信息
       */
      getReportSetting() {
        let self = this
        let params = {briefingType: 'WEEKLY'}
        getReportSetting(params).then(setting => {
          self.addForm = setting
        })
      },
      /**
       * 获取当前用户的联系人信息
       */
      getUserContacts() {
        let self = this
        let contactsParams = {
          limit: self.pager.pageSize,
          page: self.pager.currentPage
        }
        getContacts(contactsParams).then(data => {
          self.pager.totalElements = data.totalElements
          self.contacts = data.content
        })
      },
      /**
       * 当用户勾选联系人时
       */
      handleSelectionChange(val) {
        this.concatSelectedClick = true
        this.multipleSelection = val
      },
      /**
       * 格式化联系类型的显示
       */
      formatType: function (row) {
        return row.type === 'EMAIL' ? '邮箱' : row.type === 'PHONE' ? '短信' : '未知'
      },
      /**
       * 添加用户联系人
       * @param contact
       */
      createUserContacts () {
        let self = this
        self.$refs.contactForm.validate((valid) => {
          if (valid) {
            let params = self.contactForm
            params.type = 'EMAIL'
            addContact(params).then(data => {
              if (data) {
                self.$message({
                  showClose: true,
                  message: '添加联系人成功!',
                  type: 'success'
                })
              } else {
                self.$message({
                  showClose: true,
                  message: '添加联系人失败!',
                  type: 'error'
                })
              }
              self.pager.currentPage = 1
              self.getUserContacts()
            })
          }
        })
      },
      /**
       * 删除用户联系人
       * @param contact
       */
      deleteUserContacts: function (contact) {
        var self = this
        let params = contact
        this.$confirm('确认删除该记录吗?', '提示', {type: 'warning'}).then(() => {
          deleteContact(params).then(data => {
            // TODO: 如何判读用户联系人是否删除成功
            self.pager.currentPage = 1
            self.getUserContacts()
          }).catch(() => {
            self.$message({
              showClose: true,
              message: '删除用户联系人失败!',
              type: 'error'
            })
          })
        })
      },
      /**
       * 保存用户周报设置
       */
      addFormSubmit () {
        let self = this
        let params = self.addForm
        // 获取选中的联系人，
        params.contacts = self.multipleSelection
        params.cronExpression.hour = parseInt(params.cronExpression.hour.split(':')[0])
        editReportSetting(params).then(data => {
          if (data) {
            self.$message({
              showClose: true,
              message: '周报设置保存成功!',
              type: 'success'
            })
          } else {
            self.$message({
              showClose: true,
              message: '周报设置保存失败!',
              type: 'error'
            })
          }
          self.getReportSetting()
        }).catch(() => {
          self.$message({
            showClose: true,
            message: '周报设置保存失败!',
            type: 'error'
          })
        })
      },
      /**
       * 从联系人列表中选中已加入周报的联系人
       */
      toggleSelection(rows) {
        if (rows) {
          rows.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row, true)
          })
        }
      },
      /**
       * 获取子组件的参数，进行相关的操作处理
       * @param data
       */
      getData(data) {
        let self = this
        switch (data.action) {
          case 'clickCommonPager':
            self.pager = data.data
            self.getUserContacts()
            break
        }
      },
      checkSelectable(row, index) {
        if (this.addForm.enable) {
          return 1
        } else {
          return 0
        }
      }
    },
    watch: {
      addForm: {
        handler: function () {
          var self = this
          var rows = []
          self.contacts.forEach(function (obj) {
            self.addForm.contacts.forEach(function (item) {
              if (item.id === obj.id) {
                rows.push(obj)
              }
            })
          })
          self.$nextTick(function () {
            // DOM 现在更新了
            // `this` 绑定到当前实例
            self.toggleSelection(rows)
          })
        },
        deep: true
      },
      contacts: function () {
        var self = this
        var rows = []
        self.contacts.forEach(function (obj) {
          self.addForm.contacts.forEach(function (item) {
            if (item.id === obj.id) {
              rows.push(obj)
            }
          })
        })
        self.$nextTick(function () {
          // DOM 现在更新了
          // `this` 绑定到当前实例
          self.toggleSelection(rows)
        })
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss">
</style>
