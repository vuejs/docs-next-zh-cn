# 指令

## v-text

- **预期：** `string`

- **详细：**

  更新元素的 [textContent](https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent)。如果要更新部分的 `textContent`，需要使用 `{{ Mustache }}` 插值。

- **示例：**

  ```html
  <span v-text="msg"></span>
  <!-- same as -->
  <span>{{msg}}</span>
  ```

-  **参考：** [数据绑定语法 - 插值](../guide/template-syntax.html#text)

## v-html

- **预期：** `string`

- **详细：**

  更新元素的 [innerHTML](https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML)。**注意：内容按普通 HTML 插入 - 不会作为 Vue 模板进行编译**。如果试图使用 `v-html` 组合模板，可以重新考虑是否通过使用组件来替代。

  ::: warning
  在网站上动态渲染任意 HTML 是非常危险的，因为容易导致 [XSS 攻击](https://en.wikipedia.org/wiki/Cross-site_scripting)。只在可信内容上使用 `v-html`，**永不**用在用户提交的内容上。
  :::

  在 [单文件组件](../guide/single-file-component.html 里， `scoped` 的样式不会应用在 `v-html` 内部，因为那部分 HTML 没有被 Vue 的模板编译器处理。如果你希望针对 `v-html` 的内容设置带作用域的 CSS，你可以替换为 [CSS modules](https://vue-loader.vuejs.org/en/features/css-modules.html) 或用一个额外的全局 `<style>` 元素手动设置类似 BEM 的作用域策略。

- **示例：**

  ```html
  <div v-html="html"></div>
  ```

-  **参考：** [数据绑定语法 - 插值](../guide/template-syntax.html#raw-html)

## v-show

- **预期：** `any`

- **用法：**

  根据表达式之真假值，切换元素的 `display` CSS property。

  当条件变化时该指令触发过渡效果。

-  **参考：** [条件渲染 - v-show](../guide/conditional.html#v-show)

## v-if

- **预期：** `any`

- **用法：**

  根据表达式的值的 truthy-ness 来有条件地渲染元素。在切换时元素及它的数据绑定 / 组件被销毁并重建。如果元素是 `<template>`，将提取它的内容作为条件块。

  当条件变化时该指令触发过渡效果。

  当和 `v-if` 一起使用时，`v-for` 的优先级比 `v-if` 更高。详见 [列表渲染教程](../guide/list.html#v-for-with-v-if)

-  **参考：** [条件渲染 - v-if](../guide/conditional.html#v-if)

## v-else

- **不需要表达式**

- **限制：** 前一兄弟元素必须有 `v-if` 或 `v-else-if`。

- **用法：**

  为 `v-if` 或者 `v-else-if` 添加“else 块”。

  ```html
  <div v-if="Math.random() > 0.5">
    Now you see me
  </div>
  <div v-else>
    Now you don't
  </div>
  ```

-  **参考：** [条件渲染 - v-else](../guide/conditional.html#v-else)

## v-else-if

- **预期：** `any`

- **限制：** 前一兄弟元素必须有 `v-if` 或 `v-else-if`。

- **用法：**

  表示 `v-if` 的“else if 块”。可以链式调用。

  ```html
  <div v-if="type === 'A'">
    A
  </div>
  <div v-else-if="type === 'B'">
    B
  </div>
  <div v-else-if="type === 'C'">
    C
  </div>
  <div v-else>
    Not A/B/C
  </div>
  ```

-  **参考：** [条件渲染- v-else-if](../guide/conditional.html#v-else-if)

## v-for

- **预期：** `Array | Object | number | string | Iterable`

- **用法：**

  基于源数据多次渲染元素或模板块。此指令之值，必须使用特定语法 `alias in expression`，为当前遍历的元素提供别名：

  ```html
  <div v-for="item in items">
    {{ item.text }}
  </div>
  ```

  另外也可以为数组索引指定别名 (或者用于对象的键)：

  ```html
  <div v-for="(item, index) in items"></div>
  <div v-for="(value, key) in object"></div>
  <div v-for="(value, name, index) in object"></div>
  ```

  `v-for` 的默认行为会尝试原地修改元素而不是移动它们。要强制其重新排序元素，你需要用特殊 attribute `key` 来提供一个排序提示：

  ```html
  <div v-for="item in items" :key="item.id">
    {{ item.text }}
  </div>
  ```

  `v-for` 也可以在实现了 [可迭代协议](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol) 的值上使用，包括原生的 `Map` 和 `Set`。

  `v-for` 的详细用法可以通过以下链接查看教程详细说明。

-  **参考：**
  - [列表渲染](../guide/list.html)

## v-on

- **缩写：** `@`

- **预期：** `Function | Inline Statement | Object`

- **参数：** `event`

- **修饰符：**

  - `.stop` - 调用 `event.stopPropagation()`.
  - `.prevent` - 调用 `event.preventDefault()`.
  - `.capture` - - 添加事件侦听器时使用 capture 模式。
  - `.self` - 只当事件是从侦听器绑定的元素本身触发时才触发回调。
  - `.{keyAlias}` - 仅当事件是从特定键触发时才触发回调。
  - `.once` - 只触发一次回调。
  - `.left` - 只当点击鼠标左键时触发。
  - `.right` - 只当点击鼠标右键时触发。
  - `.middle` - 只当点击鼠标中键时触发。
  - `.passive` - `{ passive: true }` 模式添加侦听器

- **用法：**

  绑定事件监听器。事件类型由参数指定。表达式可以是一个方法的名字或一个内联语句，如果没有修饰符也可以省略。

  用在普通元素上时，只能监听 [原生 DOM 事件](https://developer.mozilla.org/en-US/docs/Web/Events)。用在自定义元素组件上时，也可以监听子组件触发的**自定义事件**。

  监听原生 DOM 事件时，方法以事件为唯一的参数。如果使用内联语句，语句可以访问一个 `$event` property：`v-on:click="handle('ok', $event)"`。

  `v-on` 同样支持不带参数绑定一个事件/监听器键值对的对象。注意当使用对象语法时，是不支持任何修饰器的。

- **示例：**

  ```html
  <!-- 方法处理器 -->
  <button v-on:click="doThis"></button>

  <!-- 动态事件 -->
  <button v-on:[event]="doThis"></button>

  <!-- 内联语句 -->
  <button v-on:click="doThat('hello', $event)"></button>

  <!-- 缩写 -->
  <button @click="doThis"></button>

  <!-- 动态事件缩写 (2.6.0+) -->
  <button @[event]="doThis"></button>

  <!-- 停止冒泡 -->
  <button @click.stop="doThis"></button>

  <!-- 阻止默认行为 -->
  <button @click.prevent="doThis"></button>

  <!-- 阻止默认行为，没有表达式 -->
  <form @submit.prevent></form>

  <!-- 串联修饰符 -->
  <button @click.stop.prevent="doThis"></button>

  <!-- 键修饰符，键别名 -->
  <input @keyup.enter="onEnter" />

  <!-- 点击回调只会触发一次 -->
  <button v-on:click.once="doThis"></button>

  <!-- 对象语法 -->
  <button v-on="{ mousedown: doThis, mouseup: doThat }"></button>
  ```

  在子组件上监听自定义事件 (当子组件触发“my-event”时将调用事件处理器)：

  ```html
  <my-component @my-event="handleThis"></my-component>

  <!-- 内联语句 -->
  <my-component @my-event="handleThis(123, $event)"></my-component>
  ```

-  **参考：**
  - [事件处理器]](../guide/events.html)
  - [组件 - 自定义事件](../guide/component-basics.html#listening-to-child-components-events)

## v-bind

- **缩写：** `:`

- **预期：** `any (with argument) | Object (without argument)`

- **参数：** `attrOrProp (optional)`

- **修饰符：**

  - `.camel` - 将 kebab-case attribute 名转换为 camelCase。

- **用法：**

  动态地绑定一个或多个 attribute，或一个组件 prop 到表达式。

  在绑定 `class` 或 `style` attribute 时，支持其它类型的值，如数组或对象。可以通过下面的教程链接查看详情。

  在绑定 prop 时，prop 必须在子组件中声明。可以用修饰符指定不同的绑定类型。

  没有参数时，可以绑定到一个包含键值对的对象。注意此时 `class` 和 `style` 绑定不支持数组和对象。

- **示例：**

  ```html
  <!-- 绑定 attribute -->
  <img v-bind:src="imageSrc" />

  <!-- 动态 attribute 名 -->
  <button v-bind:[key]="value"></button>

  <!-- 缩写 -->
  <img :src="imageSrc" />

  <!-- 动态 attribute 名缩写 -->
  <button :[key]="value"></button>

  <!-- 内联字符串拼接 -->
  <img :src="'/path/to/images/' + fileName" />

  <!-- class 绑定 -->
  <div :class="{ red: isRed }"></div>
  <div :class="[classA, classB]"></div>
  <div :class="[classA, { classB: isB, classC: isC }]">
    <!-- style 绑定 -->
    <div :style="{ fontSize: size + 'px' }"></div>
    <div :style="[styleObjectA, styleObjectB]"></div>

    <!-- 绑定一个全是 attribute 的对象 -->
    <div v-bind="{ id: someProp, 'other-attr': otherProp }"></div>

    <!-- prop 绑定。"prop" 必须在 my-component 声明 -->
    <my-component :prop="someThing"></my-component>

    <!-- 通过 $props 将父组件的 props 一起传给子组件 -->
    <child-component v-bind="$props"></child-component>

    <!-- XLink -->
    <svg><a :xlink:special="foo"></a></svg>
  </div>
  ```

  `.camel` 修饰符允许在使用 DOM 模板时将 `v-bind` property 名称驼峰化，例如 SVG 的 `viewBox` property：

  ```html
  <svg :view-box.camel="viewBox"></svg>
  ```

  在使用字符串模板或通过 `vue-loader` / `vueify` 编译时，无需使用 `.camel`。

-  **参考：**
  - [Class 和 Style 绑定](../guide/class-and-style.html)
  - [组件 - Props](../guide/component-basics.html#passing-data-to-child-components-with-props)

## v-model

- **预期：** 随表单控件类型不同而不同。

- **限制于：**

  - `<input>`
  - `<select>`
  - `<textarea>`
  - components

- **修饰符：**

  - [`.lazy`](../guide/forms.html#lazy) -  取代 `input` 监听 `change` 事件
  - [`.number`](../guide/forms.html#number) - 输入字符串转为有效的数字
  - [`.trim`](../guide/forms.html#trim) - 输入首尾空格过滤

- **用法：**

  在表单控件或者组件上创建双向绑定。细节请看下面的教程链接。

-  **参考：**
  - [表单控件绑定](../guide/forms.html)
  - [组件 - 在输入组件上使用自定义事件](../guide/component-custom-events.html#v-model-arguments)

## v-slot

- **缩写：** `#`

- **预期：** 可放置在函数参数位置的 JavaScript 表达式 (在 [支持的环境](../guide/component-slots.html#destructuring-slot-props) 下可使用解构)。可选，即只需要在为插槽传入 prop 的时候使用。

- **参数：** 插槽名 (可选，默认值是 `default`)

- **限用于：**

  - `<template>`
  - [组件](../guide/component-slots.html#abbreviated-syntax-for-lone-default-slots) （对于一个单独的带 prop 的默认插槽）

- **用法：**

  提供具名插槽或需要接收 prop 的插槽。

- **示例：**

  ```html
  <!-- 具名插槽 -->
  <base-layout>
    <template v-slot:header>
      Header content
    </template>

    <template v-slot:default>
      Default slot content
    </template>

    <template v-slot:footer>
      Footer content
    </template>
  </base-layout>

  <!-- 接收 prop 的具名插槽 -->
  <infinite-scroll>
    <template v-slot:item="slotProps">
      <div class="item">
        {{ slotProps.item.text }}
      </div>
    </template>
  </infinite-scroll>

  <!-- 接收 prop 的默认插槽，使用了解构 -->
  <mouse-position v-slot="{ x, y }">
    Mouse position: {{ x }}, {{ y }}
  </mouse-position>
  ```

  更多细节请查阅以下链接。

-  **参考：**
  - [组件 - 插槽](../guide/component-slots.html)

## v-pre

- **不需要表达式**

- **用法：**

  跳过这个元素和它的子元素的编译过程。可以用来显示原始 Mustache 标签。跳过大量没有指令的节点会加快编译。

- **示例：**

  ```html
  <span v-pre>{{ this will not be compiled }}</span>
  ```

## v-cloak

- **不需要表达式**

- **用法：**

  这个指令保持在元素上直到关联组件实例结束编译。和 CSS 规则如 `[v-cloak] { display: none }` 一起用时，这个指令可以隐藏未编译的 Mustache 标签直到组件实例准备完毕。

- **示例：**

  ```css
  [v-cloak] {
    display: none;
  }
  ```

  ```html
  <div v-cloak>
    {{ message }}
  </div>
  ```

  `<div>` 不会显示，直到编译结束。

## v-once

- **不需要表达式**

- **详细：**

  只渲染元素和组件**一次**。随后的重新渲染，元素/组件及其所有的子节点将被视为静态内容并跳过。这可以用于优化更新性能。

  ```html
  <!-- 单个元素 -->
  <span v-once>This will never change: {{msg}}</span>
  <!-- 有子元素 -->
  <div v-once>
    <h1>comment</h1>
    <p>{{msg}}</p>
  </div>
  <!-- 组件 -->
  <my-component v-once :comment="msg"></my-component>
  <!-- `v-for` 指令 -->
  <ul>
    <li v-for="i in list" v-once>{{i}}</li>
  </ul>
  ```

-  **参考：**
  - [数据绑定语法- 插值](../guide/template-syntax.html#text)

## v-is

> 注意: 本节仅影响直接在页面的HTML中写入Vue模板的情况。

- **预期：** 字符串文本

- **限制于：** 原生HTML元素

- **用法：** 在DOM内模板使用时，模板受原生HTML解析规则的约束。某些HTML元素，如：`<ul>`、`<ol>`、`<table>`和`<select>`等，对哪些元素可以出现在它们内部有限制，而某些元素（如：`<li>`、`<tr>` 和 `<option>` 只能出现在某些其他元素中。作为解决方法，我们可以对以下元素使用 `v-is`指令：

```html
<table>
  <tr v-is="'blog-post-row'"></tr>
</table>
```

:::warning
`v-is` 函数类似于动态2.x `:is` 绑定 —— 因此要按组件的注册名称渲染组件，其值应为JavaScript字符串文本：
```html
<!-- 不正确，不会渲染任何内容 -->
<tr v-is="blog-post-row"></tr>

<!-- 正确 -->
<tr v-is="'blog-post-row'"></tr>
```

:::
