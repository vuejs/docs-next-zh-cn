---
badges:
  - breaking
---

# 功能组件 <MigrationBadges :badges="$frontmatter.badges" />

## 概览

就变化而言，属于高等级内容：

- 在 3.x 中，功能性组件 2.x 的性能提升可以忽略不计，因此我们建议只使用有状态的组件
- 功能组件只能使用接收 `props` 和 `context` 的普通函数创建 (即：`slots`，`attrs`，`emit`)。
- **重大变更：**`functional` attribute 在单文件组件 (SFC) `<template>` 已被移除
- **重大变更：**`{ functional: true }` 选项在通过函数创建组件已被移除

更多信息，请继续阅读！

## 介绍

在 Vue 2 中，功能组件有两个主要用例：

- 作为性能优化，因为它们的初始化速度比有状态组件快得多
- 返回多个根节点

然而，在 Vue 3 中，有状态组件的性能已经提高到可以忽略不计的程度。此外，有状态组件现在还包括返回多个根节点的能力。

因此，功能组件剩下的唯一用例就是简单组件，比如创建动态标题的组件。否则，建议你像平常一样使用有状态组件。

## 2.x 语法

使用 `<dynamic-heading>` 组件，负责提供适当的标题 (即：`h1`，`h2`，`h3`，等等)，在 2.x 中，这可能是作为单个文件组件编写的：
```js
// Vue 2 功能组件示例
export default {
  functional: true,
  props: ['level'],
  render(h, { props, data, children }) {
    return h(`h${props.level}`, data, children)
  }
}
```

或者，对于喜欢在单个文件组件中使用 `<template>` 的用户：

```js
// Vue 2 功能组件示例使用 <template>
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

现在在 Vue 3 中，所有的功能组件都是用普通函数创建的，换句话说，不需要定义 `{ functional: true }` 组件选项。

他们将接收两个参数：`props` 和 `context`。`context` 参数是一个对象，包含组件的 `attrs`，`slots`，和 `emit` properties。

此外，现在不是在 `render` 函数中隐式提供 `h`，而是全局导入 `h`。

使用前面提到的 `<dynamic-heading>` 组件的示例，下面是它现在的样子。

```js
import { h } from 'vue'

const DynamicHeading = (props, context) => {
  return h(`h${props.level}`, context.attrs, context.slots)
}

DynamicHeading.props = ['level']

export default DynamicHeading
```

### 单文件组件 (SFC)

在 3.x 中，有状态组件和功能组件之间的性能差异已经大大减少，并且在大多数用例中是微不足道的。因此，在 SFCs 上使用 `functional` 的开发人员的迁移路径是删除该 attribute，无需额外工作。

使用之前的 `<dynamic-heading>` 示例，下面是它现在的样子。

```js{1}
<template>
  <component
    v-bind:is="`h${props.level}`"
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

1. `functional` attribute 在 `<template>` 中移除
2. `listeners` 现在作为 `$attrs` 的一部分传递，可以将其删除

## 下一步

有关新功能组件的用法和对渲染函数的更改的详细信息，见：

- [迁移：渲染函数](/guide/migration/render-function-api.html)
- [指南：渲染函数](/guide/render-function.html)
