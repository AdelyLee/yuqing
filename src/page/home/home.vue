<template>
  <el-row class="container">
    <!--头部-->
    <el-col :span="24" class="header" id="header">
      <el-col :span="17">
        <div class="logo">
          <div class="header-logo">
            <img alt="系统图标" :src="systemLogo" width="50px" height="50px"/>
          </div>
          <div class="header-text"> {{headerText}}</div>
        </div>
      </el-col>
      <el-col :span="7">
        <el-col :span="24" class="signOut">
          <div class="userImg"></div>
          <el-dropdown trigger="click" class="drop">
              <span class="el-dropdown-link">
                  <span v-if="username" class="userName">{{username}}</span>
                  <i class="el-icon-caret-bottom el-icon--right dropMenu"></i>
              </span>
            <el-dropdown-menu slot="dropdown" id="exit-menu">
              <el-dropdown-item class="li_item">
                <span class="psd_span" @click="dialogFormVisible = true">更改密码</span>
              </el-dropdown-item>
              <el-dropdown-item class="li_item">
                <span @click="logout" class="exit_a">退出</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <el-select v-model="theme" placeholder="请选择" @change="themeChange" style="width: 100px; margin-left: 10px">
            <el-option v-for="item in themes" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-col>
      </el-col>
    </el-col>

    <!--中间-->
    <el-col :span="24" class="main">
      <!--左侧导航-->
      <aside :class="collapsed?'menu-collapsed':'menu-expanded'" id="nav_menu">
        <!--展开折叠开关-->
        <div class="menu-toggle" @click.prevent="collapse" style="cursor: pointer">
          <i class="iconfont icon-fold" v-show="!collapsed" title="折叠菜单"></i>
          <i class="iconfont icon-fold" v-show="collapsed" title="展开菜单"></i>
        </div>

        <!--菜单展开时的显示情况-->
        <el-menu v-show="!collapsed" default-active="0" @open="handleOpen" @close="handleClose" router
                 :unique-opened="true">
          <template v-for="(item,index) in $router.options.routes" v-if="item.menuShow">
            <el-submenu v-if="!item.leaf" :index="index+''" class="expend-sub-box" id="expend-sub-box">
              <template slot="title"><i :class="item.iconCls"></i>{{item.name}}</template>
              <el-menu-item v-for="term in item.children" :key="term.path" :index="term.path" v-if="term.menuShow">
                {{term.name}}
              </el-menu-item>
            </el-submenu>
            <el-menu-item v-else-if="item.leaf&&item.children&&item.children.length" :index="item.children[0].path"
                          class="el-submenu__title">
              <i :class="item.iconCls"></i>{{item.children[0].name}}
            </el-menu-item>
          </template>
        </el-menu>
        <!--菜单折叠后的显示情况-->
        <ul v-show="collapsed" class="el-menu collapsed" ref="menuCollapsed">
          <template v-for="(item,index) in $router.options.routes" v-if="item.menuShow">
            <li v-if="!item.leaf" :index="index+''" style="position: relative;">
              <div class="el-submenu__title" @mouseover="showMenu(index,true)"
                   @mouseout="showMenu(index,false)"><i :class="item.iconCls" :title="item.name"></i></div>
              <ul class="el-menu submenu" :class="'submenu-hook-'+index" @mouseover="showMenu(index,true)"
                  @mouseout="showMenu(index,false)">
                <li v-for="term in item.children" :key="term.path" v-if="term.menuShow" class="el-menu-item"
                    :class="$route.path==term.path?'is-active':''"
                    @click="$router.push(term.path)">{{term.name}}
                </li>
              </ul>
            </li>
            <li v-else-if="item.leaf&&item.children&&item.children.length" class="el-menu-item el-submenu__title"
                :class="$route.path==item.children[0].path?'is-active':''" @click="$router.push(item.children[0].path)">
              <i :class="item.iconCls" :title="item.name"></i>
            </li>
          </template>
        </ul>
      </aside>
      <!--右侧内容区-->
      <section class="content-container">
        <div class="grid-content bg-purple-light">
          <el-col :span="24" class="content-wrapper">
            <transition name="fade" mode="out-in">
              <router-view></router-view>
            </transition>
          </el-col>
        </div>
      </section>
    </el-col>
  </el-row>
</template>

