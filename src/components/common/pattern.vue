<template>
<el-tabs v-model="keywordsModel">
  <el-tab-pane label="基础模式" name="basic">
    <el-form :model="keywordsForm" :rules="rules" ref="keywordsForm" label-width="100px">
      <el-form-item label="关键词" prop="shouldWord">
        <el-input type="textarea" v-model="keywordsForm.shouldWord"
                  placeholder="关键词之间用@隔开" :disabled="seniorModel"></el-input>
      </el-form-item>
      <el-form-item label="同现词" prop="mustWord">
        <el-input type="textarea" v-model="keywordsForm.mustWord"
                  placeholder="同现词之间用@隔开" :disabled="seniorModel"></el-input>
      </el-form-item>
      <el-form-item label="排除词" prop="mustNotWord">
        <el-input type="textarea" v-model="keywordsForm.mustNotWord"
                  placeholder="排除词之间用@隔开" :disabled="seniorModel"></el-input>
      </el-form-item>
      <el-col v-if="basicModel">
        <el-button type="primary" @click="clickSaveBtn(keywordsForm)">保存</el-button>
        <el-button @click="resetForm('keywordsForm')">重置</el-button>
      </el-col>
    </el-form>
  </el-tab-pane>
  <el-tab-pane label="高级模式" name="senior">
    <el-form :model="keywordsForm" :rules="rules" ref="keywordsForm" label-width="100px">
      <el-form-item class="switchNo">
        <span>启用高级模式 :</span>
        <el-switch v-model="seniorModel" on-color="#13ce66" off-color="#ff4949"
                   @change="switchKeywordsModel"></el-switch>
        <el-tooltip placement="top">
          <div slot="content">启动高级模式 》 基础模式取消 <br/>关闭高级模式 》 基础模式开启</div>
          <span class="prompt"></span>
        </el-tooltip>
      </el-form-item>
      <el-form-item label="关键词语" prop="expression">
        <el-input type="textarea" v-model="keywordsForm.expression"
                  placeholder="词语之间用下列符号隔开" :disabled="basicModel"></el-input>
      </el-form-item>
      <el-col v-if="seniorModel" class="opear">
        <el-button :plain="true" type="success" @click="addSymbol()" id="add">AND</el-button>
        <el-button :plain="true" type="warning" @click="addsSymbol()" id="adds">OR</el-button>
        <el-button :plain="true" type="danger" @click="addLeftSymbol()" id="left-brackets">(</el-button>
        <el-button :plain="true" type="info" @click="addRightSymbol()" id="right-brackets">)</el-button>
        <el-button :plain="true" type="success" @click="addReduceSymbol()" id="reduce">NOT</el-button>
      </el-col>
      <div class="open" style="display: none">
        <span @click="close()"><i class="el-icon-circle-close"></i></span>
                <span>多个关键词语用关键词与符号进行组合，其中<span class="red">[AND]</span>表示必须同时出现，<span
                  class="red">[OR]</span>表示包含任意一个即可，<span
                  class="red">[NOT]</span>表示排除词 <br/><span
                  class="green">示例一：</span>“安徽<span class="red">AND</span>事故”<br/>此组合表示为：安徽和事故关键词必须出现<br/><span
                  class="green">示例二：</span>“煤矿<span class="red">AND</span>事故<span
                  class="red">OR</span>安全生产”<br/>此组合表示为：煤矿和事故关键词或者煤矿和安全生产关键词(事故和安全生产关键词出现一个即可)<br/><span
                  class="green">示例三：</span>“安徽煤监局 <span class="red">AND</span> (安全生产<span
                  class="red">OR</span>煤矿<span class="red">OR</span>事故<span
                  class="red">OR</span>煤监局)”<br/>此组合表示为：安徽煤监局和安全生产关键词或者安徽煤监局和煤矿或者安徽煤监局和事故或者安徽煤监局和煤监局（安全生产和煤矿和事故和煤监局关键词出现一个即可）<br/><span
                  class="green">示例四：</span>“内地 <span class="red">AND</span> (李易峰<span
                  class="red">OR</span>杨洋<span class="red">OR</span>郑爽<span
                  class="red">OR</span>杨紫<span class="red">OR</span>赵丽颖<span class="red">OR</span>古力娜扎<span
                  class="red">OR</span>刘诗诗<span class="red">OR</span>朱茵<span class="red">OR</span>林更新<span
                  class="red">OR</span>张一山<span class="red">OR</span>张杰 NOT</span>医生”<br/>此组合表示为：内地和括号里面的随意一个关键词出现即可
        , 排除关键词医生</span>
      </div>
      <el-button class="help" @click="open()">帮助</el-button>
      <div v-if="seniorModel">
        <el-button type="primary" @click="clickSaveBtn(keywordsForm)">保存</el-button>
        <el-button @click="resetForm('keywordsForm')">重置</el-button>
      </div>
    </el-form>
  </el-tab-pane>
</el-tabs>
</template>
<script>
  export default {
    props: ['keywordsForm'],
    data () {
      return {
        keywordsModel: 'senior',
        basicModel: false,
        seniorModel: true,
        rules: {
          shouldWord: [{required: true, message: '请输入关键词', trigger: 'blur'}]
        }
      }
    },
    methods: {

    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>

</style>
