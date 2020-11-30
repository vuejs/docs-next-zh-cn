---
title: emits 选项
badges:
  - new
---

<!-- TODO: translation -->

# `emits` 选项 <MigrationBadges :badges="$frontmatter.badges" />

## 概览

Vue 3 现在提供了一个 `emits` 选项，类似于现有的 `props` 选项。此选项可用于定义组件可向其父组件触发的事件。

## 2.x 行为

在Vue 2 中，你可以定义一个组件接收的 prop，但是你不能声明它可以触发哪些事件:

```vue
<template>
  <div>
    <p>{{ text }}</p>
    <button v-on:click="$emit('accepted')">OK</button>
  </div>
</template>
<script>
  export default {
    props: ['text']
  }
</script>
```

## 3.x 行为

与 prop 类似，组件触发的事件现在可以用 `emits` 选项来定义:

```vue
<template>
  <div>
    <p>{{ text }}</p>
    <button v-on:click="$emit('accepted')">OK</button>
  </div>
</template>
<script>
  export default {
    props: ['text'],
    emits: ['accepted']
  }
</script>
```
该选项也接受一个对象，该对象允许开发人员为触发的事件传递的参数定义验证器，类似于 `props` 定义中的验证器。

欲了解更多信息，请阅读 [此特性的API文档](../../api/options-data.md#emits).

## 迁移策略

强烈建议你使用 `emits` 记录每个组件触发的所有事件。

这是特别重要的，因为[ `.native` 修饰符的移除](./v-on-native-modifier-removed.md)。没有使用 `emits` 声明的事件的任何侦听器现在都将包含在组件的 `$attrs` 中，默认情况下，它将绑定到组件的根节点。

### 举例

对于重新向父组件触发 native 事件的组件，这将导致两个事件被触发:

```vue
<template>
  <button v-on:click="$emit('click', $event)">OK</button>
</template>
<script>
export default {
  emits: [] // without declared event
}
</script>
```
当父组件监听组件上的 `click` 事件时:

```html
<my-button v-on:click="handleClick"></my-button>
```
现在它将被触发两次:

- 一次来源于 `$emit()`.
- 一次来源于绑定在根元素上的 native 事件侦听器

这里你有两个选择:

1. 正确的声明 `click` 事件。如果你确实在 `<my-button>` 中向事件处理程序中添加了一些逻辑，这是很有用的。
2. 移除事件的重新触发，因为父级现在可以轻松侦听 native 事件，而无需添加 `.native`。适用于当你真的只是重新触发事件的情况。

## 另请参阅

- [RFC 相关](https://github.com/vuejs/rfcs/blob/master/active-rfcs/0030-emits-option.md)
- [迁移指南 - 移除 `.native` ](./v-on-native-modifier-removed.md)
- [迁移指南 - 移除 `$listeners` ](./listeners-removed.md)
- [迁移指南 - `$attrs` 包括 `class` & `style`](./attrs-includes-class-style.md)
- [迁移指南 - 渲染函数 API 中的更改](./render-function-api.md)
