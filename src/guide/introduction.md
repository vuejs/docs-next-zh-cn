# 介绍

::: tip 提示
已经了解 Vue 2，只想了解 Vue 3 的新功能可以参阅[迁移指南](/guide/migration/introduction.html)！
:::

## Vue.js 是什么

Vue (读音 /vjuː/，类似于 **view**) 是一套用于构建用户界面的**渐进式框架**。与其它大型框架不同的是，Vue 被设计为可以自底向上逐层应用。Vue 的核心库只关注视图层，不仅易于上手，还便于与第三方库或既有项目整合。另一方面，当与[现代化的工具链](../guide/single-file-component.html)以及各种[支持类库](https://github.com/vuejs/awesome-vue#components--libraries)结合使用时，Vue 也完全能够为复杂的单页应用提供驱动。

如果你想在深入学习 Vue 之前对它有更多了解，我们<a id="modal-player" href="#">制作了一个视频</a>，带你了解其核心概念和一个示例工程。

<VideoLesson href="https://www.vuemastery.com/courses/intro-to-vue-3/intro-to-vue3" title="在 Vue Mastery 上免费观看视频课程">在 Vue Mastery 上免费观看视频课程</VideoLesson>

## 起步

<p>
  <ActionLink class="primary" url="installation.html">
    安装
  </ActionLink>
</p>

:::tip
官方指南假设你已了解关于 HTML、CSS 和 JavaScript 的中级知识。如果你刚开始学习前端开发，将框架作为你的第一步可能不是最好的主意——掌握好基础知识再来吧！之前有其它框架的使用经验会有帮助，但这不是必需的
:::

尝试 Vue.js 最简单的方法是使用 [Hello World 例子](https://codepen.io/team/Vue/pen/KKpRVpx)，你可以在浏览器新标签页中打开它，跟着例子学习一些基础用法。

[安装教程](/guide/installation.html)给出了更多安装 Vue 的方式。请注意我们**不推荐**新手直接使用 `vue-cli`，尤其是在你还不熟悉基于 Node.js 的构建工具时。

## 声明式渲染

Vue.js 的核心是一个允许采用简洁的模板语法来声明式地将数据渲染进 DOM 的系统：

```html
<div id="counter">
  Counter: {{ counter }}
</div>
```

```js
const Counter = {
  data() {
    return {
      counter: 0
    }
  }
}

Vue.createApp(Counter).mount('#counter')
```

我们已经成功创建了第一个 Vue 应用！看起来这跟渲染一个字符串模板非常类似，但是 Vue 在背后做了大量工作。现在数据和 DOM 已经被建立了关联，所有东西都是**响应式的**。我们要怎么确认呢？请看下面的示例，其中 `counter` property 每秒递增，你将看到渲染的 DOM 是如何变化的：

```js{8-10}
const Counter = {
  data() {
    return {
      counter: 0
    }
  },
  mounted() {
    setInterval(() => {
      this.counter++
    }, 1000)
  }
}
```

<FirstExample />

除了文本插值，我们还可以像这样绑定元素的 attribute：

```html
<div id="bind-attribute">
  <span v-bind:title="message">
    鼠标悬停几秒钟查看此处动态绑定的提示信息！
  </span>
</div>
```

```js
const AttributeBinding = {
  data() {
    return {
      message: 'You loaded this page on ' + new Date().toLocaleString()
    }
  }
}

Vue.createApp(AttributeBinding).mount('#bind-attribute')
```

<common-codepen-snippet title="Attribute dynamic binding" slug="KKpRVvJ" />

这里我们遇到了一点新东西。你看到的 `v-bind` attribute 被称为**指令**。指令带有前缀 `v-`，以表示它们是 Vue 提供的特殊 attribute。可能你已经猜到了，它们会在渲染的 DOM 上应用特殊的响应式行为。在这里，该指令的意思是：“_将这个元素节点的 `title` attribute 和当前活跃实例的 `message` property 保持一致_”。

## 处理用户输入

为了让用户和应用进行交互，我们可以用 `v-on` 指令添加一个事件监听器，通过它调用在实例中定义的方法：

```html
<div id="event-handling">
  <p>{{ message }}</p>
  <button v-on:click="reverseMessage">反转 Message</button>
</div>
```

```js
const EventHandling = {
  data() {
    return {
      message: 'Hello Vue.js!'
    }
  },
  methods: {
    reverseMessage() {
      this.message = this.message
        .split('')
        .reverse()
        .join('')
    }
  }
}

Vue.createApp(EventHandling).mount('#event-handling')
```

<common-codepen-snippet title="Event handling" slug="dyoeGjW" />

注意在这个方法中，我们更新了应用的状态，但没有触碰 DOM——所有的 DOM 操作都由 Vue 来处理，你编写的代码只需要关注逻辑层面即可。

Vue 还提供了 `v-model` 指令，它能轻松实现表单输入和应用状态之间的双向绑定。

```html
<div id="two-way-binding">
  <p>{{ message }}</p>
  <input v-model="message" />
</div>
```

```js
const TwoWayBinding = {
  data() {
    return {
      message: 'Hello Vue!'
    }
  }
}

Vue.createApp(TwoWayBinding).mount('#two-way-binding')
```

<common-codepen-snippet title="Two-way binding" slug="poJVgZm" />

## 条件与循环

控制切换一个元素是否显示也相当简单：

```html
<div id="conditional-rendering">
  <span v-if="seen">现在你看到我了</span>
</div>
```

```js
const ConditionalRendering = {
  data() {
    return {
      seen: true
    }
  }
}

Vue.createApp(ConditionalRendering).mount('#conditional-rendering')
```

这个例子演示了我们不仅可以把数据绑定到 DOM 文本或 attribute，还可以绑定到 DOM 的**结构**。此外，Vue 也提供一个强大的过渡效果系统，可以在 Vue 插入/更新/移除元素时自动应用[过渡效果](transitions-enterleave.md)。

你可以在下面的沙盒中将 `seen` 从 `true` 更改为 `false`，以检查效果：

<common-codepen-snippet title="Conditional rendering" slug="oNXdbpB" tab="js,result" />

还有其它很多指令，每个都有特殊的功能。例如，`v-for` 指令可以绑定数组的数据来渲染一个项目列表：

```html
<div id="list-rendering">
  <ol>
    <li v-for="todo in todos">
      {{ todo.text }}
    </li>
  </ol>
</div>
```

```js
const ListRendering = {
  data() {
    return {
      todos: [
        { text: 'Learn JavaScript' },
        { text: 'Learn Vue' },
        { text: 'Build something awesome' }
      ]
    }
  }
}

Vue.createApp(ListRendering).mount('#list-rendering')
```

<common-codepen-snippet title="List rendering" slug="mdJLVXq" />

## 组件化应用构建

组件系统是 Vue 的另一个重要概念，因为它是一种抽象，允许我们使用小型、独立和通常可复用的组件构建大型应用。仔细想想，几乎任意类型的应用界面都可以抽象为一个组件树：

![Component Tree](/images/components.png)

在 Vue 中，组件本质上是一个具有预定义选项的实例。在 Vue 中注册组件很简单：如对 `app` 对象所做的那样创建一个组件对象，并将其定义在父级组件的 `components` 选项中：

```js
const TodoItem = {
  template: `<li>This is a todo</li>`
}

// 创建 Vue 应用
const app = Vue.createApp({
  components: {
    TodoItem // 注册一个新组件
  },
  ... // 组件的其它 property
})

// 挂载 Vue 应用
app.mount(...)
```

现在，你可以将其放到另一个组件的模板中：

```html
<ol>
  <!-- 创建一个 todo-item 组件实例 -->
  <todo-item></todo-item>
</ol>
```

但是这样会为每个待办项渲染同样的文本，这看起来并不炫酷。我们应该能将数据从父组件传入子组件才对。让我们来修改一下组件的定义，使之能够接受一个 [prop](component-basics.html#通过-prop-向子组件传递数据)：

```js
const TodoItem = {
  props: ['todo'],
  template: `<li>{{ todo.text }}</li>`
}
```

现在，我们可以使用 `v-bind` 指令将待办项传到循环输出的每个组件中：

```html
<div id="todo-list-app">
  <ol>
     <!--
      现在我们为每个 todo-item 提供 todo 对象
      todo 对象是变量，即其内容可以是动态的。
      我们也需要为每个组件提供一个“key”，稍后再
      作详细解释。
    -->
    <todo-item
      v-for="item in groceryList"
      v-bind:todo="item"
      v-bind:key="item.id"
    ></todo-item>
  </ol>
</div>
```

```js
const TodoItem = {
  props: ['todo'],
  template: `<li>{{ todo.text }}</li>`
}

const TodoList = {
  data() {
    return {
      groceryList: [
        { id: 0, text: 'Vegetables' },
        { id: 1, text: 'Cheese' },
        { id: 2, text: 'Whatever else humans are supposed to eat' }
      ]
    }
  },
  components: {
    TodoItem
  }
}

const app = Vue.createApp(TodoList)

app.mount('#todo-list-app')
```

<common-codepen-snippet title="Intro-Components-1" slug="VwLxeEz" />

尽管这只是一个刻意设计的例子，但是我们已经设法将应用分割成了两个更小的单元。子单元通过 prop 接口与父单元进行了良好的解耦。我们现在可以进一步改进 `<todo-item>` 组件，提供一个更为复杂的模板和逻辑，而不会影响到父应用。

在一个大型应用中，有必要将整个应用程序划分为多个组件，以使开发更易管理。在[后续教程](component-basics.html)中我们将详述组件，不过这里有一个 (假想的) 例子，以展示使用了组件的应用模板是什么样的：

```html
<div id="app">
  <app-nav></app-nav>
  <app-view>
    <app-sidebar></app-sidebar>
    <app-content></app-content>
  </app-view>
</div>
```

### 与自定义元素的关系

你可能已经注意到 Vue 组件与**自定义元素**非常类似——它是 [Web Components 规范](https://www.w3.org/wiki/WebComponents/)的一部分。确实，Vue 的组件设计 (如插槽 API) 在浏览器原生支持该规范前就部分受到了它的影响。

它们之间主要的不同在于，Vue 组件的数据模型是作为框架的一部分而设计的，而该框架为构建复杂应用提供了很多必要的附加功能。例如响应式模板和状态管理——这两者都没有被该规范所覆盖。

Vue 也为创建和使用自定义元素提供了很好的支持。关于其更多细节，请浏览 [Vue 和 Web Components](/guide/web-components.html) 章节。

## 准备好了吗？

我们刚才简单介绍了 Vue 核心最基本的功能——本教程的其余部分将更加详细地涵盖这些功能以及其它高阶功能，所以请务必读完整个教程！
