/**
 * Created by lyc on 17-7-11.
 */
import Mock from 'mockjs'
const Articles = []
for (let i = 0; i < 10; i++) {
  Articles.push(Mock.mock({
    id: Mock.Random.guid(),
    title: Mock.Random.ctitle(10, 14),
    content: Mock.Random.cparagraph(3, 10),
    type: Mock.Random.pick(['news', 'weibo', 'bbs', 'bar']),
    source: Mock.Random.pick(['腾讯新闻', '网易新闻', '百度新闻', '新浪新闻', '人民网']),
    pubTime: Mock.Random.date(),
    nlp: {
      sentiment: {
        value: Mock.Random.float(0, 1, 0, 9),
        label: Mock.Random.pick(['NEU', 'POS', 'NEG'])
      }
    }
  }))
}

const ArticlePager = {
  content: Articles,
  totalElements: Mock.Random.integer(0, 10000)
}

export {Articles, ArticlePager}
