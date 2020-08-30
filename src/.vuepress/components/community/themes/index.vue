<template>
  <div class="themes">
    <theme-provider v-for="provider in providers" :key="provider.name" :provider="provider" />

    <p>
      想在这里展示你的主题吗？
      <a href="mailto:evan@vuejs.org?subject=Theme+affiliation">联系我们</a>！
    </p>
  </div>
</template>

<script>
import providers from './theme-data'

export default {
  components: {
    ThemeProvider: () => import('./theme-provider')
  },

  data: () => ({
    providers
  })
}
</script>
