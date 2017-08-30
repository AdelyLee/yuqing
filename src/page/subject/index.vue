<template>
  <div id="subject">
    <el-col :span="24">
      <div class="card-body">
        <el-row :gutter="15">
          <el-col :span="24">
            <div class="button-list">
              <div class="subject-gl" @click="showSubjectList">
                <img src="../../assets/img/ztgl.svg"
                     style="float:left;width:33px;height: 31px;margin-left: 50px;margin-top: 10px;">专题管理
                <el-row>
                  <div class="border-left-top"></div>
                  <div class="border-right-top"></div>
                </el-row>
                <el-row>
                  <div class="border-left-bottom"></div>
                  <div class="border-right-bottom"></div>
                </el-row>
              </div>
              <div class="subject-bg" @click="showReportList">
                <img src="../../assets/img/reports.svg"
                     style="float:left;width:33px;height: 31px;margin-left: 50px;margin-top: 10px;">已生成报告
                <el-row>
                  <div class="border-left-top"></div>
                  <div class="border-right-top"></div>
                </el-row>
                <el-row>
                  <div class="border-left-bottom"></div>
                  <div class="border-right-bottom"></div>
                </el-row>
              </div>
            </div>
          </el-col>
          <el-col :span="24">
            <!---start: 专题管理---->
            <el-card v-if="activeName==='subjectList'" class="box-card subject-list-box">
              <el-col class="action-list">
                <el-button class="create-subject" @click="showCreateSubjectDialog"><span class="el-icon-plus"></span>创建专题
                </el-button>
                <div class="search-subject">
                  <el-input v-model="subjectName" placeholder="请输入专题名称"></el-input>
                  <el-button type="primary" @click="clickSearchSubject">查询</el-button>
                </div>
              </el-col>
              <el-col class="subject-list" v-loading="subjectListTableLoading">
                <el-table :data="subjectListData" style="width: 100%">
                  <el-table-column prop="number" label="编号" width="80"></el-table-column>
                  <el-table-column prop="name" label="专题名称" width="180"></el-table-column>
                  <el-table-column prop="shouldWord" label="关键词"></el-table-column>
                  <el-table-column label="时间" width="220">
                    <template scope="scope">
                      <span>{{ scope.row.startFormatDate }}</span> ～
                      <span>{{ scope.row.endFormatDate }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="state" label="状态" width="100">
                  </el-table-column>
                  <el-table-column label="操作" width="300">
                    <template scope="scope">
                      <el-button class="monitor" @click="showMonitorSubject(scope.row)" size="small"><span
                        class="el-icon-setting"></span> 实时监测
                      </el-button>
                      <el-button class="update" @click="updateReport(scope.row)" size="small"><span
                        class="el-icon-document"></span> 更新报告
                      </el-button>
                      <el-button class="modify" @click="showEditSubjectDialog(scope.row)" size="small"><span
                        class="el-icon-edit"></span> 修改
                      </el-button>
                      <el-button class="delete" @click="deleteSubject(scope.row)" size="small"><span
                        class="el-icon-delete2"></span> 删除
                      </el-button>
                    </template>
                  </el-table-column>
                  <el-table-column label="是否预警" width="160">
                    <template scope="scope">
                      <el-switch v-model="scope.row.enableWarning" on-color="#13ce66" off-color="#ff4949"
                                 @change="handleEnableWarningChange(scope.row)"></el-switch>
                      <el-button @click="showEditWarningDialog(scope.row)" type="text" style="color:#999"> 预警编辑
                      </el-button>
                    </template>
                  </el-table-column>
                </el-table>
                <list-page v-if="subjectListData.length > 0" :pager="subjectListPager" @data="getData"></list-page>
              </el-col>
            </el-card>
            <!--end: 专题管理-->
            <!--start: 已生成报告-->
            <el-card v-if="activeName==='reportList'" class="box-card report-list" v-loading="reportListLoading">
              <el-row>
                <list-search :searchForm="searchForm" @data="getData"></list-search>
              </el-row>
              <el-row type="flex" class="row-bg" justify="space-around">
                <report-list :reportList="reportListData" @data="getData"></report-list>
              </el-row>
              <list-page :pager="reportListPager" @data="getReportListPager"></list-page>
            </el-card>
            <!---end: 已生成报告-->
          </el-col>
        </el-row>
        <!---start: 专题管理 - 创建专题弹出框 -->
        <el-dialog class="create-subject-dialog" title="添加专题" :visible.sync="createSubjectDialogVisible" size="small"
                   :before-close="handleCreateDialogClose">
          <el-form :model="subjectAddForm" :rules="rules" ref="subjectAddForm" label-width="100px">
            <el-form-item label="专题名称" prop="name">
              <el-input v-model="subjectAddForm.name" placeholder="请输入专题名称"></el-input>
            </el-form-item>
            <el-form-item label="关键词" prop="shouldWord">
              <el-input type="textarea" v-model="subjectAddForm.shouldWord" placeholder="关键词使用@隔开"></el-input>
            </el-form-item>
            <el-form-item label="同现词" prop="mustWord">
              <el-input type="textarea" v-model="subjectAddForm.mustWord" placeholder="同现词使用@隔开"></el-input>
            </el-form-item>
            <el-form-item label="排除词" prop="mustNotWord">
              <el-input type="textarea" v-model="subjectAddForm.mustNotWord" placeholder="排除词使用@隔开"></el-input>
            </el-form-item>
            <el-form-item label="专题时间" required>
              <el-col :span="11">
                <el-form-item prop="startDate">
                  <el-date-picker type="date" placeholder="选择专题开始时间" :editable='datePickEditable'
                                  v-model="subjectAddForm.startDate" style="width: 100%;"></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col class="line" :span="2">-</el-col>
              <el-col :span="11">
                <el-form-item prop="endDate">
                  <el-date-picker type="date" placeholder="选择专题结束时间" :editable='datePickEditable'
                                  v-model="subjectAddForm.endDate" style="width: 100%;"></el-date-picker>
                </el-form-item>
              </el-col>
            </el-form-item>
            <el-form-item label="描述" prop="description">
              <el-input type="textarea" v-model="subjectAddForm.description" placeholder="专题描述"></el-input>
            </el-form-item>
            <el-form-item label="预计数据量" prop="estimate">
              <el-input v-model="subjectAddForm.estimate" class="estimate"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="danger" @click.native="createSubjectDialogVisible = false">取消</el-button>
            <el-button type="info" @click="resetAddForm">重置</el-button>
            <el-button type="success" @click="estimateSubject(subjectAddForm, 'subjectAddForm')">预估</el-button>
            <el-button type="primary" @click.native="subjectAddFormSubmit(subjectAddForm)">创建</el-button>
          </div>
        </el-dialog>
        <!---end: 专题管理 - 创建专题弹出框 ---->
        <!---start: 专题管理 - 修改专题弹出框 ---->
        <el-dialog class="edit-subject-dialog" title="修改专题" :visible.sync="editSubjectDialogVisible" size="small">
          <el-form :model="subjectEditForm" :rules="rules" ref="subjectEditForm" label-width="100px"
                   class="demo-ruleForm">
            <el-form-item label="专题名称" prop="name">
              <el-input v-model="subjectEditForm.name" placeholder="请输入专题名称" readonly></el-input>
            </el-form-item>
            <el-form-item label="关键词" prop="shouldWord">
              <el-input type="textarea" v-model="subjectEditForm.shouldWord" placeholder="关键词使用@隔开"></el-input>
            </el-form-item>
            <el-form-item label="同现词" prop="mustWord">
              <el-input type="textarea" v-model="subjectEditForm.mustWord" placeholder="同现词使用@隔开"></el-input>
            </el-form-item>
            <el-form-item label="排除词" prop="mustNotWord">
              <el-input type="textarea" v-model="subjectEditForm.mustNotWord" placeholder="排除词使用@隔开"></el-input>
            </el-form-item>
            <el-form-item label="专题时间" required>
              <el-col :span="11">
                <el-form-item prop="startDate">
                  <el-date-picker type="date" placeholder="选择专题开始时间" :editable="datePickEditable"
                                  v-model="subjectEditForm.startDate" style="width: 100%;"></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col class="line" :span="2">-</el-col>
              <el-col :span="11">
                <el-form-item prop="endDate">
                  <el-date-picker type="date" placeholder="选择专题结束时间" :editable="datePickEditable"
                                  v-model="subjectEditForm.endDate" style="width: 100%;"></el-date-picker>
                </el-form-item>
              </el-col>
            </el-form-item>
            <el-form-item label="描述" prop="description">
              <el-input type="textarea" v-model="subjectEditForm.description" placeholder="专题描述"></el-input>
            </el-form-item>
            <el-form-item label="预计数据量" prop="estimate">
              <el-input v-model="subjectEditForm.estimate" class="estimate"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="danger" @click.native="editSubjectDialogVisible = false">取消</el-button>
            <el-button type="success" @click="estimateSubject(subjectEditForm, 'subjectEditForm')">预估</el-button>
            <el-button type="primary" @click.native="subjectEditFormSubmit(subjectEditForm)">保存</el-button>
          </div>
        </el-dialog>
        <!---end: 专题管理 - 修改专题弹出框 ---->
        <!---start: 专题管理 - 编辑专题预警弹出框 ---->
        <el-dialog class="edit-warning-dialog" title="编辑预警" :visible.sync="editWarningDialogVisible" size="small">
          <el-tabs v-model="activeNames" @tab-click="wxhandleClick">
            <el-tab-pane label="邮箱预警" name="dxWarning">
              <el-form :inline="true" ref="contactForm" :model="contactForm" :rules="warningContactRules" label-width="80px"
                       class="demo-ruleForm">
                <el-form-item label="联系人" prop="name">
                  <el-input v-model="contactForm.name" placeholder="请输入联系人"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="account">
                  <el-input v-model="contactForm.account" placeholder="请输入联系人邮箱"></el-input>
                </el-form-item>
                <el-button type="primary" @click.native="addContactSubmit">添加</el-button>
              </el-form>
            </el-tab-pane>
            <el-tab-pane label="微信预警" name="wxWarning">
              <el-form :inline="true" ref="contactForm" :model="contactForm" :rules="wxWarningContactRules" label-width="100px"
                       class="demo-ruleForm">
                <el-form-item label="联系人" prop="wxname">
                  <el-input v-model="contactForm.wxname" placeholder="请输入联系人"></el-input>
                </el-form-item>
                <el-form-item label="微信昵称" prop="nickname">
                  <el-input v-model="contactForm.nickname" placeholder="请输入微信昵称"></el-input>
                </el-form-item>
                <el-button type="primary" @click.native="addNickname">添加</el-button>
              </el-form>
              <div class="wxrwm"></div>
            </el-tab-pane>
          </el-tabs>
          <el-form :model="warningEditForm" ref="warningEditForm" :rules="warningEditFormRules" label-width="80px">
            <el-table ref="multipleTable" :data="contacts" border height="150"
                      tooltip-effect="dark"
                      style="width: 88%; margin-left: 8%" @selection-change="handleSelectionChange">
              <el-table-column type="selection" width="55"></el-table-column>
              <el-table-column prop="name" label="联系人" width="180"></el-table-column>
              <el-table-column v-if="type==='EMAIL'" prop="account" label="邮箱" min-width="180"></el-table-column>
              <el-table-column v-if="type==='WECHAT'" prop="account" label="微信ID" min-width="180"></el-table-column>
              <el-table-column label="操作">
                <template scope="scope">
                  <el-button size="small" type="danger" @click="handleDeleteContact(scope.row)">
                    删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
            <list-page :pager="contactsTablePager" @data="getPager"></list-page>
            <el-form-item label="接收时间" required>
              <el-col :span="11">
                <el-form-item prop="receiveStartTime">
                  <el-time-select placeholder="起始时间" v-model="warningEditForm.receiveStartTime"
                                  :picker-options="{ start: '00:00', step: '01:00', end: '23:00'}">
                  </el-time-select>
                </el-form-item>
              </el-col>
              <el-col class="line" :span="2">-</el-col>
              <el-col :span="11">
                <el-form-item prop="receiveEndTime">
                  <el-time-select placeholder="结束时间" v-model="warningEditForm.receiveEndTime"
                                  :picker-options="{start: '00:00', step: '01:00',end: '23:00',minTime: start}">
                  </el-time-select>
                </el-form-item>
              </el-col>
            </el-form-item>
            <el-form-item label="预警间隔">
              <el-slider v-model="warningEditForm.hours" :min="1" :max="12" :step="1" show-stops
                         :format-tooltip="hoursFormat"></el-slider>
            </el-form-item>
            <el-form-item label="预警数量" class="warning-number">
              <el-input v-model="warningEditForm.minWarningNum" placeholder="请输入预警数量"></el-input>
            </el-form-item>
            <el-form-item label="周末预警">
              <el-radio-group v-model="warningEditForm.atWeekends">
                <el-radio label="true">是</el-radio>
                <el-radio label="false">否</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="预警内容" :inline="true">
              <el-col :span="3">
                <el-checkbox :indeterminate="isIndeterminateSentiment" v-model="sentimentCheckAll"
                             @change="handleSentimentCheckAllChange">全部
                </el-checkbox>
              </el-col>
              <el-col :span="21">
                <el-checkbox-group v-model="warningEditForm.sentimentLabel" @change="handleCheckedSentimentChange">
                  <el-checkbox v-for="sentiment in sentimentTypes" :label="sentiment" :key="sentiment">
                    {{sentiment}}
                  </el-checkbox>
                </el-checkbox-group>
              </el-col>
            </el-form-item>
            <el-form-item label="预警来源">
              <el-col :span="3">
                <el-checkbox :indeterminate="isIndeterminateType" v-model="typeCheckAll"
                             @change="handleTypeCheckAllChange">全部
                </el-checkbox>
              </el-col>
              <el-col :span="21">
                <el-checkbox-group v-model="warningEditForm.type" @change="handleCheckedTypesChange">
                  <el-checkbox v-for="type in articleTypes" :label="type" :key="type">{{type}}</el-checkbox>
                </el-checkbox-group>
              </el-col>
            </el-form-item>
            <el-form-item label="匹配">
              <el-radio-group v-model="warningEditForm.filed">
                <el-radio label="title">标题</el-radio>
                <el-radio label="">全文</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="danger" @click.native="editWarningDialogVisible = false">取消</el-button>
            <el-button type="primary" @click.native="warningEditFormSubmit(warningEditForm)">保存</el-button>
          </div>
        </el-dialog>
        <!---end: 专题管理 - 编辑专题预警弹出框 ---->
      </div>
    </el-col>
  </div>
</template>
<script type="text/ecmascript-6">
  import Pager from '@/components/common/pager'
  import reportList from '@/components/common/report-list'
  import listSearch from '@/components/common/list-search'
  import {
    getSubjects,
    addSubject,
    editSubject,
    updateCustomSubjectReport,
    deleteSubject,
    getSpecialKeyWords
  } from '@/service/subject'
  import {getContacts, addContact, deleteContact, createNickname} from '@/service/contact'
  import {getFilterAndGroupBy} from '@/service/article'
  import {dateUtil} from '@/utils/dateUtil'
  import {getReports, deleteReport} from '@/service/report'
  import $ from 'jquery'
  const basePath = localStorage.getItem('basePath')

  export default {
    name: 'subject',
    data () {
      return {
        activeName: 'subjectList',
        subjectListTableLoading: true,
        reportListLoading: true,
        createSubjectDialogVisible: false,
        editSubjectDialogVisible: false,
        editWarningDialogVisible: false,
        datePickEditable: false,
        subjectListPager: {
          pageSize: 10,
          currentPage: 1,
          totalElements: 1
        },
        subjectListData: [],
        searchForm: {
          nameLabel: '报告名称:',
          timeLabel: '报告生成时间:',
          name: '',
          startDate: '',
          endDate: ''
        },
        reportListHeader: '专报',
        reportListPager: {
          pageSize: 12,
          currentPage: 1,
          totalElements: 1
        },
        reportListData: [],
        subjectAddForm: {
          name: '',
          mustWord: '',
          shouldWord: '',
          mustNotWord: '',
          startDate: '',
          endDate: '',
          description: '',
          estimate: ''
        },
        rules: {
          name: [{required: true, message: '请输入专题名称', trigger: 'blur'}],
          shouldWord: [{required: true, message: '请输入关键词', trigger: 'blur'}],
          startDate: [{type: 'date', required: true, message: '选择专题开始时间', trigger: 'change'}],
          endDate: [{type: 'date', required: true, message: '选择专题结束时间', trigger: 'change'}]
        },
        subjectEditForm: {
          name: '',
          mustWord: '',
          shouldWord: '',
          mustNotWord: '',
          startDate: '',
          endDate: '',
          description: '',
          estimate: ''
        },
        activeNames: 'dxWarning',
        contactForm: {
          wxname: '',
          name: '',
          account: '',
          nickname: ''
        },
        contactsTablePager: {
          pageSize: 50,
          currentPage: 1,
          totalElements: 1
        },
        warningContactRules: {
          name: [{required: true, message: '请输入联系人名称', trigger: 'blur'}],
          account: [
            {required: true, message: '请输入邮箱地址', trigger: 'blur'}
//            {type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur,change'}
          ]
        },
        wxWarningContactRules: {
          wxname: [{message: '请输入联系人名称', trigger: 'blur'}],
          nickname: [
            {message: '请输入微信昵称', trigger: 'blur'}
          ]
        },
        warningEditFormRules: {
          receiveStartTime: [{required: true, message: '请选择时间', trigger: 'change'}],
          receiveEndTime: [{required: true, message: '请选择时间', trigger: 'change'}]
        },
        concatSelectedClick: true,
        multipleSelection: [],
        warningEditForm: {
          contacts: [],
          receiveStartTime: '',
          receiveEndTime: '',
          hours: 1,
          filed: '',
          atWeekends: true,
          sentimentLabel: [],
          type: [],
          minWarningNum: ''
        },
        contacts: [],
        type: 'EMAIL',
        wxContacs: [],
        wxid: '',
        sentimentTypes: ['正面', '负面', '中性'],
        isIndeterminateSentiment: false,
        sentimentCheckAll: false,
        articleTypes: ['新闻', '微博', '论坛', '贴吧'],
        isIndeterminateType: false,
        typeCheckAll: false,
        subject: null // 当前编辑的专题
      }
    },
    components: {
      'list-page': Pager,
      'report-list': reportList,
      'list-search': listSearch
    },
    mounted () {
      this.getSubjectList()
    },
    methods: {
      /**
       * 点击专题管理按钮时，展示专题列表
       */
      showSubjectList () {
        let self = this
        self.activeName = 'subjectList'
      },
      /**
       * 点击已生成专报按钮时，展示相关的专报
       */
      showReportList () {
        let self = this
        self.activeName = 'reportList'
        self.getReportList()
      },
      /**
       * 点击创建专题按钮时，显示创建专题对话框
       */
      showCreateSubjectDialog () {
        let self = this
        self.createSubjectDialogVisible = true
      },
      /**
       * 当创建专题对话框关闭时,清空对话框的数据
       */
      handleCreateDialogClose () {
        let self = this
        self.resetAddForm()
        self.createSubjectDialogVisible = false
      },
      /**
       * 点击创建专题对话框中重置按钮时
       */
      resetAddForm () {
        this.$refs['subjectAddForm'].resetFields()
      },
      /**
       * 重置修改专题对话框内容
       */
      resetEditForm () {
        this.$refs['subjectEditForm'].resetFields()
      },
      /**
       * 点击创建专题对话框中保存按钮时,保存专题
       * @param subject
       */
      subjectAddFormSubmit (subject) {
        var self = this
        this.$refs['subjectAddForm'].validate((valid) => {
          if (valid) {
            let params = subject
            addSubject(params).then(data => {
              if (data) {
                self.$message({
                  showClose: true,
                  message: '添加专题成功!',
                  type: 'success'
                })
                self.resetAddForm()
                self.getSubjectList()
                self.createSubjectDialogVisible = false
              } else {
                self.$message({
                  showClose: true,
                  message: '添加专题失败!',
                  type: 'error'
                })
              }
            }).catch(() => {
              self.$message({
                showClose: true,
                message: '添加专题失败!',
                type: 'error'
              })
            })
          }
        })
      },
      /**
       * 点击创建专题或编辑专题对话框中预估按钮时,获取当前专题预估数目
       * @param subject
       * @param validateForm
       */
      estimateSubject (subject, validateForm) {
        let self = this
        self.$refs[validateForm].validate((valid) => {
          if (valid) {
            let params = {
              date: {
                startDate: dateUtil.formatDate(subject.startDate, 'yyyy-MM-dd'),
                endDate: dateUtil.formatDate(subject.endDate, 'yyyy-MM-dd')
              },
              keyword: {
                mustWord: subject.mustWord,
                shouldWord: subject.shouldWord,
                mustNotWord: subject.mustNotWord
              },
              groupName: '_type'
            }
            getFilterAndGroupBy(params).then(data => {
              if (data) {
                subject.estimate = data[0].value
              } else {
                self.$message({
                  showClose: true,
                  message: '获取预估值失败!',
                  type: 'error'
                })
              }
            }).catch(() => {
              self.$message({
                showClose: true,
                message: '获取预估值失败!',
                type: 'error'
              })
            })
          }
        })
      },
      /**
       * 点击修改专题按钮时，显示修改专题对话框
       * @param subject
       */
      showEditSubjectDialog (subject) {
        let self = this
        self.subjectEditForm.estimate = ''
        // TODO:使用jquery深度copy点击预估时,预估数目才能显示出来, 有bug, 当点击保存按钮后,预估值不显示
        $.extend(true, self.subjectEditForm, subject)
        self.editSubjectDialogVisible = true
      },
      /**
       * 点击修改专题对话框中保存按钮时,保存专题
       * @param subject
       */
      subjectEditFormSubmit (subject) {
        var self = this
        this.$refs['subjectEditForm'].validate((valid) => {
          if (valid) {
            self.editSubject(subject)
          }
        })
      },
      /**
       * 修改专题
       * @param subject
       */
      editSubject (subject) {
        let self = this
        let params = subject
        editSubject(params).then(data => {
          if (data) {
            self.$message({
              showClose: true,
              message: '修改专题成功!',
              type: 'success'
            })
            self.getSubjectList()
            self.editSubjectDialogVisible = false
          } else {
            self.$message({
              showClose: true,
              message: '修改专题失败!',
              type: 'error'
            })
          }
        }).catch(() => {
          self.$message({
            showClose: true,
            message: '修改专题失败!',
            type: 'error'
          })
        })
      },
      /**
       * 点击编辑预警按钮时，显示编辑预警对话框
       */
      showEditWarningDialog (subject) {
        let self = this
        self.subject = subject
        if (subject.warning) {
          self.warningEditForm = subject.warning
          // 判断预警内容和预警来源全选按钮
          self.handleCheckedSentimentChange(self.warningEditForm.sentimentLabel)
          self.handleCheckedTypesChange(self.warningEditForm.type)
        }
        self.getUserContacts()
        self.editWarningDialogVisible = true
      },
      /** 获取专题列表，当专题名称为''时，获取全部的专题
       * @param subjectName
       * 专题名称
       */
      getSubjectList (subjectName) {
        let self = this
        subjectName = subjectName || ''
        let params = {
          page: {
            limit: self.subjectListPager.pageSize,
            orders: [{direction: 'DESC', orderBy: 'dateCreated'}],
            page: self.subjectListPager.currentPage
          },
          subjectName: subjectName
        }
        getSubjects(params).then(data => {
          self.subjectListTableLoading = false
          self.subjectListData = data.content
          self.subjectListPager.totalElements = data.totalElements
        }).catch(error => {
          self.$confirm(error.message, '错误', {type: 'error'})
        })
      },
      /**
       * 点击专题列表查询按钮,根据专题名称查询专题
       */
      clickSearchSubject () {
        let self = this
        let subjectName = self.subjectName.trim()
        self.getSubjectList(subjectName)
      },
      /**
       * 获取专题报告列表，当传入专题为空时，获取全部的专题报告
       * @param searchCondition
       * 专题对象
       */
      getReportList(searchCondition) {
        searchCondition = searchCondition || {}
        let {startDate = '', endDate = '', title = ''} = searchCondition
        let self = this
        let params = {
          date: {
            startDate: startDate,
            endDate: endDate
          },
          page: {
            limit: self.reportListPager.pageSize,
            orders: [{direction: 'DESC', orderBy: 'dateCreated'}],
            page: self.reportListPager.currentPage
          },
          title: title,
          type: 'SPECIAL'
        }
        getReports(params).then(data => {
          self.reportListLoading = false
          self.reportListData = data.content
          self.reportListPager.totalElements = data.totalElements
        }).catch(error => {
          self.$confirm(error.message, '错误', {type: 'error'})
        })
      },
      /**
       * 进入专题实时监测页面
       * @param subject
       */
      showMonitorSubject (subject) {
        let subjectId = subject.id
        getSpecialKeyWords(subjectId).then(function (data) {
          let config = {}
          if (data.content && data.content.length > 1) {
            data = data.content[0]
          }
          data.startDate = dateUtil.formatDate(new Date(data.startDate), 'yyyy-MM-dd')
          data.endDate = dateUtil.formatDate(new Date(data.endDate), 'yyyy-MM-dd')
          config = data
          localStorage.setItem('customSubjectKeywords', JSON.stringify(config))
          window.open(basePath + '/#/monitor?id=' + subjectId)
        })
      },
      /**
       * 更新专题报告
       * @param subject
       */
      updateReport (subject) {
        let self = this
        let {id} = subject
        let params = {id: id}
        self.$confirm('确认更新当前报告?', '提示', {type: 'warning'}).then(() => {
          subject.state = '分析中'
          updateCustomSubjectReport(params).then(data => {
            self.getSubjectList()
          })
        })
      },
      /**
       * 删除专题报告
       * @param subject
       */
      deleteSubject (subject) {
        let self = this
        let params = subject
        this.$confirm('确认删除该记录吗?', '提示', {type: 'warning'}).then(() => {
          // delete the subject and get the new subject list
          deleteSubject(params).then(data => {
            self.$message({
              showClose: true,
              message: '删除专题成功!',
              type: 'success'
            })
            self.getSubjectList()
          }).catch(() => {
            self.$message({
              showClose: true,
              message: '删除专题失败!',
              type: 'error'
            })
          })
        })
      },
      /**
       * 打开或关闭预警
       * @param subject
       */
      handleEnableWarningChange (subject) {
        let self = this
        // 如果专题没有预警规则，该专题不能预警
        if (subject.warning) {
          subject.enableWarning = !subject.enableWarning
          self.editSubject(subject)
        } else {
          self.$confirm('请先添加预警规则?', '提示', {type: 'warning'}).then(() => {
            self.showEditWarningDialog(subject)
          }).catch(() => {
            subject.enableWarning = false
          })
        }
      },
      /**
       * 获取当前用户的联系人信息
       */
      getUserContacts() {
        let self = this
        let contactsParams = {
          limit: self.contactsTablePager.pageSize,
          page: self.contactsTablePager.currentPage,
          type: self.type
        }
        getContacts(contactsParams).then(data => {
          self.contactsTablePager.totalElements = data.totalElements
          self.contacts = data.content
        })
      },
      addNickname() {
        let self = this
        $('.wxrwm').show()
        self.$refs.contactForm.validate((valid) => {
          let params = self.contactForm
          params.type = 'WECHAT'
          createNickname(params).then(data => {
            self.wxid = data.openid
          })
        })
      },
      /**
       * 点击添加用户联系人
       */
      addContactSubmit () {
        let self = this
        self.$refs.contactForm.validate((valid) => {
          if (valid) {
            let params = ''
            if (self.contactForm.wxname !== '') {
              self.contactForm.name = self.contactForm.wxname
              self.contactForm.account = self.wxid
              params = self.contactForm
              params.type = 'WECHAT'
            } else {
              params = self.contactForm
              params.type = 'EMAIL'
            }
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
              self.contactsTablePager.currentPage = 1
              self.getUserContacts()
            })
          }
        })
      },
      /**
       * 获取当前用户的联系人信息
       * @param contact
       */
      handleDeleteContact (contact) {
        var self = this
        let params = contact
        this.$confirm('确认删除该记录吗?', '提示', {type: 'warning'}).then(() => {
          deleteContact(params).then(data => {
            // TODO: 如何判读用户联系人是否删除成功
            self.$message({
              showClose: true,
              message: '删除用户联系人成功!',
              type: 'success'
            })
            self.contactsTablePager.currentPage = 1
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
       * 点击联系人表全选按钮时
       * @param val
       */
      handleSelectionChange(val) {
        this.concatSelectedClick = true
        this.multipleSelection = val
      },
      /**
       * 从联系人列表中选中已加入预警的联系人
       */
      toggleSelection(rows) {
        if (rows) {
          rows.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row, true)
          })
        }
      },
      getPager(pager) {
        var data = {}
        data.action = 'clickAddWaringContactsPager'
        data.addWaringContactsPager = pager
      },
      /**
       * 格式化滑块显示
       * @param val
       */
      hoursFormat(val) {
        return val + '小时'
      },
      /**
       * 点击预警文章情感正负面类型按钮的全选按钮时
       * @param event
       */
      handleSentimentCheckAllChange(event) {
        let self = this
        self.warningEditForm.sentimentLabel = event.target.checked ? self.sentimentTypes : []
        self.isIndeterminateSentiment = false
      },
      /**
       * 点击预警文章情感正负面类型按钮的时
       * @param value
       */
      handleCheckedSentimentChange(value) {
        let self = this
        let sentimentTypes = []
        $.each(value, function (i, item) {
          if ($.inArray(item, self.sentimentTypes) > -1) {
            sentimentTypes.push(item)
          }
        })
        let checkedCount = sentimentTypes.length
        self.sentimentCheckAll = checkedCount === self.sentimentTypes.length
        self.isIndeterminateSentiment = checkedCount > 0 && checkedCount < self.sentimentTypes.length
      },
      /**
       * 点击预警文章类型按钮的全选按钮时
       * @param event
       */
      handleTypeCheckAllChange(event) {
        let self = this
        self.warningEditForm.type = event.target.checked ? self.articleTypes : []
        self.isIndeterminateType = false
      },
      /**
       * 点击预警文章类型按钮时
       * @param value
       */
      handleCheckedTypesChange(value) {
        let self = this
        let articleTypes = []
        $.each(value, function (i, item) {
          if ($.inArray(item, self.articleTypes) > -1) {
            articleTypes.push(item)
          }
        })
        let checkedCount = articleTypes.length
        self.typeCheckAll = checkedCount === self.articleTypes.length
        self.isIndeterminateType = checkedCount > 0 && checkedCount < self.articleTypes.length
      },
      /**
       * 点击保存预警按钮
       * @param warning
       */
      warningEditFormSubmit (warning) {
        let self = this
        this.$refs.warningEditForm.validate((valid) => {
          if (valid) {
            // 获取选中的联系人，
            warning.contacts = this.multipleSelection
            self.subject.warning = warning
            self.subject.enableWarning = true
            self.editSubject(self.subject)
            self.editWarningDialogVisible = false
          }
        })
      },
      /**
       * 删除用户专报
       * @param report
       */
      deleteReport (report) {
        let self = this
        let params = report
        self.$confirm('确认删除该记录吗?', '提示', {type: 'warning'}).then(() => {
          // delete the subject and get the new subject list
          deleteReport(params).then(data => {
            self.$message({
              showClose: true,
              message: '删除报告成功!',
              type: 'success'
            })
            self.reportListPager.currentPage = 1
            self.getReportList()
          }).catch(() => {
            self.$message({
              showClose: true,
              message: '删除报告失败!',
              type: 'error'
            })
          })
        })
      },

      /**
       * 点击页码，获取报告列表分页组件的参数
       * @param data
       */
      getReportListPager (data) {
        let self = this
        self.reportListPager = data.data
        self.getReportList()
      },
      /**
       * 获取子组件的参数，进行相关的操作处理
       * @param data
       */
      getData (data) {
        let self = this
        switch (data.action) {
          case 'clickCommonPager':
            self.subjectListPager = data.data
            self.getSubjectList()
            break
          case 'deleteReport':
            self.deleteReport(data.data)
            break
          case 'searchFormSubmit':
            let searchCondition = {}
            self.reportListLoading = true
            if (data.data.startDate && data.data.startDate !== '') {
              searchCondition.startDate = dateUtil.formatDate(data.data.startDate, 'yyyy-MM-dd')
            }
            if (data.data.endDate && data.data.endDate !== '') {
              searchCondition.endDate = dateUtil.formatDate(data.data.endDate, 'yyyy-MM-dd')
            }
            searchCondition.title = data.data.name
            self.getReportList(searchCondition)
            break
        }
      },
      wxhandleClick(tab, event) {
        let self = this
        switch (tab.label) {
          case '微信预警':
            self.type = 'WECHAT'
            self.showEditWarningDialog(self.subject)
            self.contactForm.wxname = ''
            self.contactForm.nickname = ''
            self.contactForm.account = ''
            self.contactForm.name = ''
            break
          case '邮箱预警':
            self.type = 'EMAIL'
            self.showEditWarningDialog(self.subject)
            self.contactForm.wxname = ''
            self.contactForm.nickname = ''
            self.contactForm.account = ''
            self.contactForm.name = ''
            break
        }
      }
    },
    watch: {
      warningEditForm: {
        handler: function () {
          var self = this
          var rows = []
          self.contacts.forEach(function (obj) {
            self.warningEditForm.contacts.forEach(function (item) {
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
          self.warningEditForm.contacts.forEach(function (item) {
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
      wxid: function () {
        var self = this
        if (self.wxid !== '') {
          self.$message({
            message: '关注成功!',
            type: 'success'
          })
          self.addContactSubmit()
        } else {
          self.$message.error('未关注！添加失败！')
        }
      }
    }
  }

</script>
<style rel="stylesheet/scss" lang="scss">
  #subject {
    .estimate > input {
      width: 120px;
      border: none;
      background: none;
    }
    .el-row {
      margin-left: 0;
      margin-right: 0;
    }
    .subject-list {
      .el-table {
        tr {
          border: none;
        }
      }
    }
    .button-list {
      float: left;
    }
    .el-card {
      border: none;
      background: none;
    }
    .create-subject {
      background-color: #123d9f;
      color: #fff;
      margin-top: 15px;
      border: none;
    }
    .subject-list-box, .report-list {
      margin-top: 20px;
      border: none;
      border-radius: 0;
      border-top: 1px solid #ccc;
      box-shadow: none;
    }
    .subject-list-box {
      .action-list {
        margin-bottom: 15px;
        float: left;
        width: 100%;
        & > button {
          float: left;
        }
        .search-subject {
          margin-top: 15px;
          float: right;
          & > .el-input {
            width: auto;
          }
        }
      }
    }
    /* 添加专题弹出框样式 */
    .create-subject-dialog {
      text-align: left;
    }
    /* 修改专题弹出框样式 */
    .edit-subject-dialog {
      text-align: left;
    }
    /* 修改专题预警弹出框样式 */
    .edit-warning-dialog {
      text-align: left;
    }
    .el-card__body {
      padding: 0;
    }

    .monitor, .update {
      background-color: #2d65f0;
      color: #fff;
      border: none;
    }

    .modify {
      background-color: #af7507;
      color: #fff;
      border: none;
    }
  .warning-number {
    input {
      width: 42%;
    }
  }

    .delete {
      background-color: #d0300b;
      color: #fff;
      border: none;
    }

    .complete {
      background-color: #0a9548;
    }

    .el-table .cell, .el-table th > div {
      padding-left: 0;
      padding-right: 0;
      box-sizing: border-box;
      text-overflow: ellipsis;
    }

    .el-button--small {
      padding: 5px 3px;
    }

    .el-table th {
      text-align: center;
    }
  .wxrwm{
    display: none;
    width: 200px;
    height: 200px;
    margin: 0 auto;
    margin-bottom: 10px;
    background-image: url("../../../src/assets/img/wx.jpg");
  }
  }
</style>

