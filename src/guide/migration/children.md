---
badges:
  - removed
---

# $children <MigrationBadges :badges="$frontmatter.badges" />

## 概览

`$children` 实例属性已从 Vue 3.0 中移除，不再支持。

## 2.x 语法

在 2.x 中，开发者可以使用 `this.$children` 直接访问当前实例的子组件：

```vue
<template>
  <div>
    <img alt="Vue logo" src="./assets/logo.png">
    <my-button>Change logo</my-button>
  </div>
</template>

<script>
import MyButton from './MyButton'

export default {
  components: {
    MyButton
  },
  mounted() {
    console.log(this.$children) // [VueComponent]
  }
}
</script>
```

## 3.x 更新

在 3.x 中，`$children` 属性已移除，不再支持。相反地，如果你需要访问子组件实例，我们建议使用 [$refs](/guide/component-template-refs.html#template-refs)。
