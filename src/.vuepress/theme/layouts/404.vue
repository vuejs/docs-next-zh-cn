<template>
  <div class="theme-container">
    <div class="theme-default-content">
      <h1>404</h1>

      <blockquote>
        <p>糟了！这个页面不存在。</p>
      </blockquote>

      <p v-show="isTranslation">
        我们的文档会不断产生新的页面。该页面可能还没有被所有的译者加入其中。
      </p>

      <RouterLink to="/">
        回到首页。
      </RouterLink>
    </div>
  </div>
</template>

<script>
import { repos } from '../../components/guide/contributing/translations-data.js'

export default {
  data () {
    return {
      isTranslation: false
    }
  },

  mounted () {
    const toOrigin = url => (String(url).match(/https?:\/\/[^/]+/) || [])[0]
    const referrer = toOrigin(document.referrer)

    // Did we get here from a translation?
    if (referrer && referrer !== location.origin && repos.some(({ url }) => toOrigin(url) === referrer)) {
      this.isTranslation = true
    }
  }
}
</script>
