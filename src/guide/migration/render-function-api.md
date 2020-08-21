---
badges:
  - breaking
---

# 渲染函数 API <MigrationBadges :badges="$frontmatter.badges" />

## 概览

此更改不会影响`<template>`用户。

以下是更改的简要总结：

- `h` 现在全局导入，而不是作为参数传递给渲染函数
- 渲染函数参数更改为在有状态组件和函数组件之间更加一致
- vnode现在有一个扁平的prop结构

更多信息，请继续阅读！

## Render函数参数

### 2.x 语法

在2.x中，e `render` 函数将自动接收 `h` 函数（它是 `createElement` 的常规别名）作为参数：

```js
// Vue 2 渲染函数示例
export default {
  render(h) {
    return h('div')
  }
}
```

### 3.x 语法

在3.x中，`h` 现在是全局导入的，而不是作为参数自动传递。


```js
// Vue 3 渲染函数示例
import { h } from 'vue'

export default {
  render() {
    return h('div')
  }
}
```

## render函数签名更改

### 2.x 语法

在2.x中， `render` 函数自动接收诸如 `h` 之类的参数。

```js
// Vue 2 渲染函数示例
export default {
  render(h) {
    return h('div')
  }
}
```

### 3.x 语法

在3.x中，由于 `render` 函数不再接收任何参数，它将主要用于 `setup()` 函数内部。这还有一个好处：可以访问作用域中声明的被动状态和函数，以及传递给 `setup()` 的参数。


```js
import { h, reactive } from 'vue'

export default {
  setup(props, { slots, attrs, emit }) {
    const state = reactive({
      count: 0
    })

    function increment() {
      state.count++
    }

    // 返回render函数
    return () =>
      h(
        'div',
        {
          onClick: increment
        },
        state.count
      )
  }
}
```

有关 `setup()` 如何工作的详细信息, 见 [Composition API Guide](/guide/composition-api-introduction.html).

## VNode Props 格式化

### 2.x 语法

在 2.x 中, `domProps` 包含VNode props中的嵌套列表：

```js
// 2.x
{
  class: ['button', 'is-outlined'],
  style: { color: '#34495E' },
  attrs: { id: 'submit' },
  domProps: { innerHTML: '' },
  on: { click: submitForm },
  key: 'submit-button'
}
```

### 3.x 语法

在3.x中，整个VNode props结构是扁平的，使用上面的例子，下面是它现在的样子

```js
// 3.x 语法
{
  class: ['button', 'is-outlined'],
  style: { color: '#34495E' },
  id: 'submit',
  innerHTML: '',
  onClick: submitForm,
  key: 'submit-button'
}
```

## 迁移策略

### 工具库作者

全局导入`h` 意味着任何包含Vue组件的库都将在某处包含`import { h } from 'vue'`，因此，这会带来一些开销，因为它需要库作者在其构建设置中正确配置Vue的外部化：

- Vue不应绑定到库中
- 对于模块构建，导入应该保持独立，由最终用户绑定器处理
- 对于UMD/browser版本，它应该首先尝试全局Vue.h，然后回退以请求调用

## 下一步

见 [Render函数指南](/guide/render-function) 更详细的文档！
