'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.pieChartOption = undefined;

var _jquery = require('jquery');

var _jquery2 = _interopRequireDefault(_jquery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _legendLabelColor = { legendLabelColor: '#fff' },
    legendLabelColor = _legendLabelColor.legendLabelColor; /**
                                                            * Created by lyc on 17-7-24.
                                                            */

var pieChartOption = exports.pieChartOption = {
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
  getOption: function getOption(data, chartConfig) {
    var color = ['#21b6b9', '#eba954', '#0092ff', '#d74e67', '#27727B', '#FE8463', '#9BCA63', '#FAD860', '#F3A43B', '#60C0DD', '#D7504B', '#C6E579', '#F4E001', '#F0805A', '#26C0C0'];
    chartConfig = chartConfig || {};
    var defaultTooltipData = { trigger: 'item', formatter: '{a}<br/>{b} : {c} ({d}%)' };
    var defaultLegendData = { x: 'center', y: 'top', data: [], textStyle: { fontSize: 14, color: legendLabelColor } };
    var _chartConfig = chartConfig,
        _chartConfig$tooltipD = _chartConfig.tooltipData,
        tooltipData = _chartConfig$tooltipD === undefined ? defaultTooltipData : _chartConfig$tooltipD,
        _chartConfig$legendDa = _chartConfig.legendData,
        legendData = _chartConfig$legendDa === undefined ? defaultLegendData : _chartConfig$legendDa,
        _chartConfig$pieForEm = _chartConfig.pieForEmotion,
        pieForEmotion = _chartConfig$pieForEm === undefined ? false : _chartConfig$pieForEm,
        seriesData = _chartConfig.seriesData;

    var seriesRenderData = [];
    var defaultSeriesItem = {
      name: '',
      type: 'pie',
      radius: ['40%', '55%'],
      avoidLabelOverlap: false,
      data: []
    };
    if (pieForEmotion) {
      defaultSeriesItem.itemStyle = {
        normal: {
          color: function color(params) {
            if (params.name === '正面') {
              return '#0092ff';
            } else if (params.name === '中性') {
              return '#eba954';
            } else if (params.name === '负面') {
              return '#d74e67';
            }
          }
        }
      };
    }
    _jquery2.default.extend(true, defaultLegendData, legendData);
    legendData = defaultLegendData;
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
            legendData.data.push(obj.name);
          });
        }
      });
    }

    return {
      color: color,
      tooltip: tooltipData,
      legend: legendData,
      series: seriesRenderData
    };
  }
};

//# sourceMappingURL=pie-chart-compiled.js.map