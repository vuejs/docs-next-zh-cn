# 应用 API

在 Vue 3 中，改变全局 Vue 行为的 API 现在被移动到了由新的 `createApp` 方法所创建的应用实例上。此外，现在它们的影响仅限于该特定应用实例：

```js
import { createApp } from 'vue'

const app = createApp({})
```

调用 `createApp` 返回一个应用实例。该实例提供了一个应用上下文。应用实例挂载的整个组件树共享相同的上下文，该上下文提供了之前在 Vue 2.x 中“全局”的配置。

另外，由于 `createApp` 方法返回应用实例本身，因此可以在其后链式调用其它方法，这些方法可以在以下部分中找到。

## component

- **参数：**

  - `{string} name`
  - `{Function | Object} [definition]`

- **返回值：**

  - 如果传入 `definition` 参数，返回应用实例。
  - 如果不传入 `definition` 参数，返回组件定义。

- **用法：**

  注册或检索全局组件。注册还会使用给定的 `name` 参数自动设置组件的 `name`。

- **示例：**

```js
import { createApp } from 'vue'

const app = createApp({})

// 注册一个名为my-component的组件
app.component('my-component', {
  /* ... */
})

// 检索注册的组件(始终返回构造函数)
const MyComponent = app.component('my-component', {})
```

- **参考：**[组件基础](../guide/component-basics.html)

## config

- **用法：**

包含应用配置的对象。

- **示例：**

```js
import { createApp } from 'vue'
const app = createApp({})

app.config = {...}
```

- **参考：**[应用配置](./application-config.html)

## directive

- **参数：**

  - `{string} name`
  - `{Function | Object} [definition]`

- **返回值：**

  - 如果传入 `definition` 参数，返回应用实例。
  - 如果不传入 `definition` 参数，返回指令定义。

- **用法：**

  注册或检索全局指令。

- **示例：**

```js
import { createApp } from 'vue'
const app = createApp({})

// 注册
app.directive('my-directive', {
  // 指令是具有一组生命周期的钩子：
  // 在绑定元素的父组件挂载之前调用
  beforeMount() {},
  // 绑定元素的父组件挂载时调用
  mounted() {},
  // 在包含组件的 VNode 更新之前调用
  beforeUpdate() {},
  // 在包含组件的 VNode 及其子组件的 VNode 更新之后调用
  updated() {},
  // 在绑定元素的父组件卸载之前调用
  beforeUnmount() {},
  // 卸载绑定元素的父组件时调用
  unmounted() {}
})

// 注册 (功能指令)
app.directive('my-directive', () => {
  // 这将被作为 `mounted` 和 `updated` 调用
})

// getter, 如果已注册，则返回指令定义
const myDirective = app.directive('my-directive')
```

指令钩子传递了这些参数：

#### el

指令绑定到的元素。这可用于直接操作 DOM。

#### binding

包含以下 property 的对象。

- `instance`：使用指令的组件实例。
- `value`：传递给指令的值。例如，在 `v-my-directive="1 + 1"` 中，该值为 `2`。
- `oldValue`：先前的值，仅在 `beforeUpdate` 和 `updated` 中可用。值是否已更改都可用。
- `arg`：参数传递给指令 (如果有)。例如在 `v-my-directive:foo` 中，arg 为 `"foo"`。
- `modifiers`：包含修饰符 (如果有) 的对象。例如在 `v-my-directive.foo.bar` 中，修饰符对象为 `{foo: true，bar: true}`。
- `dir`：一个对象，在注册指令时作为参数传递。例如，在以下指令中

```js
app.directive('focus', {
  mounted(el) {
    el.focus()
  }
})
```

`dir` 将会是以下对象：

```js
{
  mounted(el) {
    el.focus()
  }
}
```

#### vnode

上面作为 el 参数收到的真实 DOM 元素的蓝图。

#### prevNode

上一个虚拟节点，仅在 `beforeUpdate` 和 `updated` 钩子中可用。

:::tip Note
除了 `el` 之外，你应该将这些参数视为只读，并且永远不要修改它们。如果你需要跨钩子共享信息，建议通过元素的[自定义数据属性集](https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLElement/dataset)进行共享。
:::

- **参考：**[自定义指令](../guide/custom-directive.html)

## mixin

- **参数：**

  - `{Object} mixin`

- **返回值：**

  - 应用实例

- **用法：**

  在整个应用范围内应用 `mixin`。一旦注册，它们就可以在当前的应用中任何组件模板内使用它。插件作者可以使用此方法将自定义行为注入组件。**不建议在应用代码中使用**。

- **参考：**[全局 mixin](../guide/mixins.html#全局-mixin)

## mount

- **参数：**

  - `{Element | string} rootContainer`
  - `{boolean} isHydrate`

- **返回值：**

  - 根组件实例

- **用法：**

  将应用实例的根组件挂载在提供的 DOM 元素上。

- **示例：**

```html
<body>
  <div id="my-app"></div>
</body>
```

```js
import { createApp } from 'vue'

const app = createApp({})
// 做一些必要的准备
app.mount('#my-app')
```

- **参考：**
  - [生命周期图示](../guide/instance.html#生命周期图示)

## provide

- **参数：**

  - `{string | Symbol} key`
  - `value`

- **返回值：**

  - 应用实例

- **用法：**

  设置一个可以被注入到应用范围内所有组件中的值。组件应该使用 `inject` 来接收 provide 的值。

  从 `provide`/`inject` 的角度来看，可以将应用程序视为根级别的祖先，而根组件是其唯一的子级。

  该方法不应该与 [provide 组件选项](options-composition.html#provide-inject)或组合式 API 中的 [provide 方法](composition-api.html#provide-inject)混淆。虽然它们也是相同的 `provide`/`inject` 机制的一部分，但是是用来配置组件 provide 的值而不是应用 provide 的值。

  通过应用提供值在写插件时尤其有用，因为插件一般不能使用组件提供值。这是使用 [globalProperties](application-config.html#globalProperties) 的替代选择。

  :::tip Note
  `provide` 和 `inject` 绑定不是响应式的。这是有意为之。不过，如果你向下传递一个响应式对象，这个对象上的 property 会保持响应式。
  :::

- **示例：**

  向根组件中注入一个 property，值由应用提供。

```js
import { createApp } from 'vue'

const app = createApp({
  inject: ['user'],
  template: `
    <div>
      {{ user }}
    </div>
  `
})

app.provide('user', 'administrator')
```

- **参考：**
  - [Provide / Inject](../guide/component-provide-inject.md)

## unmount

- **参数：**

  - `{Element | string} rootContainer`

- **用法：**

  在提供的 DOM 元素上卸载应用实例的根组件。

- **示例：**

```html
<body>
  <div id="my-app"></div>
</body>
```

```js
import { createApp } from 'vue'

const app = createApp({})
// 做一些必要的准备
app.mount('#my-app')

// 挂载5秒后，应用将被卸载
setTimeout(() => app.unmount('#my-app'), 5000)
```

## use

- **参数：**

  - `{Object | Function} plugin`
  - `...options (可选)`

- **返回值：**

  - 应用实例

- **用法：**

  安装 Vue.js 插件。如果插件是一个对象，它必须暴露一个 `install` 方法。如果它本身是一个函数，它将被视为安装方法。

  该安装方法将以应用实例作为第一个参数被调用。传给 `use` 的其他 `options` 参数将作为后续参数传入该安装方法。

  当在同一个插件上多次调用此方法时，该插件将仅安装一次。

- **参考：** [插件](../guide/plugins.html)
