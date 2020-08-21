---
badges:
  - breaking
---

# 全局 API Treeshaking <MigrationBadges :badges="$frontmatter.badges" />

## 2.x  语法

如果你曾经在Vue中手动操作过DOM，你可能会遇到以下模式：

```js
import Vue from 'vue'

Vue.nextTick(() => {
  // 一些和DOM有关的东西
})
```

或者，如果你一直在对涉及 [async components](/guide/component-dynamic-async.html)的应用程序进行单元测试，那么很可能你编写了以下内容：

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
`Vue.nextTick()` 是一个全局的API 直接暴露在单个Vue对象上 —— 事实上，实例方法 `$nextTick()` 只是一个方便的包装 `Vue.nextTick()`为方便起见，回调的 `this` 上下文自动绑定到当前当前实例。

模块捆绑程序，如[webpack](https://webpack.js.org/) 支持 [tree-shaking](网址：https://webpack.js/webpack/js//)，这是 “死代码消除” 的一个花哨术语。不幸的是，由于代码是如何在以前的Vue版本中编写的，全局API`Vue.nextTick()`不可摇动，将包含在最终捆绑中不管它们实际在哪里使用。

## 3.x 语法

在Vue 3中，全局和内部API都经过了重构，并考虑到了tree-shaking的支持。因此，全局API现在只能作为ES模块构建的命名导出进行访问。例如，我们之前的片段现在应该如下所示：

```js
import { nextTick } from 'vue'

nextTick(() => {
  // 一些和DOM有关的东西
})
```

and

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

通过这一更改，如果模块绑定器支持tree-shaking，则Vue应用程序中未使用的全局api将从最终捆绑包中消除，从而获得最佳的文件大小。

## 受影响的API

Vue 2.x中的这些全局API受此更改的影响：

- `Vue.nextTick`
- `Vue.observable` (用 `Vue.reactive` 替换)
- `Vue.version`
- `Vue.compile` (仅全构建)
- `Vue.set` (仅兼容构建)
- `Vue.delete` (仅兼容构建)

## 内部帮助器

除了公共api，许多内部组件/帮助器现在也被导出为命名导出，只有当编译器的输出是这些特性时，才允许编译器导入这些特性，例如以下模板：

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

随着 全局 tree-shaking，用户只需为他们实际使用的功能 “付费”，更好的是，知道了可选特性不会增加不使用它们的应用程序的捆绑包大小，框架大小在将来已经不再是其他核心功能的考虑因素了，如果有的话。

::: warning 重要
以上仅适用于 [ES Modules builds](/guide/installation.html#explanation-of-different-builds) ，用于支持tree-shaking的绑定器 —— UMD构建仍然包括所有特性，并暴露Vue全局变量上的所有内容（编译器将生成适当的输出，以使用全局外的api而不是导入）。
:::

## 插件中的用法

如果你的插件依赖受影响的Vue 2.x全局API，例如：

```js
const plugin = {
  install: Vue => {
    Vue.nextTick(() => {
      // ...
    })
  }
}
```

在Vue 3中，必须显式导入：

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

如果使用webpack这样的模块捆绑包，这可能会导致Vue的源代码绑定到插件中，而且通常情况下，这并不是你所期望的。防止这种情况发生的一种常见做法是配置模块绑定器以将Vue从最终捆绑中排除。对于webpack，你可以使用 [`externals`](https://webpack.js.org/configuration/externals/) 配置选项：

```js
// webpack.config.js
module.exports = {
  /*...*/
  externals: {
    vue: 'Vue'
  }
}
```

这将告诉webpack将Vue模块视为一个外部库，而不是捆绑它。

如果你选择的模块绑定器恰好是 [Rollup](https://rollupjs.org/)，你基本上可以免费获得相同的效果，因为默认情况下，Rollup会将绝对模块id（在我们的例子中为 `'vue'` ）作为外部依赖项，而不会将它们包含在最终的bundle中。但是在绑定期间，它可能会发出一个[“将vue作为外部依赖”](https://rollupjs.org/guide/en/#warning-treating-module-as-external-dependency）警告，可使用 `external` 选项抑制该警告：

```js
// rollup.config.js
export default {
  /*...*/
  external: ['vue']
}
```
