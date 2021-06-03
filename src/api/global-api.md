---
sidebarDepth: 1
---

# 全局 API

如果你使用的是 CDN 构建，那么全局 API 可以通过全局对象 `Vue` 来访问，例如：

```js
const { createApp, h, nextTick } = Vue
```

如果你使用的是 ES 模块，那么它们可以直接导入：

```js
import { createApp, h, nextTick } from 'vue'
```

处理响应性的全局函数，如 `reactive` 和 `ref`，其文档是单独编写的。关于这些函数，请参见[响应性 API](/api/reactivity-api.html)。

## createApp

返回一个提供应用上下文的应用实例。应用实例挂载的整个组件树共享同一个上下文。

```js
const app = createApp({})
```

你可以在 `createApp` 之后链式调用其它方法，这些方法可以在[应用 API](./application-api.html) 中找到。

### 参数

该函数接收一个根组件选项对象作为第一个参数：

```js
const app = createApp({
  data() {
    return {
      ...
    }
  },
  methods: {...},
  computed: {...}
  ...
})
```

使用第二个参数，我们可以将根 prop 传递给应用程序：

```js
const app = createApp(
  {
    props: ['username']
  },
  { username: 'Evan' }
)
```

```html
<div id="app">
  <!-- 会显示 'Evan' -->
  {{ username }}
</div>
```

### 类型声明

```ts
interface Data {
  [key: string]: unknown
}

export type CreateAppFunction<HostElement> = (
  rootComponent: PublicAPIComponent,
  rootProps?: Data | null
) => App<HostElement>
```

## h

返回一个”虚拟节点“，通常缩写为 **VNode**：一个普通对象，其中包含向 Vue 描述它应在页面上渲染哪种节点的信息，包括所有子节点的描述。它的目的是用于手动编写的[渲染函数](../guide/render-function.md)：

```js
render() {
  return h('h1', {}, 'Some title')
}
```

### 参数

接收三个参数：`type`，`props` 和 `children`

#### type

- **类型：**`String | Object | Function`

- **详细：**

  HTML 标签名、组件、异步组件或函数式组件。使用返回 null 的函数将渲染一个注释。此参数是必需的。

#### props

- **类型：**`Object`

- **详细：**

  一个对象，与我们将在模板中使用的 attribute、prop 和事件相对应。可选。

#### children

- **类型：**`String | Array | Object`

- **详细：**

  子代 VNode，使用 `h()` 生成，或者使用字符串来获取“文本 VNode”，或带有插槽的对象。可选。

  ```js
  h('div', {}, [
    'Some text comes first.',
    h('h1', 'A headline'),
    h(MyComponent, {
      someProp: 'foobar'
    })
  ])
  ```

## defineComponent

从实现上看，`defineComponent` 只返回传递给它的对象。但是，就类型而言，返回的值有一个合成类型的构造函数，用于手动渲染函数、TSX 和 IDE 工具支持。

### 参数

具有组件选项的对象

```js
import { defineComponent } from 'vue'

const MyComponent = defineComponent({
  data() {
    return { count: 1 }
  },
  methods: {
    increment() {
      this.count++
    }
  }
})
```

或者是一个 `setup` 函数，函数名称将作为组件名称来使用

```js
import { defineComponent, ref } from 'vue'

const HelloWorld = defineComponent(function HelloWorld() {
  const count = ref(0)
  return { count }
})
```

## defineAsyncComponent

创建一个只有在需要时才会加载的异步组件。

### 参数

对于基本用法，`defineAsyncComponent` 可以接受一个返回 `Promise` 的工厂函数。Promise 的 `resolve` 回调应该在服务端返回组件定义后被调用。你也可以调用 `reject(reason)` 来表示加载失败。

```js
import { defineAsyncComponent } from 'vue'

const AsyncComp = defineAsyncComponent(() =>
  import('./components/AsyncComponent.vue')
)

app.component('async-component', AsyncComp)
```