<script>
  import {getUserConfig, editUserConfig} from '@/service/user'
  import $ from 'jquery'

  export default {
    name: 'home',
    data () {
      return {
        headerText: '',
        username: '',
        systemLogo: '',
        collapsed: false,
        theme: '',
        themes: [{value: 'default', label: 'default'},
          {value: 'blue', label: 'blue'}]
//          {value: 'dark', label: 'dark'}
      }
    },
    mounted () {
      let self = this
      self.setSystem()
      let obj = $('aside .expend-sub-box .el-menu')[0]
      let menuBottomFlow = $('aside .expend-sub-box .el-menu')[1]
      let menuHeight = $('#nav_menu .el-menu')['0'].clientHeight
      let headerHeight = $('#header')['0'].clientHeight
      let toggleHeight = $('.menu-toggle')['0'].clientHeight
      obj.style.maxHeight = window.innerHeight - menuHeight - headerHeight - toggleHeight + 'px'
      menuBottomFlow.style.maxHeight = window.innerHeight - menuHeight - headerHeight - toggleHeight + 'px'
    },
    methods: {
      /**
       * 配置系统设置包括系统名称,图标,主题等
       */
      setSystem() {
        // set the theme
        let self = this
        // get the keywords and the heightLightWords
        if (!localStorage.getItem('systemConfig')) {
          getUserConfig().then(systemConfig => {
            localStorage.setItem('systemConfig', JSON.stringify(systemConfig))
            self.setConfig()
          })
        } else {
          self.setConfig()
        }

        self.username = localStorage.getItem('user')
      },
      setConfig () {
        let self = this
        let {systemName = '', iconUrl = '', style = ''} = JSON.parse(localStorage.getItem('systemConfig'))
        self.headerText = systemName !== null && systemName !== '' ? systemName : '舆情系统'
        iconUrl = iconUrl !== null && iconUrl !== '' ? iconUrl : 'logo'
        style = style !== null && style !== '' ? style : 'default'
        self.systemLogo = require('static/img/logo/' + iconUrl + '.png')
        // 设置系统主题
        self.theme = style
        if (style) {
          require('static/theme/theme-' + style + '.scss')
        } else {
          require('static/theme/theme-default.scss')
        }
      },
      /**
       * 修改主题样式
       * @param theme
       * @param clicked
       * 是否是点击
       */
      themeChange (theme) {
        // 修改主题,当用户重新登录时,主题设置启用
        let self = this
        let params = {style: theme}
        let systemConfig = JSON.parse(localStorage.getItem('systemConfig'))
        if (theme !== systemConfig.style) {
          editUserConfig(params).then(data => {
            self.$confirm('更改主题成功,系统重新登录主题才能启用,是否重新登录?', '提示', {type: 'warning'}).then(() => {
              localStorage.clear()
              self.$router.push('/login')
            }).catch(() => {
              self.$message({
                message: '主题在重新登录后才启用!',
                type: 'info'
              })
            })
          })
        }
      },
      handleOpen () {
        // console.log('handleopen')
      },
      handleClose () {
        // console.log('handleclose')
      },
      // 折叠导航栏
      collapse: function () {
        this.collapsed = !this.collapsed
      },
      showMenu (i, status) {
        this.$refs.menuCollapsed.getElementsByClassName('submenu-hook-' + i)[0].style.display = status ? 'block' : 'none'
      },
      logout () {
        let self = this
        self.$confirm('确认退出吗?', '提示', {type: 'warning'}).then(() => {
          localStorage.clear()
          self.$router.push('/login')
        }).catch(() => {
          self.$message({
            message: '用户取消退出!',
            type: 'info'
          })
        })
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style rel="stylesheet/scss" lang="scss">
  @import "../../../src/style/imgUrl.scss";

  .container {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 100%;
    .header {
      width: 100%;
      height: 60px;
      position: fixed;
      z-index: 2000;
      text-align: left;
      .logo {
        margin-right: 0;
      }
      .header-logo {
        float: left;
        margin: 3px 10px auto 5px;
      }
      .header-text {
        line-height: 60px;
        font-size: 26px;
        font-weight: 600;
        font-family: "微软雅黑", "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
        padding-left: 18px;
      }
      .signOut {
        line-height: 60px;
        text-align: right;
      }
      .userImg {
        width: 30px;
        height: 30px;
        float: left;
      }
      .userName {
        font-size: 16px;
        margin-right: -5px;
      }
      .dropMenu {
        font-size: 1px;
        margin-right: -5px;
      }
    }
    .main {
      display: flex;
      position: absolute;
      top: 60px;
      bottom: 0;
      overflow: hidden;
    }
    aside {
      flex: 0 0 180px;
      width: 180px;
      .el-menu {
        /*height: 100%;*/
        border-radius: 0px;
      }
      .collapsed {
        width: 50px;
        .submenu {
          position: absolute;
          top: 0;
          left: 50px;
          z-index: 9999;
          height: auto;
          display: none;
          /*.el-menu-item {*/
          /*height: 32px;*/
          /*line-height: 32px;*/
          /*font-size: 13px;*/
          /*}*/
        }
      }
    }
    .menu-collapsed { //折叠
      flex: 0 0 50px;
      width: 50px;
    }
    .menu-expanded { //伸展
      flex: 0 0 180px;
      width: 180px;
      .el-menu {
        width: 180px !important;
        /*overflow-y: auto !important;*/
      }
    }
    .menu-toggle {
      text-align: center;
      height: 30px;
      line-height: 30px;
    }
    .el-menu-item, .el-submenu__title {
      font-size: 14px;
      height: 40px;
      line-height: 35px;
    }
    .expend-sub-box {
      .el-menu {
        overflow-y: auto;
        .el-menu-item {
          /*height: 28px;*/
          /*line-height: 28px;*/
          /*font-size: 12px;*/
          padding-left: 60px !important;
        }
      }

    }
    .el-submenu .el-menu-item {
      /*padding: 0px 0px;*/
      font-size: 10px !important;
      line-height: 40px;
      text-align: left;
      min-width: 100%;
    }
    .content-container {
      flex: 1;
      overflow-y: auto;
      padding: 10px;
      .content-wrapper {
        box-sizing: border-box;
      }
    }
  }

</style>
