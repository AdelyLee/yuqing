<template>
  <div id="contacts">
    <el-col :span="24">
      <div class="card-body">
        <el-card class="box-card">
          <div class="card-body">
            <!--start： 工具条-->
            <el-col :span="24" class="toolbar" style="padding-bottom: 0">
              <el-form :inline="true" :model="filters">
                <el-form-item>
                  <el-button type="primary" class="add" @click="showAddDialog">添加</el-button>
                </el-form-item>
              </el-form>
            </el-col>
            <!--end： 工具条-->
            <!-- start: 联系人列表 -->
            <el-table :data="contacts" highlight-current-row v-loading="contactsTableLoading" style="width: 100%;">
              <el-table-column type="index" label="编号" width="80"></el-table-column>
              <el-table-column prop="name" label="联系人" width="180" sortable></el-table-column>
              <el-table-column prop="type" label="联系方式" width="180" :formatter="formatType" sortable></el-table-column>
              <el-table-column prop="account" label="联系邮箱／号码" min-width="180"></el-table-column>
              <el-table-column label="操作">
                <template scope="scope">
                  <el-button class="modify" @click="handleEdit(scope.$index, scope.row)">
                    <span class="el-icon-edit"></span> 编辑
                  </el-button>
                  <el-button class="delete" type="danger" @click="handleDelete(scope.$index, scope.row)">
                    <span class="el-icon-delete2"></span> 删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
            <!-- end: 联系人列表 -->
            <div class="page">
              <list-page :pager="pager" @data="getData"></list-page>
            </div>
          </div>
          <!-- start: 添加联系人对话框 -->
          <el-dialog title="添加联系人" v-model="addFormVisible" :close-on-click-modal="false" style="text-align:left">
            <el-form :model="addForm" :rules="rules" ref="addForm" label-width="150px">
              <el-form-item label="联系人" prop="name">
                <el-input v-model="addForm.name" placeholder="请输入联系人名称"></el-input>
              </el-form-item>
              <el-form-item label="联系方式" prop="type">
                <el-select v-model="addForm.type" placeholder="请选择">
                  <el-option v-for="item in types" :key="item.value" :label="item.label"
                             :value="item.value"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="联系邮箱／号码" prop="account">
                <el-input v-model="addForm.account" placeholder="请输入联系人邮箱或手机号码"></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click.native="addFormVisible = false">取消</el-button>
              <el-button type="info" @click="resetAddForm">重置</el-button>
              <el-button type="primary" @click.native="addContact">添加</el-button>
            </div>
          </el-dialog>
          <!-- end: 添加联系人对话框 -->
          <!-- start: 编辑联系人对话框 -->
          <el-dialog title="编辑联系人" v-model="editFormVisible" :close-on-click-modal="false" style="text-align:left">
            <el-form :model="editForm" :rules="rules" ref="editForm" label-width="150px" class="demo-ruleForm">
              <el-form-item label="联系人" prop="name">
                <el-input v-model="editForm.name" placeholder="请输入联系人名称"></el-input>
              </el-form-item>
              <el-form-item label="联系方式" prop="type">
                <el-select v-model="editForm.type" placeholder="请选择">
                  <el-option v-for="item in types" :key="item.value" :label="item.label"
                             :value="item.value"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="联系邮箱／号码" prop="account">
                <el-input v-model="editForm.account" placeholder="请输入联系人邮箱或手机号码"></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click.native="editFormVisible = false">取消</el-button>
              <el-button type="primary" @click.native="editContact(editForm)">保存</el-button>
            </div>
          </el-dialog>
          <!-- end: 编辑联系人对话框 -->
        </el-card>
      </div>
    </el-col>
  </div>
</template>

<script>
  import Pager from '@/components/common/pager'
  import {getContacts, addContact, deleteContact, editContact} from '@/service/contact'
  export default {
    name: 'contacts',
    data() {
      return {
        addFormVisible: false,
        editFormVisible: false,
        contactsTableLoading: true,
        contacts: [],
        pager: {
          pageSize: 10,
          currentPage: 1,
          totalElements: 1
        },
        addForm: {name: '', type: '', account: ''},
        editForm: {name: '', type: '', account: ''},
        types: [{value: 'EMAIL', label: '邮箱'}
          //          {value: 'SMS', label: '短信'}
        ],
        rules: {
          name: [{required: true, message: '请输入联系人名称', trigger: 'blur'}],
          type: [{required: true, message: '请输入选择联系方式', trigger: 'blur'}],
          account: [{required: true, message: '请输入联系人邮箱或手机号码', trigger: 'blur'},
            {type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur,change'}]
        }
      }
    },
    components: {
      'list-page': Pager
    },
    created() {
    },
    mounted() {
      this.renderPageData()
    },
    methods: {
      /**
       * 渲染页面数据
       */
      renderPageData() {
        let self = this
        self.getContactList()
      },
      /**
       * 获取子组件的参数，进行相关的操作处理
       * @param data
       */
      getData(data) {
      },

      /**
       * 获取用户联系人列表
       */
      // TODO: 后台添加用户名查询联系人接口
      getContactList () {
        let self = this
        let params = {
          limit: self.pager.pageSize,
          orders: [{direction: 'DESC', orderBy: 'dateCreated'}],
          page: self.pager.currentPage
        }
        getContacts(params).then(data => {
          self.contactsTableLoading = false
          self.contacts = data.content
          self.pager.totalElements = data.totalElements
        }).catch(error => {
          self.$confirm(error.message, '错误', {type: 'error'})
        })
      },
      /**
       * 添加联系人
       */
      addContact () {
        let self = this
        let params = self.addForm
        addContact(params).then(data => {
          self.addFormVisible = false
          self.resetAddForm()
          self.getContactList()
        }).catch(error => {
          self.$confirm(error.message, '错误', {type: 'error'})
        })
      },
      /**
       * 删除联系人
       */
      editContact () {
        let self = this
        let params = self.editForm
        editContact(params).then(data => {
          self.editFormVisible = false
          self.getContactList()
        }).catch(error => {
          self.$confirm(error.message, '错误', {type: 'error'})
        })
      },
      /**
       * 删除联系人
       */
      deleteContact (contact) {
        let self = this
        let params = contact
        deleteContact(params).then(data => {
          self.pager.currentPage = 1
          self.getContactList()
        }).catch(error => {
          self.$confirm(error.message, '错误', {type: 'error'})
        })
      },
      /**
       * 格式化联系类型的显示
       */
      formatType: function (row) {
        return row.type === 'EMAIL' ? '邮箱' : row.type === 'PHONE' ? '短信' : '未知'
      },
      handleEdit(index, row) {
        let self = this
        self.editFormVisible = true
        self.editForm = row
      },
      handleDelete(index, row) {
        let self = this
        self.$confirm('确认删除该记录吗?', '提示', {type: 'warning'}).then(() => {
          self.deleteContact(row)
        }).catch(() => {
        })
      },
      /**
       * 显示添加联系人对话框
       */
      showAddDialog() {
        let self = this
        self.addFormVisible = true
      },
      /**
       * 重置添加联系人对话框
       */
      resetAddForm: function () {
        this.$refs['addForm'].resetFields()
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss">


  /*.add {*/
  /*float: right;*/
  /*}*/
</style>
