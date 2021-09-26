---
title: 移除 v-on.native 修饰符
badges:
  - breaking
---

# 移除 `v-on.native` 修饰符 <MigrationBadges :badges="$frontmatter.badges" />

## 概览

`v-on` 的 `.native` 修饰符已被移除。

## 2.x 语法

默认情况下，传递给带有 `v-on` 的组件的事件监听器只能通过 `this.$emit` 触发。要将原生 DOM 监听器添加到子组件的根元素中，可以使用 `.native` 修饰符：

```html
<my-component
  v-on:close="handleComponentEvent"
  v-on:click.native="handleNativeClickEvent"
/>
```

## 3.x 语法

`v-on` 的 `.native` 修饰符已被移除。同时，[新增的 `emits` 选项](./emits-option.md)允许子组件定义真正会被触发的事件。

因此，对于子组件中*未*被定义为组件触发的所有事件监听器，Vue 现在将把它们作为原生事件监听器添加到子组件的根元素中 (除非在子组件的选项中设置了 `inheritAttrs: false`)。

```html
<my-component
  v-on:close="handleComponentEvent"
  v-on:click="handleNativeClickEvent"
/>
```

`MyComponent.vue`

```html
<script>
  export default {
    emits: ['close']
  }
</script>
```

## 迁移策略

- 删除 `.native` 修饰符的所有实例。
- 确保所有组件都使用 `emits` 选项记录其事件。

[迁移构建开关：`COMPILER_V_ON_NATIVE`](migration-build.html#兼容性配置)

## 参考

- [相关的 RFC](https://github.com/vuejs/rfcs/blob/master/active-rfcs/0031-attr-fallthrough.md#v-on-listener-fallthrough)
- [迁移指南 - 新增 Emits 选项](./emits-option.md)
- [迁移指南 - 移除 `$listeners`](./listeners-removed.md)
- [迁移指南 - 渲染函数 API 的更改](./render-function-api.md)
