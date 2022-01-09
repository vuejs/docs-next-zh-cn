# 插槽

> 该页面假设你已经阅读过了[组件基础](component-basics.md)。如果你对组件还不太了解，推荐你先阅读它。

<VideoLesson href="https://vueschool.io/lessons/vue-3-component-slots?friend=vuejs" title="Free Vue.js Slots lesson">通过 Vue School 上的免费课程学习插槽基础</VideoLesson>

## 插槽内容

Vue 实现了一套内容分发的 API，这套 API 的设计灵感源自 [Web Components 规范草案](https://github.com/w3c/webcomponents/blob/gh-pages/proposals/Slots-Proposal.md)，将 `<slot>` 元素作为承载分发内容的出口。

它允许你像这样合成组件：

```html
<todo-button>
  Add todo
</todo-button>
```

然后在 `<todo-button>` 的模板中，你可能有：

```html
<!-- todo-button 组件模板 -->
<button class="btn-primary">
  <slot></slot>
</button>
```

当组件渲染的时候，`<slot></slot>` 将会被替换为“Add todo”。

```html
<!-- 渲染 HTML -->
<button class="btn-primary">
  Add todo
</button>
```

不过，字符串只是开始！插槽还可以包含任何模板代码，包括 HTML：

```html
<todo-button>
  <!-- 添加一个 Font Awesome 图标 -->
  <i class="fas fa-plus"></i>
  Add todo
</todo-button>
```

或其他组件：

```html
<todo-button>
  <!-- 添加一个图标的组件 -->
  <font-awesome-icon name="plus"></font-awesome-icon>
  Add todo
</todo-button>
```

如果 `<todo-button>` 的 template 中**没有**包含一个 `<slot>` 元素，则该组件起始标签和结束标签之间的任何内容都会被抛弃。

```html
<!-- todo-button 组件模板 -->

<button class="btn-primary">
  Create a new item
</button>
```

```html
<todo-button>
  <!-- 以下文本不会渲染 -->
  Add todo
</todo-button>
```

## 渲染作用域

当你想在一个插槽中使用数据时，例如：

```html
<todo-button>
  Delete a {{ item.name }}
</todo-button>
```

该插槽可以访问与模板其余部分相同的实例 property (即相同的“作用域”)。

<img src="/images/slot.png" width="447" height="auto" style="display: block; margin: 0 auto; max-width: 100%" loading="lazy" alt="Slot explanation diagram">

插槽**不能**访问 `<todo-button>` 的作用域。例如，尝试访问 `action` 将不起作用：

```html
<todo-button action="delete">
  Clicking here will {{ action }} an item
  <!--
  `action` 将会是 undefined，因为这个内容是
  传递到 <todo-button>，
  而不是在 <todo-button> 中定义的。
  -->
</todo-button>
```

请记住这条规则：

> 父级模板里的所有内容都是在父级作用域中编译的；子模板里的所有内容都是在子作用域中编译的。

## 备用内容

有时为一个插槽指定备用 (也就是默认的) 内容是很有用的，它只会在没有提供内容的时候被渲染。例如在一个 `<submit-button>` 组件中：

```html
<button type="submit">
  <slot></slot>
</button>
```

我们可能希望这个 `<button>` 内绝大多数情况下都渲染“Submit”文本。为了将“Submit”作为备用内容，我们可以将它放在 `<slot>` 标签内：

```html
<button type="submit">
  <slot>Submit</slot>
</button>
```

现在当我们在一个父级组件中使用 `<submit-button>` 并且不提供任何插槽内容时：

```html
<submit-button></submit-button>
```

备用内容“Submit”将会被渲染：

```html
<button type="submit">
  Submit
</button>
```

但是如果我们提供内容：

```html
<submit-button>
  Save
</submit-button>
```

则这个提供的内容将会被渲染从而取代备用内容：

```html
<button type="submit">
  Save
</button>
```

## 具名插槽

有时我们需要多个插槽。例如对于一个带有如下模板的 `<base-layout>` 组件：

```html
<div class="container">
  <header>
    <!-- 我们希望把页头放这里 -->
  </header>
  <main>
    <!-- 我们希望把主要内容放这里 -->
  </main>
  <footer>
    <!-- 我们希望把页脚放这里 -->
  </footer>
</div>
```

对于这样的情况，`<slot>` 元素有一个特殊的 attribute：`name`。通过它可以为不同的插槽分配独立的 ID，也就能够以此来决定内容应该渲染到什么地方：

```html
<div class="container">
  <header>
    <slot name="header"></slot>
  </header>
  <main>
    <slot></slot>
  </main>
  <footer>
    <slot name="footer"></slot>
  </footer>
</div>
```

一个不带 `name` 的 `<slot>` 出口会带有隐含的名字“default”。

在向具名插槽提供内容的时候，我们可以在一个 `<template>` 元素上使用 `v-slot` 指令，并以 `v-slot` 的参数的形式提供其名称：

```html
<base-layout>
  <template v-slot:header>
    <h1>Here might be a page title</h1>
  </template>

  <template v-slot:default>
    <p>A paragraph for the main content.</p>
    <p>And another one.</p>
  </template>

  <template v-slot:footer>
    <p>Here's some contact info</p>
  </template>
</base-layout>
```

现在 `<template>` 元素中的所有内容都将会被传入相应的插槽。

渲染的 HTML 将会是：

```html
<div class="container">
  <header>
    <h1>Here might be a page title</h1>
  </header>
  <main>
    <p>A paragraph for the main content.</p>
    <p>And another one.</p>
  </main>
  <footer>
    <p>Here's some contact info</p>
  </footer>
</div>
```

注意，**`v-slot` 只能添加在 `<template>` 上** ([只有一种例外情况](#独占默认插槽的缩写语法))。

## 作用域插槽

有时让插槽内容能够访问子组件中才有的数据是很有用的。当一个组件被用来渲染一个项目数组时，这是一个常见的情况，我们希望能够自定义每个项目的渲染方式。

例如，我们有一个组件，包含一个待办项目列表。

```js
app.component('todo-list', {
  data() {
    return {
      items: ['Feed a cat', 'Buy milk']
    }
  },
  template: `
    <ul>
      <li v-for="(item, index) in items">
        {{ item }}
      </li>
    </ul>
  `
})
```

我们可能会想把 <span v-pre>`{{ item }}`</span> 替换为 `<slot>`，以便在父组件上对其自定义。

```html
<todo-list>
  <i class="fas fa-check"></i>
  <span class="green">{{ item }}</span>
</todo-list>
```

但是，这是行不通的，因为只有在 `<todo-list>` 组件中可以访问 `item`，且插槽内容是在它的父组件上提供的。

要使 `item` 在父级提供的插槽内容上可用，我们可以添加一个 `<slot>` 元素并将其作为一个 attribute 绑定：

```html
<ul>
  <li v-for="( item, index ) in items">
    <slot :item="item"></slot>
  </li>
</ul>
```

可以根据自己的需要将任意数量的 attribute 绑定到 `slot` 上：

```html
<ul>
  <li v-for="( item, index ) in items">
    <slot :item="item" :index="index" :another-attribute="anotherAttribute"></slot>
  </li>
</ul>
```

绑定在 `<slot>` 元素上的 attribute 被称为**插槽 prop**。现在，在父级作用域中，我们可以使用带值的 `v-slot` 来定义我们提供的插槽 prop 的名字：

```html
<todo-list>
  <template v-slot:default="slotProps">
    <i class="fas fa-check"></i>
    <span class="green">{{ slotProps.item }}</span>
  </template>
</todo-list>
```

<img src="/images/scoped-slot.png" width="611" height="auto" style="display: block; margin: 0 auto; max-width: 100%;" loading="lazy" alt="Scoped slot diagram"> 

在这个例子中，我们选择将包含所有插槽 prop 的对象命名为 `slotProps`，但你也可以使用任意你喜欢的名字。

### 独占默认插槽的缩写语法

在上述情况下，当被提供的内容*只有*默认插槽时，组件的标签才可以被当作插槽的模板来使用。这样我们就可以把 `v-slot` 直接用在组件上：

```html
<todo-list v-slot:default="slotProps">
  <i class="fas fa-check"></i>
  <span class="green">{{ slotProps.item }}</span>
</todo-list>
```

这种写法还可以更简单。就像假定未指明的内容对应默认插槽一样，不带参数的 `v-slot` 被假定对应默认插槽：

```html
<todo-list v-slot="slotProps">
  <i class="fas fa-check"></i>
  <span class="green">{{ slotProps.item }}</span>
</todo-list>
```

注意默认插槽的缩写语法**不能**和具名插槽混用，因为它会导致作用域不明确：

```html
<!-- 无效，会导致警告 -->
<todo-list v-slot="slotProps">
  <i class="fas fa-check"></i>
  <span class="green">{{ slotProps.item }}</span>
  
  <template v-slot:other="otherSlotProps">
    slotProps 在此处不可用
  </template>
</todo-list>
```

只要出现多个插槽，请始终为*所有的*插槽使用完整的基于 `<template>` 的语法：

```html
<todo-list>
  <template v-slot:default="slotProps">
    <i class="fas fa-check"></i>
    <span class="green">{{ slotProps.item }}</span>
  </template>

  <template v-slot:other="otherSlotProps">
    ...
  </template>
</todo-list>
```

### 解构插槽 Prop

作用域插槽的内部工作原理是将你的插槽内容包括在一个传入单个参数的函数里：

```js
function (slotProps) {
  // ... 插槽内容 ...
}
```

这意味着 `v-slot` 的值实际上可以是任何能够作为函数定义中的参数的 JavaScript 表达式。因此你也可以使用 [ES2015 解构](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#Object_destructuring) 来传入具体的插槽 prop，如下：

```html
<todo-list v-slot="{ item }">
  <i class="fas fa-check"></i>
  <span class="green">{{ item }}</span>
</todo-list>
```

这样可以使模板更简洁，尤其是在该插槽提供了多个 prop 的时候。它同样开启了 prop 重命名等其它可能，例如将 `item` 重命名为 `todo`：

```html
<todo-list v-slot="{ item: todo }">
  <i class="fas fa-check"></i>
  <span class="green">{{ todo }}</span>
</todo-list>
```

你甚至可以定义备用内容，用于插槽 prop 是 undefined 的情形：

```html
<todo-list v-slot="{ item = 'Placeholder' }">
  <i class="fas fa-check"></i>
  <span class="green">{{ item }}</span>
</todo-list>
```

## 动态插槽名

[动态指令参数](template-syntax.md#动态参数)也可以用在 `v-slot` 上，来定义动态的插槽名：

```html
<base-layout>
  <template v-slot:[dynamicSlotName]>
    ...
  </template>
</base-layout>
```

## 具名插槽的缩写

跟 ` v-on` 和 `v-bind` 一样，`v-slot` 也有缩写，即把参数之前的所有内容 (`v-slot:`) 替换为字符 `#`。例如 `v-slot:header` 可以被重写为 `#header`：

```html
<base-layout>
  <template #header>
    <h1>Here might be a page title</h1>
  </template>

  <template #default>
    <p>A paragraph for the main content.</p>
    <p>And another one.</p>
  </template>

  <template #footer>
    <p>Here's some contact info</p>
  </template>
</base-layout>
```

然而，和其它指令一样，该缩写只在其有参数的时候才可用。这意味着以下语法是无效的：

```html
<!-- 这将触发一个警告 -->

<todo-list #="{ item }">
  <i class="fas fa-check"></i>
  <span class="green">{{ item }}</span>
</todo-list>
```

如果希望使用缩写的话，你必须始终以明确的插槽名取而代之：

```html
<todo-list #default="{ item }">
  <i class="fas fa-check"></i>
  <span class="green">{{ item }}</span>
</todo-list>
```
