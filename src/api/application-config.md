# 应用配置

每个 Vue 应用都会暴露一个 `config` 对象，该对象包含此应用的配置设置：

```js
const app = Vue.createApp({})

console.log(app.config)
```

在挂载应用之前，你可以修改其 property，如下所示。

## errorHandler

- **类型**：`Function`

- **默认**：`undefined`

- **用法**：

```js
app.config.errorHandler = (err, vm, info) => {
  // 处理错误
  // `info` 是 Vue 特定的错误信息，比如错误所在的生命周期钩子
}
```

指定一个处理函数，来处理组件渲染方法执行期间以及侦听器抛出的未捕获错误。这个处理函数被调用时，可获取错误信息和应用实例。

> 错误追踪服务 [Sentry](https://sentry.io/for/vue/) 和 [Bugsnag](https://docs.bugsnag.com/platforms/browsers/vue/) 使用此选项提供官方集成。

## warnHandler

- **类型**：`Function`

- **默认**：`undefined`

- **用法**：

```js
app.config.warnHandler = function(msg, vm, trace) {
  // `trace` 是组件的继承关系追踪
}
```

为 Vue 的运行时警告指定一个自定义处理函数。注意这只会在开发环境下生效，在生产环境下它会被忽略。

## globalProperties

- **类型**：`[key: string]: any`

- **默认**：`undefined`

- **用法**：

```js
app.config.globalProperties.foo = 'bar'

app.component('child-component', {
  mounted() {
    console.log(this.foo) // 'bar'
  }
})
```

添加可以在应用程序内的任何组件实例中访问的全局 property。属性名冲突时，组件的 property 将具有优先权。

这可以代替 Vue 2.x `Vue.prototype` 扩展：

```js
// 之前(Vue 2.x)
Vue.prototype.$http = () => {}

// 之后(Vue 3.x)
const app = Vue.createApp({})
app.config.globalProperties.$http = () => {}
```

## isCustomElement

- **类型**：`(tag: string) => boolean`

- **默认**：`undefined`

- **用法**：

```js
// 任何以“ion-”开头的元素都将被识别为自定义元素
app.config.isCustomElement = tag => tag.startsWith('ion-')
```

指定一个方法，用来识别在 Vue 之外定义的自定义元素（例如，使用 Web Components API）。如果组件符合此条件，则不需要本地或全局注册，并且 Vue 不会抛出关于 `Unknown custom element` 的警告。

> 注意，所有原生 HTML 和 SVG 标记不需要在此函数中匹配——Vue 解析器自动执行此检查。

::: tip 重要
这个配置项只有在使用运行时编译器 (runtime compiler) 版本时才会被独享。如果你使用的是仅运行时 (runtime-only) 版本，那么 `isCustomElement` 就必须通过构建设置，例如 [vue-loader 中的 `compilerOptions` 选项](https://vue-loader.vuejs.org/options.html#compileroptions)，传递给 `@vue/compiler-dom`。
:::

## optionMergeStrategies

- **类型**：`{ [key: string]: Function }`

- **默认**：`{}`

- **用法**：

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

// 'Hello, Vue'
```

为自定义选项定义合并策略。

合并策略选项分别接收在父实例和子实例上定义的该选项的值作为第一个和第二个参数，引用上下文实例被作为第三个参数传入。

- **参考**：[自定义选项合并策略](../guide/mixins.html#自定义选项合并策略)

## performance

- **类型**：`boolean`

- **默认**：`false`

- **用法**：

设置为 `true` 以在浏览器开发工具的 performance/timeline 面板中启用对组件初始化、编译、渲染和更新的性能追踪。只适用于开发模式和支持 [performance.mark](https://developer.mozilla.org/en-US/docs/Web/API/Performance/mark) API 的浏览器。
