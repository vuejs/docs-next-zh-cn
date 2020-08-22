<template>
  <SponsorsLayout extra-classes="sponsors__open-collective">
    <template #heading>Open Collective 赞助商</template>

    <template #content>
      <h4>白金</h4>
      <a
        :href="`https://opencollective.com/vuejs/tiers/platinum-sponsors/${index}/website`"
        rel="sponsored noopener"
        target="_blank"
        v-for="(_, index) in new Array(featuredCount.platinum)"
      >
        <img
          :src="`https://opencollective.com/vuejs/tiers/platinum-sponsors/${index}/avatar.svg`"
          alt="Vue.JS platinum sponsor"
        >
      </a>

      <h4>黄金</h4>
      <a
        :href="`https://opencollective.com/vuejs/tiers/gold-sponsors/${index}/website`"
        rel="sponsored noopener"
        target="_blank"
        v-for="(_, index) in new Array(featuredCount.gold)"
      >
        <img
          :src="`https://opencollective.com/vuejs/tiers/gold-sponsors/${index}/avatar.svg`"
          alt="Vue.JS gold sponsor"
        >
      </a>

      <h4>中国区视频托管赞助商</h4>
      <a
        :href="item.url"
        rel="sponsored noopener"
        target="_blank"
        v-for="(item, index) in sponsors.video_sponsors_china"
      >
        <img
          :src="`/images/sponsors/${item.img}`"
          alt="Vue.JS sponsor"
        >
      </a>
    </template>
  </SponsorsLayout>
</template>

<script>
import SponsorsLayout from '@theme/components/sponsors/SponsorsLayout.vue'

export default {
  components: {
    SponsorsLayout
  },
  props: {
    sponsors: {
      type: Object,
      default() {
        return {
          video_sponsors_china: []
        }
      }
    }
  },
  data: () => ({
    featuredCount: {
      platium: 3,
      gold: 10
    }
  })
}
</script>

<style lang="scss" scoped>
img {
  width: auto;
  max-width: 100px !important;
  max-height: 60px !important;
}
</style>
