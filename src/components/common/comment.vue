<template>
  <div id="comment">
    <el-row :gutter="5" class="list">
      <el-card class="box-card" :body-style="{ padding: '10px' }">
        <el-row class="content" id="list">
          <ul class="ul_p">
            <li v-if="articles.length > 0" class="l_style list-box" v-for="item in articles" :id="item.id"
                style="height: 100px;text-align: left">
              <el-row :gutter="1">
                <el-col :span="2" style="margin-right: 15px">
                  <span v-if="item.photo?followed=false:followed=true" :class="{'photo':followed}">{{item.photo}}</span>
                </el-col>
                <el-col :span="20">
                  <a class="a_line" :href="item.targetId" target="_blank"><span class="author_span"
                  >{{item.author}}</span></a>
                </el-col>
                <el-col :span="20" class="time_span">
                  <span><span class="time"></span>{{item.pubTime}}</span>
                  <span><span class="sours">来自</span>：{{item.source}}</span>
                </el-col>
                <el-col :span="20" class="news_m content_span">
                  <span v-html="item.content">{{item.content}}</span>
                </el-col>
              </el-row>
            </li>
          </ul>
        </el-row>
        <list-page v-if="articles" :pager="pager" @data="getPager"></list-page>
      </el-card>
    </el-row>
  </div>
</template>
<script>
  import Paging from '@/components/common/pager'
  var basePath = localStorage.getItem('basePath')
  export default {
    name: 'articles',
    followed: false,
    props: ['articles', 'pager'],
    data () {
      return {
        checkedArray: []
      }
    },
    components: {
      'list-page': Paging
    },
    mounted () {
    },
    methods: {
      getPager (pager) {
        var data = {}
        data.commentPager = pager.data
        this.$emit('data', data)
      },
      showDetail: function (id, type) {
        if (type !== 'comments') {
          window.open(basePath + '/#/detail?id=' + id)
        }
      }
    }
  }

</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  #comment {
    .ul_p {
      list-style: none;
      padding: 0px;
      margin-bottom: 10px;
    }
    .author_span {
      color: #D98E54;
      font-size: 14px;
      font-weight: 700;
    }

    .time_span {
      font-size: 12px;
      color: #808080;
    }

    .content_span {
      font-size: 14px;
    }

    .content span {
      height: 160px;
      line-height: 30px;
    }

    .a_line {
      text-decoration: none;
    }

    .a_line :hover {
      color: #307d74
    }

    .news_m[data-v-31dd6d9e] {
      margin-top: 10px;
      line-height: 20px;
      font-size: 16px;
      color: #000;
      margin-bottom: 0px;
    }

    .photo {
      display: inline-block;
      width: 60px;
      height: 55px !important;
      margin-top: 7px;
      background: url("../../assets/img/default_avatar_male_50.gif") center no-repeat;
      background-size: cover;
    }

    .box-card {
      height: 670px;
      border: none;
    }
    .list-box {
      border-top: none;
      border-right: none;
      border-left: none;
    }

    .el-pagination {
      margin: 0 !important;
    }
  }

</style>
