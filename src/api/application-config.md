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

<!-- TODO: translation -->
## compilerOptions <Badge text="3.1+" />

- **Type:** `Object`

Configure runtime compiler options. Values set on this object will be passed to the in-browser template compiler and affect every component in the configured app. Note you can also override these options on a per-component basis using the [`compilerOptions` option](/api/options-misc.html#compileroptions).

::: tip Important
This config option is only respected when using the full build (i.e. the standalone `vue.js` that can compile templates in the browser). If you are using the runtime-only build with a build setup, compiler options must be passed to `@vue/compiler-dom` via build tool configurations instead.

- For `vue-loader`: [pass via the `compilerOptions` loader option](https://vue-loader.vuejs.org/options.html#compileroptions). Also see [how to configure it in `vue-cli`](https://cli.vuejs.org/guide/webpack.html#modifying-options-of-a-loader).

- For `vite`: [pass via `@vitejs/plugin-vue` options](https://github.com/vitejs/vite/tree/main/packages/plugin-vue#example-for-passing-options-to-vuecompiler-dom).
:::

### compilerOptions.isCustomElement

- **Type:** `(tag: string) => boolean`

- **Default:** `undefined`

- **Usage:**

```js
// any element starting with 'ion-' will be recognized as a custom one
app.config.compilerOptions.isCustomElement = tag => tag.startsWith('ion-')
```

Specifies a method to recognize custom elements defined outside of Vue (e.g., using the Web Components APIs). If component matches this condition, it won't need local or global registration and Vue won't throw a warning about an `Unknown custom element`.

> Note that all native HTML and SVG tags don't need to be matched in this function - Vue parser performs this check automatically.
### compilerOptions.whitespace

- **Type:** `'condense' | 'preserve'`

- **Default:** `'condense'`

- **Usage:**

```js
app.config.compilerOptions.whitespace = 'preserve'
```

By default, Vue removes/condenses whitespaces between template elements to produce more efficient compiled output:

1. Leading / ending whitespaces inside an element are condensed into a single space
2. Whitespaces between elements that contain newlines are removed
3. Consecutive whitespaces in text nodes are condensed into a single space

Setting the value to `'preserve'` will disable (2) and (3).

### compilerOptions.delimiters

- **Type:** `Array<string>`

- **Default:** `{{ "['\u007b\u007b', '\u007d\u007d']" }}`

- **Usage:**

```js
// Delimiters changed to ES6 template string style
app.config.compilerOptions.delimiters = ['${', '}']    
```

Sets the delimiters used for text interpolation within the template.

Typically this is used to avoid conflicting with server-side frameworks that also use mustache syntax.

### compilerOptions.comments

- **Type:** `boolean`

- **Default:** `false`

- **Usage:**

```js
app.config.compilerOptions.comments = true
```

By default, Vue will remove HTML comments inside templates in production. Setting this option to `true` will force Vue to preserve comments even in production. Comments are always preserved during development.

This option is typically used when Vue is used with other libraries that rely on HTML comments.

## isCustomElement <Badge text="deprecated" type="warning"/>

Deprecated in 3.1.0. Use [`compilerOptions.isCustomElement`](#compileroptions-iscustomelement) instead.
