---
badges:
  - new
---

# 异步组件<MigrationBadges :badges="$frontmatter.badges" />

## 概览

以下是对变化的高层次概述：

- 新 `defineAsyncComponent` 助手方法，它显示定义异步组件
- `component` 选项重命名为 `loader`
- 加载程序函数本身不接收`resolve`和`reject`参数，必须返回一个Promise

如需更深入的解释，请继续阅读！

## 介绍

以前，异步组件是通过将组件定义为返回 promise 的函数来创建的，例如：

```js
const asyncPage = () => import('./NextPage.vue')
```

或者，对于带有选项的更高级组件语法：

```js
const asyncPage = {
  component: () => import('./NextPage.vue'),
  delay: 200,
  timeout: 3000,
  error: ErrorComponent,
  loading: LoadingComponent
}
```

## 3.x 语法


现在，在Vue 3中，由于功能组件被定义为纯函数，因此需要通过将异步组件定义包装在新的`defineAsyncComponent`助手中来显式定义异步组件：

```js
import { defineAsyncComponent } from 'vue'
import ErrorComponent from './components/ErrorComponent.vue'
import LoadingComponent from './components/LoadingComponent.vue'

// 不带选项的异步组件
const asyncPage = defineAsyncComponent(() => import('./NextPage.vue'))

// 带选项的异步组件
const asyncPageWithOptions = defineAsyncComponent({
  loader: () => import('./NextPage.vue'),
  delay: 200,
  timeout: 3000,
  errorComponent: ErrorComponent,
  loadingComponent: LoadingComponent
})
```

对2.x所做的另一个更改是，`component` 选项现在被重命名为 `loader`，以便准确地传达不能直接提供组件定义的信息。

```js{4}
import { defineAsyncComponent } from 'vue'

const asyncPageWithOptions = defineAsyncComponent({
  loader: () => import('./NextPage.vue'),
  delay: 200,
  timeout: 3000,
  error: ErrorComponent,
  loading: LoadingComponent
})
```

此外，与2.x不同，loader函数不再接收 `resolve` 和  `reject`  参数，必须始终返回Promise。

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

- [指南: 动态 & 异步组件](/guide/component-dynamic-async.html#dynamic-components-with-keep-alive)
