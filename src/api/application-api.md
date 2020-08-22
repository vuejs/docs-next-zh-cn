# 应用 API

在 Vue 3 中，全局改变 Vue 行为的 API 现在改为了由新的 `createApp` 方法来创建的应用程序实例。此外，它们的影响现在仅限于该特定应用程序的实例：

```js
import { createApp } from 'vue'

const app = createApp({})
```

调用 `createApp` 返回一个应用程序实例。该实例提供了一个应用程序上下文。应用程序实例挂载的整个组件树共享相同的上下文，该上下文提供了先前在 Vue 2.x 中“全局”的配置。

另外，由于 `createApp` 方法返回应用程序实例本身，因此可以在其后链接其他方法，这些方法可以在以下部分中找到。

## component

- **参数：**

  - `{string} name`
  - `{Function | Object} [definition]`

- **用法：**

  注册或检索全局组件。注册还会使用给定的 `name` 参数自动设置组件的 `name`。

- **示例：**

```js
import { createApp } from 'vue'

const app = createApp({})

//  注册一个选项对象
app.component('my-component', {
  /* ... */
})

// 检索注册的组件（始终返回构造函数）
const MyComponent = app.component('my-component', {})
```

- **参考** [Components](../guide/component-basics.html)

## config

- **用法：**

包含应用程序配置的对象。

- **示例：**

```js
import { createApp } from 'vue'
const app = createApp({})

app.config = {...}
```

- **也可以看看:** [应用程序 Config](./application-config.html)

## directive

- **参数：**

  - `{string} name`
  - `{Function | Object} [definition]`

- **用法：**

  注册或检索全局指令。

- **示例：**

```js
import { createApp } from 'vue'
const app = createApp({})

// 注册
app.directive('my-directive', {
  // 指令具有一组生命周期钩子
  // 在绑定元素的父组件挂载之前调用
  beforeMount() {},
  // 绑定元素的父组件挂载时调用
  mounted() {},
  // 在包含组件的VNode更新之前调用
  beforeUpdate() {},
  // 在包含组件的VNode及其子组件的VNode之后调用 // 有更新
  updated() {},
  // 在绑定元素的父组件卸载之前调用
  beforeUnmount() {},
  // 卸载绑定元素的父组件时调用
  unmounted() {}
})

// 注册 (功能指令)
app.directive('my-directive', () => {
  // 这将被称为 `mounted` 和 `updated`

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
- `dir`：一个对象，在注册指令时作为参数传递。例如，在指令中。

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

上面作为 el 参数收到的真是 DOM 元素的蓝图

#### prevNode

上一个的虚拟 Node，仅在 `beforeUpdate` 和 `updated` 钩子中可用。

:::tip Note
除了 `el` 之外，你应该将这些参数视为只读，并且永远不要修改它们。如果你需要跨钩子共享信息，建议通过元素的[数据集] (https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dataset) 进行共享。
:::

- **参考**[自定义指令](../guide/custom-directive.html)

## mixin

- **参数：**

  - `{Object} mixin`

- **用法：**

  在整个应用程序范围内应用 mixin，一旦注册，它们就可以在当前的 app 中任何组件模板内使用它。插件作者可以使用此方法将自定义行为注入组件。**不建议在应用程序代码中**。

- **参考** [Global Mixin](../guide/mixins.html#global-mixin)

## mount

- **参数：**

  - `{Element | string} rootContainer`
  - `{boolean} isHydrate`

- **用法：**

  将应用程序实例的根组件挂载在提供的 DOM 元素上。

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

- **参考**
  - [Lifecycle Diagram](../guide/instance.html#lifecycle-diagram)

## unmount

- **参数：**

  - `{Element | string} rootContainer`

- **用法：**

  在提供的 DOM 元素上卸载应用程序实例的根组件。

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

// 挂载5秒后，应用程序将被卸载
setTimeout(() => app.unmount('#my-app'), 5000)
```

## use

- **参数：**

  - `{Object | Function} plugin`

- **用法：**

  安装 Vue.js 插件。如果插件是一个对象，它必须暴露一个 `install` 方法。如果它本身是一个函数，它将被视为安装方法。将以 Vue 作为参数调用 install 方法。

  当在同一个插件上多次调用此方法时，该插件将仅安装一次。

- **参考** [Plugins](../guide/plugins.html)
