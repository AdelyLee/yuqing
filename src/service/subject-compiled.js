'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deleteSubject = exports.updateCustomSubjectReport = exports.editSubject = exports.addSubject = exports.getSubjects = undefined;

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _dateUtil = require('@/utils/dateUtil');

var _utils = require('@/utils/utils');

var _common = require('./common');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Created by lyc on 17-7-11.
 */
var base = _common.BASE_URL;

var AUTH_TOKEN = sessionStorage.getItem('access-user');
_axios2.default.defaults.headers.common['Authorization'] = AUTH_TOKEN;
/**
 * 根据用户获取用户专题 POST /customSubject/findByUser
 * @param params
 */
var getSubjects = exports.getSubjects = function getSubjects(params) {
  return _axios2.default.post(base + '/customSubject/findByUser', params).then(function (res) {
    var data = res.data;

    var renderData = [];
    if (data.content.length > 0) {
      data.content.forEach(function (item, index) {
        renderData.push(handlerSubjectItem(item, index, params));
      });
    }
    data.content = renderData;

    return data;
  });
};

/**
 * 处理专题列表结果
 * @param item
 * @param index
 * @param params
 * @returns {*}
 */
function handlerSubjectItem(item, index, params) {
  var limit = params.limit,
      page = params.page;

  var skip = limit * (page - 1);
  var subject = _utils.utils.decodeSubject(item);
  subject.number = skip + index + 1;
  subject.startFormatDate = _dateUtil.dateUtil.formatDate(subject.startDate, 'yyyy-MM-dd');
  subject.endFormatDate = _dateUtil.dateUtil.formatDate(subject.endDate, 'yyyy-MM-dd');

  return item;
}
/**
 * 新建专题 POST /customSubject/
 * @param params
 */
var addSubject = exports.addSubject = function addSubject(params) {
  return _axios2.default.post(base + '/customSubject/', params).then(function (res) {
    return res.data;
  });
};
/**
 * 修改专题 PUT /customSubject/{id}
 * @param params
 */
var editSubject = exports.editSubject = function editSubject(params) {
  return _axios2.default.put(base + '/customSubject/' + params.id).then(function (res) {
    return res.data;
  });
};
/**
 * 更新专题报告 GET /customSubject/updateReport/{id}
 * @param params
 */
var updateCustomSubjectReport = exports.updateCustomSubjectReport = function updateCustomSubjectReport(params) {
  return _axios2.default.get(base + '/customSubject/updateReport/' + params.id).then(function (res) {
    return res.data;
  });
};

/**
 * 删除专题 DELETE /customSubject/{id}
 * @param params
 */
var deleteSubject = exports.deleteSubject = function deleteSubject(params) {
  return _axios2.default.delete(base + '/customSubject/' + params.id).then(function (res) {
    return res.data;
  });
};

//# sourceMappingURL=subject-compiled.js.map