<template>
  <div id="article">
    <el-card class="box-card" :body-style="{ padding: '10px' }">
      <el-row :gutter="15">
        <div class="words" v-for="item in wordData">
          <div class="text-list"><li>{{item.word}}</li></div>
          <div class="butt">
            <el-button-group>
              <el-button type="primary" class="editWord" icon="edit" @click="editWords(item)"></el-button>
              <el-button type="primary" class="editWord" icon="delete" @click="deleteWords(item)"></el-button>
            </el-button-group>
          </div>
        </div>
      </el-row>
    </el-card>
  </div>
</template>

<script>
  export default {
    props: ['wordData'],
    data () {
      return {}
    },
    mounted () {

    },
    methods: {
      editWords(search) {
        var data = {}
        data.action = 'editWords'
        data.word = search
        this.$emit('data', data)
      },
      deleteWords(search) {
        var data = {}
        data.action = 'deleteWords'
        data.word = search
        this.$emit('data', data)
      }
    }

  }
</script>

