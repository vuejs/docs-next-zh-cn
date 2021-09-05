---
title: emits 选项
badges:
  - new
---

# `emits` 选项 <MigrationBadges :badges="$frontmatter.badges" />

## 概述

Vue 3 现在提供一个 `emits` 选项，和现有的 `props` 选项类似。这个选项可以用来定义一个组件可以向其父组件触发的事件。

## 2.x 的行为

在 Vue 2 中，你可以定义一个组件可接收的 prop，但是你无法声明它可以触发哪些事件：

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

## 3.x 的行为

和 prop 类似，现在可以通过 `emits` 选项来定义组件可触发的事件：

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

该选项也可以接收一个对象，该对象允许开发者定义传入事件参数的验证器，和 `props` 定义里的验证器类似。

更多信息请参阅[这部分特性的 API 文档](../../api/options-data.md#emits)。

## 迁移策略

强烈建议使用 `emits` 记录每个组件所触发的所有事件。

这尤为重要，因为我们[移除了 `.native` 修饰符](./v-on-native-modifier-removed.md)。任何未在 `emits` 中声明的事件监听器都会被算入组件的 `$attrs`，并将默认绑定到组件的根节点上。

### 示例

对于向其父组件透传原生事件的组件来说，这会导致有两个事件被触发：

```vue
<template>
  <button v-on:click="$emit('click', $event)">OK</button>
</template>
<script>
export default {
  emits: [] // 不声明事件
}
</script>
```

当一个父级组件拥有 `click` 事件的监听器时：

```html
<my-button v-on:click="handleClick"></my-button>
```

该事件现在会被触发*两次*:

- 一次来自 `$emit()`。
- 另一次来自应用在根元素上的原生事件监听器。

现在你有两个选项：

1. 正确地声明 `click` 事件。当你真的在 `<my-button>` 的事件处理器上加入了一些逻辑时，这会很有用。
2. 移除透传的事件，因为现在父组件可以很容易地监听原生事件，而不需要添加 `.native`。适用于你只想透传这个事件。

## 参考

- [相关 RFC](https://github.com/vuejs/rfcs/blob/master/active-rfcs/0030-emits-option.md)
- [迁移指南 - 移除 `.native` 修饰符](./v-on-native-modifier-removed.md)
- [迁移指南 - 移除 `$listeners`](./listeners-removed.md)
- [迁移指南 - `$attrs` 包含 `class` & `style`](./attrs-includes-class-style.md)
- [迁移指南 - 渲染函数 API 的改动](./render-function-api.md)
