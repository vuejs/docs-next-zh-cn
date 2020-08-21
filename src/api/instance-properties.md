# 实例property

## $data

- **类型：** `Object`

- **详细：**

  组件实例观察的数据对象。组件实例代理了对其 data 对象 property 的访问。

-  **参考** [选项 / 数据 - data](./options-data.html#data-2)

## $props

- **类型：** `Object`

- **详细：**

  当前组件接收到的 props 对象。组件实例代理了对其 props 对象 property 的访问。

## $el

- **类型：** `any`

- **仅可读**

- **详细：**

  组件实例使用的根 DOM 元素。

## $options

- **类型：** `Object`

- **仅可读**

- **详细：**

  用于当前 组件实例的初始化选项。需要在选项中包含自定义 property 时会有用处：

  ```js
  const app = Vue.createApp({
    customOption: 'foo',
    created() {
      console.log(this.$options.customOption) // => 'foo'
    }
  })
  ```

## $parent

- **类型：** `Vue instance`

- **仅可读**

- **详细：**

  父实例，如果当前实例有的话。

## $root

- **类型：** `Vue instance`

- **仅可读**

- **详细：**

  当前组件树的根 组件实例。如果当前实例没有父实例，此实例将会是其自己。

## $slots

- **类型：** `{ [name: string]: (...args: any[]) => Array<VNode> | undefined }`

- **仅可读**

- **详细：**

  用来访问被 [插槽分发](../guide/component-basics.html#content-distribution-with-slots) 的内容。每个 [具名插槽](../guide/component-slots.html#named-slots) 有其相应的 property (例如： `v-slot:foo` 中的内容将会在 `this.$slots.foo` 中被找到)。 `default` property 包括了所有没有被包含在具名插槽中的节点，或 `v-slot:default` 的内容。

  在使用 [渲染函数](../guide/render-function.html) 书写一个组件时，访问 `this.$slots` 最有帮助。

- **示例：**

  ```html
  <blog-post>
    <template v-slot:header>
      <h1>About Me</h1>
    </template>

    <template v-slot:default>
      <p>
        Here's some page content, which will be included in $slots.default.
      </p>
    </template>

    <template v-slot:footer>
      <p>Copyright 2020 Evan You</p>
    </template>
  </blog-post>
  ```

  ```js
  const app = Vue.createApp({})

  app.component('blog-post', {
    render() {
      return Vue.h('div', [
        Vue.h('header', this.$slots.header()),
        Vue.h('main', this.$slots.default()),
        Vue.h('footer', this.$slots.footer())
      ])
    }
  })
  ```

-  **参考**
  - [`<slot>` 组件](built-in-components.html#slot)
  - [通过插槽分发内容](../guide/component-basics.html#content-distribution-with-slots)
  - [渲染函数 - 插槽](../guide/render-function.html#slots)

## $refs

- **类型：** `Object`

- **仅可读**

- **详细：**

一个对象，持有注册过 [`ref` attribute](../guide/component-template-refs.html) 的所有 DOM 元素和组件实例。

-  **参考**
  - [模板 refs](../guide/component-template-refs.html)
  - [特殊 attributes - ref](./special-attributes.md#ref)

## $attrs

- **类型：** `Object`

- **仅可读**

- **详细：**

包含了父作用域中不作为组件 [props](./options-data.html#props) 或 [自定义事件](./options-data.html#emits)。当一个组件没有声明任何 prop 时，这里会包含所有父作用域的绑定，并且可以通过 `v-bind="$attrs"` 传入内部组件——在创建高级别的组件时非常有用。

-  **参考**
  - [非Prop Attributes](../guide/component-attrs.html)
