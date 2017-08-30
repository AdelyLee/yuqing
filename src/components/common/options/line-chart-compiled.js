'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.lineChartOption = undefined;

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

var lineChartOption = exports.lineChartOption = {
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
  getOption: function getOption(data, chartConfig) {
    var color = ['#21b6b9', '#eba954', '#0092ff', '#d74e67', '#27727B', '#FE8463', '#9BCA63', '#FAD860', '#F3A43B', '#60C0DD', '#D7504B', '#C6E579', '#F4E001', '#F0805A', '#26C0C0'];
    chartConfig = chartConfig || {};
    var defaultTooltipData = { trigger: 'axis', axisPointer: { type: 'shadow' } };
    var defaultLegendData = { x: 'center', y: 'top', data: [], textStyle: { fontSize: 14, color: legendLabelColor } };
    var defaultCategoryAxisData = {
      type: 'category',
      name: '',
      data: [],
      boundaryGap: false,
      splitLine: { show: true, interval: 'auto' },
      axisTick: { show: false },
      axisLine: {
        lineStyle: { width: 2, color: categoryAxisLineColor }
      },
      axisLabel: {
        margin: 10,
        textStyle: { fontSize: 14, color: categoryAxisLabelColor }
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
    var defaultGridData = { bottom: 20, left: 120, containLabel: true };
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
        seriesData = _chartConfig.seriesData;

    var seriesRenderData = [];
    var defaultSeriesItem = { name: '', type: 'line', smooth: true, data: [] };
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
        if (item.data.length > 0) {
          item.data.forEach(function (obj) {
            if (_jquery2.default.inArray(obj.key, defaultCategoryAxisData.data) === -1) {
              defaultCategoryAxisData.data.push(obj.key);
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
      color: color,
      tooltip: tooltipData,
      legend: legendData,
      xAxis: xAxisData,
      yAxis: yAxisData,
      grid: gridData,
      series: seriesRenderData
    };
  }
};

//# sourceMappingURL=line-chart-compiled.js.map