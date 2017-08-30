/**
 * Created by lyc on 17-7-24.
 * 暂不支持多坐标轴
 */
import $ from 'jquery'
export const barChartOption = {
  /**
   * get bar chart option by the data and chartConfig.
   * @param data
   * data format as:
   * [{
   *    name: 'barOne',
   *    data: [{name: 'a', value: 29},
   *    {'name': 'b', 'value': 7},
   *    {'name': 'a', 'value': 29},
   *    {'name': 'b', 'value': 7}]
   * },
   * {
   *    name: 'barTwo',
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
    let {tooltipData = {}, legendData = {}, xAxisData = {}, yAxisData = {}, gridData = {}, labelLength = 8, seriesItemColor = true, seriesData} = chartConfig
    let defaultTooltipData = {trigger: 'axis', axisPointer: {type: 'shadow'}}
    let defaultLegendData = {x: 'center', y: 'top', data: [], textStyle: {fontSize: 14}}
    let defaultCategoryAxisData = {
      type: 'category',
      name: '',
      data: [],
      boundaryGap: [0, 0.01],
      splitLine: {show: true, interval: 'auto'},
      axisTick: {show: false},
      axisLine: {
        lineStyle: {width: 2}
      },
      axisLabel: {
        interval: 0,
        margin: 10,
        textStyle: {fontSize: 14},
        formatter: function (value) {
          let {length} = value
          if (length > labelLength) {
            value = value.substring(0, parseInt(length / 2)) + '\n' + value.substring(parseInt(length / 2))
          }
          return value
        }
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
    let seriesRenderData = []
    let defaultSeriesItem = {
      name: '',
      type: 'bar',
      data: [],
      barMaxWidth: '40'
    }
    if (seriesItemColor) {
      defaultSeriesItem.itemStyle = {
        normal: {
          color: function (params) {
            return color[params.dataIndex % 15]
          }
        }
      }
    }

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
        legendData.data.push(item.name)
        if (item.data.length > 0) {
          item.data.forEach(function (obj) {
            if ($.inArray(obj.name, defaultCategoryAxisData.data) === -1) {
              defaultCategoryAxisData.data.push(obj.name)
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
