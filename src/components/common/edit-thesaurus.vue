<template>
  <div class="edit-subject">
    <!--修改界面-->
    <el-dialog title="修改关键词" v-model="editDialog.editFormVisible" :close-on-click-modal="false">
      <el-form :model="editForm" :rules="rules" ref="editForm" label-width="150px" class="demo-ruleForm">
        <el-form-item  class="input-sqk" label="词名" prop="name">
          <el-input v-model="editForm.word" placeholder="请输入词名"></el-input>
        </el-form-item>
        <el-form-item label="类型">
          <el-select v-model="editForm.status" placeholder="请选择类型">
            <el-option label="关键词" value="MUST"></el-option>
            <el-option label="同现词" value="SHOULD"></el-option>
            <el-option label="排除词" value="MUSTNOT"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="editDialog.editFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="editFormSubmit(editForm)">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    props: ['editDialog'],
    data: function () {
      return {
        editForm: {
          word: '',
          status: ''
        }
      }
    },
    methods: {
      editFormSubmit: function (subject) {
        var data = {}
        data.action = 'editTheasaurus'
        data.word = subject
        this.$emit('data', data)
      }
    },
    watch: {
      editDialog: {
        handler: function (val, oldVal) {
          this.editForm = val.editForm
        },
        deep: true
      }
    }

  }
</script>
