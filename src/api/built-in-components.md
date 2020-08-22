# 内置组件

## component

- **Props：**

  - `is` - `string | ComponentDefinition | ComponentConstructor`

- **用法：**

  渲染一个“元组件”为动态组件。依 `is` 的值，来决定哪个组件被渲染。

  ```html
  <!--  动态组件由 vm 实例的 `componentId` property 控制 -->
  <component :is="componentId"></component>

  <!-- 也能够渲染注册过的组件或 prop 传入的组件-->
  <component :is="$options.components.child"></component>
  ```

-  **参考：** [动态组件](../guide/component-dynamic-async.html)

## transition

- **Props：**

  - `name` - `string` 用于自动生成 CSS 过渡类名。例如：`name: 'fade'` 将自动拓展为 `.fade-enter`，`.fade-enter-active` 等。
  - `appear` - `boolean`，是否在初始渲染时使用过渡。默认为 `false`。
  - `persisted` - `boolean`。如果是 true，表示这是一个不真实插入/删除元素的转换，而是切换显示/隐藏状态。过渡钩子被注入，但渲染器将跳过。相反，自定义指令可以通过调用注入的钩子 (例如 `v-show`) 来控制转换。
  - `css` - `boolean`。是否使用 CSS 过渡类。默认为 `true`。如果设置为 `false`，将只通过组件事件触发注册的 JavaScript 钩子。
  - `type` - `string`。指定过渡事件类型，侦听过渡何时结束。有效值为 `"transition"` 和 `"animation"`。默认 Vue.js 将自动检测出持续时间长的为过渡事件类型。
  - `mode` - `string` 控制离开/进入过渡的时间序列。有效的模式有 `"out-in"` 和 `"in-out"`；默认同时进行。  
  - `duration` - `number | {` enter `: number,` leave `: number }`。指定过渡的持续时间。默认情况下，Vue 会等待过渡所在根元素的第一个 `transitionend` 或 `animationend` 事件。
  - `enter-from-class` - `string`
  - `leave-from-class` - `string`
  - `appear-class` - `string`
  - `enter-to-class` - `string`
  - `leave-to-class` - `string`
  - `appear-to-class` - `string`
  - `enter-active-class` - `string`
  - `leave-active-class` - `string`
  - `appear-active-class` - `string`

- **事件：**

  - `before-enter`
  - `before-leave`
  - `enter`
  - `leave`
  - `appear`
  - `after-enter`
  - `after-leave`
  - `after-appear`
  - `enter-cancelled`
  - `leave-cancelled` (仅 `v-show`)
  - `appear-cancelled`

- **用法：**

  `<transition>` 元素作为**单个**元素/组件的过渡效果。`<transition>` 只会把过渡效果应用到其包裹的内容上，而不会额外渲染 DOM 元素，也不会出现在可被检查的组件层级中。

  ```html
  <!-- 单个元素 -->
  <transition>
    <div v-if="ok">toggled content</div>
  </transition>

  <!-- 动态组件 -->
  <transition name="fade" mode="out-in" appear>
    <component :is="view"></component>
  </transition>

  <!-- 事件钩子 -->
  <div id="transition-demo">
    <transition @after-enter="transitionComplete">
      <div v-show="ok">toggled content</div>
    </transition>
  </div>
  ```

  ```js
  const app = Vue.createApp({
    ...
    methods: {
      transitionComplete (el) {
        // 因为传递了'el'的DOM元素作为参数
      }
    }
    ...
  })

  app.mount('#transition-demo')
  ```

