<template>
  <div id="dragTree">
    树形
  </div>
</template>

<script type="text/ecmascript-6">
  import '../../../static/plugin/jquery.ztree.core'
  import '../../../static/plugin/jquery.ztree.exedit'
  export default {
    props: ['dragTreeList'],
    data () {
      return {
      }
    },
    mounted () {
      this.getTreeList()
    },
    methods: {
      getTreeList: function () {
      }
    }

  }
</script>

