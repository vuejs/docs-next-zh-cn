# 应用 API

在 Vue 3 中，全局改变 Vue 行为的 API 现在被移动到了由新的 `createApp` 方法所创建的应用实例上。此外，现在它们的影响仅限于该特定应用实例：

```js
import { createApp } from 'vue'

const app = createApp({})
```

调用 `createApp` 返回一个应用实例。该实例提供了一个应用上下文。应用实例挂载的整个组件树共享相同的上下文，该上下文提供了之前在 Vue 2.x 中的“全局”配置。

另外，由于 `createApp` 方法返回应用实例本身，因此可以在其后链式调用其它方法，这些方法可以在以下部分中找到。

## component

- **参数：**

  - `{string} name`
  - `{Function | Object} [definition]`

- **返回值：**

  - 如果传入 `definition` 参数，则返回应用实例。
  - 如果不传入 `definition` 参数，则返回组件定义。

- **用法：**

  注册或检索全局组件。注册还会使用给定的 `name` 参数自动设置组件的 `name`。

- **示例：**

```js
import { createApp } from 'vue'

const app = createApp({})

// 注册一个选项对象
app.component('my-component', {
  /* ... */
})

// 检索注册的组件
const MyComponent = app.component('my-component')
```

- **参考：**[组件基础](../guide/component-basics.html)

## config

- **用法：**

一个包含应用配置的对象。

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

  - 如果传入 `definition` 参数，则返回应用实例。
  - 如果不传入 `definition` 参数，则返回指令定义。

- **用法：**

  注册或检索全局指令。

- **示例：**

```js
import { createApp } from 'vue'
const app = createApp({})

// 注册
app.directive('my-directive', {
  // 指令具有一组生命周期钩子：
  // 在绑定元素的 attribute 或事件监听器被应用之前调用
  created() {},
  // 在绑定元素的父组件挂载之前调用
  beforeMount() {},
  // 在绑定元素的父组件挂载之后调用
  mounted() {},
  // 在包含组件的 VNode 更新之前调用
  beforeUpdate() {},
  // 在包含组件的 VNode 及其子组件的 VNode 更新之后调用
  updated() {},
  // 在绑定元素的父组件卸载之前调用
  beforeUnmount() {},
  // 在绑定元素的父组件卸载之后调用
  unmounted() {}
})

// 注册 (函数指令)
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
- `oldValue`：先前的值，仅在 `beforeUpdate` 和 `updated` 中可用。无论值是否有更改都可用。
- `arg`：传递给指令的参数(如果有的话)。例如在 `v-my-directive:foo` 中，arg 为 `"foo"`。
- `modifiers`：包含修饰符(如果有的话) 的对象。例如在 `v-my-directive.foo.bar` 中，修饰符对象为 `{foo: true，bar: true}`。
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

一个真实 DOM 元素的蓝图，对应上面收到的 el 参数。

#### prevNode

上一个虚拟节点，仅在 `beforeUpdate` 和 `updated` 钩子中可用。

:::tip 注意
除了 `el` 之外，你应该将这些参数视为只读，并且永远不要修改它们。如果你需要跨钩子共享信息，建议通过元素的[自定义数据属性集](https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLElement/dataset)进行共享。
:::

- **参考：**[自定义指令](../guide/custom-directive.html)

## mixin

- **参数：**

  - `{Object} mixin`

- **返回值：**

  - 应用实例

- **用法：**

  将一个 mixin 应用在整个应用范围内。一旦注册，它们就可以在当前的应用中任何组件模板内使用它。插件作者可以使用此方法将自定义行为注入组件。**不建议在应用代码中使用**。

- **参考：**[全局 mixin](../guide/mixins.html#全局-mixin)

## mount

- **参数：**

  - `{Element | string} rootContainer`
  - `{boolean} isHydrate`

- **返回值：**

  - 根组件实例

- **用法：**

  所提供 DOM 元素的 `innerHTML` 将被替换为应用根组件的模板渲染结果。

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

  该方法不应该与 [provide 组件选项](options-composition.html#provide-inject)或组合式 API 中的 [provide 方法](composition-api.html#provide-inject)混淆。虽然它们也是相同的 `provide`/`inject` 机制的一部分，但是它们是用来配置组件而非应用所 provide 的值。

  通过应用提供值在编写插件时尤其有用，因为插件一般不能使用组件来提供值。这是对 [globalProperties](application-config.html#globalproperties) 的替代选择。

  :::tip 注意
  `provide` 和 `inject` 绑定不是响应式的。这是有意为之的。不过，如果你向下传递一个响应式对象，这个对象上的 property 会保持响应式。
  :::

- **示例：**

  向根组件中注入一个 property，值由应用提供：

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

- **用法：**

  卸载应用实例的根组件。

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

// 挂载 5 秒后，应用将被卸载
setTimeout(() => app.unmount(), 5000)
```

## use

- **参数：**

  - `{Object | Function} plugin`
  - `...options (可选)`

- **返回值：**

  - 应用实例

- **用法：**

  安装 Vue.js 插件。如果插件是一个对象，则它必须暴露一个 `install` 方法。如果插件本身是一个函数，则它将被视为安装方法。

  该安装方法将以应用实例作为第一个参数被调用。传给 `use` 的其他 `options` 参数将作为后续参数传入该安装方法。

  当在同一个插件上多次调用此方法时，该插件将仅安装一次。

- **示例：**

  ```js
  import { createApp } from 'vue'
  import MyPlugin from './plugins/MyPlugin'

  const app = createApp({})

  app.use(MyPlugin)
  app.mount('#app')
  ```

- **参考：**[插件](../guide/plugins.html)

## version

- **用法：**

  以字符串形式提供已安装的 Vue 的版本号。这对于基于不同版本使用不同策略的社区[插件](/guide/plugins.html)来说特别有用。

- **示例：**

  ```js
  export default {
    install(app) {
      const version = Number(app.version.split('.')[0])
      if (version < 3) {
        console.warn('This plugin requires Vue 3')
      }
      // ...
    }
  }
  ```

- **参考：**[全局 API - version](/api/global-api.html#version)
