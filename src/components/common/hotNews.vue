<template>
  <el-row>
    <el-col :span="11" class="hot-new" v-for="item in hotWeiboData" :key="item.id">
      <el-col :span="3">
        <p v-if="item.photo !=''" class=""><img :src="item.photo"
                                                                 style="width:60px;height: 60px;margin-left: 10px;"></p>
        <p>
        <div v-if="item.photo === ''" class="photos"></div>
        </p>
      </el-col>
      <el-col :span="21" class="hot_text">
        <p class="title_bt">{{item.author}}</p>
        <p>{{item.content}}</p>
        <p class="hot_time"><span class="hot_times">{{item.pubTime}}</span> <span class="herf"
                                                                                  @click="moreUrl(item.userUrl)">原文链接</span>
        </p>
      </el-col>
      <el-col :span="23" class="hot_text" :offset="1">
        <p class="bottom-text"> 转发:{{item.forwardNum}} 评论: {{item.commentNum}} 点赞: {{item.clickNum}}</p>
      </el-col>
    </el-col>
  </el-row>
</template>
<script>
  export default {
    props: ['hotWeiboData'],
    data () {
      return {}
    },
    methods: {
      moreUrl(userUrl) {
        window.open(userUrl)
      }
    }
  }
</script>

