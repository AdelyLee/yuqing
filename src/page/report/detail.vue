<template>
  <div id="report-detail">
    <el-col :span="24">
      <div class="card-body">
        <el-row :gutter="15">
          <!-- start: 报告头部-->
          <div class="report-header">
            <div class="content-save" v-if="briefingJson.author">内部资料 注意保密</div>
            <div class="title" v-if="briefingJson.title">“{{briefingJson.title}}”
              <div class="subTitle" v-if="briefingJson.type ==='专报'">{{subTitle}}</div>
            </div>
            <div class="report-info">
              <el-col :span="8" class="organization" v-if="briefingJson.author">{{briefingJson.author}}</el-col>
              <el-col :span="8" class="period" v-if="briefingJson.issue">{{briefingJson.issue}}</el-col>
              <el-col :span="8" class="createTime" v-if="briefingJson.author">{{briefingJson.createTime}}</el-col>
            </div>
          </div>
          <!-- end: 报告头部-->
          <!-- start: 报告内容-->
          <div class="report-content">
            <div class="outline" v-if="briefingJson.outline" v-html="briefingJson.outline">{{briefingJson.outline}}
            </div>
            <div v-for="item of briefingCells">
              <div class="title" :class="[item.level]" v-if="item.title" v-html="item.title">{{item.title}}</div>
              <line-bar-chart v-if="item.chartType=='bar' || item.chartType=='line'"
                              :chartConfig="item"></line-bar-chart>
              <pie-chart v-if="item.chartType=='pie'" :chartConfig="item"></pie-chart>
              <map-chart v-if="item.chartType=='map'" :chartConfig="item"></map-chart>
              <keywords-chart v-if="item.chartType=='keywordsCloud'" :chartConfig="item"></keywords-chart>
              <accident-table v-if="item.chartType=='table'" :tableData="item"></accident-table>
              <div class="description" v-if="item.description" v-html="item.description">{{item.description}}</div>
            </div>
          </div>
          <!-- start: 报告内容-->
          <!-- start: 报告总结-->
          <div class="report-summary">
            <div class="text" v-if="briefingJson.summary">{{briefingJson.summary}}</div>
          </div>
          <!-- start: 报告总结-->
        </el-row>
      </div>
    </el-col>
  </div>
</template>

<script>
  import LineBarChart from '@/components/common/charts/line-bar'
  import PieChart from '@/components/common/charts/pie'
  import MapChart from '@/components/common/charts/map'
  import KeywordsChart from '@/components/common/charts/keywords-cloud'

  import {getBriefingJson} from '@/service/report'
  import {typeUtil} from '@/utils/typeUtil'
  import {utils} from '@/utils/utils'

  export default {
    name: 'reportDetail',
    data() {
      return {
        subTitle: '舆情专报',
        briefingJson: {},
        briefingCells: []
      }
    },
    components: {
      'line-bar-chart': LineBarChart,
      'pie-chart': PieChart,
      'map-chart': MapChart,
      'keywords-chart': KeywordsChart
    },
    mounted() {
      // get briefing json data from mongodb
      this.getBriefingJson()
    },
    methods: {
      getBriefingJson: function () {
        let self = this
        let reportId = utils.getQueryVariable('id')
        let params = {id: reportId}
        getBriefingJson(params).then(briefingJson => {
          briefingJson = JSON.stringify(briefingJson)
          let briefing = JSON.parse(briefingJson, function (k, v) {
            if (v.indexOf && v.indexOf('function') > -1) {
              /* eslint-disable no-eval */
              return eval('(function(){return ' + v + ' })()')
            }
            return v
          })
          briefing.type = typeUtil.briefingType(briefing.type)

          // render briefing json
          if (briefing.briefingBody) {
            self.renderBriefingJson(briefing.briefingBody)
          }
          // delete briefing json briefing body
          delete briefing.briefingBody
          self.briefingJson = briefing
        })
      },

      renderBriefingJson: function (briefingBody) {
        let self = this
        let briefingCells = []

        function analysisArray(briefingBody) {
          briefingBody.forEach(function (item) {
            briefingCells.push(item)
            if (item.children !== undefined && item.children.length > 0) {
              analysisArray(item.children)
            }
          })
        }

        analysisArray(briefingBody)

        self.briefingCells = briefingCells
      }
    }
  }
</script>
