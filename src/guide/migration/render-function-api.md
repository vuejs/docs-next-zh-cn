---
badges:
  - breaking
---
# 渲染函数 API <MigrationBadges :badges="$frontmatter.badges" />

## 概览

此更改不会影响 `<template>` 用户。

以下是更改的简要总结：

- `h` 现在是全局导入，而不是作为参数传递给渲染函数
- 更改渲染函数参数，使其在有状态组件和函数组件的表现更加一致
- VNode 现在有一个扁平的 prop 结构

请继续阅读来获取更多信息！

## 渲染函数参数

### 2.x 语法

在 2.x 中，`render` 函数会自动接收 `h` 函数 (它是 `createElement` 的惯用别名) 作为参数：

```js
// Vue 2 渲染函数示例
export default {
  render(h) {
    return h('div')
  }
}
```

### 3.x 语法

在 3.x 中，`h` 函数现在是全局导入的，而不是作为参数自动传递。

```js
// Vue 3 渲染函数示例
import { h } from 'vue'

export default {
  render() {
    return h('div')
  }
}
```

## 渲染函数签名更改

### 2.x 语法

在 2.x 中，`render` 函数自动接收参数，如 `h` 函数。

```js
// Vue 2 渲染函数示例
export default {
  render(h) {
    return h('div')
  }
}
```

### 3.x 语法

在 3.x 中，由于 `render` 函数不再接收任何参数，它将主要在 `setup()` 函数内部使用。这还有一个好处：可以访问在作用域中声明的响应式状态和函数，以及传递给 `setup()` 的参数。

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

    // 返回渲染函数
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

有关 `setup()` 如何工作的详细信息，请参考[组合式 API 指南](/guide/composition-api-introduction.html)。

## VNode Prop 格式化

### 2.x 语法

在 2.x 中，`domProps` 包含 VNode prop 中的嵌套列表：

```js
// 2.x
{
  staticClass: 'button',
  class: { 'is-outlined': isOutlined },
  staticStyle: { color: '#34495E' },
  style: { backgroundColor: buttonColor },
  attrs: { id: 'submit' },
  domProps: { innerHTML: '' },
  on: { click: submitForm },
  key: 'submit-button'
}
```

### 3.x 语法

在 3.x 中，整个 VNode prop 的结构都是扁平的。使用上面的例子，来看看它现在的样子。

```js
// 3.x 语法
{
  class: ['button', { 'is-outlined': isOutlined }],
  style: [{ color: '#34495E' }, { backgroundColor: buttonColor }],
  id: 'submit',
  innerHTML: '',
  onClick: submitForm,
  key: 'submit-button'
}
```

## 注册组件

### 2.x 语法

在 2.x 中，注册一个组件后，把组件名作为字符串传递给渲染函数的第一个参数，它可以正常地工作：

```js
// 2.x
Vue.component('button-counter', {
  data() {
    return {
      count: 0
    }
  },
  template: `
    <button @click="count++">
      Clicked {{ count }} times.
    </button>
  `
})

export default {
  render(h) {
    return h('button-counter')
  }
}
```

### 3.x 语法

在 3.x 中，由于 VNode 是上下文无关的，不能再用字符串 ID 隐式查找已注册组件。取而代之的是，需要使用一个导入的 `resolveComponent` 方法：

```js
// 3.x
import { h, resolveComponent } from 'vue'

export default {
  setup() {
    const ButtonCounter = resolveComponent('button-counter')
    return () => h(ButtonCounter)
  }
}

```

更多信息请参考[渲染函数 API 更改 RFC](https://github.com/vuejs/rfcs/blob/master/active-rfcs/0008-render-function-api-change.md#context-free-vnodes)。

## 迁移策略

[迁移构建开关：`RENDER_FUNCTION`](migration-build.html#兼容性配置)

### 工具库作者

全局导入 `h` 意味着任何包含 Vue 组件的库都将在某处包含 `import { h } from 'vue'`。这会带来一些开销，因为它需要库作者在其构建设置中正确配置 Vue 的外部化：

- Vue 不应打包到库中
- 对于模块构建版本，导入应该保持独立，并由终端用户的打包器处理
- 对于 UMD / 浏览器构建版本，应该首先尝试全局 Vue.h，不存在时再使用 require 调用

## 下一步

详细文档请参考 [Render 函数指南](/guide/render-function)！
