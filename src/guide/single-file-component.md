# 单文件组件

<VideoLesson href="https://vueschool.io/lessons/vue-3-introduction-to-single-file-components?friend=vuejs" title="Free Vue.js Single File Components Lesson">通过 Vue School 上的免费视频课程学习单文件组件</VideoLesson>

## 介绍

Vue 单文件组件（又名 `*.vue` 文件，缩写为 **SFC**）是一种特殊的文件格式，它允许将 Vue 组件的模板、逻辑 **与** 样式封装在单个文件中。下面是 SFC 示例：

```vue
<script>
export default {
  data() {
    return {
      greeting: 'Hello World!'
    }
  }
}
</script>

<template>
  <p class="greeting">{{ greeting }}</p>
</template>

<style>
.greeting {
  color: red;
  font-weight: bold;
}
</style>
```

正如所见，Vue SFC 是经典的 HTML、CSS 与 JavaScript 三个经典组合的自然延伸。每个 `*.vue` 文件由三种类型的顶层代码块组成：`<template>`、`<script>` 与 `<style>`：

- `<script>` 部分是一个标准的 JavaScript 模块。它应该导出一个 Vue 组件定义作为其默认导出。
- `<template>` 部分定义了组件的模板。
- `<style>` 部分定义了与此组件关联的 CSS。

查阅 [SFC 语法规范](/api/sfc-spec) 查看更多细节。

## 工作原理

Vue SFC 是框架指定的文件格式，必须由 [@vue/compiler-sfc](https://github.com/vuejs/vue-next/tree/master/packages/compiler-sfc) 预编译为标准的 JavaScript 与 CSS。编译后的 SFC 是一个标准的 JavaScript（ES）模块——这意味着通过正确的构建配置，可以像模块一样导入 SFC：

```js
import MyComponent from './MyComponent.vue'

export default {
  components: {
    MyComponent
  }
}
```

SFC 中的 `<style>` 标签通常在开发过程中作为原生 `<style>` 标签注入以支持热更新。对于生产环境，它们可以被提取并合并到单个 CSS 文件中。

可以在 [Vue SFC Playground](https://sfc.vuejs.org/) 中使用 SFC ，探索其是如何编译的。

在实际项目中，通常会将 SFC 编译器与 [Vite](https://vitejs.dev/) 或 [Vue CLI](http://cli.vuejs.org/)（基于 [webpack](https://webpack.js.org/)）等构建工具集成在一起，Vue 提供的官方脚手架工具，可让你更快地开始使用 SFC。查阅 [SFC 工具](/api/sfc-tooling) 部分查看更多细节。

## 为什么要使用 SFC

虽然 SFC 需要一个构建步骤，但益处颇多：

- 使用熟悉的 HTML、CSS 与 JavaScript 语法编写模块化组件
- 预编译模板
- [组件作用域 CSS](/api/sfc-style)
- [使用 Composition API 时更符合人体工程学的语法](/api/sfc-script-setup)
- 通过交叉分析模板与脚本进行更多编译时优化
- [IDE 支持](/api/sfc-tooling.html#ide-support) 模板表达式的自动补全与类型检查
- 开箱即用的热模块更换（HMR）支持

SFC 是 Vue 作为框架的定义特性，也是在以下场景中使用 Vue 的推荐方法：

- 单页应用（SPA）
- 静态站点生成（SSG）
- 任何重要的前端，其中构建步骤可以得到更好的开发体验（DX）。

话虽如此，我们确实意识到在某些情况下 SFC 可能会觉得有些小题大做。这就是为什么 Vue 仍然可以通过纯 JavaScript 使用而无需构建步骤。如果只是想通过轻交互来增强静态 HTML，还可以看看 [petite-vue](https://github.com/vuejs/petite-vue)，这是一个 5kb 的 Vue 子集，针对渐进式增强进行了优化。

## 关注点分离怎么样？

一些来自传统 Web 开发背景的用户可能会担心 SFC 在同一个地方混合了不同的关注点——HTML/CSS/JS 应该分开！

要回答这个问题，我们必须同意关注点分离不等于文件类型分离。工程原理的最终目标是提高代码库的可维护性。关注点分离，当墨守成规地应用为文件类型的分离时，并不能帮助我们在日益复杂的前端应用程序的上下文中实现该目标。

在现代 UI 开发中，我们发现与其将代码库划分为三个相互交织的巨大层，不如将它们划分为松散耦合的组件并进行组合更有意义。在组件内部，它的模板、逻辑和样式是内在耦合的，将它们搭配起来实际上可以使组件更具凝聚力和可维护性。

注意，即使不喜欢单文件组件的想法，仍然可以通过使用 [`src` 导入](/api/sfc-spec.html#src-imports) 将 JavaScript 与 CSS 分离到单独的文件中来利用其热重载和预编译功能。
