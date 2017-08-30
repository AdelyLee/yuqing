<template>
  <div id="tree">
    <el-button type="primary" class="add-tree" @click.native="addZtree()">添加父节点</el-button>
    <ul id="treeDemo" class="ztree"></ul>
  </div>
</template>

<script type="text/ecmascript-6">
  import $ from 'jquery'
  import '../../../static/plugin/jquery.ztree.core'
  import '../../../static/plugin/jquery.ztree.exedit'
  import {
    getTree
  } from '@/service/thesaurus'
  export default {
    props: ['treeList'],
    data () {
      return {
        zNodes: []
      }
    },
    mounted () {
      this.getTreeList()
    },
    methods: {
      getTreeList: function () {
        let self = this
        var setting = {
          view: {
            addHoverDom: addHoverDom,
            removeHoverDom: removeHoverDom,
            selectedMulti: false
          },
          edit: {
            enable: true,
            editNameSelectAll: true,
            showRemoveBtn: showRemoveBtn,
            showRenameBtn: showRenameBtn
          },
          data: {
            simpleData: {
              enable: true
            }
          },
          callback: {
            beforeDrag: beforeDrag,
            beforeEditName: beforeEditName,
            beforeRemove: beforeRemove,
            beforeRename: beforeRename,
            onRemove: onRemove,
            onRename: onRename,
            onClick: zTreeOnClick
          }
        }
        var params = {
          'id': ''
        }
        getTree(params).then(data => {
          $.fn.zTree.init($('#treeDemo'), setting, data)
        }).catch(error => {
          self.$confirm(error.message, '错误', {type: 'error'})
        })
        let log
        let className = 'dark'

        function beforeDrag(treeId, treeNodes) {
          return false
        }

        function beforeEditName(treeId, treeNode) {
          className = (className === 'dark' ? '' : 'dark')
          showLog('[ ' + getTime() + ' beforeEditName ]&nbsp;&nbsp;&nbsp;&nbsp; ' + treeNode.name)
          var zTree = $.fn.zTree.getZTreeObj('treeDemo')
          zTree.selectNode(treeNode)
          setTimeout(function () {
            if (confirm('进入节点 -- ' + treeNode.name + ' 的编辑状态吗？')) {
              setTimeout(function () {
                zTree.editName(treeNode)
              }, 0)
            }
          }, 0)
          return false
        }

        function beforeRemove(treeId, treeNode) {
          className = (className === 'dark' ? '' : 'dark')
          showLog('[ ' + getTime() + ' beforeRemove ]&nbsp;&nbsp;&nbsp;&nbsp; ' + treeNode.name)
          var zTree = $.fn.zTree.getZTreeObj('treeDemo')
          zTree.selectNode(treeNode)
          return confirm('确认删除 节点 -- ' + treeNode.name + ' 吗？')
        }

        function onRemove(e, treeId, treeNode) {
          showLog('[ ' + getTime() + ' onRemove ]&nbsp;&nbsp;&nbsp;&nbsp; ' + treeNode.name)
          var data = {}
          data.action = 'removeTreeWords'
          data.word = treeNode
          self.$emit('data', data)
        }

        function beforeRename(treeId, treeNode, newName, isCancel) {
          className = (className === 'dark' ? '' : 'dark')
          showLog((isCancel ? "<span style='color:red'>" : '') + '[ ' + getTime() + ' beforeRename ]&nbsp;&nbsp;&nbsp;&nbsp ' + treeNode.name + (isCancel ? '</span>' : ''))
          if (newName.length === 0) {
            setTimeout(function () {
              var zTree = $.fn.zTree.getZTreeObj('treeDemo')
              zTree.cancelEditName()
              alert('节点名称不能为空.')
            }, 0)
            return false
          }
          return true
        }

        function onRename(e, treeId, treeNode, isCancel) {
          showLog((isCancel ? "<span style='color:red'>" : '') + '[ ' + getTime() + ' onRename ]&nbsp;&nbsp;&nbsp;&nbsp' + treeNode.name + (isCancel ? '</span>' : ''))
          var data = {}
          data.action = 'editTreeWords'
          data.word = treeNode
          self.$emit('data', data)
        }

        function showRemoveBtn(treeId, treeNode) {
          if (treeNode.children.length > 0) {
            return false
          } else if (treeNode.noEditBtn !== undefined && treeNode.noEditBtn) {
            return false
          } else {
            return true
          }
        }

        function showRenameBtn(treeId, treeNode) {
          if (treeNode.noRemoveBtn !== undefined && treeNode.noRemoveBtn) {
            return false
          } else {
            return true
          }
        }

        function showLog(str) {
          if (!log) log = $('#log')
          log.append("<li class='" + className + "'>" + str + '</li>')
          if (log.children('li').length > 8) {
            log.get(0).removeChild(log.children('li')[0])
          }
        }

        function getTime() {
          let now = new Date()
          let h = now.getHours()
          let m = now.getMinutes()
          let s = now.getSeconds()
          let ms = now.getMilliseconds()
          return (h + ':' + m + ':' + s + '' + ms)
        }

        function zTreeOnClick(event, treeId, treeNode) {
          var data = {}
          data.action = 'Words'
          data.word = treeNode
          self.$emit('data', data)
        }

//        var newCount = 1

        function addHoverDom(treeId, treeNode) {
          var sObj = $('#' + treeNode.tId + '_span')
          if (treeNode.editNameFlag || $('#addBtn_' + treeNode.tId).length > 0) return
          var addStr = "<span class='button add' id='addBtn_" + treeNode.tId + "' title='添加' onfocus='this.blur();'></span>"
          sObj.after(addStr)
          var btn = $('#addBtn_' + treeNode.tId)
          btn.bind('click', function () {
//            var zTree = $.fn.zTree.getZTreeObj('treeDemo')
//            zTree.addNodes(treeNode, {id: (100 + newCount), pId: treeNode.id, name: '关键词'})
            var data = {}
            data.action = 'addTreeWords'
            data.word = treeNode
            data.name = '关键词'
            self.$emit('data', data)
            return false
          })
        }

        function removeHoverDom(treeId, treeNode) {
          $('#addBtn_' + treeNode.tId).unbind().remove()
        }
      },
      addZtree: function () {
//        var newCount = 1
//        var zTree = $.fn.zTree.getZTreeObj('treeDemo')
//        zTree.addNodes(null, {id: (100 + newCount), pId: 0, name: '关键词'})
        var data = {}
        data.action = 'addTreeWords'
        data.name = '关键词'
        this.$emit('data', data)
      }
    },
    watch: {
      treeList: function () {
        var self = this
        self.getTreeList()
      }
    }
  }
</script>

