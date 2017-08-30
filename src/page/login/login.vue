<template>
  <div id="login" class="login" @keydown="keyUpLogin($event)" style="overflow-y:hidden;">
    <div class="row">
      <div class="left-text">
        <div class="text-first">
          <p>7*24h全网监测</p>
          <span class="line-top"></span>
          <span class="line-bottom"></span>
        </div>

        <div class="text-two">
          <p>多维度舆情分析</p>
          <span class="line-top"></span>
          <span class="line-bottom"></span>
        </div>
        <div class="text-three">
          <p>多种方式,及时预警</p>
          <span class="line-top"></span>
          <span class="line-bottom"></span>
        </div>
        <div class="text-four">
          <p>定制化报告生成</p>
        </div>
      </div>

      <div class="include">
        <span class="title">舆情系统登录</span>
        <el-card class="box-card" id="login-form">
          <div slot="header" class="clearfix">
            <span class="user-login">用户登录</span>
          </div>
          <div class="card-body">
            <el-form :model="loginForm" :rules="rules" ref="loginForm">
              <el-form-item prop="username">
                <span class="icon-user"></span>
                <el-input v-model="loginForm.username" placeholder="请输入用户名"></el-input>
              </el-form-item>
              <el-form-item prop="password">
                <span class="icon-psd"></span>
                <el-input type="password" v-model="loginForm.password" placeholder="请输入密码"></el-input>
              </el-form-item>
              <el-button type="primary" :loading="loginLoading" @click="loginSubmit(loginForm)" style="width: 100%">
                登录
              </el-button>
            </el-form>
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  import {accountLogin, getUserConfig} from '@/service/user'
  import {utils} from '@/utils/utils'
  import {getKeywords} from '@/service/config'
  export default {
    name: 'hello',
    data () {
      return {
        loginLoading: false,
        loginForm: {username: '', password: ''},
        rules: {
          username: [{required: true, message: '请输入用户名', trigger: 'blur'}],
          password: [{required: true, message: '请输入密码', trigger: 'blur'}]
        }
      }
    },
    mounted () {
      // 设置login背景的高度
      let obj = document.getElementById('login')
      obj.style.height = window.innerHeight + 'px'
    },
    methods: {

      loginSubmit (user) {
        // 如果验证成功调用
        this.$refs.loginForm.validate((valid) => {
          if (valid) {
            let self = this
            self.loginLoading = true
            let loginParams = {username: this.loginForm.username, password: this.loginForm.password}
            accountLogin(loginParams).then(data => {
              if (typeof (Storage) !== 'undefined') {
                self.loginLoading = false
                let {message, success, user, token} = data
                if (!success) {
                  self.$message({
                    message: message,
                    type: 'error'
                  })
                } else {
                  let basePath = utils.getBasePath()
                  localStorage.setItem('basePath', basePath)
                  localStorage.setItem('access-user', token)
                  axios.defaults.headers.common['Authorization'] = token
                  localStorage.setItem('user', user)
                  getUserConfig().then(systemConfig => {
                    localStorage.setItem('systemConfig', JSON.stringify(systemConfig))
                    // 设置系统主题
                    let theme = systemConfig.style
                    if (theme) {
                      require('static/theme/theme-' + theme + '.scss')
                    } else {
                      require('static/theme/theme-default.scss')
                    }
                  })

                  let baseKeywordsParams = {type: 'BASIC'}
                  let focusKeywordsParams = {type: 'FOCUS'}
                  let leaderKeywordsParams = {type: 'LEADER'}
                  let accidentKeywordsParams = {type: 'LOCAL'}
                  getKeywords(baseKeywordsParams).then(baseKeywords => {
                    localStorage.setItem('baseKeywords', JSON.stringify(baseKeywords))
                    self.$store.state.baseKeywords = baseKeywords
                  }).then(() => {
                    getKeywords(focusKeywordsParams).then(focusKeywords => {
                      localStorage.setItem('focusKeywords', JSON.stringify(focusKeywords))
                      self.$store.state.focusKeywords = focusKeywords
                    })
                  }).then(() => {
                    getKeywords(leaderKeywordsParams).then(leaderKeywords => {
                      localStorage.setItem('leaderKeywords', JSON.stringify(leaderKeywords))
                      self.$store.state.leaderKeywords = leaderKeywords
                    })
                  }).then(() => {
                    getKeywords(accidentKeywordsParams).then(accidentKeywords => {
                      localStorage.setItem('accidentKeywords', JSON.stringify(accidentKeywords))
                      self.$store.state.accidentKeywords = accidentKeywords
                    })
                  }).then(() => {
                    if (!self.$store.state.lastViewedPage) {
                      this.$router.push({path: '/'})
                    } else {
                      this.$router.push({path: '/' + self.$store.state.lastViewedPage})
                    }
                  })
                }
              } else {
                alert('抱歉！您的浏览器不支持当前系统，请更换浏览器．')
              }
            }).catch(() => {
              self.$confirm('用户名或密码错误', '错误', {type: 'error'})
            })
          }
        })
      },
      keyUpLogin (ev) {
        var self = this
        if (ev.keyCode === 13) {
          self.loginSubmit(self.loginForm)
        }
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style rel="stylesheet/scss" lang="scss">
  #login {
    padding: 0;
    margin: 0;
    width: 100%;
    height: 100%;
    background: url(../../assets/img/login_bj.jpg) center;
    background-size: 100% 100%;
    .left-text {
      width: 50%;
      height: 500px;
      .text-first, .text-two, .text-three, .text-four {
        height: 100px;
        width: 50%;
        p {
          text-align: left;
          color: #2ABBFD;
          height: 50px;
          font-size: 36px;
          font-weight: 700;
          opacity: 0.8;
          margin: 10px 0 0 0 !important;
        }
        .line-top, .line-bottom {
          display: block;
          height: 2px;
          background-color: #2ABBFD;
          opacity: 0.8;
        }
        .line-top {
          width: 34%;
        }
        .line-bottom {
          width: 45%;
        }
      }
      .text-first {
        position: absolute;
        top: 160px;
        left: 80px;
        p {
          padding: 0 0 0 130px;
        }
        .line-top {
          position: absolute;
          top: 65px;
          left: 280px;
        }
        .line-bottom {
          position: absolute;
          top: 75px;
          left: 224px;
        }
      }
      .text-two {
        position: absolute;
        top: 240px;
        left: 225px;
        p {
          padding: 0 0 0 160px;
        }
        .line-top {
          position: absolute;
          top: 65px;
          left: 280px;
        }
        .line-bottom {
          position: absolute;
          top: 75px;
          left: 224px;
        }
      }
      .text-three {
        position: absolute;
        top: 320px;
        left: 355px;
        p {
          padding: 0 0 0 160px;
        }
        .line-top {
          position: absolute;
          top: 65px;
          left: 280px;
        }
        .line-bottom {
          position: absolute;
          top: 75px;
          left: 224px;
        }
      }
      .text-four {
        position: absolute;
        top: 400px;
        left: 495px;
        p {
          padding: 0 0 0 160px;
        }
      }
    }
    .include {
      display: inline-block;
      color: #fff;
      position: absolute;
      right: 260px;
      top: 200px;
      .title {
        font-size: 30px;
        color: #26BCF9;
      }
    }
    #login-form {
      height: 350px;
      width: 340px;
      box-shadow: 5px 5px 12px #8F8F90;
      top: 265px;
      right: 220px;
      background-color: #fff;
      .user-login {
        line-height: 36px;
        font-size: 22px;
        font-weight: 700;
        color: #26BCF9;
        display: inline-block;
        margin-top: 10px;
      }
      .card-body {
        margin-top: 10px;
      }
      .icon-user, .icon-psd {
        display: inline-block;
        width: 34px;
        height: 34px;
        vertical-align: top;
        margin-top: 9px;
        position: absolute;
        left: 0;
      }
      .icon-user {
        background: url(../../assets/img/user_1.png) no-repeat center;
        background-size: cover;
        z-index: 1;
      }
      .icon-psd {
        background: url(../../assets/img/psw.png) no-repeat center;
        background-size: cover;
        z-index: 1;
      }
      .el-form {
        top: 10px;
      }
      .el-form-item {
        margin-bottom: 0 !important;
      }
      .el-form-item__error {
        position: absolute;
        top: 72% !important;
        left: 0;
      }
      .el-input {
        width: 300px !important;
        height: 45px;
        margin-bottom: 25px;
      }
      .el-input__inner {
        height: 45px !important;
        border: 1px solid #ccc !important;
        border-radius: 0 !important;
        box-sizing: border-box;
        padding: 0 0 0 32px;
        color: #000 !important;
        background-color: transparent;
      }
      .el-button {
        height: 45px;
        width: 300px !important;
        border-radius: 0px !important;
        margin-top: 20px;
        span {
          font-size: 22px;
        }
      }
      .el-card__header {
        border: none !important;
        background: #fff !important;
        padding: 18px 20px;
      }
    }
    @media screen and (min-width: 1360px) and (max-width: 1366px) {
      .left-text {
        width: 50%;
        height: 500px;
        .text-first, .text-two, .text-three, .text-four {
          height: 70px;
          width: 50%;
          p {
            text-align: left;
            color: #2ABBFD;
            height: 50px;
            font-size: 30px;
            font-weight: 700;
            margin: 10px 0 0 0 !important;
          }
          .line-top, .line-bottom {
            display: block;
            height: 2px;
            background-color: #2ABBFD;
          }
          .line-top {
            width: 34%;
          }
          .line-bottom {
            width: 45%;
          }
        }
        .text-first {
          position: absolute;
          top: 120px;
          left: 70px;
          p {
            padding: 0 0 0 110px;
          }
          .line-top {
            position: absolute;
            top: 55px;
            left: 190px;
          }
          .line-bottom {
            position: absolute;
            top: 65px;
            left: 134px;
          }
        }
        .text-two {
          position: absolute;
          top: 180px;
          left: 160px;
          p {
            padding: 0 0 0 160px;
          }
          .line-top {
            position: absolute;
            top: 55px;
            left: 200px;
          }
          .line-bottom {
            position: absolute;
            top: 65px;
            left: 150px;
          }
        }
        .text-three {
          position: absolute;
          top: 240px;
          left: 260px;
          p {
            padding: 0 0 0 160px;
          }
          .line-top {
            position: absolute;
            top: 55px;
            left: 250px;
          }
          .line-bottom {
            position: absolute;
            top: 65px;
            left: 184px;
          }
        }
        .text-four {
          position: absolute;
          top: 300px;
          left: 390px;
          p {
            padding: 0 0 0 160px;
          }
        }
      }
      .include {
        display: inline-block;
        color: #fff;
        position: absolute;
        right: 249px;
        top: 130px;
        .title {
          font-size: 30px;
          color: #26BCF9;
        }
      }
      #login-form {
        position: absolute;
        top: 55px;
        right: -77px;
      }
      input:-webkit-autofill, textarea:-webkit-autofill, select:-webkit-autofill {
        background-color: #fff !important;
      }

    }
  }

</style>
