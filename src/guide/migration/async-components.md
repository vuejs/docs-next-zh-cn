---
badges:
  - new
---

# 异步组件 <MigrationBadges :badges="$frontmatter.badges" />

## 概览

以下是对变化的高层次概述：

- 新的 `defineAsyncComponent` 助手方法，用于显式地定义异步组件
- `component` 选项重命名为 `loader`
- Loader 函数本身不再接收 `resolve` 和 `reject` 参数，且必须返回一个 Promise

如需更深入的解释，请继续阅读！

## 介绍

以前，异步组件是通过将组件定义为返回 Promise 的函数来创建的，例如：

```js
const asyncModal = () => import('./Modal.vue')
```

或者，对于带有选项的更高阶的组件语法：

```js
const asyncModal = {
  component: () => import('./Modal.vue'),
  delay: 200,
  timeout: 3000,
  error: ErrorComponent,
  loading: LoadingComponent
}
```

## 3.x 语法

现在，在 Vue 3 中，由于函数式组件被定义为纯函数，因此异步组件的定义需要通过将其包裹在新的 `defineAsyncComponent` 助手方法中来显式地定义：

```js
import { defineAsyncComponent } from 'vue'
import ErrorComponent from './components/ErrorComponent.vue'
import LoadingComponent from './components/LoadingComponent.vue'

// 不带选项的异步组件
const asyncModal = defineAsyncComponent(() => import('./Modal.vue'))

// 带选项的异步组件
const asyncModalWithOptions = defineAsyncComponent({
  loader: () => import('./Modal.vue'),
  delay: 200,
  timeout: 3000,
  errorComponent: ErrorComponent,
  loadingComponent: LoadingComponent
})
```

<!-- TODO: translation -->
::: tip NOTE
Vue Router supports a similar mechanism for asynchronously loading route components, known as *lazy loading*. Despite the similarities, this feature is distinct from Vue's support for async components. You should **not** use `defineAsyncComponent` when configuring route components with Vue Router. You can read more about this in the [Lazy Loading Routes](https://next.router.vuejs.org/guide/advanced/lazy-loading.html) section of the Vue Router documentation.
:::

对 2.x 所做的另一个更改是，`component` 选项现在被重命名为 `loader`，以便准确地传达不能直接提供组件定义的信息。

```js{4}
import { defineAsyncComponent } from 'vue'

const asyncModalWithOptions = defineAsyncComponent({
  loader: () => import('./Modal.vue'),
  delay: 200,
  timeout: 3000,
  errorComponent: ErrorComponent,
  loadingComponent: LoadingComponent
})
```

此外，与 2.x 不同，loader 函数不再接收 `resolve` 和 `reject` 参数，且必须始终返回 Promise。

```js
// 2.x 版本
const oldAsyncComponent = (resolve, reject) => {
  /* ... */
}

// 3.x 版本
const asyncComponent = defineAsyncComponent(
  () =>
    new Promise((resolve, reject) => {
      /* ... */
    })
)
```

有关异步组件用法的详细信息，请参阅：

- [指南：动态 & 异步组件](/guide/component-dynamic-async.html#在动态组件上使用-keep-alive)
