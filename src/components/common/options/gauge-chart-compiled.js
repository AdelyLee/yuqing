'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.gaugeChartOption = undefined;

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _jquery = require('jquery');

var _jquery2 = _interopRequireDefault(_jquery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var gaugeChartOption = {
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
  getOption: function getOption(data, chartConfig) {
    var _color = ['#21b6b9', '#eba954', '#0092ff', '#d74e67', '#27727B', '#FE8463', '#9BCA63', '#FAD860', '#F3A43B', '#60C0DD', '#D7504B', '#C6E579', '#F4E001', '#F0805A', '#26C0C0'];
    chartConfig = chartConfig || {};
    var _chartConfig = chartConfig,
        _chartConfig$tooltipD = _chartConfig.tooltipData,
        tooltipData = _chartConfig$tooltipD === undefined ? {} : _chartConfig$tooltipD,
        _chartConfig$legendDa = _chartConfig.legendData,
        legendData = _chartConfig$legendDa === undefined ? {} : _chartConfig$legendDa,
        _chartConfig$xAxisDat = _chartConfig.xAxisData,
        xAxisData = _chartConfig$xAxisDat === undefined ? {} : _chartConfig$xAxisDat,
        _chartConfig$yAxisDat = _chartConfig.yAxisData,
        yAxisData = _chartConfig$yAxisDat === undefined ? {} : _chartConfig$yAxisDat,
        _chartConfig$gridData = _chartConfig.gridData,
        gridData = _chartConfig$gridData === undefined ? {} : _chartConfig$gridData,
        _chartConfig$labelLen = _chartConfig.labelLength,
        labelLength = _chartConfig$labelLen === undefined ? 8 : _chartConfig$labelLen,
        seriesData = (0, _objectWithoutProperties3.default)(_chartConfig, ['tooltipData', 'legendData', 'xAxisData', 'yAxisData', 'gridData', 'labelLength']);

    var defaultTooltipData = { trigger: 'axis', axisPointer: { type: 'shadow' } };
    var defaultLegendData = { x: 'center', y: 'top', data: [] };
    var defaultCategoryAxisData = {
      type: 'category',
      name: '',
      data: [],
      boundaryGap: [0, 0.01],
      splitLine: { show: true, interval: 'auto' },
      axisTick: { show: false },
      axisLabel: {
        interval: 0,
        margin: 10,
        textStyle: { fontSize: 14 },
        formatter: function formatter(value, index) {
          var _value = value,
              length = _value.length;

          if (length > labelLength) {
            value = value.substring(0, parseInt(length / 2)) + '\n' + value.substring(parseInt(length / 2));
          }
          return value;
        }
      }
    };
    var defaultValueAxisData = {
      type: 'value',
      name: '',
      axisTick: { show: false },
      axisLabel: { margin: 10, textStyle: { fontSize: 14 } }
    };
    var defaultGridData = { top: '8%', bottom: '20%', left: '5%', containLabel: true };
    _jquery2.default.extend(true, tooltipData, defaultTooltipData);
    _jquery2.default.extend(true, legendData, defaultLegendData);
    _jquery2.default.extend(true, gridData, defaultGridData);
    var seriesRenderData = [];
    var defaultSeriesItem = {
      name: '',
      type: 'bar',
      data: [],
      barMaxWidth: '40',
      itemStyle: {
        normal: {
          color: function color(params) {
            return _color[params.dataIndex % 15];
          }
        }
      }
    };

    if (data.length > 0) {
      data.forEach(function (item, i) {
        var seriesItem = {};
        _jquery2.default.extend(true, seriesItem, defaultSeriesItem);
        _jquery2.default.extend(true, seriesItem, seriesData[i]);
        seriesItem.name = item.name;
        seriesItem.data = item.data;
        legendData.data.push(item.name);
        if (item.data.length > 0) {
          item.data.forEach(function (obj) {
            defaultCategoryAxisData.data.push(obj.name);
          });
        }

        seriesRenderData.push(seriesItem);
      });
    }

    if (xAxisData.type === 'value') {
      _jquery2.default.extend(true, xAxisData, defaultValueAxisData);
    } else {
      _jquery2.default.extend(true, xAxisData, defaultCategoryAxisData);
    }
    if (yAxisData.type === 'category') {
      _jquery2.default.extend(true, yAxisData, defaultCategoryAxisData);
    } else {
      _jquery2.default.extend(true, yAxisData, defaultValueAxisData);
    }

    return {
      color: _color,
      tooltip: tooltipData,
      legend: legendData,
      xAxis: xAxisData,
      yAxis: yAxisData,
      grid: gridData,
      series: seriesRenderData
    };
  }
}; /**
    * Created by lyc on 17-7-24.
    * need to do
    */
exports.gaugeChartOption = gaugeChartOption;

//# sourceMappingURL=gauge-chart-compiled.js.map