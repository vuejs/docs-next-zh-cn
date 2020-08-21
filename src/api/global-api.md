# 全局 API

## createApp

返回提供应用程序上下文的应用程序实例。 应用程序实例安装的整个组件树共享相同的上下文。

```js
const app = Vue.createApp({})
```

你可以在 `createApp` 之后链接其他方法，这些方法可以在 [Application API](./application-api.html)中找到。


### 参数

该函数接收根组件选项对象作为第一个参数：

```js
const app = Vue.createApp({
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

使用第二个参数，我们可以将根prop传递给应用程序：

```js
const app = Vue.createApp(
  {
    props: ['username']
  },
  { username: 'Evan' }
)
```


```html
<div id="app">
  <!-- 会显示'Evan' -->
  {{ username }}
</div>
```

### 声明类型

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

返回一个返回的 `虚拟node`，通常缩写为 **VNode** ：一个普通对象，其中包含向Vue描述它应在页面上渲染哪种节点的信息，包括任何子节点的描述。 它用于手动编写的[渲染函数](../guide/render-function.md)：

```js
render() {
  return Vue.h('h1', {}, 'Some title')
}
```

### 参数

接收三个参数: `tag`, `props` 和 `children`

#### tag

- **类型：** `String | Object | Function | null`

- **详细：**

  一个HTML 标签 名，一个组件，一个异步组件或null，使用null将渲染注释。此参数是必需的。

#### props

- **类型：** `Object`

- **详细：**

  与我们将在模板中使用的attributes、prop和事件相对应的对象。可选。

#### children

- **类型：** `String | Array | Object`

- **详细：**

  子虚拟Node，使用 `h()`生成，或者使用字符串来获取 “文本节点” 或带有插槽的对象。可选

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

实现方面， `defineComponent` 只返回传递给它的对象。但是，就类型而言，返回值有一个用于手动渲染函数的构造函数、TSX和IDE工具支持的合成类型。

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

## defineAsyncComponent

创建只在必要时加载的异步组件。

### 参数

对于基本用法，`defineAsyncComponent` 可以接受返回 `Promise` 的工厂函数。从服务器检索组件定义后，应调用Promise的 `resolve`回调。你也可以调用 `reject(reason)`，以表示加载失败。

```js
import { defineAsyncComponent } from 'vue'

const AsyncComp = defineAsyncComponent(() =>
  import('./components/AsyncComponent.vue')
)

app.component('async-component', AsyncComp)
```

当使用 [本地注册](../guide/component-registration.html#local-registration), 也可以直接提供一个返回 `Promise` 的函数：
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

对于高级用法，`defineAsyncComponent` 可以接受对象：

`defineAsyncComponent` 方法还可以返回以下格式的对象：

```js
import { defineAsyncComponent } from 'vue'

const AsyncComp = defineAsyncComponent({
  // 工厂函数
  loader: () => import('./Foo.vue')
  // 加载异步组件时要使用的组件
  loadingComponent: LoadingComponent,
  // 加载失败时使用的组件
  errorComponent: ErrorComponent,
  // 显示加载组件前延迟。默认值：200ms。
  delay: 200,
  // 如果超时，将显示错误组件
  // 提供并超出。默认值：Infinity。
  timeout: 3000,
  // 一个函数，返回一个布尔值，指示当加载程序promise拒绝时异步组件是否应重试
  retryWhen: error => error.code !== 404,
  // 允许的最大重试次数
  maxRetries: 3,
  // 定义组件是否可挂起
  suspensible: false
})
```

**也可以看看**: [动态和异步组件](../guide/component-dynamic-async.html)

## resolveComponent

:::warning
`resolveComponent` 只能在 `render` 或 `setup` 函数中使用。
:::


如果在当前应用程序实例中可用，则允许按名称解析`component`。

当为找到时返回一个 `Component` 或者 `undefined`。

```js
const app = Vue.createApp({})
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

接受一个参数: `component`

#### component

- **类型：** `String`

- **详细：**
  载的组件的名称。

