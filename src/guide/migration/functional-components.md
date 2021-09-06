---
badges:
  - breaking
---

# 函数式组件 <MigrationBadges :badges="$frontmatter.badges" />

## 概览

对变化的总体概述：

- 在 3.x 中，2.x 带来的函数式组件的性能提升可以忽略不计，因此我们建议只使用有状态的组件
- 函数式组件只能由接收 `props` 和 `context` (即：`slots`、`attrs`、`emit`) 的普通函数创建
- **非兼容**：`functional` attribute 已从单文件组件 (SFC) 的 `<template>` 中移除
- **非兼容**：`{ functional: true }` 选项已从通过函数创建的组件中移除

更多信息，请继续阅读！

## 介绍

在 Vue 2 中，函数式组件主要有两个应用场景：

- 作为性能优化，因为它们的初始化速度比有状态组件快得多
- 返回多个根节点

然而，在 Vue 3 中，有状态组件的性能已经提高到它们之间的区别可以忽略不计的程度。此外，有状态组件现在也支持返回多个根节点。

因此，函数式组件剩下的唯一应用场景就是简单组件，比如创建动态标题的组件。否则，建议你像平常一样使用有状态组件。

## 2.x 语法

使用 `<dynamic-heading>` 组件，负责提供适当的标题 (即：`h1`、`h2`、`h3` 等等)，在 2.x 中，这可以通过单文件组件编写：

```js
// Vue 2 函数式组件示例
export default {
  functional: true,
  props: ['level'],
  render(h, { props, data, children }) {
    return h(`h${props.level}`, data, children)
  }
}
```

或者，对于喜欢在单文件组件中使用 `<template>` 的用户：

```vue
<!-- Vue 2 结合 <template> 的函数式组件示例 -->
<template functional>
  <component
    :is="`h${props.level}`"
    v-bind="attrs"
    v-on="listeners"
  />
</template>

<script>
export default {
  props: ['level']
}
</script>
```

## 3.x 语法

### 通过函数创建组件

现在，在 Vue 3 中，所有的函数式组件都是用普通函数创建的。换句话说，不需要定义 `{ functional: true }` 组件选项。

它们将接收两个参数：`props` 和 `context`。`context` 参数是一个对象，包含组件的 `attrs`、`slots` 和 `emit` property。

此外，`h` 现在是全局导入的，而不是在 `render` 函数中隐式提供。

以前面提到的 `<dynamic-heading>` 组件为例，下面是它现在的样子。

```js
import { h } from 'vue'

const DynamicHeading = (props, context) => {
  return h(`h${props.level}`, context.attrs, context.slots)
}

DynamicHeading.props = ['level']

export default DynamicHeading
```

### 单文件组件 (SFC)

在 3.x 中，有状态组件和函数式组件之间的性能差异已经大大减少，并且在大多数用例中是微不足道的。因此，在单文件组件上使用 `functional` 的开发者的迁移路径是删除该 attribute，并将 `props` 的所有引用重命名为 `$props`，以及将 `attrs` 重命名为 `$attrs`。

以之前的 `<dynamic-heading>` 为例，下面是它现在的样子。

```vue{1,3,4}
<template>
  <component
    v-bind:is="`h${$props.level}`"
    v-bind="$attrs"
  />
</template>

<script>
export default {
  props: ['level']
}
</script>
```

主要的区别在于：

1. 从 `<template>` 中移除 `functional` attribute
2. `listeners` 现在作为 `$attrs` 的一部分传递，可以将其删除

## 下一步

有关新的函数式组件的用法和对渲染函数的更改的详细信息，请参考：

- [迁移：渲染函数](/guide/migration/render-function-api.html)
- [指南：渲染函数](/guide/render-function.html)
- [迁移构建开关：`COMPONENT_FUNCTIONAL`](migration-build.html#兼容性配置)
