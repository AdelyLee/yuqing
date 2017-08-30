'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ArticlePager = exports.Articles = undefined;

var _mockjs = require('mockjs');

var _mockjs2 = _interopRequireDefault(_mockjs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Articles = []; /**
                    * Created by lyc on 17-7-11.
                    */

for (var i = 0; i < 10; i++) {
  Articles.push(_mockjs2.default.mock({
    id: _mockjs2.default.Random.guid(),
    title: _mockjs2.default.Random.ctitle(10, 30),
    content: _mockjs2.default.Random.cparagraph(3, 10),
    type: _mockjs2.default.Random.pick(['news', 'weibo', 'bbs', 'bar', 'weixin']),
    pubTime: _mockjs2.default.Random.date().getTime(),
    nlp: {
      sentiment: {
        value: _mockjs2.default.Random.float(0, 1, 0, 9),
        label: _mockjs2.default.Random.pick(['NEU', 'POS', 'NEG'])
      }
    }
  }));
}
var ArticlePager = {
  content: undefined.Articles,
  totalElements: _mockjs2.default.Random.integer(0, 10000)
};

exports.Articles = Articles;
exports.ArticlePager = ArticlePager;

//# sourceMappingURL=article-compiled.js.map