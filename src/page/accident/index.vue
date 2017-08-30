<template>
  <div id="accident">
    <div class="card-body">
      <el-row :gutter="15">
        <el-form :inline="true" :model="accidentSearchCondition">
          <el-form-item label="地区:">
            <el-select v-model="accidentSearchCondition.area" placeholder="地区">
              <el-option label="全国" value="all"></el-option>
              <el-option v-for="province in provinces" :label="province" :value="province" :key="province">
                {{province}}
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="煤矿类型:">
            <el-select v-model="accidentSearchCondition.type" placeholder="煤矿类型">
              <el-option label="全部" value="all"></el-option>
              <el-option v-for="subType in types" :label="subType" :value="subType" :key="subType">
                {{subType}}
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="时间类型:">
            <el-select v-model="accidentSearchCondition.timeType" placeholder="时间类型">
              <el-option label="年度" value="year"></el-option>
              <el-option label="月份" value="month"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="accidentSearchCondition.timeType==='year'" label="年份:">
            <el-date-picker v-model="accidentSearchCondition.year" align="right" type="year" placeholder="选择年份"
                            :picker-options="pickerOptionsYear">
            </el-date-picker>
          </el-form-item>
          <el-form-item v-if="accidentSearchCondition.timeType==='month'" label="月份:">
            <el-date-picker v-model="accidentSearchCondition.month" type="month" format="第 MM 月"
                            placeholder="选择月份" :picker-options="pickerOptionsMonth">

            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="accidentSearchSubmit(accidentSearchCondition)">查询</el-button>
          </el-form-item>
        </el-form>
      </el-row>
      <el-row :gutter="15">
        <el-col :span="12">
          <el-card class="box-card" :body-style="{ padding: '0px' }">
            <div slot="header" class="chart-header">
              <span class="iconfont icon-monthAccidnet"></span><span
              class="chart-text">{{monthOrDayHighAccidentChart}}</span>
            </div>
            <el-col v-loading="monthOrDayHighAccidentLoading">
              <line-bar-chart :chartConfig="monthOrDayHighAccidentConfig"></line-bar-chart>
            </el-col>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card class="box-card" :body-style="{ padding: '0px' }">
            <div slot="header" class="chart-header">
              <span class="iconfont icon-weekAccident"></span><span class="chart-text">星期高发事故图</span>
            </div>
            <el-col v-loading="weeklyHighAccidentLoading">
              <line-bar-chart :chartConfig="weeklyHighAccidentConfig"></line-bar-chart>
            </el-col>
          </el-card>
        </el-col>
      </el-row>
      <el-row :gutter="15">
        <el-col :span="8">
          <el-card class="box-card" :body-style="{ padding: '0px' }">
            <div slot="header" class="chart-header">
              <span class="iconfont icon-industryAccident"></span><span class="chart-text">行业领域事故图</span>
            </div>
            <el-col v-loading="industryHighAccidentLoading">
              <pie-chart :chartConfig="industryHighAccidentConfig"></pie-chart>
            </el-col>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card class="box-card" :body-style="{ padding: '0px' }">
            <div slot="header" class="chart-header">
              <!--<div class="chart-area"></div>-->
              <span class="iconfont icon-areaAccident"></span><span class="chart-text">地区事故分析图</span>
            </div>
            <el-col v-loading="areaHighAccidentLoading">
              <line-bar-chart :chartConfig="areaHighAccidentConfig"></line-bar-chart>
            </el-col>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card class="box-card" :body-style="{ padding: '0px' }">
            <div slot="header" class="chart-header">
              <!--<div class="chart-accident-level"></div>-->
              <span class="iconfont icon-accidentLevel"></span><span class="chart-text">事故级别图</span>
            </div>
            <el-col v-loading="levelAccidentLoading">
              <pie-chart :chartConfig="levelAccidentConfig"></pie-chart>
            </el-col>
          </el-card>
        </el-col>
      </el-row>
      <el-col v-loading="accidentsLoading">
        <div class="subject-gl">
          <span class="iconfont icon-seriousAccident"
                style="float:left;width:28px;height: 25px;margin-left: 22px;color:#fff;"></span><span>{{accidentTitle}}</span>
          <el-row>
            <div class="border-left-top"></div>
            <div class="border-right-top"></div>
          </el-row>
          <el-row>
            <div class="border-left-bottom"></div>
            <div class="border-right-bottom"></div>
          </el-row>
        </div>
        <!--<div class="accident-title">{{accidentTitle}}</div>-->
        <div style="margin-top: 60px">
          <ul v-if="accidentData.length===0" class="article-list">暂无数据</ul>
          <ul class="article-list">
            <li class="zdsg-list" v-for="(item, index) in accidentData">
              <el-row class="lists">
                <div class="border-left-top"></div>
                <div class="border-right-top"></div>
              </el-row>
              <el-row>
                <div class="border-left-bottom"></div>
                <div class="border-right-bottom"></div>
              </el-row>
              <el-row :gutter="15" style="padding: 20px 20px">
                <el-col :span="24" class="tit">
                  <el-col :span="1"><span class="small-article-image accident-logo"></span></el-col>
                  <el-col :span="12"><span v-html="item.companyName" class="title">{{item.companyName}}</span></el-col>
                  <el-col :span="5">死亡人数：<span class="deas">{{item.deathnumber}}人</span></el-col>
                  <el-col :span="6"><span>时间：{{item.atime}}</span></el-col>
                </el-col>
                <el-col :span="24" v-if="contentAll === ''" class="cont"><div class="main">{{content = item.content && item.content.length < 130 ? item.content :
                  item.content.substring(0, 130)}}<span class="content-all" v-if="item.content.length>130" @click="part(item,index)">...</span></div>
                </el-col>
                <el-col :span="24" v-if="contentAll.length > 0" class="cont">
                  <div class="main">{{item.content}}
                  </div>
                </el-col>
              </el-row>
              <div class='tipTitle hover-title'>{{item.content}}</div>
            </li>
          </ul>
          <list-page :pager="pager" @data="getData"></list-page>
        </div>

      </el-col>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import Pager from '@/components/common/pager'
  import pieChart from '@/components/common/charts/pie'
  import lineBarChart from '@/components/common/charts/line-bar'
  import {pieChartOption} from '@/components/common/options/pie-chart'
  import {barChartOption} from '@/components/common/options/bar-chart'
  import {getAccidents} from '@/service/accident'
  import {dateUtil} from '@/utils/dateUtil'
  import {typeUtil} from '@/utils/typeUtil'

  import $ from 'jquery'

  export default {
    name: 'accident',
    data () {
      return {
        monthOrDayHighAccidentLoading: true,
        weeklyHighAccidentLoading: true,
        industryHighAccidentLoading: true,
        areaHighAccidentLoading: true,
        levelAccidentLoading: true,
        accidentsLoading: true,
        monthOrDayHighAccidentChart: '月份高发事故图',
        accidentSearchCondition: {
          startTime: '',
          endTime: '',
          area: 'all',
          type: 'all',
          timeType: '',
          year: '',
          month: ''
        },
        provinces: ['北京', '天津', '上海', '重庆', '河北', '河南', '云南', '辽宁', '黑龙江', '湖南', '安徽', '山东', '新疆', '江苏', '浙江', '江西', '湖北', '广西', '甘肃', '山西', '内蒙古', '陕西', '吉林', '福建', '贵州', '广东', '青海', '西藏', '四川', '宁夏', '海南'],
        types: ['瓦斯爆炸', '冒顶片帮', '机械伤害', '车辆伤害', '触电', '中毒和窒息', '淹溺', '火灾', '其他伤害'],
        pickerOptionsYear: {
          disabledDate(time) {
            return time.getTime() > Date.now() - 8.64e7
          }
        },
        pickerOptionsMonth: {
          disabledDate(time) {
            return time.getTime() > Date.now() - 8.64e7
          }
        },
        queryParam: {},
        monthOrDayHighAccidentConfig: {
          chartId: 'month-day-high-accident-chart',
          option: {},
          events: {
            'click': function (param) {
            }
          }
        },
        weeklyHighAccidentConfig: {
          chartId: 'weekly-high-accident-chart',
          option: {},
          events: {
            'click': function (param) {
            }
          }
        },
        industryHighAccidentConfig: {
          chartId: 'industry-high-accident-chart',
          option: {},
          events: {
            'click': function (param) {
            }
          }
        },
        areaHighAccidentConfig: {
          chartId: 'area-high-accident-chart',
          option: {},
          events: {
            'click': function (param) {
            }
          }
        },
        levelAccidentConfig: {
          chartId: 'level-accident-chart',
          option: {},
          events: {
            'click': function (param) {
            }
          }
        },
        accidentTitle: '重大以上事故',
        accidentData: [],
        pager: {
          pageSize: 3,
          currentPage: 1,
          totalElements: 1
        },
        title: '',
        contentAll: ''
      }
    },
    components: {
      'pie-chart': pieChart,
      'line-bar-chart': lineBarChart,
      'list-page': Pager
    },
    created () {
      // 初始化查询条件
      let self = this
      self.initAccidentCondition()
    },
    mounted () {
      this.renderPageData()
    },
    methods: {
      part: function (item, index) {
        let self = this
        $('.article-list').find('li').eq(index).css('height', '220px')
        $('.article-list').find('li').eq(index).find('.main').css('height', '170px')
        $('.article-list').find('li').eq(index).find('.border-left-bottom').css('top', '184px')
        $('.article-list').find('li').eq(index).find('.border-right-bottom').css('top', '184px')
        self.contentAll = item.content
      },
      /**
       * 初始化事故查询条件
       */
      initAccidentCondition () {
        let self = this
        self.accidentSearchCondition.timeType = 'year'
        let date = new Date()
        self.accidentSearchCondition.year = dateUtil.parseDate(date.getFullYear() + '-01-01')
        self.accidentSearchCondition.month = dateUtil.parseDate(date.getFullYear() + date.getMonth() + 1 + '-01')
      },
      /**
       * 渲染页面数据
       */
      renderPageData () {
        var self = this

        // 获取查询条件
        self.queryParam = self.getParam()
        self.getMonthOrDayHighAccident()
        self.getWeeklyHighAccident()
        self.getIndustryHighAccident()
        self.getAreaHighAccident()
        self.getLevelAccident()
        self.getSeriousAccidentList()
      },
      accidentSearchSubmit () {
        this.renderPageData()
      },
      /**
       * 根据条件获取月份或天事故高发图数据
       */
      getMonthOrDayHighAccident () {
        let self = this
        let param = {}
        $.extend(true, param, self.queryParam)
        param.sortBy = [{k: 'times', v: '-1'}, {k: 'deathnumber', v: '-1'}]
        if (self.accidentSearchCondition.timeType === 'month') {
          param.groupBy.push({k: 'adate', v: 'adate', o: 'dayOfMonth', t: 'date'})
        }
        if (self.accidentSearchCondition.timeType === 'year') {
          param.groupBy.push({k: 'adate', v: 'adate', o: 'month', t: 'date'})
        }
        getAccidents(param).then(data => {
          self.monthOrDayHighAccidentLoading = false
          let renderData = []
          let deathItem = {name: '死亡人数', data: []}
          let timesItem = {name: '发生次数', data: []}
          if (data.length > 0) {
            data.forEach(function (item) {
              let deathObj = {}
              let timesObj = {}
              if (self.accidentSearchCondition.timeType === 'year') {
                deathObj.name = item._id.adate.month + '月'
                timesObj.name = item._id.adate.month + '月'
              } else if (self.accidentSearchCondition.timeType === 'month') {
                deathObj.name = item._id.adate.dayOfMonth + '日'
                timesObj.name = item._id.adate.dayOfMonth + '日'
              }
              deathObj.value = item.deathnumber
              timesObj.value = item.times
              deathItem.data.push(deathObj)
              timesItem.data.push(timesObj)
            })
          }
          renderData.push(deathItem)
          renderData.push(timesItem)
          let chartConfig = {seriesItemColor: false}
          self.monthOrDayHighAccidentConfig.option = barChartOption.getOption(renderData, chartConfig)
        }).catch(error => {
          self.$confirm(error.message, '错误', {type: 'error'})
        })
      },
      /**
       * 根据条件获取星期事故高发图数据
       */
      getWeeklyHighAccident () {
        let self = this
        let param = {}
        $.extend(true, param, self.queryParam)
        param.sortBy = [{k: 'times', v: '-1'}, {k: 'deathnumber', v: '-1'}]
        param.groupBy.push({k: 'adate', v: 'adate', o: 'dayOfWeek', t: 'date'})
        getAccidents(param).then(data => {
          self.weeklyHighAccidentLoading = false
          let renderData = []
          let deathItem = {name: '死亡人数', data: []}
          let timesItem = {name: '发生次数', data: []}
          if (data.length > 0) {
            data.forEach(function (item) {
              let deathObj = {}
              let timesObj = {}
              deathObj.name = typeUtil.unCodeWeekly(item._id.adate.dayOfWeek.toString())
              timesObj.name = deathObj.name
              deathObj.value = item.deathnumber
              timesObj.value = item.times
              deathItem.data.push(deathObj)
              timesItem.data.push(timesObj)
            })
          }
          renderData.push(deathItem)
          renderData.push(timesItem)
          let chartConfig = {seriesItemColor: false}
          self.weeklyHighAccidentConfig.option = barChartOption.getOption(renderData, chartConfig)
        }).catch(error => {
          self.$confirm(error.message, '错误', {type: 'error'})
        })
      },
      /**
       * 根据条件获取行业领域事故占比数据
       */
      getIndustryHighAccident () {
        let self = this
        let param = {}
        $.extend(true, param, self.queryParam)
        param.sortBy = [{k: 'times', v: '-1'}, {k: 'deathnumber', v: '-1'}]
        param.groupBy.push({k: 'atype2', v: 'atype2'})
        getAccidents(param).then(data => {
          self.industryHighAccidentLoading = false
          let renderData = []
          let deathItem = {name: '死亡人数', radius: [0, '30%'], data: [], label: {normal: {show: false}}}
          let timesItem = {name: '发生次数', radius: ['45%', '65%'], data: []}
          if (data.length > 0) {
            data.forEach(function (item) {
              let deathObj = {}
              let timesObj = {}
              deathObj.name = item._id.atype2
              timesObj.name = deathObj.name
              deathObj.value = item.deathnumber
              timesObj.value = item.times
              deathItem.data.push(deathObj)
              timesItem.data.push(timesObj)
            })
          }
          renderData.push(deathItem)
          renderData.push(timesItem)
          let chartConfig = {legendData: {x: 'left', orient: 'vertical'}, seriesData: renderData}
          self.industryHighAccidentConfig.option = pieChartOption.getOption(renderData, chartConfig)
        }).catch(error => {
          self.$confirm(error.message, '错误', {type: 'error'})
        })
      },
      /**
       * 根据条件获取地区事故分析图数据
       */
      getAreaHighAccident () {
        let self = this
        let param = {}
        $.extend(true, param, self.queryParam)
        param.sortBy = [{k: 'times', v: '-1'}, {k: 'deathnumber', v: '-1'}]
        param.groupBy.push({k: 'province', v: 'province'})
        getAccidents(param).then(data => {
          self.areaHighAccidentLoading = false
          let renderData = []
          let deathItem = {name: '死亡人数', data: [], stack: '事故'}
          let timesItem = {name: '发生次数', data: [], stack: '事故'}
          if (data.length > 0) {
            data.forEach(function (item) {
              let deathObj = {}
              let timesObj = {}
              deathObj.name = item._id.province
              timesObj.name = item._id.province
              deathObj.value = item.deathnumber
              timesObj.value = item.times
              deathItem.data.push(deathObj)
              timesItem.data.push(timesObj)
            })
          }
          renderData.push(deathItem)
          renderData.push(timesItem)
          let chartConfig = {xAxisData: {axisLabel: {rotate: 45}}, seriesItemColor: false, seriesData: renderData}
          self.areaHighAccidentConfig.option = barChartOption.getOption(renderData, chartConfig)
        }).catch(error => {
          self.$confirm(error.message, '错误', {type: 'error'})
        })
      },
      /**
       * 根据条件获取事故级别占比数据
       */
      getLevelAccident () {
        let self = this
        let param = {}
        $.extend(true, param, self.queryParam)
        param.sortBy = [{k: 'times', v: '-1'}, {k: 'deathnumber', v: '-1'}]
        param.groupBy.push({k: 'sgjb', v: 'sgjb'})
        getAccidents(param).then(data => {
          self.levelAccidentLoading = false
          let renderData = []
          let deathItem = {name: '死亡人数', radius: [0, '30%'], data: [], label: {normal: {show: false}}}
          let timesItem = {name: '发生次数', radius: ['45%', '65%'], data: []}
          if (data.length > 0) {
            data.forEach(function (item) {
              let deathObj = {}
              let timesObj = {}
              if (item._id.sgjb !== undefined && item._id.sgjb !== '') {
                deathObj.name = item._id.sgjb
                timesObj.name = deathObj.name
                deathObj.value = item.deathnumber
                timesObj.value = item.times
                deathItem.data.push(deathObj)
                timesItem.data.push(timesObj)
              }
            })
          }
          renderData.push(deathItem)
          renderData.push(timesItem)
          let chartConfig = {legendData: {x: 'left', orient: 'vertical'}, seriesData: renderData}
          self.levelAccidentConfig.option = pieChartOption.getOption(renderData, chartConfig)
        }).catch(error => {
          self.$confirm(error.message, '错误', {type: 'error'})
        })
      },
      /**
       * 根据条件获取重大以上事故数据
       */
      getSeriousAccidentList () {
        let self = this
        self.accidentsLoading = true
        let param = {}
        $.extend(true, param, self.queryParam)
        param.sortBy = [{k: 'times', v: '-1'}, {k: 'deathnumber', v: '-1'}]
        param.limit = self.pager.pageSize
        param.skip = (self.pager.currentPage - 1) * self.pager.pageSize
        param.where.push({k: 'sgjb', v: '重大事故,特大事故', o: 'in'})
        delete param.select
        getAccidents(param).then(data => {
          self.accidentsLoading = false
          data.content.forEach(function (item) {
            item.atime = new Date(parseInt(item.atime) * 1000).toLocaleString()
          })
          self.accidentData = data.content
          self.pager.totalElements = data.total
        }).catch(error => {
          self.$confirm(error.message, '错误', {type: 'error'})
        })
      },
      /**
       * 获取子组件的参数，进行相关的操作处理
       * @param data
       */
      getData (data) {
        let self = this
        switch (data.action) {
          case 'clickCommonPager':
            self.pager = data.data
            self.getSeriousAccidentList()
            self.contentAll = ''
            break
        }
      },
      /**
       * 获取查询条件，封装查询参数
       */
      getParam () {
        let self = this
        if (self.accidentSearchCondition.timeType === 'year') {
          let date = self.accidentSearchCondition.year

          self.accidentSearchCondition.startTime = date.getTime() / 1000
          self.accidentSearchCondition.endTime = dateUtil.addDate(dateUtil.addDate(date, 'y', 1), 's', -1) / 1000
        } else if (self.accidentSearchCondition.timeType === 'month') {
          let date = self.accidentSearchCondition.month

          self.accidentSearchCondition.startTime = date.getTime() / 1000
          self.accidentSearchCondition.endTime = dateUtil.addDate(dateUtil.addDate(date, 'M', 1), 's', -1) / 1000
        }
        let {startTime, endTime} = self.accidentSearchCondition
        let param = {
          from: 'acc',
          select: [{k: 'deathnumber', v: 'sum'}, {k: 'times', v: 'count'}],
          where: [{k: 'atype', v: '煤矿'}, {k: 'atime', v: startTime, o: '>='}, {k: 'atime', v: endTime, o: '<='}],
          groupBy: []
        }

        if (self.accidentSearchCondition.area !== 'all') {
          param.where.push({k: 'province', v: self.accidentSearchCondition.area})
        }
        if (self.accidentSearchCondition.type !== 'all') {
          param.where.push({k: 'atype2', v: self.accidentSearchCondition.type})
        }

        return param
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss">
  #accident {
    .el-form {
      padding-left: 30px;
      text-align: left;
    }
    .el-form-item {
      width: 250px;
      .el-form-item__content {
        width: 170px;
      }
    }
    .border-left-top {
      float: left;
      width: 4%;
      height: 10%;
      margin-top: -50px;
      border-top: 1px solid #fff;
      border-left: 1px solid #fff;

    }
    .border-left-left {
      float: left;
      width: 1%;
      height: 30%;
      margin-top: -50px;
      border-left: 1px solid #fff;
    }
    .border-right-top {
      float: right;
      width: 4%;
      height: 10%;
      margin-top: -50px;
      border-top: 1px solid #fff;
      border-right: 1px solid #fff;

    }
    .border-left-bottom {
      float: left;
      width: 4%;
      height: 10%;
      border-bottom: 1px solid #fff;
      border-left: 1px solid #fff;

    }
    .border-right-bottom {
      float: right;
      width: 4%;
      height: 10%;
      border-bottom: 1px solid #fff;
      border-right: 1px solid #fff;
    }
    .lists {
      position: relative;
    }
    .article-list {
      padding-top: 10px;
      list-style: none;
      position: relative;
      padding-left: 0px;
      width: 95%;
      margin: 0 auto;
      .zdsg-list {
        width: 95%;
        height: 150px;
        margin: 0 auto;
        line-height: 40px;
        margin-top: 20px;
        text-align: left;
        padding: 0 10px 0 10px;
      }
      .border-left-top {
        width: 35px;
        height: 35px;
        position: absolute;
        top: 47px;
        left: -15px;
      }
      .border-right-top {
        width: 35px;
        height: 35px;
        position: absolute;
        top: 47px;
        right: -15px;
      }
      .border-left-bottom {
        width: 35px;
        height: 35px;
        position: absolute;
        top: 114px;
        left: -15px;

      }
      .border-right-bottom {
        width: 35px;
        height: 35px;
        position: absolute;
        top: 114px;
        right: -15px;
      }
    }
    .tit {
      padding-left: 0px !important;
    }
    .tit .title {
      color: #47B7E5;
      font-size: 18px;
      font-weight: 700;

    }
    .tit .deas {
      color: #F51C3B;
      font-weight: 700;
    }
    .subject-gl {
      width: 180px;
      color: #fff;
    }
    .img {
      display: inline-block;
      width: 28px;
      height: 25px;
      color: #fff;
      background-size: contain;
    }
    .hover-title{
      width: 500px;
      min-width: 500px;
      color: rgb(0, 0, 0);
      background-color: rgb(204, 204, 204);
      position: absolute;
      padding: 10px 10px;
      z-index: 9999;
      display: none;
    }
    .main{
      width: 98%;
      min-height: 100px;
    }
    .content-all {
      position: absolute;
      right: 17%;
      bottom: 25%;
    }
  }
</style>
