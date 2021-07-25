# 应用配置

每个 Vue 应用都会暴露一个 `config` 对象，该对象包含此应用的配置设置：

```js
const app = createApp({})

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

指定一个处理函数，来处理组件渲染方法和侦听器执行期间抛出的未捕获错误。这个处理函数被调用时，可获取错误信息和应用实例。

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

添加一个可以在应用的任何组件实例中访问的全局 property。组件的 property 在命名冲突具有优先权。

这可以代替 Vue 2.x `Vue.prototype` 扩展：

```js
// 之前(Vue 2.x)
Vue.prototype.$http = () => {}

// 之后(Vue 3.x)
const app = createApp({})
app.config.globalProperties.$http = () => {}
```

## optionMergeStrategies

- **类型**：`{ [key: string]: Function }`

- **默认**：`{}`

- **用法**：

```js
const app = createApp({
  mounted() {
    console.log(this.$options.hello)
  }
})

app.config.optionMergeStrategies.hello = (parent, child) => {
  return `Hello, ${child}`
}

app.mixin({
  hello: 'Vue'
})

// 'Hello, Vue'
```

为自定义选项定义合并策略。

合并策略选项分别接收在父实例和子实例上定义的选项的值作为第一个和第二个参数。

- **参考**：[自定义选项合并策略](../guide/mixins.html#自定义选项合并策略)

## performance

- **类型**：`boolean`

- **默认**：`false`

- **用法**：

设置为 `true` 以在浏览器开发工具的 performance/timeline 面板中启用对组件初始化、编译、渲染和更新的性能追踪。只适用于开发模式和支持 [performance.mark](https://developer.mozilla.org/en-US/docs/Web/API/Performance/mark) API 的浏览器。

## compilerOptions <Badge text="3.1+" />

- **类型**：`Object`

配置运行时编译器的选项。设置在这个对象上的值将会被传入浏览器内的模板编译器，并影响配置过的应用内的每个组件。注意，你也可以使用 [`compilerOptions` 选项](/api/options-misc.html#compileroptions)在每个组件的基础上覆写这些选项。

::: tip 重要
该配置选项只在完整的构建中生效 (例如可以在浏览器中编译模板的独立版 `vue.js`)。如果你使用的是附带额外构建设置的仅运行时版，编译器选项必须传入 `@vue/compiler-dom` 构建工具的配置来替代

- 对 `vue-loader` 来说：[通过 `compilerOptions` loader 选项传入](https://vue-loader.vuejs.org/options.html#compileroptions)。也可以查阅 [`vue-cli` 中的配置方式](https://cli.vuejs.org/zh/guide/webpack.html#修改-loader-选项)。

- 对 `vite` 来说：[通过 `@vitejs/plugin-vue` 选项传入](https://github.com/vitejs/vite/tree/main/packages/plugin-vue#example-for-passing-options-to-vuecompiler-dom)。
:::

### compilerOptions.isCustomElement

- **类型**：`(tag: string) => boolean`

- **默认值**：`undefined`

- **用法**：

```js
// 任何 'ion-' 开头的元素都会被识别为自定义元素
app.config.compilerOptions.isCustomElement = tag => tag.startsWith('ion-')
```

指定一个方法来识别 Vue 以外 (例如通过 Web Components API) 定义的自定义元素。如果组件匹配了这个条件，就不需要本地或全局注册，Vue 也不会抛出 `Unknown custom element` 的警告。

> 注意所有的原生 HTML 和 SVG 标记不需要被这个函数匹配——Vue 的解析器会自动检测它们。

### compilerOptions.whitespace

- **类型**：`'condense' | 'preserve'`

- **默认值**：`'condense'`

- **用法**：

```js
app.config.compilerOptions.whitespace = 'preserve'
```

默认情况下，Vue 会移除/压缩模板元素之间的空格以产生更高效的编译结果：

1. 元素内的多个开头/结尾空格会被压缩成一个空格
2. 元素之间的包括折行在内的多个空格会被移除
3. 文本结点之间可被压缩的空格都会被压缩成为一个空格

设置 `'preserve'` 的值可以禁用 (2) 和 (3)。

### compilerOptions.delimiters

- **类型**：`Array<string>`

- **默认值**：`{{ "['\u007b\u007b', '\u007d\u007d']" }}`

- **用法**：

```js
// 将边界符改变为 ES6 模板字符串风格
app.config.compilerOptions.delimiters = ['${', '}']    
```

设置用在模板内的文本插值的边界符。

这个选项一般会用于避免和同样使用大括号语法的服务端框架发生冲突。

### compilerOptions.comments

- **类型**：`boolean`

- **默认值**：`false`

- **用法**：

```js
app.config.compilerOptions.comments = true
```

默认情况下，Vue 会在生产环境下移除模板内的 HTML 注释。将这个选项设置为 `true` 可以强制 Vue 在生产环境下保留注释。而在开发环境下注释是始终被保留的。

这个选项一般会用于依赖 HTML 注释的其它库和 Vue 配合使用。

## isCustomElement <Badge text="deprecated" type="warning"/>

从 3.1.0 开始被废弃。请换用 [`compilerOptions.isCustomElement`](#compileroptions-iscustomelement)。
