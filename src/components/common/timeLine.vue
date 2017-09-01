<template>
  <div class="timeLine">
    <div class="timeline animated">
      <div class="timeline-row" v-for="(item,i) in timeData" :key="i">
        <div class="cd-timeline-img cd-location">
          <span class="img"></span>
        </div>
        <div class="panel timeline-content" @click="getSimilar(item.titleSimHash)">
          <div class="panel-body">
            <div class="timeline-time">{{item.pubTime}}</div>
            <h2 class="title">{{item.title}}
            </h2>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import $ from 'jquery'
  export default {
    props: ['timeData'],
    data () {
      return {}
    },
    mounted () {
      this.getAnimate()
    },
    methods: {
      getSimilar(similar) {
        let data = {}
        data.action = 'clickSimilarArticleList'
        data.searchKv = [{'key': 'titleSimHash', 'value': similar}]
        this.$emit('data', data)
      },
      getAnimate () {
        (function () {
          $('.mybox').ready(function () {
            const timelineAnimate = function (elem) {
              return $('.timeline.animated .timeline-row').each(function (i) {
//                let bottomofobject
//                let bottomofwindow
//                bottomofobject = $(this).position().top + $(this).outerHeight()
//                bottomofwindow = $('.mybox').scrollTop() + $('.mybox').height()
//                if (bottomofobject > bottomofwindow) {
//                }
                return $(this).addClass('active')
              })
            }
            timelineAnimate()
            $('.mybox').scroll(function () {
              return timelineAnimate()
            })
          })
        }).call(this)
      }
    }
  }
</script>