-  **参考：** [进入 & 离开过渡](/guide/transitions-enterleave.html#transitioning-single-elements-components)

## transition-group

- **Props：**

  - `tag` - `string`，默认为 `span`。
  - `move-class` - 覆盖移动过渡期间应用的 CSS 类。
  - 除了 `mode`，其他 attribute 和 `<transition>` 相同。

- **事件：**

  - 事件和 `<transition>` 相同。

- **用法：**

  `<transition-group>` 元素作为**多个**元素/组件的过渡效果。`<transition-group>` 渲染一个真实的 DOM 元素。默认渲染 `<span>`，可以通过 `tag` attribute 配置哪个元素应该被渲染。

  注意，每个 `<transition-group>` 的子节点必须有[**独立的 key**](./special-attributes.html#key)，动画才能正常工作

  `<transition-group>` 支持通过 CSS transform 过渡移动。当一个子节点被更新，从屏幕上的位置发生变化，它会被应用一个移动中的 CSS 类 (通过 `name` attribute 或配置 `move-class` attribute 自动生成)。如果 CSS `transform` property 是“可过渡”property，当应用移动类时，将会使用 [FLIP 技术](https://aerotwist.com/blog/flip-your-animations/)使元素流畅地到达动画终点。

  ```html
  <transition-group tag="ul" name="slide">
    <li v-for="item in items" :key="item.id">
      {{ item.text }}
    </li>
  </transition-group>
  ```

-  **参考：** [列表过渡](/guide/transitions-list.html)

## keep-alive

- **Props：**

  - `include` - `string | RegExp | Array`。只有名称匹配的组件会被缓存。
  - `exclude` - `string | RegExp | Array`。任何名称匹配的组件都不会被缓存。
  - `max` - `number | string`。最多可以缓存多少组件实例。

- **用法：**

  `<keep-alive>` 包裹动态组件时，会缓存不活动的组件实例，而不是销毁它们。和 `<transition>` 相似，`<keep-alive>` 是一个抽象组件：它自身不会渲染一个 DOM 元素，也不会出现在组件的父组件链中。

  当组件在 `<keep-alive>` 内被切换，它的 `activated` 和 `deactivated` 这两个生命周期钩子函数将会被对应执行。

  主要用于保留组件状态或避免重新渲染。

  ```html
  <!-- 基本 -->
  <keep-alive>
    <component :is="view"></component>
  </keep-alive>

  <!-- 多个条件判断的子组件 -->
  <keep-alive>
    <comp-a v-if="a > 1"></comp-a>
    <comp-b v-else></comp-b>
  </keep-alive>

  <!-- 和 `<transition>` 一起使用 -->
  <transition>
    <keep-alive>
      <component :is="view"></component>
    </keep-alive>
  </transition>
  ```

  注意，`<keep-alive>` 是用在其一个直属的子组件被切换的情形。如果你在其中有 `v-for` 则不会工作。如果有上述的多个条件性的子元素，`<keep-alive>` 要求同时只有一个子元素被渲染。


- **`include` 和 `exclude`**

  The `include` 和 `exclude` prop 允许组件有条件地缓存。二者都可以用逗号分隔字符串、正则表达式或一个数组来表示：

  ```html
  <!-- 逗号分隔字符串 -->
  <keep-alive include="a,b">
    <component :is="view"></component>
  </keep-alive>

  <!-- regex (使用 `v-bind`) -->
  <keep-alive :include="/a|b/">
    <component :is="view"></component>
  </keep-alive>

  <!-- Array (使用 `v-bind`) -->
  <keep-alive :include="['a', 'b']">
    <component :is="view"></component>
  </keep-alive>
  ```

  匹配首先检查组件自身的 `name` 选项，如果 `name` 选项不可用，则匹配它的局部注册名称 (父组件 `components` 选项的键值)。匿名组件不能被匹配。

- **`max`**

  最多可以缓存多少组件实例。一旦这个数字达到了，在新实例被创建之前，已缓存组件中最久没有被访问的实例会被销毁掉。

  ```html
  <keep-alive :max="10">
    <component :is="view"></component>
  </keep-alive>
  ```

  :::warning
  `<keep-alive>` 不会在函数式组件中正常工作，因为它们没有缓存实例。
  :::

-  **参考：** [动态组件 - keep-alive](../guide/component-dynamic-async.html#dynamic-components-with-keep-alive)

## slot

- **Props：**

  - `name` - `string`，用于具名插槽

- **用法：**

  `<slot>` 元素作为组件模板之中的内容分发插槽。`<slot>` 元素自身将被替换。

  详细用法，请参考下面教程的链接。

-  **参考：** [通过插槽分发内容](../guide/component-basics.html#content-distribution-with-slots)

## teleport

- **Props：**

  - `to` - `string`。需要 prop，必须是有效的查询选择器或 HTMLElement (如果在浏览器环境中使用)。指定将在其中移动 `<teleport>` 内容的目标元素

  ```html
  <!-- 正确 -->
  <teleport to="#some-id" />
  <teleport to=".some-class" />
  <teleport to="[data-teleport]" />

  <!-- 错误 -->
  <teleport to="h1" />
  <teleport to="some-string" />
  ```

  - `disabled` - `boolean`。此可选属性可用于禁用 `<teleport>` 的功能，这意味着其插槽内容将不会移动到任何位置，而是在您在周围父组件中指定了 `<teleport>` 的位置渲染。

  ```html
  <teleport to="#popup" :disabled="displayVideoInline">
    <video src="./my-movie.mp4">
  </teleport>
  ```

  请注意，这将移动实际的 DOM 节点，而不是被销毁和重新创建，并且它还将保持任何组件实例的活动状态。所有有状态的 HTML 元素 (即播放的视频) 都将保持其状态。

-  **参考：** [Teleport 组件](../guide/teleport.html#teleport)
