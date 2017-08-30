/**
 * Created by lyc on 17-7-24.
 * need to do
 */
import $ from 'jquery'

export const mapChartOption = {
  /**
   * get map chart option by the data and chartConfig.
   * @param data
   * data format as:
   * [{
   *    name: 'mapOne',
   *    data: [{name: 'a', value: 29},
   *    {'name': 'b', 'value': 7},
   *    {'name': 'a', 'value': 29},
   *    {'name': 'b', 'value': 7}]
   * },
   * {
   *    name: 'mapTwo',
   *    data: [{'name': 'e', 'value': 29},
   *    {'name': 'f', 'value': 7}]
   * }]
   * @param chartConfig
   * config of the chart
   * @returns option
   */
  getOption: function (data, chartConfig) {
    chartConfig = chartConfig || {}
    let {tooltipData = {}, legendData = {}, visualMapData = {}, seriesData} = chartConfig
    let defaultTooltipData = {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c}'
    }
    let defaultLegendData = {
      x: 'center',
      y: 'top',
      data: []
    }
    let defaultVisualMap = {
      min: 0,
      max: 100,
      left: 'left',
      top: 'bottom',
      text: ['高', '低'], // 文本，默认为数值文本
      calculable: true,
      textStyle: {
        color: '#659cd5'
      }
    }
    $.extend(true, tooltipData, defaultTooltipData)
    $.extend(true, legendData, defaultLegendData)
    $.extend(true, visualMapData, defaultVisualMap)
    let seriesRenderData = []
    let defaultSeriesItem = {
      name: '',
      type: 'map',
      mapType: 'china',
      data: []
    }

    $.each(data, function (i, item) {
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
    })

    return {
      tooltip: tooltipData,
      legend: legendData,
      visualMap: visualMapData,
      series: seriesRenderData
    }
  }
}
