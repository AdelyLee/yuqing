<template>
  <div id="report-list">
    <el-col :span="8" v-if="reportList.length>0" class="list-report" v-for="item in reportList" :key="item.id">
      <el-col :span="8" v-if="reportList[0].type=='MONTHLY'" class="report-monthly"></el-col>
      <el-col :span="8" v-if="reportList[0].type=='WEEKLY'" class="report-weekly"></el-col>
      <el-col :span="8" v-if="reportList[0].type=='SPECIAL'" class="report-special"></el-col>
      <div class="report">
        <el-row>
          <div class="times_bt"><span></span>{{item.createTime}}</div>
        </el-row>
        <el-row>
          <el-col :span="24" class="title" :class="{ special: item.type==='SPECIAL' }">
            {{item.title}}
          </el-col>
        </el-row>
        <el-row>
          <div class="but-right">
            <div v-if="reportList[0].type=='SPECIAL'" class="button_delectred">
              <span :attachment="item.id" @click="deleteReport(item)">删除</span>
            </div>
            <div class="button_colorred">
              <span :attachment="item.attachment" @click="downloadReport(item.attachment)">下载</span>
            </div>
            <div class="button_color">
              <span :id="item.id" @click="previewReport(item.id)">预览</span>
            </div>
          </div>
        </el-row>
      </div>
    </el-col>
  </div>
</template>
<script>
  import {BASE_URL} from '@/service/common'
  const basePath = localStorage.getItem('basePath')
  export default {
    props: ['reportList'],
    data () {
      return {}
    },
    mounted () {
    },
    methods: {
      previewReport: function (id) {
        window.open(basePath + '/#/reportDetail?id=' + id)
      },
      downloadReport: function (attachment) {
        if (attachment.length > 1) {
          let file = attachment[0].substring(0, attachment[0].length - 4)
          window.open(BASE_URL + '/file/download/doc/' + file)
        }
      },
      deleteReport: function (report) {
        let data = {}
        data.action = 'deleteReport'
        data.data = report
        this.$emit('data', data)
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  #report-list {
    width: 100%;
    .list-report {
      min-height: 220px;
    }

    .report-monthly {
      min-height: 171px;
      position: absolute;
      background: url('../../assets/img/monthly-new.png') no-repeat;
      background-size: contain;
    }

    .report-weekly {
      height: 171px;
      position: absolute;
      background: url('../../assets/img/weekly-new.png') no-repeat;
      background-size: contain;
    }

    .report-special {
      min-height: 171px;
      position: absolute;
      background: url('../../assets/img/special-new.png') no-repeat;
      background-size: contain;
    }

    .report {
      padding: 6% 20% 10% 40%;
      height: 121px;
      width: 180px;
      color:#fff;
    }

    .times_bt {
      float: right;
      line-height: 30px;
    }

    .title {
      height: 60px;
      line-height: 60px;
      text-align: center;
      font-size: 18px;
      font-weight: 600;
      &.special {
        line-height: 30px;
      }
    }

    .button_color {
      float: right;
      color: #fff;
      padding: 4px 6px;
      font-size: 12px;
      border-radius: 6px;
      background-color: #2d66f1;
      cursor: pointer;
    }

    .button_color:hover {
      background-color: #071F47;
    }

    .button_colorred:hover {
      background-color: #071F47;
    }

    .button_colorred {
      float: right;
      color: #fff;
      margin-left: 5px;
      padding: 4px 6px;
      font-size: 12px;
      border-radius: 6px;
      background-color: #af7507;
      cursor: pointer;
    }

    .button_delectred {
      float: right;
      color: #fff;
      margin-left: 5px;
      padding: 4px 6px;
      font-size: 12px;
      border-radius: 6px;
      background-color: #d0300b;
      cursor: pointer;
    }

    .button_delectred:hover {
      background-color: #071F47;
    }

    .but-right {
      width: 368px;
      float: right;
    }
  }
</style>
