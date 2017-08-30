'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.barChartOption = undefined;

var _jquery = require('jquery');

var _jquery2 = _interopRequireDefault(_jquery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _categoryAxisLabelCol = {
  categoryAxisLabelColor: '#fff',
  categoryAxisLineColor: '#fff',
  valueAxisLabelColor: '#fff',
  valueAxisLineColor: '#fff',
  legendLabelColor: '#fff'
},
    categoryAxisLabelColor = _categoryAxisLabelCol.categoryAxisLabelColor,
    valueAxisLabelColor = _categoryAxisLabelCol.valueAxisLabelColor,
    legendLabelColor = _categoryAxisLabelCol.legendLabelColor,
    categoryAxisLineColor = _categoryAxisLabelCol.categoryAxisLineColor,
    valueAxisLineColor = _categoryAxisLabelCol.valueAxisLineColor; /**
                                                                    * Created by lyc on 17-7-24.
                                                                    * 暂不支持多坐标轴
                                                                    */

var barChartOption = exports.barChartOption = {
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
        _chartConfig$seriesIt = _chartConfig.seriesItemColor,
        seriesItemColor = _chartConfig$seriesIt === undefined ? true : _chartConfig$seriesIt,
        seriesData = _chartConfig.seriesData;

    var defaultTooltipData = { trigger: 'axis', axisPointer: { type: 'shadow' } };
    var defaultLegendData = { x: 'center', y: 'top', data: [], textStyle: { fontSize: 14, color: legendLabelColor } };
    var defaultCategoryAxisData = {
      type: 'category',
      name: '',
      data: [],
      boundaryGap: [0, 0.01],
      splitLine: { show: true, interval: 'auto' },
      axisTick: { show: false },
      axisLine: {
        lineStyle: { width: 2, color: categoryAxisLineColor }
      },
      axisLabel: {
        interval: 0,
        margin: 10,
        textStyle: { fontSize: 14, color: categoryAxisLabelColor },
        formatter: function formatter(value) {
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
      axisLine: {
        lineStyle: { width: 2, color: valueAxisLineColor }
      },
      axisLabel: { margin: 10, textStyle: { fontSize: 14, color: valueAxisLabelColor } }
    };
    var defaultGridData = { top: '8%', bottom: '20%', left: '5%', containLabel: true };
    var seriesRenderData = [];
    var defaultSeriesItem = {
      name: '',
      type: 'bar',
      data: [],
      barMaxWidth: '40'
    };
    if (seriesItemColor) {
      defaultSeriesItem.itemStyle = {
        normal: {
          color: function color(params) {
            return _color[params.dataIndex % 15];
          }
        }
      };
    }

    _jquery2.default.extend(true, defaultTooltipData, tooltipData);
    _jquery2.default.extend(true, defaultLegendData, legendData);
    _jquery2.default.extend(true, defaultGridData, gridData);
    tooltipData = defaultTooltipData;
    legendData = defaultLegendData;
    gridData = defaultGridData;

    if (data.length > 0) {
      data.forEach(function (item, i) {
        var seriesItem = {};
        if (seriesData) {
          _jquery2.default.extend(true, seriesItem, defaultSeriesItem, seriesData[i]);
          seriesRenderData.push(seriesItem);
        } else {
          _jquery2.default.extend(true, seriesItem, defaultSeriesItem);
          seriesItem.name = item.name;
          seriesItem.data = item.data;
          seriesRenderData.push(seriesItem);
        }
        legendData.data.push(item.name);
        if (item.data.length > 0) {
          item.data.forEach(function (obj) {
            if (_jquery2.default.inArray(obj.name, defaultCategoryAxisData.data) === -1) {
              defaultCategoryAxisData.data.push(obj.name);
            }
          });
        }
      });
    }

    if (xAxisData.type === 'value') {
      _jquery2.default.extend(true, defaultValueAxisData, xAxisData);
      xAxisData = defaultValueAxisData;
    } else {
      _jquery2.default.extend(true, defaultCategoryAxisData, xAxisData);
      xAxisData = defaultCategoryAxisData;
    }
    if (yAxisData.type === 'category') {
      _jquery2.default.extend(true, defaultCategoryAxisData, yAxisData);
      yAxisData = defaultCategoryAxisData;
    } else {
      _jquery2.default.extend(true, defaultValueAxisData, yAxisData);
      yAxisData = defaultValueAxisData;
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
};

//# sourceMappingURL=bar-chart-compiled.js.map