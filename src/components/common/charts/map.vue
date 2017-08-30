<template>
  <div class="map-chart">
    <div :id="chartConfig.chartId">
    </div>
  </div>
</template>

<script>
  import {chart} from '@/utils/draw-echarts/charts'
  export default {
    props: ['chartConfig'],
    data () {
      return {}
    },
    mounted () {
      if (JSON.stringify(this.chartConfig.option) !== '{}') {
        chart.drawMapChart(this.chartConfig.chartId, this.chartConfig.option, this.chartConfig.events)
      }
    },
    watch: {
      chartConfig: {
        handler: function (val, oldVal) {
          let self = this
          if (JSON.stringify(this.chartConfig.option) !== '{}') {
            chart.drawMapChart(this.chartConfig.chartId, this.chartConfig.option, this.chartConfig.events)
          } else {
            document.getElementById(self.chartConfig.chartId).innerHTML = '暂无相关数据!'
          }
        },
        deep: true
      }
    }
  }
</script>
