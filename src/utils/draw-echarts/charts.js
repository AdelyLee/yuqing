/**
 * Created by lyc on 17-5-17.
 * echarts 画图工具类, 引入jquery使用jquery的深度copy 和数据请求get方法
 * 引用 mapChartUtil 是对地图geoJson数据进行处理.
 *
 * drawLineBarChart 画这线图或者柱状图
 *
 * drawPieChart 画饼图
 *
 * drawMapChart 渲染地图
 * 地图下钻的功能不能实现可配置花,可以根据自己的调用改渲染方法时,控制逻辑来实现
 *
 * 引入d3实现关键词云图
 *
 */
import d3 from 'd3'
import d3LayoutCloud from 'd3-cloud'
import $ from 'jquery'
import echarts from 'echarts'
import {mapChartUtil} from './map-chart-util'

function getTheme() {
  let {style = ''} = JSON.parse(localStorage.getItem('systemConfig'))
  style = style !== null && style !== '' ? style : 'default'
  let themeData = require('static/charts-theme/' + style + '.json')
  let {themeName = '', theme = {}} = themeData
  echarts.registerTheme(themeName, theme)
  return themeName
}
export const chart = {
  /**
   * 绘制echarts柱状图或折线图
   * @param containerId
   * @param option
   * @param events
   */
  drawLineBarChart: function (containerId, option, events) {
    echarts.dispose(document.getElementById(containerId))
    let myChart = echarts.init(document.getElementById(containerId), getTheme())
    // 指定图表默认配置项和数据
    let defaultOption = {
      tooltip: {},
      xAxis: {
        data: ['a', 'b', 'c', 'd', 'e', 'f']
      },
      yAxis: {},
      series: [{
        name: '数量',
        type: 'bar',
        data: [5, 20, 36, 10, 10, 20]
      }]
    }

    if (option.series && option.series.length > 0) {
      delete defaultOption.series[0].data
      delete defaultOption.xAxis.data
    }
    $.extend(true, defaultOption, option)

    if (events) {
      for (let i in events) {
        let event = events[i]
        if (typeof event === 'function') {
          myChart.on(i, event)
        }
      }
    }

    myChart.setOption(defaultOption)
  },
  /**
   * 绘制echarts饼状图
   * @param containerId
   * @param option
   * @param events
   */
  drawPieChart: function (containerId, option, events) {
    echarts.dispose(document.getElementById(containerId))
    let myChart = echarts.init(document.getElementById(containerId), getTheme())
    // 指定图表默认配置项和数据
    let defaultOption = {
      tooltip: {},
      series: [
        {
          name: '数量',
          type: 'pie',
          radius: '55%',
          data: [
            {value: 335, name: 'a'},
            {value: 310, name: 'b'},
            {value: 234, name: 'c'},
            {value: 135, name: 'd'},
            {value: 1548, name: 'e'}
          ],
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    }
    if (option.series && option.series.length > 0) {
      delete defaultOption.series[0].data
    }
    $.extend(true, defaultOption, option)
    if (events) {
      for (let i in events) {
        let event = events[i]
        if (typeof event === 'function') {
          myChart.on(i, event)
        }
      }
    }

    myChart.setOption(defaultOption)
  },
  /**
   * 绘制echarts仪表盘图
   * @param containerId
   * @param option
   * @param events
   */
  drawGaugeChart: function (containerId, option, events) {
    echarts.dispose(document.getElementById(containerId))
    let myChart = echarts.init(document.getElementById(containerId), getTheme())
    // 指定图表默认配置项和数据
    let defaultOption = {
      tooltip: {},
      series: [
        {
          name: '情感类型',
          startAngle: 180,
          endAngle: 0,
          min: 0,
          max: 100,
          type: 'gauge',
          detail: {formatter: '{value}'},
          radius: '85%',
          axisLine: {
            show: false,
            lineStyle: {
              width: 30,
              shadowBlur: 0,
              color: [[0.3, '#E96C6C'], [0.7, '#52B5FF'], [1, '#D2DD2A']]
            }
          },
          data: [{value: 20, name: 'a'}]
        }
      ]
    }

    if (option.series && option.series.length > 0) {
      delete defaultOption.series[0].data
    }
    $.extend(true, defaultOption, option)

    if (events) {
      for (let i in events) {
        let event = events[i]
        if (typeof event === 'function') {
          myChart.on(i, event)
        }
      }
    }

    myChart.setOption(defaultOption)
  },

  /**
   * 绘制echarts地图
   * @param containerId
   * @param option
   * @param events
   */
  drawMapChart: function (containerId, option, events) {
    let mapType = option.mapType === undefined ? 'china' : option.mapType
    let provinces = []
    for (let province in mapChartUtil._provinceMap) {
      provinces.push(province)
    }

    function getJsonUrl(mapType) {
      let geoJsonName = ''
      let mapJsonUrl = require('static/geoJson/china.json')
      if (mapType === 'china') {
        mapJsonUrl = require('static/geoJson/china.json')
      } else if ($.inArray(mapType, provinces) !== -1) {
        geoJsonName = mapChartUtil._provinceMap[mapType]
        mapJsonUrl = require('static/geoJson/geometryProvince/' + geoJsonName + '.json')
      } else {
        geoJsonName = mapChartUtil.cityMap[mapType]
        if (geoJsonName === undefined) {
          mapJsonUrl = require('static/geoJson/china.json')
        } else {
          mapJsonUrl = require('static/geoJson/geometryCounties/' + geoJsonName + '.json')
        }
      }

      return mapJsonUrl
    }

    echarts.dispose(document.getElementById(containerId))
    echarts.registerMap(mapType, getJsonUrl(mapType))
    let myChart = echarts.init(document.getElementById(containerId), getTheme())
    // 指定图表默认配置项和数据
    let defaultOption = {
      tooltip: {
        trigger: 'item',
        formatter: '{b}'
      },
      series: [
        {
          name: '地图',
          type: 'map',
          mapType: mapType,
          selectedMode: 'multiple',
          label: {
            normal: {
              show: true
            },
            emphasis: {
              show: true
            }
          },
          data: []
        }
      ]
    }

    if (option.series && option.series.length > 0) {
      delete defaultOption.series[0].data
    }
    $.extend(true, defaultOption, option)

    if (events) {
      for (let i in events) {
        let event = events[i]
        if (typeof event === 'function') {
          myChart.on(i, event)
        }
      }
    }

    myChart.setOption(defaultOption)
  },

  /**
   * 绘制d3关键词云图
   * @param containerId
   * @param option
   */
  drawKeyWordsCloud: function (containerId, option) {
    let item = document.getElementById(containerId)
    let defaultOption = [{
      keyword: '暂无相关数据',
      score: 10
    }]
    let data = option.data
    if (data !== undefined && data.length > 0) {
      $(item).empty()
    } else {
      data = defaultOption
    }
    let height = $(item).height()
    let width = $(item).width()
    let fill = d3.scale.category20()
    let scale = d3.scale.linear()
      .domain([0, data[0].score / 3, data[0].score])
      .range([10, 20, 50])

    let layout = d3LayoutCloud()
      .size([width, height])
      .words(data.map(function (d) {
        return {
          text: d.keyword,
          size: scale(d.score)
        }
      })).padding(2).rotate(function () {
        return ~~(Math.random() * 2) * 90
      }).font('Impact').fontSize(function (d) {
        return d.size
      }).on('end', draw)

    layout.start()

    function draw(words) {
      d3.select(item)
        .append('svg').attr('width', '100%')
        .attr('height', '100%')
        .style('border-radius', width + 'px')
        .append('g').attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')')
        .selectAll('text')
        .data(words).enter().append('text')
        .style('font-size', function (d) {
          return d.size + 'px'
        })
        .style('font-family', '微软雅黑')
        .style('fill', function (d, i) {
          return fill(i)
        })
        .attr('text-anchor', 'middle')
        .attr('transform', function (d) {
          return 'translate(' + [d.x, d.y] + ')rotate(' + d.rotate + ')'
        })
        .text(function (d) {
          return d.text
        })
    }
  },
  /**
   * 绘制d3气泡图
   * @param containerId
   * @param option
   */
  drawBubbleChart: function (containerId, option) {
  }
}
