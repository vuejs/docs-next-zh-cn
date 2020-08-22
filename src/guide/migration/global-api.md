---
badges:
  - breaking
---

# 全局 API <MigrationBadges :badges="$frontmatter.badges" />

Vue 2.x 有许多全局 API 和配置，这些 API 和配置可以全局改变 Vue 的行为。例如，要创建全局组件，可以使用 `Vue.component` 这样的 API：

```js
Vue.component('button-counter', {
  data: () => ({
    count: 0
  }),
  template: '<button @click="count++">Clicked {{ count }} times.</button>'
})
```

类似地，以下是全局指令的声明方式：

```js
Vue.directive('focus', {
  inserted: el => el.focus()
})
```

虽然这种方法很方便，但它会导致一些问题。从技术上讲，Vue 2 没有“app”的概念，我们定义的应用程序只是通过 `new Vue()` 创建的根 Vue 实例。从同一个 Vue 构造函数**创建的每个根实例共享相同的全局配置**，因此：


- 全局配置使得在测试期间很容易意外地污染其他测试用例。用户需要仔细存储原始全局配置，并在每次测试后恢复 (例如重置 `Vue.config.errorHandler`)。有些 API 像 `Vue.使用` 以及 `Vue.mixin` 甚至连恢复效果的方法都没有，这使得涉及插件的测试特别棘手。实际上，vue test utils 必须实现一个特殊的 API `createLocalVue` 来处理此问题：

```js
import { createLocalVue, mount } from '@vue/test-utils'

// 建扩展的 `Vue` 构造函数
const localVue = createLocalVue()

// 在 “local” Vue构造函数上 “全局” 安装插件
localVue.use(MyPlugin)

// 通过 `localVue` 来挂载选项
mount(Component, { localVue })
```
- 全局配置使得在同一页面上的多个“app”之间共享同一个 Vue 副本非常困难，但全局配置不同。
  ```js
  // 这会影响两个根实例
  Vue.mixin({
    /* ... */
  })

  const app1 = new Vue({ el: '#app-1' })
  const app2 = new Vue({ el: '#app-2' })
  ```

为了避免这些问题，在 Vue 3 中我们引入...

## 一个新的全局 API：`createApp`

调用 `createApp` 返回一个应用实例，这是 Vue 3 中的新概念：

```js
import { createApp } from 'vue'

const app = createApp({})
```

应用程序实例暴露当前全局 API 的子集，经验法则是，任何全局改变 Vue 行为的 API 现在都会移动到应用实例上，以下是当前全局 API 及其相应实例 API 的表：

| 2.x 全局 API             | 3.x 实例 API (`app`)                                                                          |
| -------------------------- | ------------------------------------------------------------------------------------------- |
| Vue.config                 | app.config                                                                                  |
| Vue.config.productionTip   | _removed_ ([见下方](#config-productiontip-removed))                                          |
| Vue.config.ignoredElements | app.config.isCustomElement ([见下方](#config-ignoredelements-is-now-config-iscustomelement)) |
| Vue.component              | app.component                                                                                |
| Vue.directive              | app.directive                                                                                |
| Vue.mixin                  | app.mixin                                                                                    |
| Vue.use                    | app.use ([见下方w](#a-note-for-plugin-authors))                                              |

所有其他不全局改变行为的全局 API 现在被命名为 exports，文档见[全局] API Treeshaking](。/global-api-treeshaking.html)。

### `config.productionTip` 移除

在 Vue 3.x 中，“使用生产版本”提示仅在使用“dev + full build”(包含运行时编译器并有警告的构建) 时才会显示。

对于 ES 模块构建，由于它们是与 bundler 一起使用的，而且在大多数情况下，CLI 或样板已经正确地配置了生产环境，所以本技巧将不再出现。

### `config.ignoredElements` 替换为 `config.isCustomElement`

引入此配置选项的目的是支持原生自定义元素，因此重命名可以更好地传达它的功能，新选项还需要一个比旧的 string/RegExp 方法提供更多灵活性的函数：

```js
// before
Vue.config.ignoredElements = ['my-el', /^ion-/]

// after
const app = Vue.createApp({})
app.config.isCustomElement = tag => tag.startsWith('ion-')
```

:::tip 重要

在 3.0 中，元素是否是组件的检查已转移到模板编译阶段，因此只有在使用运行时编译器时才考虑此配置选项。如果你使用的是 runtime-only 版本 `isCustomElement` 必须通过 `@vue/compiler-dom` 在构建步骤替换——比如，通过 [`compilerOptions` option in vue-loader](https://vue-loader.vuejs.org/options.html#compileroptions)。

- 如果 `config.isCustomElement` 当使用仅运行时构建时时，将发出警告，指示用户在生成设置中传递该选项；
- 这将是 Vue CLI 配置中新的顶层选项。
:::

### 插件作者须知

插件作者通常使用 `Vue.use`。例如，官方的 `vue-router` 插件是如何在浏览器环境中自行安装的：

```js
var inBrowser = typeof window !== 'undefined'
/* … */
if (inBrowser && window.Vue) {
  window.Vue.use(VueRouter)
}
```

由于 `use` 全局 API 在 Vue 3 中不再可用，此方法将停止工作并停止调用 `Vue.use()` 现在将触发警告，于是，最终用户现在必须在应用程序实例上显式指定使用插件：

```js
const app = createApp(MyApp)
app.use(VueRouter)
```

## 挂载 App 实例

使用 `createApp(/* options */)` 初始化后，应用实例 `app` 可用于挂载具有 `app.mount(domTarget)`：

```js
import { createApp } from 'vue'
import MyApp from './MyApp.vue'

const app = createApp(MyApp)
app.mount('#app')
```

经过所有这些更改，我们在指南开头的组件和指令将被改写为如下内容：

```js
const app = createApp(MyApp)

app.component('button-counter', {
  data: () => ({
    count: 0
  }),
  template: '<button @click="count++">Clicked {{ count }} times.</button>'
})

app.directive('focus', {
  mounted: el => el.focus()
})

// 现在所有应用实例都挂载了，与其组件树一起，将具有相同的 “button-counter” 组件 和 “focus” 指令不污染全局环境
app.mount('#app')
```

## 提供/注入 (Provide / Inject)

与在 2.x 根实例中使用 `provide` 选项类似，Vue 3 应用程序实例还可以提供可由应用程序内的任何组件注入的依赖项：

```js
// 在入口
app.provide({
  guide: 'Vue 3 Guide'
})

// 在子组件
export default {
  inject: {
    book: {
      from: guide
    }
  },
  template: `<div>{{ book }}</div>`
}
```

## 在应用程序之间共享配置

在应用程序之间共享配置 (如组件或指令) 的一种方法是创建工厂功能，如下所示：

```js
import { createApp } from 'vue'
import Foo from './Foo.vue'
import Bar from './Bar.vue'

const createMyApp = options => {
  const app = createApp(options)
  app.directive('focus' /* ... */)

  return app
}

createMyApp(Foo).mount('#foo')
createMyApp(Bar).mount('#bar')
```

现在，Foo 和 Bar 实例及其后代中都可以使用 `focus` 指令。
