<template>
  <div class="pinyin-contact">
    <el-row :gutter="15" class="screen">
      <el-button @click="pinYindata('A')">A</el-button>
      <el-button @click="pinYindata('B')">B</el-button>
      <el-button @click="pinYindata('C')">C</el-button>
      <el-button @click="pinYindata('D')">D</el-button>
      <el-button @click="pinYindata('E')">E</el-button>
      <el-button @click="pinYindata('F')">F</el-button>
      <el-button @click="pinYindata('G')">G</el-button>
      <el-button @click="pinYindata('H')">H</el-button>
      <el-button @click="pinYindata('I')">I</el-button>
      <el-button @click="pinYindata('J')">J</el-button>
      <el-button @click="pinYindata('K')">K</el-button>
      <el-button @click="pinYindata('L')">L</el-button>
      <el-button @click="pinYindata('M')">M</el-button>
      <el-button @click="pinYindata('N')">N</el-button>
      <el-button @click="pinYindata('O')">O</el-button>
      <el-button @click="pinYindata('P')">P</el-button>
      <el-button @click="pinYindata('Q')">Q</el-button>
      <el-button @click="pinYindata('R')">R</el-button>
      <el-button @click="pinYindata('S')">S</el-button>
      <el-button @click="pinYindata('T')">T</el-button>
      <el-button @click="pinYindata('U')">U</el-button>
      <el-button @click="pinYindata('V')">V</el-button>
      <el-button @click="pinYindata('W')">W</el-button>
      <el-button @click="pinYindata('X')">X</el-button>
      <el-button @click="pinYindata('Y')">Y</el-button>
      <el-button @click="pinYindata('Z')">Z</el-button>
    </el-row>
  </div>
</template>

<script>
  export default {
    data: function () {
      return {}
    },
    methods: {
      pinYindata(pinYin) {
        var data = {}
        data.action = 'pinYinWords'
        data.word = pinYin
        this.$emit('data', data)
      }
    }

  }
</script>
<style lang="scss" >

</style>
