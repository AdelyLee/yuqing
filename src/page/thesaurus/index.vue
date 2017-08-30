<template>
  <div id="thesaurus">
    <div class="card-body" id="content">
      <el-row :gutter="15">
        <el-col :span="4">
          <tree-list :treeList="treeList" ref="childMethod"  @data="getSearch"></tree-list>
        </el-col>
        <el-col :span="20">
          <el-row :gutter="5" class="list">
            <div class="el_coldate">
              <el-card class="box-card" :body-style="{ padding: '10px' }">
                <el-row :gutter="15">
                  <el-button type="success" class="add-thesaurus" @click="showAddDialog">添加</el-button>
                  <div class="search">
                    <el-input placeholder="请输入内容" v-model="searchName">
                      <el-button slot="append" @click="clickQuery(searchName)"><span
                        class="search-icon">查询</span>
                      </el-button>
                    </el-input>
                  </div>
                </el-row>
                <el-tabs v-model="activeName" @tab-click="handleClick">
                  <el-tab-pane label="关键词" name="must">
                    <pinyin-thesaurus :pinYin="pinYin" @data="getSearch"></pinyin-thesaurus>
                    <thesaurus-list :wordData="thesaurusList" @data="getSearch"></thesaurus-list>
                    <add-thesaurus :addDialog="addDialog" @data="getSearch"></add-thesaurus>
                    <edit-thesaurus :editDialog="editDialog" @data="getSearch"></edit-thesaurus>
                  </el-tab-pane>
                  <el-tab-pane label="同现词" name="should">
                    <pinyin-thesaurus :pinYin="pinYin" @data="getSearch"></pinyin-thesaurus>
                    <thesaurus-list :wordData="thesaurusShouldList" @data="getSearch"></thesaurus-list>
                    <add-thesaurus :addDialog="addDialog" @data="getSearch"></add-thesaurus>
                    <edit-thesaurus :editDialog="editDialog" @data="getSearch"></edit-thesaurus>
                  </el-tab-pane>
                  <el-tab-pane label="排除词" name="mustNot">
                    <pinyin-thesaurus :pinYin="pinYin" @data="getSearch"></pinyin-thesaurus>
                    <thesaurus-list :wordData="thesaurusMustNotList" @data="getSearch"></thesaurus-list>
                    <add-thesaurus :addDialog="addDialog" @data="getSearch"></add-thesaurus>
                    <edit-thesaurus :editDialog="editDialog" @data="getSearch"></edit-thesaurus>
                  </el-tab-pane>
                </el-tabs>

              </el-card>
            </div>
          </el-row>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import Tree from '@/components/common/tree'
  import AddThesaurus from '@/components/common/add-thesaurus'
  import EditThesaurus from '@/components/common/edit-thesaurus'
  import PinyinThesaurus from '@/components/common/pinyin-thesaurus'
  import Thesaurus from '@/components/common/thesaurus'
  import {
    getThesaurus,
    getPinyinThesaurus,
    getSearchThesaurus,
    getLibraryThesaurus,
    getAddWords,
    editThesaurus,
    deleteThesaurus,
    editTree,
    removeTree,
    addTree
  } from '@/service/thesaurus'
  export default {
    name: 'thesaurus',
    data () {
      return {
        activeName: 'must',
        name: 'MUST',
        searchWord: '',
        searchName: '',
        addDialog: {
          addFormVisible: false,
          addForm: {}
        },
        pinYin: {},
        editDialog: {
          editFormVisible: false,
          editForm: {}
        },
        pager: {
          pageSize: 10,
          currentPage: 1,
          totalElements: 1
        },
        libraryId: 1,
        id: 1,
        thesaurusList: [],
        treeList: [],
        thesaurusShouldList: [],
        thesaurusMustNotList: [],
        subject: {},
        pinyins: ''
      }
    },
    components: {
      'tree-list': Tree,
      'add-thesaurus': AddThesaurus,
      'edit-thesaurus': EditThesaurus,
      'pinyin-thesaurus': PinyinThesaurus,
      'thesaurus-list': Thesaurus
    },
    mounted () {
      let self = this
      this.getThesaurus(self.name)
      this.getTree()
    },
    methods: {
      getThesaurus: function (name) {
        let self = this
        let params = {
          'pageRequest': {
            'libraryId': self.libraryId,
            'limit': self.pager.pageSize,
            'page': self.pager.currentPage
          }
        }
        getThesaurus(params, self.name).then(data => {
          self.pager.totalElements = data.totalElements
          switch (name) {
            case 'MUST':
              self.thesaurusList = data.content
              break
            case 'SHOULD':
              self.thesaurusShouldList = data.content
              break
            case 'MUSTNOT':
              self.thesaurusMustNotList = data.content
              break
          }
        }).catch(error => {
          self.$confirm(error.message, '错误', {type: 'error'})
        })
      },
      getPinyinThesaurus: function () {
        let self = this
        let params = {
          'pageRequest': {
            'limit': self.pager.pageSize,
            'page': self.pager.currentPage
          }
        }
        getPinyinThesaurus(params, self.libraryId, self.pinyins).then(data => {
          self.pager.totalElements = data.totalElements
          self.thesaurusList = data.content
        }).catch(error => {
          self.$confirm(error.message, '错误', {type: 'error'})
        })
      },
      getSearchThesaurus: function () {
        let self = this
        let params = {
          'pageRequest': {
            'limit': self.pager.pageSize,
            'page': self.pager.currentPage
          }
        }
        getSearchThesaurus(params, self.searchWord).then(data => {
          self.thesaurusList = data.content
        }).catch(error => {
          self.$confirm(error.message, '错误', {type: 'error'})
        })
      },
      getLibraryThesaurus: function () {
        let self = this
        let params = {
          'pageRequest': {
            'limit': self.pager.pageSize,
            'page': self.pager.currentPage
          }
        }
        getLibraryThesaurus(params, self.searchWord).then(data => {
          self.thesaurusList = data.content
        }).catch(error => {
          self.$confirm(error.message, '错误', {type: 'error'})
        })
      },
      getTree: function () {
        this.$refs.childMethod.getTreeList()
//        let self = this
//        let params = {
//          'id': ''
//        }
//        getTree(params).then(data => {
//          self.treeList = data.content
//        }).catch(error => {
//          self.$confirm(error.message, '错误', {type: 'error'})
//        })
      },
      showAddDialog: function () {
        this.addDialog.addFormVisible = true
      },
      getAddWords: function (id, word, status) {
        let self = this
        let params = {
          'library': [
            {
              'id': id
            }
          ],
          'status': status,
          'word': word
        }
        getAddWords(params).then(data => {
          self.pager.currentPage = 1
          self.getThesaurus(status)
        }).catch(error => {
          self.$confirm(error.message, '错误', {type: 'error'})
        })
      },
      editThesaurus: function (id, word, status) {
        let self = this
        let params = {
          'status': status,
          'word': word
        }
        editThesaurus(params, id).then(data => {
          self.getThesaurus()
        }).catch(error => {
          self.$confirm(error.message, '错误', {type: 'error'})
        })
      },
      deleteThesaurus: function (subject) {
        let self = this
        let params = subject
        deleteThesaurus(params).then(data => {
          self.pager.currentPage = 1
          self.getThesaurus(subject.status)
        }).catch(error => {
          self.$confirm(error.message, '错误', {type: 'error'})
        })
      },
      editTree: function (treeName) {
        let self = this
        let params = {
          name: treeName.name,
          parent: {
            id: treeName.pId
          }
        }
        editTree(params, treeName).then(data => {
        }).catch(error => {
          self.$confirm(error.message, '错误', {type: 'error'})
        })
      },
      removeTree: function (treeName) {
        let self = this
        let params = treeName
        removeTree(params).then(data => {
        }).catch(error => {
          self.$confirm(error.message, '错误', {type: 'error'})
        })
      },
      addTree: function (treeName) {
        let self = this
        var params = {}
        if (treeName !== undefined) {
          params = {
            'name': '关键词',
            'parent': {
              'id': treeName.id
            }
          }
        } else {
          params = {
            'name': '关键词'
          }
        }
        addTree(params).then(data => {
          self.getTree()
        }).catch(error => {
          self.$confirm(error.message, '错误', {type: 'error'})
        })
      },
      clickQuery: function (search) {
        let self = this
        if (search !== '') {
          self.searchWord = search
          this.getSearchThesaurus()
        } else {
          this.$message({
            showClose: true,
            message: '请输入关键词！',
            type: 'warning'
          })
        }
      },
      getSearch (data) {
        let self = this
        switch (data.action) {
          case 'deleteWords':
            this.$confirm('确认删除该记录吗?', '提示', {type: 'warning'}).then(() => {
              self.deleteThesaurus(data.word)
            })
            break
          case 'editWords':
            this.editDialog.editFormVisible = true
            self.editDialog.editForm = data.word
            break
          case 'addThwsaurus':
            self.addDialog.addFormVisible = false
            self.addDialog.addForm = {}
            self.getAddWords(self.id, data.contact.name, data.contact.status)
            break
          case 'editTheasaurus':
            this.editDialog.editFormVisible = false
            self.addDialog.editForm = {}
            self.editThesaurus(data.word.id, data.word.word, data.word.status)
            break
          case 'Words':
            self.libraryId = data.word.id
            self.id = data.word.id
            self.searchWord = data.word.name
            self.getLibraryThesaurus()
            break
          case 'pinYinWords':
            self.pinyins = data.word
            self.getPinyinThesaurus(self.pager.pageSize, self.pager.currentPage, self.libraryId, self.pinyins)
            break
          case 'editTreeWords':
            self.editTree(data.word)
            break
          case 'removeTreeWords':
            self.removeTree(data.word)
            break
          case 'addTreeWords':
            self.addTree(data.word)
            break
        }
      },
      handleClick(tab, event) {
        var self = this
        switch (tab.label) {
          case '关键词':
            self.name = 'MUST'
            break
          case '同现词':
            self.name = 'SHOULD'
            break
          case '排除词':
            self.name = 'MUSTNOT'
            break
        }
        self.getThesaurus(self.name)
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss">
  #thesaurus{
    .el-form-item{
      margin-bottom: 0px;
    }
    input.radio {margin: 0 2px 0 8px;}
    input.radio.first {margin-left:0;}
    input.empty {color: lightgray;}
    code {color: #2f332a;}
    .highlight_red {color:#A60000;}
    .highlight_green {color:#A7F43D;}
    li {list-style: circle;font-size: 12px;}
    li.title {list-style: none;}
    ul.list {margin-left: 17px;}
    ul.ztree {margin-top: 10px;}
    ul.log {border: 1px solid #617775;background: #f0f6e4;width:300px;height:170px;overflow: hidden;}
    ul.log.small {height:45px;}
    ul.log li {color: #666666;list-style: none;padding-left: 10px;}
    ul.log li.dark {background-color: #E3E3E3;}

    /* ruler */
    div.ruler {height:20px; width:220px; background-color:#f0f6e4;border: 1px solid #333; margin-bottom: 5px; cursor: pointer}
    div.ruler div.cursor {height:20px; width:30px; background-color:#3C6E31; color:white; text-align: right; padding-right: 5px; cursor: pointer}
    .btn {
      display: inline-block;
      margin-bottom: 0;
      font-weight: 400;
      text-align: center;
      vertical-align: middle;
      cursor: pointer;
      background-image: none;
      border: 1px solid transparent;
      white-space: nowrap;
      padding: 6px 12px;
      font-size: 14px;
      line-height: 1.42857143;
      border-radius: 4px;
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
    }
    .btn-success {
      color: #fff;
      background-color: #13ce66;
      border-color: #13ce66;
      border-radius: 4px;
    }
    .btn-primary{
      color: #fff;
      background-color: #50bfff;
      border-color: #50bfff;
      border-radius: 4px;
    }
    .btn-danger{
      color: #fff;
      background-color: #d2322d;
      border-color: #ac2925;
      border-radius: 4px;
    }
    .screen{
      height: 40px;
      /*border-bottom: 2px solid #cccccc;*/
    }
    .el-button--default{
      border-radius: 4px 4px 0px 0px;
    }
   .el-button {
    padding: 7px 9px !important;
    }
  @media screen and (min-width: 1360px) and (max-width: 1366px) {
    .el-button {
      padding: 6px 5px !important;
    }
    .text-list li {
      font-size: 16px !important;
    }
    .editWord {
      padding: 4px 5px!important;
    }
  }
    .text {
      background-color: #4e89c3;
      padding: 2px;
      text-align: center;
      border-radius: 8px;
      color: #fff;
      font-size: 14px;
      font-weight: 600;
      margin-right: 15px;
    }
    .search {
      width: 50%;
      line-height: 30px;
      border: 1px solid #1D90E6;
      float: right;
      margin-right: 1.3%;
      .el-input {
        font-size: 14px;
        width: 97%;
      }
      .el-input-group__append, .el-input-group__prepend {
        background-color: #ffffff;
        color: #666666;
        border: none;
        width: 2%;
      }
      .el-input__inner {
        border: none;
        box-sizing: border-box;
      }
      .search-icon {
        margin-right: -35%;
        height: 20px;
        background-color: #20a0ff;
        line-height: 20px;
        color: #ffffff;
        border-radius: 10px;
        padding: 8px 20px 8px 20px;
      }
    }
    .words{
      float: left;
      width: 22%;
    }
    .text-list{
      width: 40%;
      text-align: left;
      float: left;
      margin-left: 1%;
      margin-right: 1%;
      margin-top:5%;
      li{
        font-size: 18px;
        font-weight: 600;
        padding-top: 2px;
        list-style-type: none;
        font-family: 微软雅黑;
      }
    }
    .butt{
      float: left;
      margin-top:5%;
    }
    .input-sqk{
      margin-bottom: 20px;
    }
    .ztree * {padding:0; margin:0; font-size:12px; font-family: Verdana, Arial, Helvetica, AppleGothic, sans-serif}
    .ztree {margin:0; padding:5px; color:#333}
    .ztree li{padding:0; margin:0; list-style:none; line-height:14px; text-align:left; white-space:nowrap; outline:0}
    .ztree li ul{ margin:0; padding:0 0 0 18px}
    .ztree li ul.line{ background:url(../../../src/assets/img/line_conn.gif) 0 0 repeat-y;}

    .ztree li a {padding:1px 3px 0 0; margin:0; cursor:pointer; height:22px; background-color: transparent;
      text-decoration:none; vertical-align:top; display: inline-block}
    .ztree li a:hover {text-decoration:underline}
    .ztree li a.curSelectedNode {padding-top:0px; height:23px; opacity:0.8;}
    .ztree li a.curSelectedNode_Edit {padding-top:0px; color:black; height:23px; border:1px #ffcd2c solid; opacity:0.8;}
    .ztree li a.tmpTargetNode_inner {padding-top:0px;  color:white; height:23px; border:1px #ffcd2c solid;
      opacity:0.8; filter:alpha(opacity=80)}
    .ztree li a.tmpTargetNode_prev {}
    .ztree li a.tmpTargetNode_next {}
    .ztree li a input.rename {height:14px; width:80px; padding:0; margin:0;
      font-size:12px; border:1px #cccccc solid; *border:0px;outline: 0;margin-left: 5px; margin-top: -5px;}
    .ztree li span { line-height: 20px;  font-size: 16px; margin-right:2px}
    .ztree li span.button {line-height:0; margin:0; width:16px; height:16px; display: inline-block; vertical-align:middle;
      border:0 none; cursor: pointer;outline:none;
      background-color:transparent; background-repeat:no-repeat; background-attachment: scroll;
      background-image:url("../../../src/assets/img/zTreeStandard.png"); *background-image:url("../../../src/assets/img/zTreeStandard.gif")}

    .ztree li span.button.chk {display: none;width:13px; height:13px; margin:0 3px 0 0; cursor: auto}
    .ztree li span.button.chk.checkbox_false_full {background-position:0 0}
    .ztree li span.button.chk.checkbox_false_full_focus {background-position:0 -14px}
    .ztree li span.button.chk.checkbox_false_part {background-position:0 -28px}
    .ztree li span.button.chk.checkbox_false_part_focus {background-position:0 -42px}
    .ztree li span.button.chk.checkbox_false_disable {background-position:0 -56px}
    .ztree li span.button.chk.checkbox_true_full {background-position:-14px 0}
    .ztree li span.button.chk.checkbox_true_full_focus {background-position:-14px -14px}
    .ztree li span.button.chk.checkbox_true_part {background-position:-14px -28px}
    .ztree li span.button.chk.checkbox_true_part_focus {background-position:-14px -42px}
    .ztree li span.button.chk.checkbox_true_disable {background-position:-14px -56px}
    .ztree li span.button.chk.radio_false_full {background-position:-28px 0}
    .ztree li span.button.chk.radio_false_full_focus {background-position:-28px -14px}
    .ztree li span.button.chk.radio_false_part {background-position:-28px -28px}
    .ztree li span.button.chk.radio_false_part_focus {background-position:-28px -42px}
    .ztree li span.button.chk.radio_false_disable {background-position:-28px -56px}
    .ztree li span.button.chk.radio_true_full {background-position:-42px 0}
    .ztree li span.button.chk.radio_true_full_focus {background-position:-42px -14px}
    .ztree li span.button.chk.radio_true_part {background-position:-42px -28px}
    .ztree li span.button.chk.radio_true_part_focus {background-position:-42px -42px}
    .ztree li span.button.chk.radio_true_disable {background-position:-42px -56px}

    .ztree li span.button.switch {width:18px; height:18px}
    .ztree li span.button.root_open{background-position:-92px -54px}
    .ztree li span.button.root_close{background-position:-74px -54px}
    .ztree li span.button.roots_open{background-position:-92px 0}
    .ztree li span.button.roots_close{background-position:-74px 0}
    .ztree li span.button.center_open{background-position:-92px -18px}
    .ztree li span.button.center_close{background-position:-74px -18px}
    .ztree li span.button.bottom_open{background-position:-92px -36px}
    .ztree li span.button.bottom_close{background-position:-74px -36px}
    .ztree li span.button.noline_open{background-position:-92px -72px}
    .ztree li span.button.noline_close{background-position:-74px -72px}
    .ztree li span.button.root_docu{ background:none;}
    .ztree li span.button.roots_docu{background-position:-56px 0}
    .ztree li span.button.center_docu{background-position:-56px -18px}
    .ztree li span.button.bottom_docu{background-position:-56px -36px}
    .ztree li span.button.noline_docu{ background:none;}

    .ztree li span.button.ico_open{margin-right:2px; background-position:-110px -16px; vertical-align:top; *vertical-align:middle}
    .ztree li span.button.ico_close{margin-right:2px; background-position:-110px 0; vertical-align:top; *vertical-align:middle}
    .ztree li span.button.ico_docu{margin-right:2px; background-position:-110px -32px; vertical-align:top; *vertical-align:middle}
    .ztree li span.button.edit {margin-right:2px; background-position:-110px -48px; vertical-align:top; *vertical-align:middle}
    .ztree li span.button.remove {margin-right:2px; background-position:-110px -64px; vertical-align:top; *vertical-align:middle}
    .ztree li span.button.add {margin-right:2px; background-position:0px 0px; vertical-align:top; *vertical-align:middle}
    .ztree li span.button.ico_loading{margin-right:2px; background:url(../../../src/assets/img/loading.gif) no-repeat scroll 0 0 transparent; vertical-align:top; *vertical-align:middle}

    ul.tmpTargetzTree {background-color:#FFE6B0; opacity:0.8; filter:alpha(opacity=80)}

    span.tmpzTreeMove_arrow {width:16px; height:16px; display: inline-block; padding:0; margin:2px 0 0 1px; border:0 none; position:absolute;
      background-color:transparent; background-repeat:no-repeat; background-attachment: scroll;
      background-position:-110px -80px; background-image:url("../../../src/assets/img/zTreeStandard.png"); *background-image:url("../../../src/assets/img/zTreeStandard.gif")}

    ul.ztree.zTreeDragUL {margin:0; padding:0; position:absolute; width:auto; height:auto;overflow:hidden; background-color:#cfcfcf; border:1px #00B83F dotted; opacity:0.8; filter:alpha(opacity=80)}
    .zTreeMask {z-index:10000; background-color:#cfcfcf; opacity:0.0; filter:alpha(opacity=0); position:absolute}
    .el-tooltip__popper.is-dark {
      background: #ffffff;
      border: 1px solid #cccccc;
      color: #000;
    }
    .add{
      float: right;
      margin-right: 10%;
    }
    .word-ck{
      float: left;
      width:300px;
    }
    .el-button--default {
      border-radius: 4px 4px 0px 0px;
      padding: 7px 11px;
    }
    .pinyin-contact{
      margin-top: 10px;
    }
    .search .el-input-group__append, .search .el-input-group__prepend {
      background:none !important;
    }
    .add-thesaurus{
      float: right;
      margin-right: 1.3%;
      width: 7%;
      height: 35px;
    }
  .el-select {
    text-align: left;
  }
  .el-form-item__content {
    text-align: left;
  }
  .editWord{
    padding: 5px 7px !important;
  }
  .add-tree{
    margin-left: -55%;
    padding: 3px 5px !important;
  }
  }

</style>
