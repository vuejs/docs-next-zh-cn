# 动态组件 & 异步组件

> 该页面假设你已经阅读过了[组件基础](component-basics.md)。如果你对组件还不太了解，推荐你先阅读它。

## 在动态组件上使用 `keep-alive`

我们之前曾经在一个多标签的界面中使用 `is` attribute 来切换不同的组件：

```vue-html
<component :is="currentTabComponent"></component>
```

当在这些组件之间切换的时候，你有时会想保持这些组件的状态，以避免反复渲染导致的性能问题。例如我们来展开说一说这个多标签界面：

<common-codepen-snippet title="Dynamic components: without keep-alive" slug="jOPjZOe" tab="html,result" />

你会注意到，如果你选择了一篇文章，切换到 *Archive* 标签，然后再切换回 *Posts*，是不会继续展示你之前选择的文章的。这是因为你每次切换新标签的时候，Vue 都创建了一个新的 `currentTabComponent` 实例。

重新创建动态组件的行为通常是非常有用的，但是在这个案例中，我们更希望那些标签的组件实例能够被在它们第一次被创建的时候缓存下来。为了解决这个问题，我们可以用一个 `<keep-alive>` 元素将其动态组件包裹起来。

```vue-html
<!-- 失活的组件将会被缓存！-->
<keep-alive>
  <component :is="currentTabComponent"></component>
</keep-alive>
```

来看看修改后的结果：

<common-codepen-snippet title="Dynamic components: with keep-alive" slug="VwLJQvP" tab="html,result" />

现在，这个 *Posts* 标签即使在未被渲染时也能保持它的状态 (被选中的文章) 。

你可以在 [API 参考](../api/built-in-components.html#keep-alive)查阅更多关于 `<keep-alive>` 的细节。

## 异步组件

在大型应用中，我们可能需要将应用分割成小一些的代码块，并且只在需要的时候才从服务器加载一个模块。为了实现这个效果，Vue 有一个 `defineAsyncComponent` 方法：

```js
const { createApp, defineAsyncComponent } = Vue

const app = createApp({})

const AsyncComp = defineAsyncComponent(
  () =>
    new Promise((resolve, reject) => {
      resolve({
        template: '<div>I am async!</div>'
      })
    })
)

app.component('async-example', AsyncComp)
```

如你所见，此方法接受一个返回 `Promise` 的工厂函数。从服务器检索组件定义后，应调用 Promise 的 `resolve` 回调。你也可以调用 `reject(reason)`，来表示加载失败。

你也可以在工厂函数中返回一个 `Promise`，把 webpack 2 及以上版本和 ES2015 语法相结合后，我们就可以这样使用动态地导入：

```js
import { defineAsyncComponent } from 'vue'

const AsyncComp = defineAsyncComponent(() =>
  import('./components/AsyncComponent.vue')
)

app.component('async-component', AsyncComp)
```

当[在局部注册组件](component-registration.html#局部注册)时，你也可以使用 `defineAsyncComponent`：

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

### 与 Suspense 一起使用

异步组件在默认情况下是*可挂起*的。这意味着如果它在父链中有一个 `<Suspense>`，它将被视为该 `<Suspense>` 的异步依赖。在这种情况下，加载状态将由 `<Suspense>` 控制，组件自身的加载、错误、延迟和超时选项都将被忽略。

通过在其选项中指定 `suspensible: false`，异步组件可以退出 `Suspense` 控制，并始终控制自己的加载状态。

你可以在 [API 参考](../api/global-api.html#参数-4)查看更多可用的选项。
