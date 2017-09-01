<template>
  <div id="industry-keywords">
    <el-col :span="24">
      <div class="card-body">
        <div class="model">
        <p class="pTitle manage-title-img">行业关键词设置</p>
        <div class="buttons industry">
          <div class="el-tabs__header">
            <div class="el-tabs__nav-wrap">
              <div class="el-tabs__nav-scroll">
                <div class="el-tabs__nav">
                  <div class="el-tabs__item is-active"
                       @click="handleClickTrendButton('COLLIERY', $event)"><span>
                                                             煤矿</span></div>
                  <div class="el-tabs__item"
                       @click="handleClickTrendButton('NONCOAL', $event)"><span>
                                                            金属非金属</span></div>
                  <div class="el-tabs__item"
                       @click="handleClickTrendButton('CHEMICALS', $event)"><span>
                                                            危险化学品</span></div>
                  <div class="el-tabs__item"
                       @click="handleClickTrendButton('BUSINESS', $event)"><span>
                                                            工商贸</span></div>
                  <div class="el-tabs__item"
                       @click="handleClickTrendButton('FIREWORKS', $event)"><span>
                                                            烟花爆竹</span></div>
                  <div class="el-tabs__item"
                       @click="handleClickTrendButton('BUILDINGS', $event)"><span>
                                                            建筑</span></div>
                  <div class="el-tabs__item"
                       @click="handleClickTrendButton('TRANSPORTATION', $event)"><span>
                                                            交通运输</span></div>
                  <div class="el-tabs__item"
                       @click="handleClickTrendButton('OTHERS', $event)"><span>
                                                            其他</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
          <el-tabs v-model="keywordsModel">
            <el-tab-pane label="基础模式" name="basic">
              <el-form :model="keywordsForm" :rules="rules" ref="keywordsForm" label-width="150px">
                <el-form-item label="关键词" prop="shouldWord">
                  <el-input type="textarea" v-model="keywordsForm.shouldWord" placeholder="关键词之间用@隔开" :disabled="seniorModel"></el-input>
                </el-form-item>
                <el-form-item label="同现词" prop="mustWord">
                  <el-input type="textarea" v-model="keywordsForm.mustWord" placeholder="同现词之间用@隔开" :disabled="seniorModel"></el-input>
                </el-form-item>
                <el-form-item label="排除词" prop="mustNotWord">
                  <el-input type="textarea" v-model="keywordsForm.mustNotWord" placeholder="排除词之间用@隔开" :disabled="seniorModel"></el-input>
                </el-form-item>
                <el-col v-if="basicModel">
                  <el-button type="primary" @click="clickSaveBtn(false)">保存</el-button>
                </el-col>
              </el-form>
            </el-tab-pane>
            <el-tab-pane label="高级模式" name="senior">
              <el-form :model="keywordsForm" label-position="right" :rules="rules" ref="keywordsForm" label-width="150px">
                <el-form-item label="启用高级模式 :" class="switchNo">
                  <el-switch v-model="seniorModel" on-color="#13ce66" off-color="#ff4949" @change="switchKeywordsModel"></el-switch>
                  <el-tooltip placement="top">
                    <div slot="content">启动高级模式 》 基础模式取消
                      <br/>关闭高级模式 》 基础模式开启
                    </div>
                    <span class="prompt manage-prompt-img"></span>
                  </el-tooltip>
                </el-form-item>

                <el-form-item label="关键词语" prop="expression">
                  <el-input id="expression" type="textarea" v-model="keywordsForm.expression" placeholder="词语之间用下列符号隔开" :disabled="basicModel"></el-input>
                </el-form-item>
                <el-form-item label=" ">
                  <el-col :span="18" v-if="seniorModel" class="opearBtn">
                    <el-button :plain="true" type="success" @click="addSymbol('AND')">AND</el-button>
                    <el-button :plain="true" type="warning" @click="addSymbol('OR')">OR</el-button>
                    <el-button :plain="true" type="danger" @click="addSymbol('(')">(</el-button>
                    <el-button :plain="true" type="info" @click="addSymbol(')')">)</el-button>
                    <el-button :plain="true" type="success" @click="addSymbol('NOT')">NOT</el-button>
                  </el-col>
                  <el-col :span="6" class="help">
                    <el-button  @click="open()">帮助</el-button>
                  </el-col>
                </el-form-item>
                <!-- start: 帮助弹出框 -->
                <el-dialog class="help-dialog" title="帮助信息" :visible.sync="helpDailogVisible" size="big">
                  <div>
                    <span>多个关键词语用关键词与符号进行组合，其中
                      <span class="red">[AND]</span>表示必须同时出现，
                      <span class="red">[OR]</span>表示包含任意一个即可，
                      <span class="red">[NOT]</span>表示排除词
                      <br/>
                      <span class="green">示例一：</span>“安徽
                      <span class="red">AND</span>事故”
                      <br/>此组合表示为：安徽和事故关键词必须出现
                      <br/>
                      <span class="green">示例二：</span>“煤矿
                      <span class="red">AND</span>事故
                      <span class="red">OR</span>安全生产”
                      <br/>此组合表示为：煤矿和事故关键词或者煤矿和安全生产关键词(事故和安全生产关键词出现一个即可)
                      <br/>
                      <span class="green">示例三：</span>“安徽煤监局
                      <span class="red">AND</span> (安全生产
                      <span class="red">OR</span>煤矿
                      <span class="red">OR</span>事故
                      <span class="red">OR</span>煤监局)”
                      <br/>此组合表示为：安徽煤监局和安全生产关键词或者安徽煤监局和煤矿或者安徽煤监局和事故或者安徽煤监局和煤监局（安全生产和煤矿和事故和煤监局关键词出现一个即可）
                      <br/>
                      <span class="green">示例四：</span>“内地
                      <span class="red">AND</span> (李易峰
                      <span class="red">OR</span>杨洋
                      <span class="red">OR</span>郑爽
                      <span class="red">OR</span>杨紫
                      <span class="red">OR</span>赵丽颖
                      <span class="red">OR</span>古力娜扎
                      <span class="red">OR</span>刘诗诗
                      <span class="red">OR</span>朱茵
                      <span class="red">OR</span>林更新
                      <span class="red">OR</span>张一山
                      <span class="red">OR</span>张杰 NOT</span>医生”
                    <br/>此组合表示为：内地和括号里面的随意一个关键词出现即可 , 排除关键词医生</span>
                  </div>
                  <div slot="footer" class="dialog-footer">
                  </div>
                </el-dialog>
                <!---end: 帮助弹出框 -->
                <div v-if="seniorModel">
                  <el-button type="primary" @click="clickSaveBtn(false)">保存</el-button>
                </div>
              </el-form>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </el-col>
  </div>
</template>

<script type="text/ecmascript-6">
  import { getKeywords, editKeywords } from '@/service/config'
  import $ from 'jquery'
  export default {
    name: 'industryKeywords',
    data () {
      return {
        types: 'COLLIERY',
        keywordsModel: 'senior',
        basicModel: false,
        seniorModel: true,
        helpDailogVisible: false,
        keywordsForm: {},
        rules: {
          shouldWord: [{ required: true, message: '请输入关键词', trigger: 'blur' }]
        }
      }
    },
    mounted() {
      this.getIndustryKeyword()
    },
    methods: {
      getIndustryKeyword: function () {
        let self = this
        // get the keywords
        let industryKeywordsParams = { type: self.types }
        getKeywords(industryKeywordsParams).then(industryKeywords => {
          self.keywordsForm = industryKeywords
          localStorage.setItem('industryKeywords', JSON.stringify(industryKeywords))
        }).then(() => {
          // 判断关键词模式,设置相关的值
          if (self.keywordsForm.mode === 'NORMAL') {
            self.keywordsModel = 'basic'
            self.basicModel = true
            self.seniorModel = false
          } else if (self.keywordsForm.mode === 'ADVANCED') {
            self.keywordsModel = 'senior'
            self.basicModel = false
            self.seniorModel = true
          }
        })
      },
      handleClickTrendButton: function (trendTimesType, item) {
        var self = this
        $('.buttons.industry').find('.el-tabs__item').removeClass('is-active')
        $(item.currentTarget).addClass('is-active')
        self.types = trendTimesType
        self.getIndustryKeyword()
      },
      /**
       * 切换关键词模式
       * @param model
       */
      switchKeywordsModel(model) {
        let self = this
        if (model) {
          self.keywordsModel = 'senior'
          self.keywordsForm.mode = 'ADVANCED'
          self.seniorModel = true
          self.basicModel = false
          self.$message({
            showClose: true,
            message: '切换至高级模式!',
            type: 'info'
          })
        } else {
          self.keywordsModel = 'basic'
          self.keywordsForm.mode = 'NORMAL'
          self.seniorModel = false
          self.basicModel = true
          self.$message({
            showClose: true,
            message: '切换至基础模式!',
            type: 'info'
          })
        }

        self.clickSaveBtn(true)
      },
      /**
       * 帮助页面
       */
      open() {
        let self = this
        self.helpDailogVisible = true
      },
      close() {
        let self = this
        self.helpDailogVisible = false
      },
      /**
       * 为表达式添加连接符号
       * @param str
       */
      addSymbol(str) {
        var obj = document.getElementById('expression').firstElementChild
        if (document.selection) {
          let sel = document.selection.createRange()
          sel.text = str
        } else if (typeof obj.selectionStart === 'number' && typeof obj.selectionEnd === 'number') {
          let startPos = obj.selectionStart
          let endPos = obj.selectionEnd
          let cursorPos = startPos
          let tmpStr = obj.value
          obj.value = tmpStr.substring(0, startPos) + str + tmpStr.substring(endPos, tmpStr.length)
          cursorPos += str.length
          obj.selectionStart = obj.selectionEnd = cursorPos
        } else {
          obj.value += str
        }
      },
      clickSaveBtn(switchModel) {
        let self = this
        let params = self.keywordsForm
        // 验证关键词不能为空
        self.$refs.keywordsForm.validate((valid) => {
          if (valid) {
            if (self.keywordsForm.expression !== '') {
              editKeywords(params).then(industryKeywords => {
                if (industryKeywords) {
                  localStorage.setItem('industryKeywords', JSON.stringify(industryKeywords))
                  if (!switchModel) {
                    self.$message({
                      showClose: true,
                      message: '保存焦点关键词成功!',
                      type: 'success'
                    })
                  }
                } else {
                  if (switchModel) {
                    self.$message({
                      showClose: true,
                      message: '切换模式失败!',
                      type: 'error'
                    })
                  } else {
                    self.$message({
                      showClose: true,
                      message: '保存焦点关键词失败!',
                      type: 'error'
                    })
                  }
                }
              })
            }
          }
        })
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss">
  #industry-keywords{
  .model {
    padding: 20px;
  .title {
    text-align: left;
  }
  .el-form {
    padding: 25px;
  }
  .help-dialog {
    text-align: left;
  }
  .el-textarea__inner {
    min-height: 100px;
    width: 90%;
  }
  .buttons .el-tabs__item.is-active {
    border-bottom: 2px solid #20a0ff;
  }
  .el-tabs__item.is-active {
    color: #20a0ff;
  }
  }
  }
</style>
