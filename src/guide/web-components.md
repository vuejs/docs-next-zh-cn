# Vue 与 Web Components

[Web Components](https://developer.mozilla.org/zh-CN/docs/Web/Web_Components) 是一组 Web 原生 API 的总称，允许开发人员创建可重用的自定义组件。

我们认为 Vue 和 Web Components 大体上是互补的技术。Vue 能很好地解析和创建自定义元素。不论是在将自定义元素整合到已有的 Vue 应用中，还是使用 Vue 构建和分发自定义元素，你都能获得很好的支持。

## 在 Vue 中使用自定义元素

Vue [在 Custom Elements Everywhere 测试中获得了 100% 的完美分数](https://custom-elements-everywhere.com/libraries/vue/results/results.html)。Vue 应用程序中解析出的自定义元素大体上和原生 HTML 元素相同，但需要牢记以下几点：

### 跳过组件的解析

默认情况下，Vue 会优先尝试将一个非原生的 HTML 标签解析为一个注册的 Vue 组件，如果失败则会将其渲染为自定义元素。这种行为会导致在开发模式下的 Vue 发出“failed to resolve component”的警告。如果你希望 Vue 能将某些确切的元素作为自定义元素处理并跳过组件解析，请指定 [`compilerOptions.isCustomElement` 选项](/api/application-config.html#compileroptions)。

如果你正在构建步骤中使用 Vue，则此选项需要通过构建配置传递，因为这是一个编译时选项。

#### 浏览器内配置示例

```js
// 仅当使用浏览器内编译时有效
// 如果你正在使用构建工具，请查看下方的配置示例
app.config.compilerOptions.isCustomElement = tag => tag.includes('-')
```

#### Vite 配置示例

```js
// vite.config.js
import vue from '@vitejs/plugin-vue'

export default {
  plugins: [
    vue({
      template: {
        compilerOptions: {
          // 将所有包含短横线的标签作为自定义元素处理
          isCustomElement: tag => tag.includes('-')
        }
      }
    })
  ]
}
```

#### Vue CLI 配置示例

```js
// vue.config.js
module.exports = {
  chainWebpack: config => {
    config.module
      .rule('vue')
      .use('vue-loader')
      .tap(options => ({
        ...options,
        compilerOptions: {
          // 将所有以 ion- 开头的标签作为自定义元素处理
          isCustomElement: tag => tag.startsWith('ion-')
        }
      }))
  }
}
```

### 传递 DOM Property

由于 DOM attribute 只能是字符串，因此我们得将复杂数据作为 DOM property 传递给自定义元素。在自定义元素上配置 prop 时，Vue 3 会自动使用 `in` 操作符检查是否存在 DOM-property，如果此键存在则会优先将值配置为一个 DOM property。也就是说大多数情况下，如果自定义元素遵守[推荐的最佳实践](https://developers.google.com/web/fundamentals/web-components/best-practices#aim-to-keep-primitive-data-attributes-and-properties-in-sync,-reflecting-from-property-to-attribute,-and-vice-versa.)，则无需考虑这一点。

但是，在极少数情况下，数据必须作为 DOM property 传递，但自定义元素没有正确定义/反映 property  (导致 `in` 检查失败)。此时，可以使用 `.prop` 修饰符强制将一个 `v-bind` 绑定设置为一个 DOM property：

```html
<my-element :user.prop="{ name: 'jack' }"></my-element>

<!-- 等效的简写 -->
<my-element .user="{ name: 'jack' }"></my-element>
```

## 使用 Vue 构建自定义元素

自定义元素的一大好处就是它们可以与任何框架一起使用，甚至可以在没有框架的情况下使用。当你需要向可能使用不同前端技术栈的终端用户分发组件时，或者希望向最终应用程序隐藏其所用组件的实现细节时，使用自定义元素非常适合。

### defineCustomElement

Vue 支持使用 [`defineCustomElement`](/api/global-api.html#definecustomelement) 方法创建自定义元素，并且使用与 Vue 组件完全一致的 API。该方法接受与 [`defineComponent`](/api/global-api.html#definecomponent) 相同的参数，但是会返回一个扩展自 `HTMLElement` 的自定义元素构造函数：

```html
<my-vue-element></my-vue-element>
```

```js
import { defineCustomElement } from 'vue'

const MyVueElement = defineCustomElement({
  // 在此提供正常的 Vue 组件选项
  props: {},
  emits: {},
  template: `...`,

  // defineCustomElement 独有特性: CSS 会被注入到隐式根 (shadow root) 中
  styles: [`/* inlined css */`]
})

// 注册自定义元素
// 注册完成后，此页面上的所有的 `<my-vue-element>` 标签会被更新
customElements.define('my-vue-element', MyVueElement)

// 你也可以编程式地实例化这个元素：
// (只能在注册后完成此操作)
document.body.appendChild(
  new MyVueElement({
    // initial props (optional)
  })
)
```

#### 生命周期

- 当元素的 [`connectedCallback`](https://developer.mozilla.org/zh-CN/docs/Web/Web_Components/Using_custom_elements#使用生命周期回调函数) 被首次调用时，Vue 自定义元素会在其隐式根部挂载一个内部的 Vue 组件实例。

- 当元素的 `disconnectedCallback` 被调用时，Vue 会在很短的时间后检查此元素是否已被移出页面。

  - 如果元素仍在文档中，说明是移动，组件实例将被保留；

  - 如果元素已被移出文档，说明是移除，组件实例将被卸载。

#### Props

- 所有使用 `props` 选项声明的 prop 都将在自定义元素上定义为 property。Vue 将在合适的时候自动处理 attribute / property 之间的映射。

  - Attribute 总是映射为相应的 property。

  - 基础类型 (`string`、`boolean` 或 `number`) 的 property 会被映射为 attribute。

- Vue 也会自动将声明为 `Boolean` 或 `Number` 类型的 attribute prop (始终为字符串)转换为所需的类型。例如给出以下 prop 声明：

  ```js
  props: {
    selected: Boolean,
    index: Number
  }
  ```

  以及自定义元素用法：

  ```html
  <my-element selected index="1"></my-element>
  ```

  在组件中，`selected` 会被转换为 `true` (boolean)，`index` 会被转换为 `1` (number)。

#### 事件

在自定义元素中，通过 `this.$emit` 或在 setup 中的 `emit` 发出的事件会被调度为原生 [CustomEvents](https://developer.mozilla.org/en-US/docs/Web/Events/Creating_and_triggering_events#adding_custom_data_%E2%80%93_customevent)。附加的事件参数 (payload) 会作为数组暴露在 CustomEvent 对象的 `details` property 上。

#### 插槽

在组件内部，可以像往常一样使用 `<slot/>` 渲染插槽。但是在解析最终生成的元素时，它只接受[原生插槽语法](https://developer.mozilla.org/zh-CN/docs/Web/Web_Components/Using_templates_and_slots)：

- 不支持[作用域插槽](/guide/component-slots.html#scoped-slot#作用域插槽)。

- 传递命名插槽时，请使用 `slot` attribute 而非 `v-slot` 指令：

  ```html
  <my-element>
    <div slot="named">hello</div>
  </my-element>
  ```

#### Provide / Inject

[Provide / Inject API](/guide/component-provide-inject.html#provide-inject) 和[组合式 API 中的 Provide / Inject](/api/composition-api.html#provide-inject) 在 Vue 定义的自定义元素之间可以正常工作。但是请注意这**仅适用于自定义元素之间**，即 Vue 定义的自定义元素将无法注入非自定义元素的 Vue 组件提供的属性。

### 将 SFC 作为自定义元素

`defineCustomElement` 也适用于 Vue 单文件组件 (SFC)。但是，在默认工具链配置下，生产构建时 SFC 内部的 `<style>` 会被提取并合并到单独的 CSS 文件中。当使用 SFC 作为自定义元素时，通常需要将 `<style>` 标签注入自定义元素的隐式根。

官方 SFC 工具支持以“自定义元素模式”(需要 `@vitejs/plugin-vue@^1.4.0` 或 `vue-loader@^16.5.0` )导入 SFC。以自定义元素模式加载的 SFC 将其 `<style>` 标签作为 CSS 字符串内联，并在组件的 `styles` 选项中暴露出来，然后会被 `defineCustomElement` 获取并在实例化时注入隐式根。

要选用此模式，只需使用 `.ce.vue` 作为文件拓展名即可：

```js
import { defineCustomElement } from 'vue'
import Example from './Example.ce.vue'

console.log(Example.styles) // ["/* 内联的 css */"]

// 转换为自定义元素构造器
const ExampleElement = defineCustomElement(Example)

// 注册
customElements.define('my-example', ExampleElement)
```

如果你希望指定应在自定义元素模式下导入的文件(例如将 _所有_ SFC 视为自定义元素)，你可以将 `customElement` 选项传递给相应的构建插件：

- [@vitejs/plugin-vue](https://github.com/vitejs/vite/tree/main/packages/plugin-vue#using-vue-sfcs-as-custom-elements)
- [vue-loader](https://github.com/vuejs/vue-loader/tree/next#v16-only-options)

### Vue 自定义元素库的提示

如果使用 Vue 构建自定义元素，则此元素将依赖于 Vue 的运行时。这会导致一个 16kb 左右的基础大小开销 (具体取决于使用了多少特性)。这意味着如果你准备发布单个自定义元素，使用 Vue 可能不是最佳方案——你可能想要使用纯 JavaScript，[petite-vue](https://github.com/vuejs/petite-vue)，或是其他专注于轻量化运行时的框架。但是，如果你要发布具有复杂逻辑的自定义元素集合，那么这点基础大小就会显得合理了，因为 Vue 可以使用非常精简的代码耦合每个组件。你准备发布的元素越多，开销权衡就越好。

如果自定义元素会在同样使用 Vue 的项目中使用，你可以选择从构建的包中外部化 Vue，这样元素就会使用与宿主应用程序相同的 Vue 副本。

我们推荐你提供一个导出独立元素的构造函数，这样你的用户就可以灵活地按需导入它们并使用他们所需的标签名注册自定义元素。你还可以导出一个能自动注册所有元素的函数以便于使用。这是一个 Vue 自定义元素库示例的入口点：

```js
import { defineCustomElement } from 'vue'
import Foo from './MyFoo.ce.vue'
import Bar from './MyBar.ce.vue'

const MyFoo = defineCustomElement(Foo)
const MyBar = defineCustomElement(Bar)

// 导出独立的元素
export { MyFoo, MyBar }

export function register() {
  customElements.define('my-foo', MyFoo)
  customElements.define('my-bar', MyBar)
}
```

如果你有许多组件，你还可以利用构建工具提供的功能，例如 Vite 的 [glob 导入](https://cn.vitejs.dev/guide/features.html#glob-import)或是 webpack 的 [`require.context`](https://webpack.js.org/guides/dependency-management/#requirecontext)。

## 对比 Web Components 与 Vue 组件

一些开发人员认为应该避免使用框架专有的组件模型，并且仅使用自定义元素以便应用程序“面向未来”。我们将在此处尝试解释为什么我们认为这种看法过于简单化了问题。

自定义元素和 Vue 组件之间确实存在一定程度的功能重叠：它们都允许我们定义具有数据传递、事件发出和生命周期管理功能的可重用组件。然而，Web Components API 是相对低级和简单的。为了构建一个实际可用的应用程序，我们需要很多平台没有涵盖的附加功能：

- 一个声明式的、高效的模板系统；

- 一个有助于跨组件逻辑提取和重用的响应式状态管理系统；

- 一个能在服务器端渲染组件并在客户端集成的高效方法(SSR)，这对于 SEO 和 [Web 关键指标 (例如 LCP)](https://web.dev/vitals/) 来说很重要。原生自定义元素 SSR 通常涉及在 Node.js 中模拟 DOM，然后序列化被改变的 DOM，而 Vue SSR 会尽可能编译为字符串连接，后者的效率更高。

作为一个考虑周到的系统，Vue 的组件模型在设计时就考虑到了这些需求。

如果你拥有一支称职的工程团队，或许可以基于原生自定义元素构建出近似效果的产品——但这也意味着你需要承担对内部框架的长期维护负担，同时失去了像 Vue 这样拥有生态系统和社区贡献的成熟的框架。

也有使用自定义元素作为其组件模型基础构建的框架，但它们都不可避免地要针对上面列出的问题引入自己的专有解决方案。使用这些框架需要学习或是购买他们对这些问题的技术决策——尽管他们可能会打广告宣传——这依旧无法使你免除后顾之忧。

我们还找到了一些自定义元素无法胜任的应用场景：

- 激进的插槽定值会阻碍组件的整合。Vue 的[作用域插槽](/guide/component-slots.html#scoped-slots)提供了非常强大的组件整合机制，这是原生插槽所没有的，因为原生插槽的激进特性。激进特性插槽同样意味着接收组件无法控制何时或是否需要渲染一段插槽内容。

- 目前，发布带有隐式 DOM scoped CSS 的自定义元素需要将 CSS 嵌入到 JavaScript 中，以便它们可以在运行时注入到隐式根中。在 SSR 场景中，它们还会导致重复定义样式。该领域有一些[平台特性](https://github.com/whatwg/html/pull/4898/)正在开发中——但截至目前，它们尚未得到普遍支持，并且仍有生产环境性能/ SSR 问题需要解决。而与此同时，Vue SFC 已经提供了 [CSS 作用域机制](/api/sfc-style.html)，支持将样式提取到纯 CSS 文件中。

Vue 将始终与 Web 平台中的最新标准保持同步，如果平台提供的任何内容能使我们的工作更轻松，我们将很乐意利用它。但是，我们的目标是提供运行良好且开箱即用的解决方案。这意味着我们必须以批判的心态整合新的平台功能——这会涉及到在遵循现有标准的前提下弥补标准的不足。
