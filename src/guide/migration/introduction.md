# 介绍

::: info 提示
刚接触 Vue.js？先从[基础指南](/guide/introduction.html)开始吧。
:::

本指南主要是为有 Vue 2 经验的、希望了解 Vue 3 的新功能和更改的用户而提供的。**在试用 Vue 3 之前，你不必完整阅读这些内容**。虽然看起来有很多变化，但很多你已经了解和喜欢 Vue 的部分仍是一样的。不过我们希望尽可能全面，并为每处变化提供详细的例子。

- [快速开始](#快速开始)
- [用于迁移的构建版本](#用于迁移的构建版本)
- [值得注意的新特性](#值得注意的新特性)
- [非兼容的变更](#非兼容的变更)
- [官方的支持库](#官方的支持库)

## 概览

<br>
<!--
Generated from
[![观看视频 What's new in Vue 3 (英文)](/cn/whatsnew.jpg)](https://vimeo.com/440868720)
to replace this iframe with an image link to avoid the assets from vimeo being blocked
<iframe src="https://player.vimeo.com/video/440868720" width="640" height="360" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>
-->
<style>
  #video-whatsnew { display: block; width: 640px; height: 360px; }
  #video-whatsnew:hover { outline: 3px #3eaf7c solid; }
</style>
<a href="https://vimeo.com/440868720" id="video-whatsnew" target="_blank" rel="noopener noreferrer"><img src="/cn/whatsnew.jpg" alt="观看视频 What's new in Vue 3 (英文)" /></a>

开始学习 Vue 3 [Vue Mastery](https://www.vuemastery.com/courses-path/vue3)。

## 快速开始

如果你想要在一个新项目里快速尝试 Vue 3：

- 通过 CDN：`<script src="https://unpkg.com/vue@next"></script>`
- [Codepen](https://codepen.io/yyx990803/pen/OJNoaZL) 上的浏览器内试验田
- [CodeSandbox](https://vue.new/) 上的浏览器内沙盒
- 通过脚手架 [Vite](https://github.com/vitejs/vite)：

  ```bash
  npm init vite hello-vue3 -- --template vue # 或 yarn create vite hello-vue3 --template vue
  ```

- 通过脚手架 [vue-cli](https://cli.vuejs.org/)：

  ```bash
  npm install -g @vue/cli # 或 yarn global add @vue/cli
  vue create hello-vue3
  # 选择 vue 3 preset
  ```

## 用于迁移的构建版本

如果你打算要将一个基于 Vue 2 的项目或者库升级到 Vue 3，我们提供了一个与 Vue 2 API 兼容的 Vue 3 构建版本，详情见[用于迁移的构建版本](./migration-build.html)。

## 值得注意的新特性

Vue 3 中一些需要关注的新功能包括：

- [组合式 API](/guide/composition-api-introduction.html)
- [Teleport](/guide/teleport.html)
- [片段](/guide/migration/fragments.html)
- [Emits 组件选项](/guide/component-custom-events.html)
- [来自 `@vue/runtime-core` 的 `createRenderer` API](https://github.com/vuejs/vue-next/tree/master/packages/runtime-core)，用于创建自定义渲染器
- [单文件组件组合式 API 语法糖 (`<script setup>`)](/api/sfc-script-setup.html)
- [单文件组件状态驱动的 CSS 变量 (`<style>` 中的 `v-bind`)](/api/sfc-style.html#状态驱动的动态-css)
- [SFC `<style scoped>` 现在可以包含全局规则或只针对插槽内容的规则](https://github.com/vuejs/rfcs/blob/master/active-rfcs/0023-scoped-styles-changes.md)
- [Suspense](/guide/migration/suspense.html) <Badge text="实验性" type="warning" />

## 非兼容的变更

下面列出了从 2.x 开始的非兼容的变更：

### 全局 API

- [全局 Vue API 已更改为使用应用程序实例](/guide/migration/global-api.html)
- [全局和内部 API 已经被重构为支持 tree-shake](/guide/migration/global-api-treeshaking.html)

### 模板指令

- [组件上 `v-model` 用法已更改，以替换 `v-bind.sync`](/guide/migration/v-model.html)
- [`<template v-for>` 和非 `v-for` 节点上的 `key` 用法已更改](/guide/migration/key-attribute.html)
- [在同一元素上使用的 `v-if` 和 `v-for` 优先级已更改](/guide/migration/v-if-v-for.html)
- [`v-bind="object"` 现在排序敏感](/guide/migration/v-bind.html)
- [`v-on:event.native` 修饰符已移除](./v-on-native-modifier-removed.md)
- [`v-for` 中的 `ref` 不再注册 ref 数组](/guide/migration/array-refs.html)

### 组件

- [只能使用普通函数创建函数式组件](/guide/migration/functional-components.html)
- [`functional` attribute 在单文件组件 (SFC) 的 `<template>` 和 `functional` 组件选项中被废弃](/guide/migration/functional-components.html)
- [异步组件现在需要使用 `defineAsyncComponent` 方法来创建](/guide/migration/async-components.html)
- [组件事件现在需要在 `emits` 选项中声明](./emits-option.md)

### 渲染函数

- [渲染函数 API 更改](/guide/migration/render-function-api.html)
- [`$scopedSlots` property 已移除，所有插槽都通过 `$slots` 作为函数暴露](/guide/migration/slots-unification.html)
- [`$listeners` 被移除或整合到 `$attrs`](./listeners-removed)
- [`$attrs` 现在包含 `class` 和 `style` attribute](./attrs-includes-class-style.md)

### 自定义元素

- [自定义元素检测现在在模板编译时执行](/guide/migration/custom-elements-interop.html)
- [特殊的 `is` attribute 的使用被严格限制在被保留的 `<component>` 标签中](/guide/migration/custom-elements-interop.html#定制内置元素)

### 其他小改变

- `destroyed` 生命周期选项被重命名为 `unmounted`
- `beforeDestroy` 生命周期选项被重命名为 `beforeUnmount`
- [`default` prop 工厂函数不再可以访问 `this` 上下文](/guide/migration/props-default-this.html)
- [自定义指令的 API 已更改为与组件生命周期一致，且 `binding.expression` 已移除](/guide/migration/custom-directives.html)
- [`data` 选项应始终被声明为一个函数](/guide/migration/data-option.html)
- [来自 mixin 的 `data` 选项现在为浅合并](/guide/migration/data-option.html#mixin-合并行为变更)
- [Attribute 强制策略已更改](/guide/migration/attribute-coercion.html)
- [一些过渡的 class 被重命名](/guide/migration/transition.html)
- [`<TransitionGroup>` 不再默认渲染包裹元素](/guide/migration/transition-group.html)
- [当侦听一个数组时，只有当数组被替换时，回调才会触发，如果需要在变更时触发，则必须指定 `deep` 选项](/guide/migration/watch.html)
- 没有特殊指令的标记 (`v-if/else-if/else`、`v-for` 或 `v-slot`) 的 `<template>` 现在被视为普通元素，并将渲染为原生的 `<template>` 元素，而不是渲染其内部内容。
- [已挂载的应用不会取代它所挂载的元素](/guide/migration/mount-changes.html)
- [生命周期的 `hook:` 事件前缀改为 `vnode-`](/guide/migration/vnode-lifecycle-events.html)

### 被移除的 API

- [`keyCode` 作为 `v-on` 修饰符的支持](/guide/migration/keycode-modifiers.html)
- [$on、$off 和 $once 实例方法](/guide/migration/events-api.html)
- [过滤器 (filter)](/guide/migration/filters.html)
- [内联模板 attribute](/guide/migration/inline-template-attribute.html)
- [`$children` 实例 property](/guide/migration/children.html)
- [`propsData` 选项](/guide/migration/props-data.html)
- `$destroy` 实例方法。用户不应再手动管理单个 Vue 组件的生命周期。
- 全局函数 `set` 和 `delete` 以及实例方法 `$set` 和 `$delete`。基于代理的变化检测已经不再需要它们了。

## 官方的支持库

我们所有的官方库和工具现在都支持 Vue 3，但其中一些仍处于测试版或候选发布状态。你可以在下面找到各个库的详细信息。大多数库目前使用 npm 上的 `next` dist 标签发布。我们打算在所有官方库有了稳定的兼容版本后，就改用 `latest` 标签。

### Vue CLI

<a href="https://www.npmjs.com/package/@vue/cli" target="_blank" noopener noreferrer><img src="https://img.shields.io/npm/v/@vue/cli"></a>

从 v4.5.0 开始，`vue-cli` 现在提供了内置选项，可在创建新项目时选择 Vue 3。现在可以升级 `vue-cli` 并运行 `vue create` 来创建 Vue 3 项目。

- [文档](https://cli.vuejs.org/zh/)
- [GitHub](https://github.com/vuejs/vue-cli)

### Vue Router

<a href="https://www.npmjs.com/package/vue-router/v/next" target="_blank" noopener noreferrer><img src="https://img.shields.io/npm/v/vue-router/next.svg"></a>

Vue Router 4.0 提供了 Vue 3 支持，并有许多非兼容的变更，详情见[迁移指南](https://next.router.vuejs.org/guide/migration/)。

- [文档](https://next.router.vuejs.org/)
- [Github](https://github.com/vuejs/vue-router-next)
- [RFCs](https://github.com/vuejs/rfcs/pulls?q=is%3Apr+is%3Amerged+label%3Arouter)

### Vuex

<a href="https://www.npmjs.com/package/vuex/v/next" target="_blank" noopener noreferrer><img src="https://img.shields.io/npm/v/vuex/next.svg"></a>

Vuex 4.0 提供了 Vue 3 支持，其 API 与 3.x 基本相同。唯一的非兼容变更是[插件的安装方式](https://next.vuex.vuejs.org/guide/migrating-to-4-0-from-3-x.html#breaking-changes)。

- [文档](https://next.vuex.vuejs.org/)
- [Github](https://github.com/vuejs/vuex/tree/4.0)

### Devtools 扩展

我们正在开发一个新版本的 Devtools，它有一个新的 UI 和经过重构的内部结构，以支持多个 Vue 版本。新版本目前处于测试阶段，目前只支持 Vue 3。Vuex 和 Router 的集成也在进行中。

- Chrome：[从 Chrome web 商店中安装](https://chrome.google.com/webstore/detail/vuejs-devtools/ljjemllljcmogpfapbkkighbhhppjdbg?hl=en)

  - 提示：beta 版本可能与 devtools 的稳定版本冲突，因此你可能需要暂时禁用稳定版本，以便 beta 版本正常工作。

- Firefox：[下载签名扩展](https://github.com/vuejs/vue-devtools/releases/tag/v6.0.0-beta.20) (assets 下的 `.xpi` 文件)

### IDE 支持

推荐使用 [VSCode](https://code.visualstudio.com/) 和我们官方拓展 [Volar](https://github.com/johnsoncodehk/volar)，它为 Vue 3 提供了全面的 IDE 支持

### 其他项目

| 项目               | npm | 仓库 |
| -------------------   | --- | ---- |
| @vue/babel-plugin-jsx | [![rc][jsx-badge]][jsx-npm]   | [[Github][jsx-code]] |
| eslint-plugin-vue     | [![beta][epv-badge]][epv-npm] | [[Github][epv-code]] |
| @vue/test-utils       | [![beta][vtu-badge]][vtu-npm] | [[Github][vtu-code]] |
| vue-class-component   | [![beta][vcc-badge]][vcc-npm] | [[Github][vcc-code]] |
| vue-loader            | [![rc][vl-badge]][vl-npm]     | [[Github][vl-code]]  |
| rollup-plugin-vue     | [![beta][rpv-badge]][rpv-npm] | [[Github][rpv-code]] |

[jsx-badge]: https://img.shields.io/npm/v/@vue/babel-plugin-jsx.svg
[jsx-npm]: https://www.npmjs.com/package/@vue/babel-plugin-jsx
[jsx-code]: https://github.com/vuejs/jsx-next

[vd-badge]: https://img.shields.io/npm/v/@vue/devtools/beta.svg
[vd-npm]: https://www.npmjs.com/package/@vue/devtools/v/beta
[vd-code]: https://github.com/vuejs/vue-devtools/tree/next

[epv-badge]: https://img.shields.io/npm/v/eslint-plugin-vue.svg
[epv-npm]: https://www.npmjs.com/package/eslint-plugin-vue
[epv-code]: https://github.com/vuejs/eslint-plugin-vue

[vtu-badge]: https://img.shields.io/npm/v/@vue/test-utils/next.svg
[vtu-npm]: https://www.npmjs.com/package/@vue/test-utils/v/next
[vtu-code]: https://github.com/vuejs/vue-test-utils-next

[jsx-badge]: https://img.shields.io/npm/v/@ant-design-vue/babel-plugin-jsx.svg
[jsx-npm]: https://www.npmjs.com/package/@ant-design-vue/babel-plugin-jsx
[jsx-code]: https://github.com/vueComponent/jsx

[vcc-badge]: https://img.shields.io/npm/v/vue-class-component/next.svg
[vcc-npm]: https://www.npmjs.com/package/vue-class-component/v/next
[vcc-code]: https://github.com/vuejs/vue-class-component/tree/next

[vl-badge]: https://img.shields.io/npm/v/vue-loader/next.svg
[vl-npm]: https://www.npmjs.com/package/vue-loader/v/next
[vl-code]: https://github.com/vuejs/vue-loader/tree/next

[rpv-badge]: https://img.shields.io/npm/v/rollup-plugin-vue/next.svg
[rpv-npm]: https://www.npmjs.com/package/rollup-plugin-vue/v/next
[rpv-code]: https://github.com/vuejs/rollup-plugin-vue/tree/next

::: info 提示
想了解更多关于 Vue 3 的库和插件的兼容性信息，请务必查看 [awesome-vue 中的这个 issue](https://github.com/vuejs/awesome-vue/issues/3544)。
:::
