# 迁移构建

## 概述

`@vue/compat` (即“迁移构建”) 是一个 Vue 3 的构建，其提供可配置的与 Vue 2 兼容的行为。

该构建默认运行在 Vue 2 的模式下——大部分公有 API 的行为和 Vue 2 一致，仅有一小部分例外。使用在 Vue 3 中发生改变或被废弃的特性时会抛出运行时警告。一个特性的兼容性也可以基于单个组件进行开启或禁用。

### 目标用例

- 将一个 Vue 2 应用升级为 Vue 3 (存在[限制](#已知的限制))
- 迁移一个库以支持 Vue 3
- 对于尚未尝试 Vue 3 的资深 Vue 2 开发者来说，迁移构建可以用来代替 Vue 3 以更好地学习版本之间的差异。

### 已知的限制

当我们全力尝试让该迁移构建模拟尽可能多的 Vue 2 行为的时候，有些限制可能会阻止应用的顺利升级：

- 基于 Vue 2 内部 API 或未成文的行为的依赖。最常见的情况就是使用 `VNodes` 上的私有 property。如果你的项目依赖诸如 [Vuetify](https://vuetifyjs.com/zh-Hans/)、[Quasar](https://quasar.dev/) 或 [ElementUI](https://element.eleme.io/#/zh-CN) 的组件库，那么最好等待一下它们的 Vue 3 兼容版本。

- 对 IE11 的支持：[Vue 3 已经官方放弃对 IE11 的支持](https://github.com/vuejs/rfcs/blob/master/active-rfcs/0038-vue3-ie11-support.md)。如果仍然需要支持 IE11 或更低版本，那你仍需继续使用 Vue 2。

- 服务端渲染：该迁移构建可以被用于服务端渲染，但是迁移一个自定义的服务端渲染设置有更多工作要做。大致的思路是将 `vue-server-renderer` 替换为 [`@vue/server-renderer`](https://github.com/vuejs/vue-next/tree/master/packages/server-renderer)。Vue 3 不再提供一个包渲染器，且我们推荐使用 [Vite](https://cn.vitejs.dev/guide/ssr.html) 支持 Vue 3 服务端渲染。如果你在使用 [Nuxt.js](https://zh.nuxtjs.org/)，那最好等待一下 Nuxt 3。

### 预期

请注意迁移构建旨在覆盖公开成文的 Vue 2 API 和行为。如果应用依赖了未成文的行为导致在迁移构建下运行失败，我们可能不太会调整迁移构建以迎合这种特殊情况。取而代之的是，请考虑重构或移除导致这些问题行为的依赖。

多留意一下：如果你的应用较大且复杂，即便有了构建迁移，整个迁移过程也会是一个挑战。如果你的应用不幸无法顺利升级，请留意我们正在计划将组合式 API 等其它 Vue 3 特性向后迁移至 Vue 2.7 (预计在 2021 年第三季度末)。

如果应用在迁移构建中顺利运行，你**可以**在迁移完成之前将其发布到生产环境。尽管存在一些小的性能或包大小的问题，但应该不会可观地影响到生产环境的用户体验。你可能需要为基于 Vue 2 行为且无法升级/替换的依赖这样做。

该迁移构建会从 3.1 开始提供，且会随着 3.2 的发布计划进行持续发布。我们计划在将来某个小版本号起最终停止发布迁移构建 (在 2021 年底前至少不会)，因此你仍需要在此之前将其迁移到标准构建。

## 升级流程

The following workflow walks through the steps of migrating an actual Vue 2 app (Vue HackerNews 2.0) to Vue 3. The full commits can be found [here](https://github.com/vuejs/vue-hackernews-2.0/compare/migration). Note that the actual steps required for your project may vary, and these steps should be treated as general guidance rather than strict instructions.

### 准备工作

- If you are still using the [deprecated named / scoped slot syntax](https://vuejs.org/v2/guide/components-slots.html#Deprecated-Syntax), update it to the latest syntax first (which is already supported in 2.6).
- 如果你仍然使用[废弃的具名/作用域插槽语法](https://cn.vuejs.org/v2/guide/components-slots.html#废弃了的语法)，请先将其更新至 (2.6 已经支持的) 最新的语法。

### 安装

1. 尽可能升级工具。

   - 如果使用自定义 webpack 设置：升级 `vue-loader` 到 `^16.0.0`。
   - 如果使用 `vue-cli`：通过 `vue upgrade` 升级到最新的 `@vue/cli-service`。
   - (替代方案) 迁移至 [Vite](https://cn.vitejs.dev/) + [vite-plugin-vue2](https://github.com/underfin/vite-plugin-vue2)。[[示例提交](https://github.com/vuejs/vue-hackernews-2.0/commit/565b948919eb58f22a32afca7e321b490cb3b074)]

2. 在 `package.json` 里，更新 `vue` 到 3.1，安装 `@vue/compat` 相同的版本，且如果存在 `vue-template-compiler` 的话，将其替换为 `@vue/compiler-sfc`。

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

3. 在构建设置中，将 `vue` 别名为 `@vue/compat`，且通过 Vue 编译器选项开启兼容模式。

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

4. 在这方面，应用可能会遭遇一些编译时错误/警告 (例如对过滤器的使用)。请先修复它们。如果所有的编译器警告都解决了，你也可以把编译器设置为 Vue 3 模式。

   [示例提交](https://github.com/vuejs/vue-hackernews-2.0/commit/b05d9555f6e115dea7016d7e5a1a80e8f825be52)

5. 在修复这些错误之后，如果没有受制于上述的[限制](#已知的限制)，那么应用就应该可以运行了。

   你可能会同时从命令行和浏览器控制台看到很多警告。这里提供一些一般化的小建议：

   - 你可以在浏览器控制台里过滤特定的警告。通过过滤器使自己每次专注在某一种问题的修复上是个不错的主意。你也可以使用类似 `-GLOBAL_MOUNT` 的否定式过滤器。

   - 你可以通过[兼容性配置](#兼容性配置)抑制特定的废弃内容。

   - 有些警告可能来自你使用的依赖 (如 `vue-router`)。你可以通过警告的组件轨迹或调用栈轨迹 (可以点击展开) 来进行检查。可以优先专注于修复源自你自己代码的警告。

   - 如果你使用了 `vue-router`，请注意在升级至 `vue-router` v4 之前，`<transition>` 和 `<keep-alive>` 无法和 `<router-view>` 一起工作。

6. 升级 [`<transition>` 类名](/guide/migration/transition.html)。这是唯一没有运行时警告的特性。你可以在整个项目范围内做一次 `.*-enter` 和 `.*-leave` CSS 类名的搜索。

   [示例提交](https://github.com/vuejs/vue-hackernews-2.0/commit/d300103ba622ae26ac26a82cd688e0f70b6c1d8f)

7. 更新应用的入口以使用[新的全局挂载 API](/guide/migration/global-api.html#a-new-global-api-createapp)。

   [示例提交](https://github.com/vuejs/vue-hackernews-2.0/commit/a6e0c9ac7b1f4131908a4b1e43641f608593f714)

8. [升级 `vuex` 至 v4](https://next.vuex.vuejs.org/guide/migrating-to-4-0-from-3-x.html)。

   [示例提交](https://github.com/vuejs/vue-hackernews-2.0/commit/5bfd4c61ee50f358cd5daebaa584f2c3f91e0205)

9. [升级 `vue-router` 至 v4](https://next.router.vuejs.org/guide/migration/index.html)。如果你还适用了 `vuex-router-sync`，可以同时将其替换为一个 store getter。

   升级过后，同 `<router-view>` 一起使用 `<transition>` 和 `<keep-alive>` 就要求使用新的[基于作用域插槽的语法](https://next.router.vuejs.org/guide/migration/index.html#router-view-keep-alive-and-transition)。

   [示例提交](https://github.com/vuejs/vue-hackernews-2.0/commit/758961e73ac4089890079d4ce14996741cf9344b)

10. 单独警告单独处理。注意有些特性在 Vue 2 和 Vue 3 之间存在行为冲突——例如渲染函数 API，或函数式组件 vs. 异步组件的改变。为了迁移到 Vue 3 API 而不影响到应用的其它部分，你可以通过 [`compatConfig` 选项](#基于单个组件的配置)对单个组件选入 Vue 3 的行为。

    [示例提交](https://github.com/vuejs/vue-hackernews-2.0/commit/d0c7d3ae789be71b8fd56ce79cb4cb1f921f893b)

11. 当所有的警告都被修复时，你可以正确地移除迁移构建而切换为 Vue 3。注意如果存在基于 Vue 2 行为的依赖，你可能无法做到这一点。

    [示例提交](https://github.com/vuejs/vue-hackernews-2.0/commit/9beb45490bc5f938c9e87b4ac1357cfb799565bd)

## 兼容性配置

### 全局配置

Compat features can be disabled individually:

```js
import { configureCompat } from 'vue'

// disable compat for certain features
configureCompat({
  FEATURE_ID_A: false,
  FEATURE_ID_B: false
})
```

Alternatively, the entire application can default to Vue 3 behavior, with only certain compat features enabled:

```js
import { configureCompat } from 'vue'

// default everything to Vue 3 behavior, and only enable compat
// for certain features
configureCompat({
  MODE: 3,
  FEATURE_ID_A: true,
  FEATURE_ID_B: true
})
```

### 基于单个组件的配置

A component can use the `compatConfig` option, which expects the same options as the global `configureCompat` method:

```js
export default {
  compatConfig: {
    MODE: 3, // opt-in to Vue 3 behavior for this component only
    FEATURE_ID_A: true // features can also be toggled at component level
  }
  // ...
}
```

### 针对编译器的配置

Features that start with `COMPILER_` are compiler-specific: if you are using the full build (with in-browser compiler), they can be configured at runtime. However if using a build setup, they must be configured via the `compilerOptions` in the build config instead (see example configs above).

## 特性参考

### 兼容性类型

- ✔ Fully compatible
- ◐ Partially Compatible with caveats
- ⨂ Incompatible (warning only)
- ⭘ Compat only (no warning)

### 不兼容

> Should be fixed upfront or will likely lead to errors

| ID                                    | Type | Description                                                             | Docs                                                                                           |
| ------------------------------------- | ---- | ----------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| GLOBAL_MOUNT_CONTAINER                | ⨂    | Mounted application does not replace the element it's mounted to        | [link](/guide/migration/mount-changes.html)                                                    |
| CONFIG_DEVTOOLS                       | ⨂    | production devtools is now a build-time flag                            | [link](https://github.com/vuejs/vue-next/tree/master/packages/vue#bundler-build-feature-flags) |
| COMPILER_V_IF_V_FOR_PRECEDENCE        | ⨂    | `v-if` and `v-for` precedence when used on the same element has changed | [link](/guide/migration/v-if-v-for.html)                                                       |
| COMPILER_V_IF_SAME_KEY                | ⨂    | `v-if` branches can no longer have the same key                         | [link](/guide/migration/key-attribute.html#on-conditional-branches)                            |
| COMPILER_V_FOR_TEMPLATE_KEY_PLACEMENT | ⨂    | `<template v-for>` key should now be placed on `<template>`             | [link](/guide/migration/key-attribute.html#with-template-v-for)                                |
| COMPILER_SFC_FUNCTIONAL               | ⨂    | `<template functional>` is no longer supported in SFCs                  | [link](/guide/migration/functional-components.html#single-file-components-sfcs)                |

### 带有注意事项的部分兼容

| ID                       | Type | Description                                                                                                                                                                                | Docs                                                                                                          |
| ------------------------ | ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------- |
| CONFIG_IGNORED_ELEMENTS  | ◐    | `config.ignoredElements` is now `config.compilerOptions.isCustomElement` (only in browser compiler build). If using build setup, `isCustomElement` must be passed via build configuration. | [link](/guide/migration/global-api.html#config-ignoredelements-is-now-config-compileroptions-iscustomelement) |
| COMPILER_INLINE_TEMPLATE | ◐    | `inline-template` removed (compat only supported in browser compiler build)                                                                                                                | [link](/guide/migration/inline-template-attribute.html)                                                       |
| PROPS_DEFAULT_THIS       | ◐    | props default factory no longer have access to `this` (in compat mode, `this` is not a real instance - it only exposes props, `$options` and injections)                                   | [link](/guide/migration/props-default-this.html)                                                              |
| INSTANCE_DESTROY         | ◐    | `$destroy` instance method removed (in compat mode, only supported on root instance)                                                                                                       |                                                                                                               |
| GLOBAL_PRIVATE_UTIL      | ◐    | `Vue.util` is private and no longer available                                                                                                                                              |                                                                                                               |
| CONFIG_PRODUCTION_TIP    | ◐    | `config.productionTip` no longer necessary                                                                                                                                                 | [link](/guide/migration/global-api.html#config-productiontip-removed)                                         |
| CONFIG_SILENT            | ◐    | `config.silent` removed                                                                                                                                                                    |                                                                                                               |

### 仅兼容 (无告警)

| ID                 | Type | Description                            | Docs                                     |
| ------------------ | ---- | -------------------------------------- | ---------------------------------------- |
| TRANSITION_CLASSES | ⭘    | Transition enter/leave classes changed | [link](/guide/migration/transition.html) |

### 完全兼容

| ID                           | Type | Description                                                           | Docs                                                                                       |
| ---------------------------- | ---- | --------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| GLOBAL_MOUNT                 | ✔    | new Vue() -> createApp                                                | [link](/guide/migration/global-api.html#mounting-app-instance)                             |
| GLOBAL_EXTEND                | ✔    | Vue.extend removed (use `defineComponent` or `extends` option)        | [link](/guide/migration/global-api.html#vue-extend-removed)                                |
| GLOBAL_PROTOTYPE             | ✔    | `Vue.prototype` -> `app.config.globalProperties`                      | [link](/guide/migration/global-api.html#vue-prototype-replaced-by-config-globalproperties) |
| GLOBAL_SET                   | ✔    | `Vue.set` removed (no longer needed)                                  |                                                                                            |
| GLOBAL_DELETE                | ✔    | `Vue.delete` removed (no longer needed)                               |                                                                                            |
| GLOBAL_OBSERVABLE            | ✔    | `Vue.observable` removed (use `reactive`)                             | [link](/api/basic-reactivity.html)                                                         |
| CONFIG_KEY_CODES             | ✔    | config.keyCodes removed                                               | [link](/guide/migration/keycode-modifiers.html)                                            |
| CONFIG_WHITESPACE            | ✔    | In Vue 3 whitespace defaults to `"condense"`                          |                                                                                            |
| INSTANCE_SET                 | ✔    | `vm.$set` removed (no longer needed)                                  |                                                                                            |
| INSTANCE_DELETE              | ✔    | `vm.$delete` removed (no longer needed)                               |                                                                                            |
| INSTANCE_EVENT_EMITTER       | ✔    | `vm.$on`, `vm.$off`, `vm.$once` removed                               | [link](/guide/migration/events-api.html)                                                   |
| INSTANCE_EVENT_HOOKS         | ✔    | Instance no longer emits `hook:x` events                              | [link](/guide/migration/vnode-lifecycle-events.html)                                       |
| INSTANCE_CHILDREN            | ✔    | `vm.$children` removed                                                | [link](/guide/migration/children.html)                                                     |
| INSTANCE_LISTENERS           | ✔    | `vm.$listeners` removed                                               | [link](/guide/migration/listeners-removed.html)                                            |
| INSTANCE_SCOPED_SLOTS        | ✔    | `vm.$scopedSlots` removed; `vm.$slots` now exposes functions          | [link](/guide/migration/slots-unification.html)                                            |
| INSTANCE_ATTRS_CLASS_STYLE   | ✔    | `$attrs` now includes `class` and `style`                             | [link](/guide/migration/attrs-includes-class-style.html)                                   |
| OPTIONS_DATA_FN              | ✔    | `data` must be a function in all cases                                | [link](/guide/migration/data-option.html)                                                  |
| OPTIONS_DATA_MERGE           | ✔    | `data` from mixin or extension is now shallow merged                  | [link](/guide/migration/data-option.html)                                                  |
| OPTIONS_BEFORE_DESTROY       | ✔    | `beforeDestroy` -> `beforeUnmount`                                    |                                                                                            |
| OPTIONS_DESTROYED            | ✔    | `destroyed` -> `unmounted`                                            |                                                                                            |
| WATCH_ARRAY                  | ✔    | watching an array no longer triggers on mutation unless deep          | [link](/guide/migration/watch.html)                                                        |
| V_FOR_REF                    | ✔    | `ref` inside `v-for` no longer registers array of refs                | [link](/guide/migration/array-refs.html)                                                   |
| V_ON_KEYCODE_MODIFIER        | ✔    | `v-on` no longer supports keyCode modifiers                           | [link](/guide/migration/keycode-modifiers.html)                                            |
| CUSTOM_DIR                   | ✔    | Custom directive hook names changed                                   | [link](/guide/migration/custom-directives.html)                                            |
| ATTR_FALSE_VALUE             | ✔    | No longer removes attribute if binding value is boolean `false`       | [link](/guide/migration/attribute-coercion.html)                                           |
| ATTR_ENUMERATED_COERCION     | ✔    | No longer special case enumerated attributes                          | [link](/guide/migration/attribute-coercion.html)                                           |
| TRANSITION_GROUP_ROOT        | ✔    | `<transition-group>` no longer renders a root element by default      | [link](/guide/migration/transition-group.html)                                             |
| COMPONENT_ASYNC              | ✔    | Async component API changed (now requires `defineAsyncComponent`)     | [link](/guide/migration/async-components.html)                                             |
| COMPONENT_FUNCTIONAL         | ✔    | Functional component API changed (now must be plain functions)        | [link](/guide/migration/functional-components.html)                                        |
| COMPONENT_V_MODEL            | ✔    | Component v-model reworked                                            | [link](/guide/migration/v-model.html)                                                      |
| RENDER_FUNCTION              | ✔    | Render function API changed                                           | [link](/guide/migration/render-function-api.html)                                          |
| FILTERS                      | ✔    | Filters removed (this option affects only runtime filter APIs)        | [link](/guide/migration/filters.html)                                                      |
| COMPILER_IS_ON_ELEMENT       | ✔    | `is` usage is now restricted to `<component>` only                    | [link](/guide/migration/custom-elements-interop.html)                                      |
| COMPILER_V_BIND_SYNC         | ✔    | `v-bind.sync` replaced by `v-model` with arguments                    | [link](/guide/migration/v-model.html)                                                      |
| COMPILER_V_BIND_PROP         | ✔    | `v-bind.prop` modifier removed                                        |                                                                                            |
| COMPILER_V_BIND_OBJECT_ORDER | ✔    | `v-bind="object"` is now order sensitive                              | [link](/guide/migration/v-bind.html)                                                       |
| COMPILER_V_ON_NATIVE         | ✔    | `v-on.native` modifier removed                                        | [link](/guide/migration/v-on-native-modifier-removed.html)                                 |
| COMPILER_V_FOR_REF           | ✔    | `ref` in `v-for` (compiler support)                                   |                                                                                            |
| COMPILER_NATIVE_TEMPLATE     | ✔    | `<template>` with no special directives now renders as native element |                                                                                            |
| COMPILER_FILTERS             | ✔    | filters (compiler support)                                            |                                                                                            |
{"mode":"full","isActive":false}
