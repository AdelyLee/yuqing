/**
 * Created by lyc on 17-7-11.
 */
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import {LoginUsers} from '../data/user'
import {ArticlePager} from '../data/article'
let _Articles = ArticlePager

export default {
  init () {
    let mock = new MockAdapter(axios)

    mock.onPost('/login').reply(arg => {
      let {username, password} = JSON.parse(arg.data)
      return new Promise((resolve, reject) => {
        let user = null
        setTimeout(() => {
          let hasUser = LoginUsers.some(u => {
            if (u.username === username && u.password === password) {
              user = JSON.parse(JSON.stringify(u))
              delete user.password
              return true
            }
          })

          if (hasUser) {
            resolve([200, {code: 200, msg: '请求成功', user}])
          } else {
            resolve([200, {code: 500, msg: '账号或密码错误'}])
          }
        }, 1000)
      })
    })

    // 获取用户列表
    mock.onGet('/article/list').reply(config => {
      let {content, totalElements} = _Articles
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            content: content,
            totalElements: totalElements
          }])
        }, 500)
      })
    })
  }
}
