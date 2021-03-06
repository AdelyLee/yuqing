/**
 * Created by lyc on 17-7-24.
 */
import $ from 'jquery'
export const pieChartOption = {
  /**
   * get pie chart option by the data and chartConfig.
   * @param data
   * data format as:
   * [{
   *    name: 'pieOne',
   *    data: [{name: 'a', value: 29},
   *    {'name': 'b', 'value': 7},
   *    {'name': 'a', 'value': 29},
   *    {'name': 'b', 'value': 7}]
   * },
   * {
   *    name: 'pieTwo',
   *    data: [{'name': 'e', 'value': 29},
   *    {'name': 'f', 'value': 7}]
   * }]
   * @param chartConfig
   * config of the chart
   * @returns option
   */
  getOption: function (data, chartConfig) {
    chartConfig = chartConfig || {}
    let defaultTooltipData = {trigger: 'item', formatter: '{a}<br/>{b} : {c} ({d}%)'}
    let defaultLegendData = {x: 'center', y: 'top', data: [], textStyle: {fontSize: 14}}
    let {tooltipData = defaultTooltipData, legendData = defaultLegendData, pieForEmotion = false, seriesData} = chartConfig
    let seriesRenderData = []
    let defaultSeriesItem = {
      name: '',
      type: 'pie',
      radius: ['40%', '55%'],
      avoidLabelOverlap: false,
      data: []
    }
    if (pieForEmotion) {
      defaultSeriesItem.itemStyle = {
        normal: {
          color: function (params) {
            if (params.name === '正面') {
              return '#0092ff'
            } else if (params.name === '中性') {
              return '#eba954'
            } else if (params.name === '负面') {
              return '#d74e67'
            } else if (params.name === '原微博') {
              return '#ff733f'
            } else if (params.name === '转发微博') {
              return '#4baae4'
            }
          }
        }
      }
    }
    $.extend(true, defaultLegendData, legendData)
    legendData = defaultLegendData
    if (data.length > 0) {
      data.forEach(function (item, i) {
        let seriesItem = {}
        if (seriesData) {
          $.extend(true, seriesItem, defaultSeriesItem, seriesData[i])
          seriesRenderData.push(seriesItem)
        } else {
          $.extend(true, seriesItem, defaultSeriesItem)
          seriesItem.name = item.name
          seriesItem.data = item.data
          seriesRenderData.push(seriesItem)
        }
        if (item.data.length > 0) {
          item.data.forEach(function (obj) {
            legendData.data.push(obj.name)
          })
        }
      })
    }

    return {
      tooltip: tooltipData,
      legend: legendData,
      series: seriesRenderData
    }
  }
}
