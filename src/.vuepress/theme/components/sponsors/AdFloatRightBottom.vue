<template>
  <div class="ad" id="ad">
    <span style="float: right;">广告</span>
    <a :href="item.url"
       v-for="item in adData"
       target="_blank" rel="nofollow">
      <img :src="`/images/${item.img}`" :alt="`${item.name}`">
    </a>
  </div>
</template>

<script>
import sponsors from '@theme/data/patreon-sponsors.js'

export default {
  data() {
    return {
      adData: sponsors.global_ad || []
    }
  }
}
</script>
<style lang="scss" scoped>
#ad {
  width: 125px;
  position: fixed;
  z-index: 19;
  bottom: 10px;
  right: 10px;
  padding: 10px;
  background-color: #fff;
  border-radius: 3px;
  font-size: 13px;

  img {
    width: 125px;
  }
}
</style>
