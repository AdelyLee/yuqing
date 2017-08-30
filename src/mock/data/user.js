/**
 * Created by lyc on 17-7-11.
 */
import Mock from 'mockjs'
const LoginUsers = [
  {
    id: 1,
    username: 'ahmj',
    password: 'ahmj123',
    email: 'liyc@bjtopcom.com',
    name: '北京卓越'
  }
]

const Users = []
for (let i = 0; i < 100; i++) {
  Users.push(Mock.mock({
    id: Mock.Random.guid(),
    name: Mock.Random.cname(),
    address: Mock.mock('@county(true)'),
    'age|18-60': 1,
    birth: Mock.Random.date(),
    sex: Mock.Random.integer(0, 1)
  }))
}

export {LoginUsers, Users}