当使用[局部注册](../guide/component-registration.html#局部注册)时，你也可以直接提供一个返回 `Promise` 的函数：
```js
import { createApp, defineAsyncComponent } from 'vue'

createApp({
  // ...
  components: {
    AsyncComponent: defineAsyncComponent(() =>
      import('./components/AsyncComponent.vue')
    )
  }
})
```

对于高阶用法，`defineAsyncComponent` 可以接受一个对象：

`defineAsyncComponent` 方法还可以返回以下格式的对象：

```js
import { defineAsyncComponent } from 'vue'

const AsyncComp = defineAsyncComponent({
  // 工厂函数
  loader: () => import('./Foo.vue')
  // 加载异步组件时要使用的组件
  loadingComponent: LoadingComponent,
  // 加载失败时要使用的组件
  errorComponent: ErrorComponent,
  // 在显示 loadingComponent 之前的延迟 | 默认值：200（单位 ms）
  delay: 200,
  // 如果提供了 timeout ，并且加载组件的时间超过了设定值，将显示错误组件
  // 默认值：Infinity（即永不超时，单位 ms）
  timeout: 3000,
  // 定义组件是否可挂起 | 默认值：true
  suspensible: false,
  /**
   *
   * @param {*} error 错误信息对象
   * @param {*} retry 一个函数，用于指示当 promise 加载器 reject 时，加载器是否应该重试
   * @param {*} fail  一个函数，指示加载程序结束退出
   * @param {*} attempts 允许的最大重试次数
   */
  onError(error, retry, fail, attempts) {
    if (error.message.match(/fetch/) && attempts <= 3) {
      // 请求发生错误时重试，最多可尝试 3 次
      retry()
    } else {
      // 注意，retry/fail 就像 promise 的 resolve/reject 一样：
      // 必须调用其中一个才能继续错误处理。
      fail()
    }
  }
})
```

**参考**：[动态和异步组件](../guide/component-dynamic-async.html)

## resolveComponent

:::warning
`resolveComponent` 只能在 `render` 或 `setup` 函数中使用。
:::

如果在当前应用实例中可用，则允许按名称解析 `component`。

返回一个 `Component`。如果没有找到，则返回接收的参数 `name`。

```js
const app = createApp({})
app.component('MyComponent', {
  /* ... */
})
```

```js
import { resolveComponent } from 'vue'
render() {
  const MyComponent = resolveComponent('MyComponent')
}
```

### 参数

接受一个参数：`name`

#### name

- **类型：**`String`

- **详细：**

  已加载的组件的名称。

## resolveDynamicComponent

:::warning

`resolveDynamicComponent` 只能在 `render` 或 `setup` 函数中使用。
:::

允许使用与 `<component :is="">` 相同的机制来解析一个 `component`。

返回已解析的 `Component` 或新创建的 `VNode`，其中组件名称作为节点标签。如果找不到 `Component`，将发出警告。

```js
import { resolveDynamicComponent } from 'vue'
render () {
  const MyComponent = resolveDynamicComponent('MyComponent')
}
```

### 参数

接受一个参数：`component`

#### component

- **类型：**`String | Object (组件的选项对象)`

- **详细：**

  有关详细信息，请参阅[动态组件](../guide/component-dynamic-async.html)上的文档。

## resolveDirective

:::warning
`resolveDirective` 只能在 `render` 或 `setup` 函数中使用。
:::

如果在当前应用实例中可用，则允许通过其名称解析一个 `directive`。

返回一个 `Directive`。如果没有找到，则返回 `undefined`。

```js
const app = createApp({})
app.directive('highlight', {})
```

```js
import { resolveDirective } from 'vue'
render () {
  const highlightDirective = resolveDirective('highlight')
}
```

### 参数

接受一个参数：`name`

#### name

- **类型：**`String`

- **详细：**

  已加载的指令的名称。

## withDirectives

:::warning
`withDirectives` 只能在 `render` 或 `setup` 函数中使用。
:::

允许将指令应用于 **VNode**。返回一个包含应用指令的 VNode。

```js
import { withDirectives, resolveDirective } from 'vue'
const foo = resolveDirective('foo')
const bar = resolveDirective('bar')

return withDirectives(h('div'), [
  [foo, this.x],
  [bar, this.y]
])
```

### 参数

接受两个参数：`vnode` 和 `directives`。

#### vnode

- **类型：**`vnode`

- **详细：**

  一个虚拟节点，通常使用 `h()` 创建。

#### directives

- **类型：**`Array`

- **详细：**

  一个指令数组。

  每个指令本身都是一个数组，最多可以定义 4 个索引，如以下示例所示。

  - `[directive]` - 该指令本身。必选。

  ```js
  const MyDirective = resolveDirective('MyDirective')
  const nodeWithDirectives = withDirectives(h('div'), [[MyDirective]])
  ```

  - `[directive, value]` - 上述内容，再加上分配给指令的类型为 `any` 的值。

  ```js
  const MyDirective = resolveDirective('MyDirective')
  const nodeWithDirectives = withDirectives(h('div'), [[MyDirective, 100]])
  ```

  - `[directive, value, arg]` - 上述内容，再加上一个 `string` 参数，比如：在 `v-on:click` 中的 `click`。

  ```js
  const MyDirective = resolveDirective('MyDirective')
  const nodeWithDirectives = withDirectives(h('div'), [
    [MyDirective, 100, 'click']
  ])
  ```

  - `[directive, value, arg, modifiers]` - 上述内容，再加上定义任何修饰符的 `key: value` 键值对 `Object`。

  ```js
  const MyDirective = resolveDirective('MyDirective')
  const nodeWithDirectives = withDirectives(h('div'), [
    [MyDirective, 100, 'click', { prevent: true }]
  ])
  ```

## createRenderer

createRenderer 函数接受两个泛型参数：
`HostNode` 和 `HostElement`，对应于宿主环境中的 Node 和 Element 类型。

例如，对于 runtime-dom，HostNode 将是 DOM `Node` 接口，HostElement 将是 DOM `Element` 接口。

自定义渲染器可以传入特定于平台的类型，如下所示：

``` ts
import { createRenderer } from 'vue'
const { render, createApp } = createRenderer<Node, Element>({
  patchProp,
  ...nodeOps
})
```

### 参数

接受两个参数：`HostNode` 和 `HostElement`。

#### HostNode

- **类型：**`Node`

- **详细：**

  宿主环境中的节点。

#### HostElement

- **类型：**`Element`

- **详细：**

  宿主环境中的元素。

## nextTick

将回调推迟到下一个 DOM 更新周期之后执行。在更改了一些数据以等待 DOM 更新后立即使用它。

```js
import { createApp, nextTick } from 'vue'

const app = createApp({
  setup() {
    const message = ref('Hello!')
    const changeMessage = async newMessage => {
      message.value = newMessage
      await nextTick()
      console.log('Now DOM is updated')
    }
  }
})
```

**参考**：[`$nextTick` 实例方法](instance-methods.html#nexttick)

## mergeProps

将包含 VNode prop 的多个对象合并为一个单独的对象。其返回的是一个新创建的对象，而作为参数传递的对象则不会被修改。

可以传递不限数量的对象，后面参数的 property 优先。事件监听器被特殊处理，`class` 和 `style` 也是如此，这些 property 的值是被合并的而不是覆盖的。

```js
import { h, mergeProps } from 'vue'
export default {
  inheritAttrs: false,
  render() {
    const props = mergeProps({
      // 该 class 将与 $attrs 中的其他 class 合并。
      class: 'active'
    }, this.$attrs)
    return h('div', props)
  }
}
```

## useCssModule

:::warning
`useCssModule` 只能在 `render` 或 `setup` 函数中使用。
:::

允许在 [`setup`](/api/composition-api.html#setup) 的[单文件组件](/guide/single-file-component.html)函数中访问 CSS 模块。

```vue
<script>
import { h, useCssModule } from 'vue'
export default {
  setup () {
    const style = useCssModule()
    return () => h('div', {
      class: style.success
    }, 'Task complete!')
  }
}
</script>
<style module>
.success {
  color: #090;
}
</style>
```

关于使用 CSS 模块的更多信息，请参阅 [Vue Loader - CSS Modules](https://vue-loader.vuejs.org/zh/guide/css-modules.html)。

### 参数

接受一个参数：`name`

#### 名词

- **类型：** `String`

- **详细：**

  CSS 模块的名称。默认为 `'$style'`。

## version

以字符串形式提供已安装的 Vue 的版本号。

```js
const version = Number(Vue.version.split('.')[0])
if (version === 3) {
  // Vue 3
} else if (version === 2) {
  // Vue 2
} else {
  // 不支持的 Vue 的版本
}
```

**参考：**[应用 API - version](/api/application-api.html#version)
