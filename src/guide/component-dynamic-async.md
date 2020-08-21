# 动态组件 & 异步组件

> 该页面假设你已经阅读过了[组件基础](component-basics.md)。如果你还对组件不太了解，推荐你先阅读它。

## 在动态组件上使用 `keep-alive`

我们之前曾经在一个多标签的界面中使用 `is` attribute 来切换不同的组件：

```vue-html
<component :is="currentTabComponent"></component>
```

当在这些组件之间切换的时候，你有时会想保持这些组件的状态，以避免反复重渲染导致的性能问题。例如我们来展开说一说这个多标签界面：

<p class="codepen" data-height="300" data-theme-id="39028" data-default-tab="html,result" data-user="Vue" data-slug-hash="jOPjZOe" data-editable="true" style="height: 300px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="Dynamic components: without keep-alive">
  <span>See the Pen <a href="https://codepen.io/team/Vue/pen/jOPjZOe">
  Dynamic components: without keep-alive</a> by Vue (<a href="https://codepen.io/Vue">@Vue</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

你会注意到，如果你选择了一篇文章，切换到 *Archive* 标签，然后再切换回 Posts，是不会继续展示你之前选择的文章的。这是因为你每次切换新标签的时候，Vue 都创建了一个新的 `currentTabComponent` 实例。

重新创建动态组件的行为通常是非常有用的，但是在这个案例中，我们更希望那些标签的组件实例能够被在它们第一次被创建的时候缓存下来。为了解决这个问题，我们可以用一个 `<keep-alive>` 元素将其动态组件包裹起来。

```vue-html
<!-- 失活的组件将会被缓存！-->
<keep-alive>
  <component :is="currentTabComponent"></component>
</keep-alive>
```

来看看修改后的结果：

<p class="codepen" data-height="300" data-theme-id="39028" data-default-tab="html,result" data-user="Vue" data-slug-hash="VwLJQvP" data-editable="true" style="height: 300px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="Dynamic components: with keep-alive">
  <span>See the Pen <a href="https://codepen.io/team/Vue/pen/VwLJQvP">
  Dynamic components: with keep-alive</a> by Vue (<a href="https://codepen.io/Vue">@Vue</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

现在这个 *Posts* 标签保持了它的状态 (被选中的文章) 甚至当它未被渲染时也是如此。你可以在这个示例查阅到完整的代码。

你可以在 [API 参考文档](../api/built-in-components.html#keep-alive) 查阅更多关于 `<keep-alive>` 的细节。

## 异步组件

在大型应用中，我们可能需要将应用分割成小一些的代码块，并且只在需要的时候才从服务器加载一个模块。为了简化，Vue 有一个`defineAsyncComponent` 方法：

```js
const app = Vue.createApp({})

const AsyncComp = Vue.defineAsyncComponent(
  () =>
    new Promise((resolve, reject) => {
      resolve({
        template: '<div>I am async!</div>'
      })
    })
)

app.component('async-example', AsyncComp)
```

如你所见，此方法接受返回 `Promise` 的工厂函数。从服务器检索组件定义后，应调用Promise的 `resolve` 回调。你也可以调用 `reject(reason)`，以指示加载失败。

你也可以在工厂函数中返回一个` Promise`，所以把 webpack 2 和 ES2015 语法加在一起，我们可以这样使用动态导入：

```js
import { defineAsyncComponent } from 'vue'

const AsyncComp = defineAsyncComponent(() =>
  import('./components/AsyncComponent.vue')
)

app.component('async-component', AsyncComp)
```

当 [在本地注册组件](component-registration.html#local-registration) 时，你也可以使用 `dfineAysncComponent`

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

### 与Suspense一起使用

异步组件在默认情况下是可挂起的。这意味着如果它在父链中有一个[`<Suspense>`](TODO)，它将被视为该`<Suspense>`的异步依赖。在这种情况下，加载状态将由 `<Suspense>` 控制，组件自身的加载、错误、延迟和超时选项将被忽略。

The async component can opt-out of `Suspense` control and let the component always control its own loading state by specifying `suspensible: false` in its options.

异步组件可以选择退出 `Suspense` 控制，并通过在其选项中指定 `suspensable:false` ，让组件始终控制自己的加载状态。

你可以在中查看可用选项的列表 [API Reference](../api/global-api.html#arguments-4)