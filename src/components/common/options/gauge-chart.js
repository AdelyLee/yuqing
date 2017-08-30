/**
 * Created by lyc on 17-7-24.
 * need to do
 */
import $ from 'jquery'

export const gaugeChartOption = {
  /**
   * get gauge chart option by the data and chartConfig.
   * @param data
   * data format as:
   * [{
   *    name: 'gaugeOne',
   *    data: [{name: 'a', value: 29},
   *    {'name': 'b', 'value': 7},
   *    {'name': 'a', 'value': 29},
   *    {'name': 'b', 'value': 7}]
   * },
   * {
   *    name: 'gaugeTwo',
   *    data: [{'name': 'e', 'value': 29},
   *    {'name': 'f', 'value': 7}]
   * }]
   * @param chartConfig
   * config of the chart
   * @returns option
   */
  getOption: function (data, chartConfig) {
    let color = ['#21b6b9', '#eba954', '#0092ff', '#d74e67', '#27727B', '#FE8463', '#9BCA63', '#FAD860', '#F3A43B', '#60C0DD', '#D7504B', '#C6E579', '#F4E001', '#F0805A', '#26C0C0']
    chartConfig = chartConfig || {}
    let {tooltipData = {}, legendData = {}, gridData = {}, ...seriesData} = chartConfig
    let defaultTooltipData = {trigger: 'axis', axisPointer: {type: 'shadow'}}
    let defaultLegendData = {x: 'center', y: 'top', data: []}
    let defaultGridData = {top: '8%', bottom: '20%', left: '5%', containLabel: true}
    $.extend(true, tooltipData, defaultTooltipData)
    $.extend(true, legendData, defaultLegendData)
    $.extend(true, gridData, defaultGridData)
    let seriesRenderData = []
    let defaultSeriesItem = {
      name: '情感类型',
      startAngle: 180,
      endAngle: 0,
      min: 0,
      max: 100,
      type: 'gauge',
      detail: {
        formatter: '{value}',
        offsetCenter: [0, '-40%']
      },
      radius: '95%',
      center: ['50%', '70%'],
      axisLine: {
        show: false,
        lineStyle: {
          width: 30,
          shadowBlur: 0,
          color: [[0.3, '#E96C6C'], [0.7, '#52B5FF'], [1, '#D2DD2A']]
        }
      },
      axisLabel: {
        formatter: function (e) {
          switch (e + '') {
            case '0':
              return '负面'
            case '50':
              return '中性'
            case '100':
              return '正面'
            default:
              return ''
          }
        },
        textStyle: {
          fontSize: 15,
          fontWeight: ''
        }
      },
      title: {
        show: false
      }
    }
    if (data.length > 0) {
      data.forEach(function (item, i) {
        let seriesItem = {}
        $.extend(true, seriesItem, defaultSeriesItem)
        $.extend(true, seriesItem, seriesData[i])
        seriesItem.name = item.name
        seriesItem.data = item.data
        legendData.data.push(item.name)
        seriesRenderData.push(seriesItem)
      })
    }
    return {
      color: color,
      tooltip: tooltipData,
      legend: legendData,
      grid: gridData,
      series: seriesRenderData
    }
  }
}
