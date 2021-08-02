---
badges:
  - breaking
---

# 全局 API <MigrationBadges :badges="$frontmatter.badges" />

Vue 2.x 有许多全局 API 和配置，这些 API 和配置可以全局改变 Vue 的行为。例如，要注册全局组件，可以使用 `Vue.component` 这样的 API：

```js
Vue.component('button-counter', {
  data: () => ({
    count: 0
  }),
  template: '<button @click="count++">Clicked {{ count }} times.</button>'
})
```

类似地，使用全局指令的声明方式如下：

```js
Vue.directive('focus', {
  inserted: el => el.focus()
})
```

虽然这种声明方式很方便，但它也会导致一些问题。从技术上讲，Vue 2 没有“app”的概念，我们定义的应用只是通过 `new Vue()` 创建的根 Vue 实例。从同一个 Vue 构造函数**创建的每个根实例共享相同的全局配置**，因此：

- 在测试期间，全局配置很容易意外地污染其他测试用例。用户需要仔细存储原始全局配置，并在每次测试后恢复 (例如重置 `Vue.config.errorHandler`)。有些 API 像 `Vue.use` 以及 `Vue.mixin` 甚至连恢复效果的方法都没有，这使得涉及插件的测试特别棘手。实际上，vue-test-utils 必须实现一个特殊的 API `createLocalVue` 来处理此问题：

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

调用 `createApp` 返回一个*应用实例*，这是 Vue 3 中的新概念：

```js
import { createApp } from 'vue'

const app = createApp({})
```

