---
badges:
  - breaking
---

# VNode 生命周期事件 <MigrationBadges :badges="$frontmatter.badges" />

## 总览

在 Vue 2，我们可以通过事件来监听组件生命周期中的关键阶段。这些事件名都是以 `hook:` 开头并跟随相应的生命周期钩子的名字。

在 Vue 3，这些前缀会被改为 `vnode-`。额外地，这些事件在 HTML 元素上也可用，和在组件上的用法一样。

## 2.x 语法

在 Vue 2，这些事件名和生命周期钩子一样，并附带 `hook:` 的前缀：

```html
<template>
  <child-component @hook:updated="onUpdated">
</template>
```

## 3.x 语法

在 Vue 3，事件名附带的是 `vnode-` 前缀：

```html
<template>
  <child-component @vnode-updated="onUpdated">
</template>
```

或者在驼峰命名法的情况下附带前缀 `vnode`：

```html
<template>
  <child-component @vnodeUpdated="onUpdated">
</template>
```

## 迁移策略

绝大多数情况下只需要修改前缀。生命周期钩子 `beforeDestroy` 和 destroyed` 已经被重命名为 `beforeUnmount` 和 `unmouted`，所以相应的事件名也需要更新。

## 参考

- [迁移指南：事件 API](/guide/migration/events-api.html)
