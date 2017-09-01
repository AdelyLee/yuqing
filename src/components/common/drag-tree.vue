<template>
  <div id="dragTree">
    <ul id="dragTrees" class="ztree"></ul>
  </div>
</template>

<script type="text/ecmascript-6">
  import $ from 'jquery'
  import '../../../static/plugin/jquery.ztree.core'
//  import '../../../static/plugin/jquery.ztree.excheck'
  import '../../../static/plugin/jquery.ztree.exedit'
  import {
    getDragTree
  } from '@/service/leaderNews'
  export default {
    props: ['dragTreeList'],
    data () {
      return {
      }
    },
    mounted () {
      this.getDragTreeList()
    },
    methods: {
      getDragTreeList: function () {
        let self = this
        var setting = {
          view: {
            removeHoverDom: removeHoverDom,
            selectedMulti: false
          },
          check: {
            enable: true
          },
          edit: {
            enable: true,
            editNameSelectAll: true,
            showRemoveBtn: showRemoveBtn,
            showRenameBtn: showRenameBtn,
            drag: {
              isCopy: true,
              isMove: true,
              prev: true,
              next: true,
              inner: true
            }
          },
          data: {
            simpleData: {
              enable: true
            }
          },
          callback: {
//             beforeDrag: beforeDrag,
//            beforeDrop: beforeDrop,
//            onDrag: onDrag,
//            onDrop: onDrop,
//            onExpand: onExpand,
//            beforeDragOpen: beforeDragOpen,
//            beforeEditName: beforeEditName,
            onClick: zTreeOnClick
          }
        }
        var params = {
          'id': ''
        }
        getDragTree(params).then(data => {
          $.fn.zTree.init($('#dragTrees'), setting, data)
        }).catch(error => {
          self.$confirm(error.message, '错误', {type: 'error'})
        })
//       function beforeDrag(treeId, treeNodes) {
//          return true
//        }
//        function beforeDrop (treeId, treeNodes, targetNode, moveType, isCopy) {
//          if (treeNodes[0].isParent) {
//            $.each(treeNodes[0].children, function (i, treeNode) {
//            })
//          }
//          if (treeNodes[0].level === 0) {
//            alert('不允许拖拽库节点')
//            return false
//          }
//          if (!targetNode.isParent) {
//            alert('不允许拖拽任何节点到表节点下')
//            return false
//          }
//          return true
//        }
//        function beforeDragOpen () {
//          return true
//        }
//        function onDrag () {
//          return true
//        }
//        function onDrop (event, treeId, treeNodes, targetNode, moveType, isCopy) {
//          if (treeNodes[0].isParent) {
//            $.each(treeNodes[0].children, function (i, treeNode) {
//            })
//          }
//          return true
//        }
//        function onExpand () {
//          return true
//        }
        function showRenameBtn(treeId, treeNode) {
          return false
        }
        function showRemoveBtn(treeId, treeNode) {
          return false
        }
        function zTreeOnClick(event, treeId, treeNode) {
          var data = {}
          data.action = 'Words'
          data.word = treeNode
          self.$emit('data', data)
        }
        function removeHoverDom(treeId, treeNode) {
          $('#addBtn_' + treeNode.tId).unbind().remove()
        }
      }
    }

  }
</script>

