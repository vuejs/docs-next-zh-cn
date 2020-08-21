# 介绍

> 这里有这么多东西！这是否意味着 3.0 是完全不同的，我必须重新学习基础知识，而迁移实际上是不可能的？

很高兴你这么问！答案是不。我们已经尽了很大的努力来确保大部分 API 是相同的，核心概念没有改变。它很长，因为我们喜欢提供非常详细的解释和包括很多例子。放心。**这不是你必须从头开始阅读的东西**

我们最大的改变可能是新的 [Composition API](/guide/composition-api-introduction.html)，这完全是附加的-前面的选项 API 将继续受到支持，因为组合 API 是一个高级特性。

## 概览

<br>
<iframe src="https://player.vimeo.com/video/440868720" width="640" height="360" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>

开始学习 Vue 3 [Vue Mastery](https://www.vuemastery.com/courses-path/vue3)。

### 新特性

Vue 3 中需要关注的一些新功能包括：

- [Composition API](/guide/composition-api-introduction.html)
- [传送](/guide/teleport.html)
- [Fragments](/guide/migration/fragments.html)
- [Emits 组件选项](/guide/component-custom-events.html)
- `createRenderer` API 从 `@vue/runtime-core` 创建自定义渲染器

### 重大改变

下面列出了从2.x开始的重大更改：

- [全局 Vue API 已更改为使用应用程序实例](/guide/migration/global-api.html)
- [全局和内部api已经被重构为可 tree-shakable](/guide/migration/global-api-treeshaking.html)
- [`model` 组件选项和 `v-bind` 的 `sync` 更改和移除了 `v-model`参数](/guide/migration/v-model.html)
- [渲染函数 API 改变](/guide/migration/render-function-api.html)
- [只能使用普通函数创建功能组件](/guide/migration/functional-components.html)
- [`functional` 属性在单文件组件 (SFC) `<template>` 和 `functional` 组件选项被抛弃](/guide/migration/functional-components.html)
- [异步组件现在需要 `defineAsyncComponent` 方法来创建](/guide/migration/async-components.html)
- [组件数据选项应始终声明为函数](/guide/migration/data-option.html)
- [自定义元素白名单现在在模板编译期间执行](/guide/migration/custom-elements-interop.html)
- [特殊的 `is` prop 用法仅限于保留 `<component>` tag](/guide/migration/custom-elements-interop.html) 
- [`$scopedSlots` 属性已删除，需要替换为 `$slots`](/guide/migration/slots-unification.html)
- [attribute 强制策略已更改](/guide/migration/attribute-coercion.html)
- [自定义指令 API 已更改为与组件生命周期一致](/guide/migration/custom-directives.html)
- 一些转换 class 被重命名了：
  - `v-enter` -> `v-enter-from`
  - `v-leave` -> `v-leave-from`
- [组件 watch 选项](/api/options-data.html#watch)和[实例方法 `$watch`](/api/instance-methods.html#watch) 不再支持点分隔字符串路径，请改用计算函数作为参数
- 在 Vue 2.x 中，应用根容器的 `outerHTML` 将替换为根组件模板 (如果根组件没有模板/渲染选项，则最终编译为模板)。VUE3.x 现在使用应用程序容器的 `innerHTML`。

### 移除

- [`keyCode` 支持像 `v-on` 修饰](/guide/migration/keycode-modifiers.html)
- [$on，$off and \$once 实例方法](/guide/migration/events-api.html)
- [Filters](/guide/migration/filters.html)
- [内链模板 attribute](/guide/migration/inline-template-attribute.html)

## FAQ

### 我该从哪里开始项目迁移呢？

> 迁移助手仍在开发中

1. 从运行迁移助手 (还在开发中) 在当前项目。我们仔细缩小了一个高级 Vue dev 并将其压缩到一个简单的命令行界面中。每当他们发现一个过时的功能，他们会让你知道，提供建议，并提供更多信息的链接。

2. 之后，在侧边栏中浏览此页面的目录。如果你看到一个可能会影响你的主题，但是迁移帮助程序没有捕捉到，请查看它。

3. 如果你有任何测试，运行它们看看还有什么失败。如果没有测试，只需在浏览器中打开应用程序，并在导航时留意警告或错误。

4. 现在，你的应用程序应该已经完全迁移了。如果你仍然渴望更多，你可以阅读本页的其余部分，或者从[开始](#overview)阅读新的和改进的指南。由于你已经熟悉了核心概念，所以许多部分都可以略读。

### 将 Vue 2.x 应用迁移 3.0 要花费多长时间

这取决于几个因素：

- 你的 app 的尺寸 (小到中等尺寸的应用可能需要不到一天的时间)。

- 有多少次你分心了，想玩一个很酷的新功能。😉 不用猜了，这也发生在我们重构 3.0 的时候！

- 你正在使用哪些过时的功能。大多数都可以使用查找和替换进行升级，但其他一些可能需要几分钟的时间。如果你当前没有按照[我们的风格指南](/style-guide/)，Vue 3.0 也会更加努力地迫使你这么做。从长远来看，这是一件好事，但也可能意味着一个重要的 (可能会过期) 重构。

### 如果我升级到 Vue 3，我还需要升级 Vuex 和 Vue-router 吗？

是的，[Vuex](https://github.com/vuejs/vuex/tree/4.0#vuex-4) 和 [Vue Router](https://github.com/vuejs/vue-router-next) 现在还是 beta 版本。