## resolveDynamicComponent

:::warning

`resolveDynamicComponent` 只能在 `render` 或 `setup` 函数中使用。
:::

允许使用 `<component :is="">`所采用的相同机制来解析 `component`。


返回已解析的 `Component` 或新创建的 `VNode` ，其中组件名作为节点标记。如果找不到 `Component`，将发出警告。

```js
import { resolveDynamicComponent } from 'vue'
render () {
  const MyComponent = resolveDynamicComponent('MyComponent')
}
```

### 参数

接受一个参数: `component`

#### component

- **类型：** `String | Object (组件的选项对象)`

- **详细：**

  有关详细信息，请参阅 [动态组件](../guide/component-dynamic-async.html) 上的文档。

## resolveDirective

:::warning
`resolveDirective` 只能在 `render` 或 `setup` 函数中使用。
:::

允许按名称解析 `directive` ，如果在当前应用程序实例中可用。

没有找到时，返回一个 `Directive` 或 `undefined`

```js
const app = Vue.createApp({})
app.directive('highlight', {})
```

```js
import { resolveDirective } from 'vue'
render () {
  const highlightDirective = resolveDirective('highlight')
}
```

### 参数

接受一个参数: `name`

#### name

- **类型：** `String`

- **详细：**

  已加载指令的名称。

## withDirectives

:::warning
`withDirectives` 只能在 `render` 或 `setup` 函数中使用。
:::

允许将指令应用于**VNode**，返回带有已应用指令的VNode。

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

接受两个: `vnode` 和 `directives`.

#### vnode

- **类型：** `vnode`

- **详细：** 

  一个虚拟node，通常使用`h()`创建。

#### directives

- **类型：** `Array`

- **详细：**

  一个指令数组。
  
  每个指令本身都是一个数组，最多可以定义4个索引，如以下示例所示。

  - `[directive]` - 该指令本身，必须的。

  ```js
  const MyDirective = resolveDirective('MyDirective')
  const nodeWithDirectives = withDirectives(
    h('div'), 
    [ [MyDirective] ]
  )
  ```

  - `[directive, value]` - 上面加上要分配给指令的类型为`any`的值。

  ```js
  const MyDirective = resolveDirective('MyDirective')
  const nodeWithDirectives = withDirectives(
    h('div'), 
    [ [MyDirective, 100] ]
  )
  ```

  - `[directive, value, arg]` - 上面加上一个 `String` 参数，比如： `click` 在 `v-on:click` 中。

  ```js
  const MyDirective = resolveDirective('MyDirective')
  const nodeWithDirectives = withDirectives(
    h('div'), 
    [ [MyDirective, 100, 'click'] ]
  )
  ```

  - `[directive, value, arg, modifiers]` - 上面加一个 `key: value` 键值对 `Object` 定义任何修饰符。

  ```js
  const MyDirective = resolveDirective('MyDirective')
  const nodeWithDirectives = withDirectives(
    h('div'), 
    [ [MyDirective, 100, 'click', { prevent: true }] ]
  )
  ```

## createRenderer

createRenderer函数接受两个泛型参数：
`HostNode` 和 `HostElement`, 对应于宿主环境中的节点和元素类型。
 
例如，对于runtime-dom，HostNode将是DOM `Node` 接口，HostElement将是DOM `Element`接口。
 
自定义渲染器可以传入特定于平台的类型，如下所示：

``` js
import { createRenderer } from 'vue'
const { render, createApp } = createRenderer<Node, Element>({
  patchProp,
  ...nodeOps
})
```

### 参数

接受两个: `HostNode` 和 `HostElement`

#### HostNode

- **类型：** `Node`

- **详细：**

  宿主环境中的节点。

#### HostElement

- **类型：** `Element`

- **详细：**

  宿主环境中的元素

## nextTick

将回调推迟到下一个DOM更新周期之后执行。在更改了一些数据以等待DOM更新后立即使用它。

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

**也可以看看**: [`$nextTick` instance method](instance-methods.html#nexttick)
