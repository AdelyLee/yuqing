'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.chart = undefined;

var _d = require('d3');

var _d2 = _interopRequireDefault(_d);

var _d3Cloud = require('d3-cloud');

var _d3Cloud2 = _interopRequireDefault(_d3Cloud);

var _jquery = require('jquery');

var _jquery2 = _interopRequireDefault(_jquery);

var _echarts = require('echarts');

var _echarts2 = _interopRequireDefault(_echarts);

var _mapChartUtil = require('./map-chart-util');

var _utils = require('../utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
var basePath = _utils.utils.getBasePath();

var chart = exports.chart = {
  /**
   * 绘制echarts柱状图或折线图
   * @param containerId
   * @param option
   * @param events
   */
  drawLineBarChart: function drawLineBarChart(containerId, option, events) {
    _echarts2.default.dispose(document.getElementById(containerId));
    var myChart = _echarts2.default.init(document.getElementById(containerId));
    // 指定图表默认配置项和数据
    var defaultOption = {
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
    };

    if (option.series && option.series.length > 0) {
      delete defaultOption.series[0].data;
      delete defaultOption.xAxis.data;
    }
    _jquery2.default.extend(true, defaultOption, option);

    if (events) {
      for (var i in events) {
        var event = events[i];
        if (typeof event === 'function') {
          myChart.on(i, event);
        }
      }
    }

    myChart.setOption(defaultOption);
  },
  /**
   * 绘制echarts饼状图
   * @param containerId
   * @param option
   * @param events
   */
  drawPieChart: function drawPieChart(containerId, option, events) {
    _echarts2.default.dispose(document.getElementById(containerId));
    var myChart = _echarts2.default.init(document.getElementById(containerId));
    // 指定图表默认配置项和数据
    var defaultOption = {
      tooltip: {},
      series: [{
        name: '数量',
        type: 'pie',
        radius: '55%',
        data: [{ value: 335, name: 'a' }, { value: 310, name: 'b' }, { value: 234, name: 'c' }, { value: 135, name: 'd' }, { value: 1548, name: 'e' }],
        itemStyle: {
          emphasis: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }]
    };
    if (option.series && option.series.length > 0) {
      delete defaultOption.series[0].data;
    }
    _jquery2.default.extend(true, defaultOption, option);
    if (events) {
      for (var i in events) {
        var event = events[i];
        if (typeof event === 'function') {
          myChart.on(i, event);
        }
      }
    }

    myChart.setOption(defaultOption);
  },
  /**
   * 绘制echarts仪表盘图
   * @param containerId
   * @param option
   * @param events
   */
  drawGaugeChart: function drawGaugeChart(containerId, option, events) {
    _echarts2.default.dispose(document.getElementById(containerId));
    var myChart = _echarts2.default.init(document.getElementById(containerId));
    // 指定图表默认配置项和数据
    var defaultOption = {
      tooltip: {},
      series: [{
        name: '情感类型',
        startAngle: 180,
        endAngle: 0,
        min: 0,
        max: 100,
        type: 'gauge',
        detail: { formatter: '{value}' },
        radius: '85%',
        axisLine: {
          show: false,
          lineStyle: {
            width: 30,
            shadowBlur: 0,
            color: [[0.3, '#E96C6C'], [0.7, '#52B5FF'], [1, '#D2DD2A']]
          }
        },
        data: [{ value: 20, name: 'a' }]
      }]
    };

    if (option.series && option.series.length > 0) {
      delete defaultOption.series[0].data;
    }
    _jquery2.default.extend(true, defaultOption, option);

    if (events) {
      for (var i in events) {
        var event = events[i];
        if (typeof event === 'function') {
          myChart.on(i, event);
        }
      }
    }

    myChart.setOption(defaultOption);
  },

  /**
   * 绘制echarts地图
   * @param containerId
   * @param option
   * @param events
   */
  drawMapChart: function drawMapChart(containerId, option, events) {
    var mapType = option.mapType === undefined ? 'china' : option.mapType;
    var provinces = [];
    for (var province in _mapChartUtil.mapChartUtil._provinceMap) {
      provinces.push(province);
    }

    function getJsonUrl(mapType) {
      var geoJsonName = '';
      var mapJsonUrl = basePath + '/static/geoJson/china.json';
      if (mapType === 'china') {
        mapJsonUrl = basePath + '/static/geoJson/china.json';
      } else if (_jquery2.default.inArray(mapType, provinces) !== -1) {
        geoJsonName = _mapChartUtil.mapChartUtil._provinceMap[mapType];
        mapJsonUrl = basePath + '/static/geoJson/geometryProvince/' + geoJsonName + '.json';
      } else {
        geoJsonName = _mapChartUtil.mapChartUtil.cityMap[mapType];
        if (geoJsonName === undefined) {
          mapJsonUrl = basePath + '/static/geoJson/china.json';
        } else {
          mapJsonUrl = basePath + '/static/geoJson/geometryCounties/' + geoJsonName + '.json';
        }
      }

      return mapJsonUrl;
    }

    _jquery2.default.get(getJsonUrl(mapType), function (mapJson) {
      _echarts2.default.dispose(document.getElementById(containerId));
      _echarts2.default.registerMap(mapType, mapJson);
      var myChart = _echarts2.default.init(document.getElementById(containerId));
      // 指定图表默认配置项和数据
      var defaultOption = {
        tooltip: {
          trigger: 'item',
          formatter: '{b}'
        },
        series: [{
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
        }]
      };

      if (option.series && option.series.length > 0) {
        delete defaultOption.series[0].data;
      }
      _jquery2.default.extend(true, defaultOption, option);

      if (events) {
        for (var i in events) {
          var event = events[i];
          if (typeof event === 'function') {
            myChart.on(i, event);
          }
        }
      }

      myChart.setOption(defaultOption);
    });
  },

  /**
   * 绘制d3关键词云图
   * @param containerId
   * @param option
   */
  drawKeyWordsCloud: function drawKeyWordsCloud(containerId, option) {
    var item = document.getElementById(containerId);
    var defaultOption = [{
      keyword: '暂无相关数据',
      score: 10
    }];
    var data = option.data;
    if (data !== undefined && data.length > 0) {
      (0, _jquery2.default)(item).empty();
    } else {
      data = defaultOption;
    }
    var height = (0, _jquery2.default)(item).height();
    var width = (0, _jquery2.default)(item).width();
    var fill = _d2.default.scale.category20();
    var scale = _d2.default.scale.linear().domain([0, data[0].score / 3, data[0].score]).range([10, 20, 50]);

    var layout = (0, _d3Cloud2.default)().size([width, height]).words(data.map(function (d) {
      return {
        text: d.keyword,
        size: scale(d.score)
      };
    })).padding(2).rotate(function () {
      return ~~(Math.random() * 2) * 90;
    }).font('Impact').fontSize(function (d) {
      return d.size;
    }).on('end', draw);

    layout.start();

    function draw(words) {
      _d2.default.select(item).append('svg').attr('width', '100%').attr('height', '100%').style('border-radius', width + 'px').append('g').attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')').selectAll('text').data(words).enter().append('text').style('font-size', function (d) {
        return d.size + 'px';
      }).style('font-family', '微软雅黑').style('fill', function (d, i) {
        return fill(i);
      }).attr('text-anchor', 'middle').attr('transform', function (d) {
        return 'translate(' + [d.x, d.y] + ')rotate(' + d.rotate + ')';
      }).text(function (d) {
        return d.text;
      });
    }
  },
  /**
   * 绘制d3气泡图
   * @param containerId
   * @param option
   */
  drawBubbleChart: function drawBubbleChart(containerId, option) {}
};

//# sourceMappingURL=charts-compiled.js.map