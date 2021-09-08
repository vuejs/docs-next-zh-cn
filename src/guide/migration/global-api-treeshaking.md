---
badges:
  - breaking
---

# 全局 API Treeshaking <MigrationBadges :badges="$frontmatter.badges" />

## 2.x 语法

如果你曾经在 Vue 中手动操作过 DOM，你可能会用过这种方式：

```js
import Vue from 'vue'

Vue.nextTick(() => {
  // 一些和 DOM 有关的东西
})
```

或者，如果你曾经对涉及[异步组件](/guide/component-dynamic-async.html)的应用进行单元测试，那么你很可能编写过以下内容：

```js
import { shallowMount } from '@vue/test-utils'
import { MyComponent } from './MyComponent.vue'

test('an async feature', async () => {
  const wrapper = shallowMount(MyComponent)

  // 执行一些 DOM 相关的任务

  await wrapper.vm.$nextTick()

  // 运行你的断言
})
```

`Vue.nextTick()` 是一个直接暴露在单个 Vue 对象上的全局 API。实际上，实例方法 `$nextTick()` 只是一个方便的 `Vue.nextTick()` 包裹器，将其回调的 `this` 上下文自动绑定到当前实例上，以方便使用。

但是，如果你从来都没有过手动操作 DOM 的必要，也没有在你的应用中使用或测试过异步组件，那该怎么办？或者，不管出于什么原因，你更喜欢使用老式的 `window.setTimeout()` 来代替它？在这种情况下，`nextTick()` 的代码就会变成死代码——也就是说，代码写了，但从未使用过。而死代码很难成为一个好的东西，尤其是在我们的客户端上下文中，每一个字节都很重要。

如 [webpack](https://webpack.js.org/) 这样的模块打包工具支持 [tree-shaking](https://webpack.js.org/guides/tree-shaking/)，这是表达“消除死代码”的一个花哨术语。遗憾的是，由于之前的 Vue 版本中的代码编写方式，如 `Vue.nextTick()` 这样的全局 API 是不支持 tree-shake 的，不管它们实际上是否被使用了，都会被包含在最终的打包产物中。

## 3.x 语法

在 Vue 3 中，全局和内部 API 都经过了重构，并考虑到了 tree-shaking 的支持。因此，对于 ES 模块构建版本来说，全局 API 现在通过具名导出进行访问。例如，我们之前的代码片段现在应该如下所示：

```js
import { nextTick } from 'vue'

nextTick(() => {
  // 一些和 DOM 有关的东西
})
```

与

```js
import { shallowMount } from '@vue/test-utils'
import { MyComponent } from './MyComponent.vue'
import { nextTick } from 'vue'

test('an async feature', async () => {
  const wrapper = shallowMount(MyComponent)

  // 执行一些 DOM 相关的任务

  await nextTick()

  // 运行你的断言
})
```

直接调用 `Vue.nextTick()` 将导致臭名昭著的 `undefined is not a function` 错误。

通过这一更改，如果模块打包工具支持 tree-shaking，则 Vue 应用中未使用的全局 API 将从最终的打包产物中排除，从而获得最佳的文件大小。

## 受影响的 API

Vue 2.x 中的这些全局 API 受此更改的影响：

- `Vue.nextTick`
- `Vue.observable` (用 `Vue.reactive` 替换)
- `Vue.version`
- `Vue.compile` (仅完整构建版本)
- `Vue.set` (仅兼容构建版本)
- `Vue.delete` (仅兼容构建版本)

## 内部帮助器

除了公共 API，许多内部组件/帮助器现在也以具名的方式导出。这允许编译器只在代码被使用到时才引入并输出它。例如以下模板：

```html
<transition>
  <div v-show="ok">hello</div>
</transition>
```

将编译为类似于以下的内容：

```js
import { h, Transition, withDirectives, vShow } from 'vue'

export function render() {
  return h(Transition, [withDirectives(h('div', 'hello'), [[vShow, this.ok]])])
}
```

这实际上意味着只有在应用实际使用了 `Transition` 组件它才会被导入。换句话说，如果应用没有使用任何 `Transition` 组件，那么用于支持此功能的代码将不会出现在最终的打包产物中。

有了全局 tree-shaking 后，用户只需为他们实际使用到的功能“买单”。更棒的是，因为可选特性不会增加未使用它们的应用的打包产物大小，以后在追加核心功能时，即使对框架大小有所顾虑，它也将不再那么重要了。

:::warning 重要
以上仅适用于 [ES 模块构建版本](/guide/installation.html#对不同构建版本的解释)，用于支持 tree-shaking 的打包工具——UMD 构建仍然包括所有特性，并暴露 Vue 全局变量上的所有内容 (编译器将生成适当的输出以从该全局变量上使用 API，而不是导入)。
:::

## 插件中的用法

如果你的插件依赖到了受影响的 Vue 2.x 全局 API，例如：

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

如果使用了 webpack 这样的模块打包工具，这可能会导致 Vue 的源代码输出打包到插件中，而通常情况下，这并不是你所期望的。为了防止发生这种情况，一种常见做法是配置模块打包工具以将 Vue 从最终的打包产物中排除。对于 webpack 来说，你可以使用 [`externals`](https://webpack.js.org/configuration/externals/) 配置选项：

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

如果你选择的模块打包工具恰好是 [Rollup](https://rollupjs.org/)，你基本上可以直接获得相同的效果。因为默认情况下，Rollup 会将绝对模块 id (在我们的例子中为 `'vue'`) 作为外部依赖项，而不会将它们包含在最终的打包产物中。但是在输出打包期间，它可能会抛出一个[“将 vue 作为外部依赖”](https://rollupjs.org/guide/en/#warning-treating-module-as-external-dependency)的警告，可使用 `external` 选项阻止该警告：

```js
// rollup.config.js
export default {
  /*...*/
  external: ['vue']
}
```
