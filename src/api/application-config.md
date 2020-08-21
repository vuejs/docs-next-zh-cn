# 应用配置

`config` 是一个对象，包含 Vue 的全局配置。可以在启动应用之前修改下列 property：

```js
const app = Vue.createApp({})

app.config = {...}
```

## devtools

- **类型：** `boolean`

- **默认:** `true` (在生成打包中是`false`)

- **用法：**

```js
app.config.devtools = true
```

配置是否允许 [vue devtools](https://github.com/vuejs/vue-devtools) 检查代码。开发版本默认为 `true`，生产版本默认为 `false`。生产版本设为 `true` 可以启用检查。

## errorHandler

- **类型：** `Function`

- **默认：** `undefined`

- **用法：**

```js
app.config.errorHandler = (err, vm, info) => {
  // 处理错误
  // `info` 是 Vue 特定的错误信息，比如错误所在的生命周期钩子
  // 发现错误
}
```

指定组件的渲染和观察期间未捕获错误的处理函数。这个处理函数被调用时，可获取错误信息和应用实例。

> 错误追踪服务 [Sentry](https://sentry.io/for/vue/) 和 [Bugsnag](https://docs.bugsnag.com/platforms/browsers/vue/)使用此选项提供官方集成。

## warnHandler

- **类型：** `Function`

- **默认：** `undefined`

- **用法：**

```js
app.config.warnHandler = function(msg, vm, trace) {
  // `trace` 是组件的继承关系追踪
}
```

为 Vue 的运行时警告赋予一个自定义处理函数。注意这只会在开发者环境下生效，在生产环境下它会被忽略。

## globalProperties

- **类型：** `[key: string]: any`

- **默认：** `undefined`

- **用法：**

```js
app.config.globalProperties.foo = 'bar'

app.component('child-component', {
  mounted() {
    console.log(this.foo) // 'bar'
  }
})
```

添加可以在应用程序内的任何组件实例中访问的全局property。 按键冲突时，组件的属性将具有优先权。

这可以代替Vue 2.x `Vue.prototype` 扩展：

```js
// Before
Vue.prototype.$http = () => {}

// After
const app = Vue.createApp({})
app.config.globalProperties.$http = () => {}
```

## isCustomElement

- **类型：** `(tag: string) => boolean`

- **默认：** `undefined`

- **用法：**

```js
// 任何以“ion-”开头的元素都将被识别为自定义元素
app.config.isCustomElement = tag => tag.startsWith('ion-')
```

指定识别在Vue外部定义的自定义元素的方法（例如，使用Web组件API）。如果组件符合此条件，则不需要本地或全局注册，并且Vue不会抛出关于 `未知自定义元素` 的警告。

> 注意，所有原生HTML和SVG标记不需要在此函数中匹配 —— Vue解析器自动执行此检查

## optionMergeStrategies

- **类型：** `{ [key: string]: Function }`

- **默认：** `{}`

- **用法：**

```js
const app = Vue.createApp({
  mounted() {
    console.log(this.$options.hello)
  }
})

app.config.optionMergeStrategies.hello = (parent, child, vm) => {
  return `Hello, ${child}`
}

app.mixin({
  hello: 'Vue'
})

// 'Hello, Vue
```

自定义合并策略的选项。

合并策略选项分别接收在父实例和子实例上定义的该选项的值作为第一个和第二个参数，引用实例上下文被作为第三个参数传入。

- **也可以看看** [Custom Option Merging Strategies](../guide/mixins.html#custom-option-merge-strategies)

## performance

- **类型：** `boolean`

- **默认：** `false`

- **Usage**:

设置为 `true` 以在浏览器开发工具的性能/时间线面板中启用对组件初始化、编译、渲染和打补丁的性能追踪。只适用于开发模式和支持 [performance.mark](https://developer.mozilla.org/en-US/docs/Web/API/Performance/mark) API 的浏览器上。