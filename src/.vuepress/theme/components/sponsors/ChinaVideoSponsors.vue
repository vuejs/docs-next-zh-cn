<template>
  <SponsorsLayout extra-classes="sponsors__open-collective">
    <template #heading>中国区视频托管赞助商</template>

    <template #content>
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
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
img {
  width: auto;
  max-width: 100px !important;
  max-height: 60px !important;
}
</style>
