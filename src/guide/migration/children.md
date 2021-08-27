---
badges:
  - removed
---

# $children <MigrationBadges :badges="$frontmatter.badges" />

## 概览

`$children` 实例 property 已从 Vue 3.0 中移除，不再支持。

## 2.x 语法

在 2.x 中，开发者可以使用 `this.$children` 访问当前实例的直接子组件：

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

在 3.x 中，`$children` property 已被移除，且不再支持。如果你需要访问子组件实例，我们建议使用 [$refs](/guide/component-template-refs.html#模板引用)。

## 迁移策略

[迁移构建开关：`INSTANCE_CHILDREN`](migration-build.html#兼容性配置)