如果你使用的是 Vue 的 [CDN](/guide/installation.html#cdn) 构建，那么 `createApp` 是通过全局的 `Vue` 对象暴露的。

```js
const { createApp } = Vue

const app = createApp({})
```

应用实例暴露了 Vue 2 当前全局 API 的子集，经验法则是，_任何全局改变 Vue 行为的 API 现在都会移动到应用实例上_，以下是当前 Vue2 全局 API 及其相应实例 API 的表：

| 2.x 全局 API               | 3.x 实例 API (`app`)                                                                                         |
| -------------------------- | ------------------------------------------------------------------------------------------------------------ |
| Vue.config                 | app.config                                                                                                   |
| Vue.config.productionTip   | _removed_ ([见下方](#config-productiontip-移除))                                                             |
| Vue.config.ignoredElements | app.config.compilerOptions.isCustomElement ([见下方](#config-ignoredelements-替换为-config-iscustomelement)) |
| Vue.component              | app.component                                                                                                |
| Vue.directive              | app.directive                                                                                                |
| Vue.mixin                  | app.mixin                                                                                                    |
| Vue.use                    | app.use ([见下方](#插件使用者须知))                                                                          |
| Vue.prototype              | app.config.globalProperties ([见下方](#vue-prototype-替换为-config-globalproperties))                        |
| Vue.extend                 | _removed_ ([see below](#vue-extend-removed))                                                                 |

所有其他不全局改变行为的全局 API 现在被命名为 exports，文档见[全局 API Treeshaking](/guide/migration/global-api-treeshaking.html)。

### `config.productionTip` 移除

在 Vue 3.x 中，“使用生产版本”提示仅在使用“dev + full build”(包含运行时编译器并有警告的构建) 时才会显示。

对于 ES 模块构建，由于它们是与 bundler 一起使用的，而且在大多数情况下，CLI 或样板已经正确地配置了生产环境，所以本技巧将不再出现。

[迁移构建标记：`CONFIG_PRODUCTION_TIP`](migration-build.html#兼容性配置)

### `config.ignoredElements` 替换为 `config.isCustomElement`

引入此配置选项的目的是支持原生自定义元素，因此重命名可以更好地传达它的功能，新选项还需要一个比旧的 string/RegExp 方法提供更多灵活性的函数：

```js
// 之前
Vue.config.ignoredElements = ['my-el', /^ion-/]

// 之后
const app = createApp({})
app.config.compilerOptions.isCustomElement = tag => tag.startsWith('ion-')
```

:::tip 重要

在 Vue 3 中，元素是否是组件的检查已转移到模板编译阶段，因此只有在使用运行时编译器时才考虑此配置选项。如果你使用的是 runtime-only 版本 `isCustomElement` 必须通过 `@vue/compiler-dom` 在构建步骤替换——比如，通过 [`compilerOptions` option in vue-loader](https://vue-loader.vuejs.org/options.html#compileroptions)。

- 如果 `config.compilerOptions.isCustomElement` 当使用仅运行时构建时时，将发出警告，指示用户在生成设置中传递该选项；
- 这将是 Vue CLI 配置中新的顶层选项。
  :::

[迁移构建标记：`CONFIG_IGNORED_ELEMENTS`](migration-build.html#兼容性配置)

### `Vue.prototype` 替换为 `config.globalProperties`

在 Vue 2 中， `Vue.prototype` 通常用于添加所有组件都能访问的 property。

在 Vue 3 等同于[`config.globalProperties`](/api/application-config.html#globalproperties)。这些 property 将被复制到应用中作为实例化组件的一部分。

```js
// 之前 - Vue 2
Vue.prototype.$http = () => {}
```

```js
// 之后 - Vue 3
const app = createApp({})
app.config.globalProperties.$http = () => {}
```

使用 `provide` ([稍后](#provide-inject)会讨论) 时，也应考虑作为 `globalProperties` 的替代品。

<!-- TODO: translation -->

[Migration build flag: `GLOBAL_PROTOTYPE`](migration-build.html#兼容性配置)

### `Vue.extend` 移除

在 Vue 2.x 中，`Vue.extend` 曾经被用于创建一个基于 Vue 构造函数的“子类”，其参数应为一个包含组件选项的对象。在 Vue 3.x 中，我们已经没有组件构造器的概念了。应该始终使用 `createApp` 这个全局 API 来挂载组件：

```js
// 之前 - Vue 2
// 创建构造器
const Profile = Vue.extend({
  template: '<p>{{firstName}} {{lastName}} aka {{alias}}</p>',
  data() {
    return {
      firstName: 'Walter',
      lastName: 'White',
      alias: 'Heisenberg'
    }
  }
})
// 创建一个 Profile 的实例，并将它挂载到一个元素上
new Profile().$mount('#mount-point')
```

```js
// 之后 - Vue 3
const Profile = {
  template: '<p>{{firstName}} {{lastName}} aka {{alias}}</p>',
  data() {
    return {
      firstName: 'Walter',
      lastName: 'White',
      alias: 'Heisenberg'
    }
  }
}
Vue.createApp(Profile).mount('#mount-point')
```

#### 类型推断

在 Vue 2 中，`Vue.extend` 也被用来为组件选项提供 TypeScript 类型推断。在 Vue 3 中，为了达到相同的目的，`defineComponent` 全局 API 可以用来作为 `Vue.extend` 的替代方案。

需要注意的是，虽然 `defineComponent` 的返回类型是一个类似构造器的类型，但是它的目的仅仅是为了 TSX 的推断。在运行时 `defineComponent` 大部分是无操作的，且会将选项参数原样返回。

#### 组件继承

在 Vue 3 中，我们强烈建议使用 [组合式 API](/api/composition-api.html) 来替代继承与 mixin。如果因为某种原因仍然需要使用组件继承，你可以使用 [`extends` 选项](/api/options-composition.html#extends) 来代替 `Vue.extend`。

[迁移构建标记：`GLOBAL_EXTEND`](migration-build.html#兼容性配置)

### 插件使用者须知

插件开发者通常使用 `Vue.use`。例如，官方的 `vue-router` 插件是如何在浏览器环境中自行安装的：

```js
var inBrowser = typeof window !== 'undefined'
/* … */
if (inBrowser && window.Vue) {
  window.Vue.use(VueRouter)
}
```

由于 `use` 全局 API 在 Vue 3 中不再使用，此方法将停止工作并停止调用 `Vue.use()` 现在将触发警告，于是，开发者必须在应用程序实例上显式指定使用此插件：

```js
const app = createApp(MyApp)
app.use(VueRouter)
```

## 挂载 App 实例

使用 `createApp(/* options */)` 初始化后，应用实例 `app` 可用 `app.mount(domTarget)` 挂载根组件实例：

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

// 现在，所有通过 `app.mount()` 挂载的应用实例及其组件树，将具有相同的 “button-counter” 组件和 “focus” 指令，而不会污染全局环境
app.mount('#app')
```

[迁移构建标记：`GLOBAL_MOUNT`](migration-build.html#兼容性配置)

## Provide / Inject

与在 2.x 根实例中使用 `provide` 选项类似，Vue 3 应用实例也提供了可被应用内任意组件注入的依赖项：

```js
// 在入口
app.provide('guide', 'Vue 3 Guide')

// 在子组件
export default {
  inject: {
    book: {
      from: 'guide'
    }
  },
  template: `<div>{{ book }}</div>`
}
```

使用 `provide` 在编写插件时非常有用，可以替代 `globalProperties`。

## 在应用之间共享配置

在应用之间共享配置 (如组件或指令) 的一种方法是创建工厂函数，如下所示：

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

现在，`Foo` 和 `Bar` 实例及其后代中都可以使用 `focus` 指令。
