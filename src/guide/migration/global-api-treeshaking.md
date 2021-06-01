---
badges:
  - breaking
---

# 全局 API Treeshaking <MigrationBadges :badges="$frontmatter.badges" />

## 2.x 语法

如果你曾经在 Vue 中手动操作过 DOM，你可能会遇到这种方式：

```js
import Vue from 'vue'

Vue.nextTick(() => {
  // 一些和DOM有关的东西
})
```

或者，如果你在对涉及[异步组件](/guide/component-dynamic-async.html)的应用程序进行单元测试，那么很可能你编写了以下内容：

```js
import { shallowMount } from '@vue/test-utils'
import { MyComponent } from './MyComponent.vue'

test('an async feature', async () => {
  const wrapper = shallowMount(MyComponent)

  // 执行一些DOM相关的任务

  await wrapper.vm.$nextTick()

  // 运行你的断言
})
```

`Vue.nextTick()` 是一个直接暴露在单个 Vue 对象上的全局 API。实际上，实例方法 `$nextTick()` 只是一个方便的 `Vue.nextTick()` 包裹器，将其回调的 `this` 上下文自动绑定到当前实例上，以方便使用。

但是，如果你从来没有处理过手动的 DOM 操作，也没有在你的应用中使用或测试异步组件，怎么办？或者，不管出于什么原因，你更喜欢使用老式的 `window.setTimeout()` 来代替呢？在这种情况下，`nextTick()` 的代码就会变成死代码--也就是说，写了代码但从未使用过。而死代码几乎不是一件好事，尤其是在我们的客户端上下文中，每一行代码都很重要。

如 [webpack](https://webpack.js.org/) 这样的模块打包工具支持 [tree-shaking](https://webpack.js.org/guides/tree-shaking/)，这是表达“死代码消除”的一个花哨术语。遗憾的是，由于在之前的 Vue 版本中代码是这样编写的，全局 API 如 `Vue.nextTick()` 是不支持 tree-shake 的，不管它们实际是否被使用，都会被包含在最终的打包产物中。

## 3.x 语法

在 Vue 3 中，全局和内部 API 都经过了重构，并考虑到了 tree-shaking 的支持。因此，全局 API 现在只能作为 ES 模块构建的命名导出进行访问。例如，我们之前的片段现在应该如下所示：

```js
import { nextTick } from 'vue'

nextTick(() => {
  // 一些和DOM有关的东西
})
```

与

```js
import { shallowMount } from '@vue/test-utils'
import { MyComponent } from './MyComponent.vue'
import { nextTick } from 'vue'

test('an async feature', async () => {
  const wrapper = shallowMount(MyComponent)

  // 执行一些DOM相关的任务

  await nextTick()

  // 运行你的断言
})
```

直接调用 `Vue.nextTick()` 将导致臭名昭著的 `undefined is not a function` 错误。

通过这一更改，如果模块打包工具支持 tree-shake，则 Vue 应用程序中未使用的全局 API 将从最终的打包产物中排除，从而获得最佳的文件大小。

## 受影响的 API

Vue 2.x 中的这些全局 API 受此更改的影响：

- `Vue.nextTick`
- `Vue.observable` (用 `Vue.reactive` 替换)
- `Vue.version`
- `Vue.compile` (仅完整构建版本)
- `Vue.set` (仅兼容构建版本)
- `Vue.delete` (仅兼容构建版本)

## 内部帮助器

除了公共 API，许多内部组件/帮助器现在也被导出为命名导出，只有当编译器的输出是这些特性时，才允许编译器导入这些特性，例如以下模板：

```html
<transition>
  <div v-show="ok">hello</div>
</transition>
```

被编译为类似于以下的内容：

```js
import { h, Transition, withDirectives, vShow } from 'vue'

export function render() {
  return h(Transition, [withDirectives(h('div', 'hello'), [[vShow, this.ok]])])
}
```

这实际上意味着只有在应用程序实际使用了 `Transition` 组件时才会导入它。换句话说，如果应用程序没有任何 `Transition` 组件，那么支持此功能的代码将不会出现在最终的捆绑包中。

有了全局 tree-shake 后，用户只需为他们实际使用的功能“买单”。更好的是，知道了可选特性不会增加未使用它们的应用程序的打包产物大小，以后在追加核心功能时，即使对框架大小有顾虑，这也不再是那么重要的考虑因素了。

:::warning 重要
以上仅适用于 [ES Modules builds](/guide/installation.html#对不同构建版本的解释)，用于支持 tree-shaking 的打包工具——UMD 构建仍然包括所有特性，并暴露 Vue 全局变量上的所有内容 (编译器将生成适当的输出以从该全局变量上使用 API，而不是导入)。
:::

## 插件中的用法

如果你的插件依赖受影响的 Vue 2.x 全局 API，例如：

```js
const plugin = {
  install: Vue => {
    Vue.nextTick(() => {
      // ...
    })
  }
}
```

在 Vue 3 中，必须显式导入：

```js
import { nextTick } from 'vue'

const plugin = {
  install: app => {
    nextTick(() => {
      // ...
    })
  }
}
```

如果使用 webpack 这样的模块打包工具，这可能会导致 Vue 的源代码输出打包到插件中，而且通常情况下，这并不是你所期望的。防止这种情况发生的一种常见做法是配置模块打包工具以将 Vue 从最终 bundle 中排除。对于 webpack，你可以使用 [`externals`](https://webpack.js.org/configuration/externals/) 配置选项：

```js
// webpack.config.js
module.exports = {
  /*...*/
  externals: {
    vue: 'Vue'
  }
}
```

这将告诉 webpack 将 Vue 模块视为一个外部库，而不将它打包进来。

如果你选择的模块打包工具恰好是 [Rollup](https://rollupjs.org/)，你基本上可以直接获得相同的效果，因为默认情况下，Rollup 会将绝对模块 id (在我们的例子中为 `'vue'`) 作为外部依赖项，而不会将它们包含在最终的 bundle 中。但是在输出打包期间，它可能会抛出一个[“将 vue 作为外部依赖”](https://rollupjs.org/guide/en/#warning-treating-module-as-external-dependency)警告，可使用 `external` 选项阻止该警告：

```js
// rollup.config.js
export default {
  /*...*/
  external: ['vue']
}
```
