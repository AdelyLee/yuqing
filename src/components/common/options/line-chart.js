/**
 * Created by lyc on 17-7-24.
 * 暂不支持多坐标轴
 */
import $ from 'jquery'
export const lineChartOption = {
  /**
   * get line chart option by the data and chartConfig.
   * @param data
   * data format as:
   * [{
   *    name: 'lineOne',
   *    data: [{name: 'a', value: 29},
   *    {'name': 'b', 'value': 7},
   *    {'name': 'a', 'value': 29},
   *    {'name': 'b', 'value': 7}]
   * },
   * {
   *    name: 'lineTwo',
   *    data: [{'name': 'e', 'value': 29},
   *    {'name': 'f', 'value': 7}]
   * }]
   * @param chartConfig
   * config of the chart
   * @returns option
   */
  getOption: function (data, chartConfig) {
    chartConfig = chartConfig || {}
    let defaultTooltipData = {trigger: 'axis', axisPointer: {type: 'shadow'}}
    let defaultLegendData = {x: 'center', y: 'top', data: [], textStyle: {fontSize: 14}}
    let defaultCategoryAxisData = {
      type: 'category',
      name: '',
      data: [],
      boundaryGap: false,
      splitLine: {show: true, interval: 'auto'},
      axisTick: {show: false},
      axisLine: {
        lineStyle: {width: 2}
      },
      axisLabel: {
        margin: 10,
        textStyle: {fontSize: 14}
      }
    }
    let defaultValueAxisData = {
      type: 'value',
      name: '',
      axisTick: {show: false},
      axisLine: {
        lineStyle: {width: 2}
      },
      axisLabel: {margin: 10, textStyle: {fontSize: 14}}
    }
    let defaultGridData = {top: '8%', bottom: '20%', left: '5%', containLabel: true}
    let {tooltipData = {}, legendData = {}, xAxisData = {}, yAxisData = {}, gridData = {}, seriesData} = chartConfig
    let seriesRenderData = []
    let defaultSeriesItem = {name: '', type: 'line', smooth: true, data: []}
    $.extend(true, defaultTooltipData, tooltipData)
    $.extend(true, defaultLegendData, legendData)
    $.extend(true, defaultGridData, gridData)
    tooltipData = defaultTooltipData
    legendData = defaultLegendData
    gridData = defaultGridData

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
            if ($.inArray(obj.key, defaultCategoryAxisData.data) === -1) {
              defaultCategoryAxisData.data.push(obj.key)
            }
          })
        }
      })
    }

    if (xAxisData.type === 'value') {
      $.extend(true, defaultValueAxisData, xAxisData)
      xAxisData = defaultValueAxisData
    } else {
      $.extend(true, defaultCategoryAxisData, xAxisData)
      xAxisData = defaultCategoryAxisData
    }
    if (yAxisData.type === 'category') {
      $.extend(true, defaultCategoryAxisData, yAxisData)
      yAxisData = defaultCategoryAxisData
    } else {
      $.extend(true, defaultValueAxisData, yAxisData)
      yAxisData = defaultValueAxisData
    }

    return {
      tooltip: tooltipData,
      legend: legendData,
      xAxis: xAxisData,
      yAxis: yAxisData,
      grid: gridData,
      series: seriesRenderData
    }
  }
}
