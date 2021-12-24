# 用于迁移的构建版本

## 概述

`@vue/compat` (即“迁移构建版本”) 是一个 Vue 3 的构建版本，提供了可配置的兼容 Vue 2 的行为。

该构建版本默认运行在 Vue 2 的模式下——大部分公有 API 的行为和 Vue 2 一致，仅有一小部分例外。使用在 Vue 3 中发生改变或被废弃的特性时会抛出运行时警告。一个特性的兼容性也可以基于单个组件进行开启或禁用。

### 预期用例

- 将一个 Vue 2 应用升级为 Vue 3 (存在[限制](#已知的限制))
- 迁移一个库以支持 Vue 3
- 对于尚未尝试 Vue 3 的资深 Vue 2 开发者来说，迁移构建版本可以用来代替 Vue 3 以更好地学习版本之间的差异。

### 已知的限制

虽然我们已经努力使迁移构建版本尽可能地模拟 Vue 2 的行为，但仍有一些限制可能会阻止应用的顺利升级：

- 基于 Vue 2 内部 API 或文档中未记载行为的依赖。最常见的情况就是使用 `VNodes` 上的私有 property。如果你的项目依赖诸如 [Vuetify](https://vuetifyjs.com/zh-Hans/)、[Quasar](https://quasar.dev/) 或 [Element UI](https://element.eleme.io/#/zh-CN) 等组件库，那么最好等待一下它们的 Vue 3 兼容版本。

- 对 IE11 的支持：[Vue 3 已经官方放弃对 IE11 的支持](https://github.com/vuejs/rfcs/blob/master/active-rfcs/0038-vue3-ie11-support.md)。如果仍然需要支持 IE11 或更低版本，那你仍需继续使用 Vue 2。

- 服务端渲染：该迁移构建版本可以被用于服务端渲染，但是迁移一个自定义的服务端渲染配置还有很多工作要做。大致的思路是将 `vue-server-renderer` 替换为 [`@vue/server-renderer`](https://github.com/vuejs/vue-next/tree/master/packages/server-renderer)。Vue 3 不再提供一个包渲染器，且我们推荐使用 [Vite](https://cn.vitejs.dev/guide/ssr.html) 以支持 Vue 3 服务端渲染。如果你正在使用 [Nuxt.js](https://zh.nuxtjs.org/)，可以尝试 [Nuxt Bridge，一个 Nuxt.js 2 到 3 的兼容层](https://v3.nuxtjs.org/getting-started/bridge/)。对于复杂、生产环境的项目来说，可能最好还是等待一下 [Nuxt 3 (目前处于 beta 阶段)](https://v3.nuxtjs.org/getting-started/introduction)。

### 预期

请注意迁移构建版本旨在覆盖在文档中公开记载的 Vue 2 API 和行为。如果应用依赖了未记载的行为导致在迁移构建下运行失败，我们可能不太会调整迁移构建版本以迎合这种特殊情况。请考虑重构或移除导致这些问题行为的依赖。

多留意一下：如果你的应用较大且复杂，即便有了迁移构建版本，整个迁移过程也会是一个挑战。如果你的应用不幸无法顺利升级，请留意我们正在计划将组合式 API 等其它 Vue 3 特性迁移回 Vue 2.7 (预计在 2021 年第三季度末)。

如果应用在迁移构建版本中顺利运行，你**可以**在迁移完成之前将其发布到生产环境。尽管存在一些小的性能或包大小的问题，但应该不会显著地影响到生产环境的用户体验。当你有基于 Vue 2 行为的依赖且无法升级/替换时，可能不得不这样做。

该迁移构建版本会从 3.1 开始提供，且会随着 3.2 的发布计划进行持续发布。我们计划在将来某个小版本号起最终停止发布迁移构建版本 (在 2021 年底前至少不会)，因此你仍需要在此之前将其迁移到标准构建版本。

## 升级流程

下面的工作流程讲述了将一个实际的 Vue 2 应用 (Vue HackerNews 2.0) 迁移到 Vue 3 的过程。完整的提交记录在[这里](https://github.com/vuejs/vue-hackernews-2.0/compare/migration)。请注意，你的项目所需要的实际步骤可能有所不同。下面的步骤仅应被视为一般性的指南，而非严格的教程。

### 准备工作

- 如果你仍然使用[废弃的具名/作用域插槽语法](https://cn.vuejs.org/v2/guide/components-slots.html#废弃了的语法)，请先将其更新至 (2.6 已经支持的) 最新的语法。

### 安装

1. 尽可能升级工具。

   - 如果使用了自定义的 webpack 设置：将 `vue-loader` 升级至 `^16.0.0`。
   - 如果使用了 `vue-cli`：通过 `vue upgrade` 升级到最新的 `@vue/cli-service`。
   - (替代方案) 迁移至 [Vite](https://cn.vitejs.dev/) + [vite-plugin-vue2](https://github.com/underfin/vite-plugin-vue2)。[[示例提交](https://github.com/vuejs/vue-hackernews-2.0/commit/565b948919eb58f22a32afca7e321b490cb3b074)]

2. 在 `package.json` 里，将 `vue` 更新到 3.1，安装相同版本的 `@vue/compat`。且如果存在 `vue-template-compiler` 的话，将其替换为 `@vue/compiler-sfc`。

   ```diff
   "dependencies": {
   -  "vue": "^2.6.12",
   +  "vue": "^3.1.0",
   +  "@vue/compat": "^3.1.0"
      ...
   },
   "devDependencies": {
   -  "vue-template-compiler": "^2.6.12"
   +  "@vue/compiler-sfc": "^3.1.0"
   }
   ```

   [示例提交](https://github.com/vuejs/vue-hackernews-2.0/commit/14f6f1879b43f8610add60342661bf915f5c4b20)

3. 在构建设置中，为 `vue` 设置别名 `@vue/compat`，且通过 Vue 编译器选项开启兼容模式。

   **示例配置**

   <details>
     <summary><b>vue-cli</b></summary>

   ```js
   // vue.config.js
   module.exports = {
     chainWebpack: config => {
       config.resolve.alias.set('vue', '@vue/compat')

       config.module
         .rule('vue')
         .use('vue-loader')
         .tap(options => {
           return {
             ...options,
             compilerOptions: {
               compatConfig: {
                 MODE: 2
               }
             }
           }
         })
     }
   }
   ```

   </details>

   <details>
     <summary><b>普通 webpack</b></summary>

   ```js
   // webpack.config.js
   module.exports = {
     resolve: {
       alias: {
         vue: '@vue/compat'
       }
     },
     module: {
       rules: [
         {
           test: /\.vue$/,
           loader: 'vue-loader',
           options: {
             compilerOptions: {
               compatConfig: {
                 MODE: 2
               }
             }
           }
         }
       ]
     }
   }
   ```

   </details>

   <details>
     <summary><b>Vite</b></summary>

   ```js
   // vite.config.js
   export default {
     resolve: {
       alias: {
         vue: '@vue/compat'
       }
     },
     plugins: [
       vue({
         template: {
           compilerOptions: {
             compatConfig: {
               MODE: 2
             }
           }
         }
       })
     ]
   }
   ```

   </details>

4. 如果使用了 TypeScript，你还需要修改 `vue` 的类型，通过添加一个 `*.d.ts` 暴露其 (在 Vue 3 中已经不再展示) 默认导出。

   ```ts
   declare module 'vue' {
     import { CompatVue } from '@vue/runtime-dom'
     const Vue: CompatVue
     export default Vue
     export * from '@vue/runtime-dom'
   }
   ```

5. 在此，你的应用可能会遇到一些编译时的错误/警告 (例如对过滤器的使用)，请先修复这些错误。直至所有的编译警告都消失，当然，你也可以把编译器设置为 Vue 3 模式。

   [示例提交](https://github.com/vuejs/vue-hackernews-2.0/commit/b05d9555f6e115dea7016d7e5a1a80e8f825be52)

6. 在修复了这些错误之后，如果没有受制于上述的[限制](#已知的限制)，那么应用就应该可以运行了。

   你可能会同时从命令行和浏览器控制台看到很多警告。这里提供一些一般化的小建议：

   - 你可以在浏览器控制台里过滤特定的警告。建议通过使用过滤器，使自己每次专注修复同一种问题。你也可以使用类似 `-GLOBAL_MOUNT` 的否定式过滤器。

   - 你可以通过[兼容性配置](#兼容性配置)关闭对特定的废弃内容的处理。

   - 有些警告可能来自你使用的依赖 (如 `vue-router`)。你可以通过警告的组件嵌套或调用栈的追踪信息 (可以点击展开) 来进行检查。可以优先专注于修复源自你自己代码的警告。

   - 如果你使用了 `vue-router`，请注意在升级至 `vue-router` v4 之前，`<transition>` 和 `<keep-alive>` 无法和 `<router-view>` 一起工作。

7. 升级 [`<transition>` 类名](/guide/migration/transition.html)。这是唯一没有运行时警告的特性。你可以在整个项目范围内做一次 `.*-enter` 和 `.*-leave` CSS 类名的搜索。

   [示例提交](https://github.com/vuejs/vue-hackernews-2.0/commit/d300103ba622ae26ac26a82cd688e0f70b6c1d8f)

8. 更新应用的入口以使用[新的全局挂载 API](https://v3.cn.vuejs.org/guide/migration/global-api.html#一个新的全局-api-createapp)。

   [示例提交](https://github.com/vuejs/vue-hackernews-2.0/commit/a6e0c9ac7b1f4131908a4b1e43641f608593f714)

9. [将 `vuex` 升级至 v4](https://next.vuex.vuejs.org/zh/guide/migrating-to-4-0-from-3-x.html)。

   [示例提交](https://github.com/vuejs/vue-hackernews-2.0/commit/5bfd4c61ee50f358cd5daebaa584f2c3f91e0205)

10. [将 `vue-router` 升级至 v4](https://next.router.vuejs.org/zh/guide/migration/index.html)。如果你还使用了 `vuex-router-sync`，可以同时将其替换为一个 store getter。

    升级过后，同 `<router-view>` 一起使用 `<transition>` 和 `<keep-alive>` 就要求使用新的[基于作用域插槽的语法](https://next.router.vuejs.org/zh/guide/migration/index.html#router-view-、-keep-alive-和-transition)。

    [示例提交](https://github.com/vuejs/vue-hackernews-2.0/commit/758961e73ac4089890079d4ce14996741cf9344b)

11. 逐个修复警告。注意有些特性在 Vue 2 和 Vue 3 之间存在行为冲突——例如渲染函数 API，或函数式组件 vs. 异步组件的改变。为了迁移到 Vue 3 API 而不影响到应用的其它部分，你可以通过 [`compatConfig` 选项](#基于单个组件的配置)对单个组件选择性启用 Vue 3 的行为。

    [示例提交](https://github.com/vuejs/vue-hackernews-2.0/commit/d0c7d3ae789be71b8fd56ce79cb4cb1f921f893b)

12. 当修复了所有警告以后，你就可以移除迁移构建版本并切换为 Vue 3。注意如果存在基于 Vue 2 行为的依赖，你可能无法做到这一点。

    [示例提交](https://github.com/vuejs/vue-hackernews-2.0/commit/9beb45490bc5f938c9e87b4ac1357cfb799565bd)

## 兼容性配置

### 全局配置

兼容性特性可以进行单独禁用：

```js
import { configureCompat } from 'vue'

// 禁用某些兼容性特性
configureCompat({
  FEATURE_ID_A: false,
  FEATURE_ID_B: false
})
```

或者整个应用默认为 Vue 3 的行为，仅开启某些兼容性特性：

```js
import { configureCompat } from 'vue'

// 所有 Vue 3 的默认行为，并开启某些兼容性特性
configureCompat({
  MODE: 3,
  FEATURE_ID_A: true,
  FEATURE_ID_B: true
})
```

### 基于单个组件的配置

一个组件可以使用 `compatConfig` 选项，并支持与全局 `configureCompat` 方法相同的选项：

```js
export default {
  compatConfig: {
    MODE: 3, // 只为这个组件选择性启用 Vue 3 行为
    FEATURE_ID_A: true // 也可以在组件级别开启某些特性
  }
  // ...
}
```

### 针对编译器的配置

以 `COMPILER_` 开头的特性是针对编译器的：如果你正在使用完整构建版本 (含浏览器内编译器)，它们可以在运行时中被配置。然而如果使用构建设置，它们必须换为通过在构建配置中的 `compilerOptions` 进行配置 (参阅上述的配置)。

## 特性参考

### 兼容性类型

- ✔ 完全兼容
- ◐ 部分兼容且附带注意事项
- ⨂ 不兼容 (只有警告)
- ⭘ 仅兼容 (没有警告)

### 不兼容

> 应该被修复，否则很可能会导致错误

| ID | 类型 | 描述 | 文档 |
| ---- | ---- | ---- | ---- |
| GLOBAL_MOUNT_CONTAINER                | ⨂    | 被挂载的应用不会替换被挂载到的元素 | [链接](/guide/migration/mount-changes.html)                                                    |
| CONFIG_DEVTOOLS                       | ⨂    | 生产环境开发者工具现在是一个构建时的开关 | [链接](https://github.com/vuejs/vue-next/tree/master/packages/vue#bundler-build-feature-flags) |
| COMPILER_V_IF_V_FOR_PRECEDENCE        | ⨂    | `v-if` 和 `v-for` 用在相同的元素上时的处理顺序发生了改变 | [链接](/guide/migration/v-if-v-for.html)                                                       |
| COMPILER_V_IF_SAME_KEY                | ⨂    | `v-if` 分支不能再拥有相同的 key | [链接](/guide/migration/key-attribute.html#on-conditional-branches)                            |
| COMPILER_V_FOR_TEMPLATE_KEY_PLACEMENT | ⨂    | `<template v-for>` key 现在应该被放在 `<template>` 上 | [链接](/guide/migration/key-attribute.html#with-template-v-for)                                |
| COMPILER_SFC_FUNCTIONAL               | ⨂    | 单文件组件中不再支持 `<template functional>` | [链接](/guide/migration/functional-components.html#single-file-components-sfcs)                |

### 部分兼容且附带注意事项

| ID | 类型 | 描述 | 文档 |
| ---- | ---- | ---- | ---- |
| CONFIG_IGNORED_ELEMENTS  | ◐    | `config.ignoredElements` 现在改为了 `config.compilerOptions.isCustomElement` (只在浏览器编译器构建版本中)。如果使用了构建设置，`isCustomElement` 必须通过构建配置传入。 | [链接](/guide/migration/global-api.html#config-ignoredelements-替换为-config-iscustomelement) |
| COMPILER_INLINE_TEMPLATE | ◐    | `inline-template` 被移除 (兼容模式只在浏览器编译器构建版本中支持) | [链接](/guide/migration/inline-template-attribute.html)                                                       |
| PROPS_DEFAULT_THIS       | ◐    | prop 的默认工厂方法不再可以访问 `this` (在兼容模式下，`this` 不是一个真实的实例——它只暴露 prop、`$options` 和注入) | [链接](/guide/migration/props-default-this.html)                                                              |
| INSTANCE_DESTROY         | ◐    | `$destroy` 实例方法被移除 (在兼容模式下，只在根实例下支持) | |
| GLOBAL_PRIVATE_UTIL      | ◐    | `Vue.util` 是私有的，且不再可用 | |
| CONFIG_PRODUCTION_TIP    | ◐    | 不再需要 `config.productionTip`  | [链接](/guide/migration/global-api.html#config-productiontip-移除) |
| CONFIG_SILENT            | ◐    | `config.silent` 被移除 | |

### 仅兼容 (无告警)

| ID | 类型 | 描述 | 文档 |
| ---- | ---- | ---- | ---- |
| TRANSITION_CLASSES | ⭘    | 过渡动画的进入/离开的 class 发生了变化 | [链接](/guide/migration/transition.html) |

### 完全兼容

| ID | 类型 | 描述 | 文档 |
| ---- | ---- | ---- | ---- |
| GLOBAL_MOUNT                 | ✔    | new Vue() -> createApp | [链接](/guide/migration/global-api.html#挂载-app-实例) |
| GLOBAL_EXTEND                | ✔    | Vue.extend 被移除 (使用 `defineComponent` 或 `extends` 选项) | [链接](/guide/migration/global-api.html#vue-extend-移除) |
| GLOBAL_PROTOTYPE             | ✔    | `Vue.prototype` -> `app.config.globalProperties` | [链接](/guide/migration/global-api.html#vue-prototype-替换为-config-globalproperties) |
| GLOBAL_SET                   | ✔    | `Vue.set` 被移除 (不再需要) | |
| GLOBAL_DELETE                | ✔    | `Vue.delete` 被移除 (不再需要) | |
| GLOBAL_OBSERVABLE            | ✔    | `Vue.observable` 被移除 (使用 `reactive`) | [链接](/api/basic-reactivity.html) |
| CONFIG_KEY_CODES             | ✔    | config.keyCodes 被移除 | [链接](/guide/migration/keycode-modifiers.html) |
| CONFIG_WHITESPACE            | ✔    | 在 Vue 3 中空格默认为 `"condense"` | |
| INSTANCE_SET                 | ✔    | `vm.$set` 被移除 (不再需要) | |
| INSTANCE_DELETE              | ✔    | `vm.$delete` 被移除 (不再需要) | |
| INSTANCE_EVENT_EMITTER       | ✔    | `vm.$on`、`vm.$off`、`vm.$once` 被移除 | [链接](/guide/migration/events-api.html) |
| INSTANCE_EVENT_HOOKS         | ✔    | 实例不再抛出 `hook:x` 事件 | [链接](/guide/migration/vnode-lifecycle-events.html) |
| INSTANCE_CHILDREN            | ✔    | `vm.$children` 被移除 | [链接](/guide/migration/children.html) |
| INSTANCE_LISTENERS           | ✔    | `vm.$listeners` 被移除 | [链接](/guide/migration/listeners-removed.html) |
| INSTANCE_SCOPED_SLOTS        | ✔    | `vm.$scopedSlots` 被移除；`vm.$slots` 现在暴露函数 | [链接](/guide/migration/slots-unification.html) |
| INSTANCE_ATTRS_CLASS_STYLE   | ✔    | `$attrs` 现在包含了 `class` 和 `style` | [链接](/guide/migration/attrs-includes-class-style.html) |
| OPTIONS_DATA_FN              | ✔    | `data` 在所有情况下都必须是一个函数 | [链接](/guide/migration/data-option.html) |
| OPTIONS_DATA_MERGE           | ✔    | 来自 mixin 或扩展的 `data` 现在都是浅合并 | [链接](/guide/migration/data-option.html) |
| OPTIONS_BEFORE_DESTROY       | ✔    | `beforeDestroy` -> `beforeUnmount` | |
| OPTIONS_DESTROYED            | ✔    | `destroyed` -> `unmounted` | |
| WATCH_ARRAY                  | ✔    | 对于一个数组的操作，侦听无法被触发了，除非使用了深度侦听 | [链接](/guide/migration/watch.html) |
| V_FOR_REF                    | ✔    | `v-for` 内的 `ref` 不再注册 ref 数组 | [链接](/guide/migration/array-refs.html) |
| V_ON_KEYCODE_MODIFIER        | ✔    | `v-on` 不再支持 keyCode 修饰符 | [链接](/guide/migration/keycode-modifiers.html) |
| CUSTOM_DIR                   | ✔    | 自定义指令钩子命名变化 | [链接](/guide/migration/custom-directives.html) |
| ATTR_FALSE_VALUE             | ✔    | attribute 的绑定值为布尔值 `false` 时不再将其移除 | [链接](/guide/migration/attribute-coercion.html) |
| ATTR_ENUMERATED_COERCION     | ✔    | 不再特殊处理枚举类型 attribute | [链接](/guide/migration/attribute-coercion.html) |
| TRANSITION_GROUP_ROOT        | ✔    | `<transition-group>` 不再默认渲染一个根元素 | [链接](/guide/migration/transition-group.html) |
| COMPONENT_ASYNC              | ✔    | 异步组件 API 改变 (现在需要 `defineAsyncComponent`) | [链接](/guide/migration/async-components.html) |
| COMPONENT_FUNCTIONAL         | ✔    | 函数式组件 API 改变 (现在必须只是一个普通函数) | [链接](/guide/migration/functional-components.html) |
| COMPONENT_V_MODEL            | ✔    | 组件的 v-model 修改 | [链接](/guide/migration/v-model.html) |
| RENDER_FUNCTION              | ✔    | 渲染函数 API 更改 | [链接](/guide/migration/render-function-api.html) |
| FILTERS                      | ✔    | 过滤器被移除 (该选项只会影响运行时的过滤器 API) | [链接](/guide/migration/filters.html) |
| COMPILER_IS_ON_ELEMENT       | ✔    | `is` 的使用现在被严格限制在 `<component>` 上 | [链接](/guide/migration/custom-elements-interop.html) |
| COMPILER_V_BIND_SYNC         | ✔    | `v-bind.sync` 被替换为带参数的 `v-model` | [链接](/guide/migration/v-model.html) |
| COMPILER_V_BIND_PROP         | ✔    | `v-bind.prop` 修饰符被移除 | |
| COMPILER_V_BIND_OBJECT_ORDER | ✔    | `v-bind="object"` 现在是顺序敏感的 | [链接](/guide/migration/v-bind.html) |
| COMPILER_V_ON_NATIVE         | ✔    | `v-on.native` 修饰符被移除 | [链接](/guide/migration/v-on-native-modifier-removed.html) |
| COMPILER_V_FOR_REF           | ✔    | `v-for` 中的 `ref` (编译器支持)) | |
| COMPILER_NATIVE_TEMPLATE     | ✔    | 没有特殊指令的 `<template>` 现在会被渲染为原生元素 | |
| COMPILER_FILTERS             | ✔    | 过滤器 (编译器支持) | |
