<template>
  <div class="add-contact">
    <!--添加界面-->
    <el-dialog title="添加词库" v-model="addDialog.addFormVisible" :close-on-click-modal="false">
      <el-form :model="addForm" :rules="rules" ref="addForm" label-width="100px" class="demo-ruleForm">
        <el-form-item  class="input-sqk" label="词名" prop="name">
          <el-input v-model="addForm.name" placeholder="请输入词名"></el-input>
        </el-form-item>
        <el-form-item label="类型">
          <el-select v-model="addForm.status" placeholder="请选择类型">
            <el-option label="关键词" value="MUST"></el-option>
            <el-option label="同现词" value="SHOULD"></el-option>
            <el-option label="排除词" value="MUSTNOT"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="addDialog.addFormVisible = false">取消</el-button>
        <el-button type="info" @click="resetAddForm()">重置</el-button>
        <el-button type="primary" @click.native="addFormSubmit(addForm)">添加</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    props: ['addDialog'],
    data: function () {
      return {
        addForm: {
          name: '',
          status: ''
        }
      }
    },
    methods: {
      resetAddForm: function () {
        this.$refs['addForm'].resetFields()
      },
      addFormSubmit: function (contact) {
        var self = this
        var data = {}
        data.action = 'addThwsaurus'
        data.contact = contact
        this.$emit('data', data)
        self.addForm.name = ''
        self.addForm.status = ''
      }
    }
  }
</script>
