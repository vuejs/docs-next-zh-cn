<template>
  <main class="page">
    <slot name="top"/>

    <Content class="theme-default-content"/>
    <PageEdit/>

    <PageNav v-bind="{ sidebarItems }"/>

    <slot name="bottom"/>

    <AdFloatRightBottom/>
  </main>
</template>

<script>
import PageEdit from '@theme/components/PageEdit.vue'
import PageNav from '@theme/components/PageNav.vue'
import AdFloatRightBottom from '@theme/components/sponsors/AdFloatRightBottom.vue'

export default {
  components: { PageEdit, PageNav, AdFloatRightBottom },
  props: ['sidebarItems']
}
</script>

<style lang="stylus">
@require '../styles/wrapper.styl'

.page
  padding-bottom 2rem
  display block

</style>
