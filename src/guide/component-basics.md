# 组件基础

## 基本实例

这里有一个 Vue 组件的示例：

```js
// 创建一个Vue 应用
const app = Vue.createApp({})

// 定义一个名为 button-counter 的新全局组件
app.component('button-counter', {
  data() {
    return {
      count: 0
    }
  },
  template: `
    <button @click="count++">
      You clicked me {{ count }} times.
    </button>`
})
```

::: info
在这里演示的是一个简单的示例，但是在典型的 Vue 应用中，我们使用单个文件组件而不是字符串模板。你可以[在本节](single-file-component.html)找到有关它们的更多信息。
:::

组件是带有名称的可复用实例，在这个例子中是 `<button-counter>`。我们可以把这个组件作为一个根实例中的自定义元素来使用：

```html
<div id="components-demo">
  <button-counter></button-counter>
</div>
```

```js
app.mount('#components-demo')
```
<common-codepen-snippet title="Component basics" slug="abORVEJ" tab="js,result" :preview="false" />

因为组件是可复用的组件实例，所以它们与根实例接收相同的选项，例如 `data`、`computed`、`watch`、`methods` 以及生命周期钩子等。

## 组件的复用

你可以将组件进行任意次数的复用：

```html
<div id="components-demo">
  <button-counter></button-counter>
  <button-counter></button-counter>
  <button-counter></button-counter>
</div>
```

<common-codepen-snippet title="Component basics: reusing components" slug="rNVqYvM" tab="html,result" :preview="false" />

注意当点击按钮时，每个组件都会各自独立维护它的 `count`。因为你每用一次组件，就会有一个它的新**实例**被创建。

## 组件的组织

通常一个应用会以一棵嵌套的组件树的形式来组织：

![Component Tree](/images/components.png)

例如，你可能会有页头、侧边栏、内容区等组件，每个组件又包含了其它的像导航链接、博文之类的组件。

为了能在模板中使用，这些组件必须先注册以便 Vue 能够识别。这里有两种组件的注册类型：**全局注册**和**局部注册**。至此，我们的组件都只是通过 `component` 全局注册的：

```js
const app = Vue.createApp({})

app.component('my-component-name', {
  // ... 选项 ...
})
```

全局注册的组件可以在随后创建的 `app` 实例模板中使用，也包括根实例组件树中的所有子组件的模板中。

到目前为止，关于组件注册你需要了解的就这些了，如果你阅读完本页内容并掌握了它的内容，我们会推荐你再回来把[组件注册](component-registration.md)读完。

## 通过 Prop 向子组件传递数据

早些时候，我们提到了创建一个博文组件的事情。问题是如果你不能向这个组件传递某一篇博文的标题或内容之类的我们想展示的数据的话，它是没有办法使用的。这也正是 prop 的由来。

Prop 是你可以在组件上注册的一些自定义 attribute。为了给博文组件传递一个标题，我们可以用一个 props 选项将其包含在该组件可接受的 `prop` 列表中：

```js
const app = Vue.createApp({})

app.component('blog-post', {
  props: ['title'],
  template: `<h4>{{ title }}</h4>`
})

app.mount('#blog-post-demo')
```

一个组件默认可以拥有任意数量的 prop，任何值都可以传递给任何 prop。在上述模板中，你会发现我们能够在组件实例中访问这个值，就像访问 `data` 中的值一样。

一个 prop 被注册之后，你就可以像这样把数据作为一个自定义 attribute 传递进来：

```html
<div id="blog-post-demo" class="demo">
  <blog-post title="My journey with Vue"></blog-post>
  <blog-post title="Blogging with Vue"></blog-post>
  <blog-post title="Why Vue is so fun"></blog-post>
</div>
```

<common-codepen-snippet title="Component basics: passing props" slug="PoqyOaX" tab="html,result" :preview="false" />

然而在一个典型的应用中，你可能在 `data` 里有一个博文的数组：

```js
const App = {
  data() {
    return {
      posts: [
        { id: 1, title: 'My journey with Vue' },
        { id: 2, title: 'Blogging with Vue' },
        { id: 3, title: 'Why Vue is so fun' }
      ]
    }
  }
}

const app = Vue.createApp(App)

app.component('blog-post', {
  props: ['title'],
  template: `<h4>{{ title }}</h4>`
})

app.mount('#blog-posts-demo')
```

并想要为每篇博文渲染一个组件：

```html
<div id="blog-posts-demo">
  <blog-post
    v-for="post in posts"
    :key="post.id"
    :title="post.title"
  ></blog-post>
</div>
```

如上所示，你会发现我们可以使用 `v-bind` 来动态传递 prop。这在你一开始不清楚要渲染的具体内容，是非常有用的。

到目前为止，关于 prop 你需要了解的大概就这些了，如果你阅读完本页内容并掌握了它的内容，我们会推荐你再回来把 [prop](component-props.html) 读完。

## 监听子组件事件

我们在开发 `<blog-post>` 组件时，它的一些功能可能需要与父级组件进行沟通。例如我们可能会引入一个辅助功能来放大博文的字号，同时让页面的其它部分保持默认的字号。

在其父组件中，我们可以通过添加一个 `postFontSize` 数据 property 来支持这个功能：

```js
const App = {
  data() {
    return {
      posts: [
        /* ... */
      ],
      postFontSize: 1
    }
  }
}
```

它可以在模板中用来控制所有博文的字号：

```html
<div id="blog-posts-events-demo">
  <div v-bind:style="{ fontSize: postFontSize + 'em' }">
    <blog-post v-for="post in posts" :key="post.id" :title="post.title"></blog-post>
  </div>
</div>
```

现在我们在每篇博文正文之前添加一个按钮来放大字号：

```js
app.component('blog-post', {
  props: ['title'],
  template: `
    <div class="blog-post">
      <h4>{{ title }}</h4>
      <button>
        Enlarge text
      </button>
    </div>
  `
})
```

问题是这个按钮不会做任何事：

```html
<button>
  Enlarge text
</button>
```

当点击这个按钮时，我们需要告诉父级组件放大所有博文的文本。幸好组件实例提供了一个自定义事件的系统来解决这个问题。父级组件可以像处理原生 DOM 事件一样通过 `v-on` 或 `@` 监听子组件实例的任意事件：

```html
<blog-post ... @enlarge-text="postFontSize += 0.1"></blog-post>
```

同时子组件可以通过调用内建的 [**$emit** 方法](../api/instance-methods.html#emit)并传入事件名称来触发一个事件：

```html
<button @click="$emit('enlarge-text')">
  Enlarge text
</button>
```

多亏了 `@enlarge-text="postFontSize += 0.1"` 监听器，父级组件能够接收事件并更新 `postFontSize` 值。

<common-codepen-snippet title="Component basics: emitting events" slug="KKpGyrp" tab="html,result" :preview="false" />

我们可以在组件的 `emits` 选项中列出已抛出的事件。

```js
app.component('blog-post', {
  props: ['title'],
  emits: ['enlarge-text']
})
```

这将允许我们检查组件抛出的所有事件，还可以选择 [validate them](component-custom-events.html#validate-emitted-events)。

### 使用事件抛出一个值

有的时候用一个事件来抛出一个特定的值是非常有用的。例如我们可能想让 `<blog-post>` 组件决定它的文本要放大多少。这时可以使用 `$emit` 的第二个参数来提供这个值：

```html
<button @click="$emit('enlarge-text', 0.1)">
  Enlarge text
</button>
```

然后当在父级组件监听这个事件的时候，我们可以通过 `$event` 访问到被抛出的这个值：

```html
<blog-post ... @enlarge-text="postFontSize += $event"></blog-post>
```

或者，如果这个事件处理函数是一个方法：

```html
<blog-post ... @enlarge-text="onEnlargeText"></blog-post>
```

那么这个值将会作为第一个参数传入这个方法：

```js
methods: {
  onEnlargeText(enlargeAmount) {
    this.postFontSize += enlargeAmount
  }
}
```

### 在组件上使用 v-model

自定义事件也可以用于创建支持 `v-model` 的自定义输入组件。记住：

```html
<input v-model="searchText" />
```

等价于：

```html
<input :value="searchText" @input="searchText = $event.target.value" />
```

当用在组件上时，`v-model` 则会这样：

```html
<custom-input
  :model-value="searchText"
  @update:model-value="searchText = $event"
></custom-input>
```

::: warning
请注意，我们在这里使用的是 `model-value`，因为我们使用的是 DOM 模板中的 kebab-case。你可以在 [DOM Template Parsing Caveats](#dom-template-parsing-caveats) 部分找到关于 kebab cased 和 camelCased 属性的详细说明
:::

为了让它正常工作，这个组件内的 `<input>` 必须：

- 将其 `value` attribute 绑定到一个名叫 `modelValue` 的 prop 上
- 在其 `input` 事件被触发时，将新的值通过自定义的 `update:modelValue` 事件抛出

写成代码之后是这样的：

```js
app.component('custom-input', {
  props: ['modelValue'],
  emits: ['update:modelValue'],
  template: `
    <input
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
    >
  `
})
```

现在 `v-model` 就应该可以在这个组件上完美地工作起来了：

```html
<custom-input v-model="searchText"></custom-input>
```

在自定义组件中创建 `v-model` 功能的另一种方法是使用 `computed` property 的功能来定义 getter 和 setter。

在下面的示例中，我们使用计算属性重构 `<custom-input>` 组件。

请记住，`get` 方法应返回 `modelValue` property，或用于绑定的任何 property，`set` 方法应为该 property 触发相应的 `$emit`。

```js
app.component('custom-input', {
  props: ['modelValue'],
  emits: ['update:modelValue'],
  template: `
    <input v-model="value">
  `,
  computed: {
    value: {
      get() {
        return this.modelValue
      },
      set(value) { 
        this.$emit('update:modelValue', value)
      }
    }
  }
})
```

现在你只需要了解自定义组件事件，但一旦你读完本页并对其内容还觉得不错，我们建议你稍后再阅读有关[自定义事件](component-custom-events.md)

## 通过插槽分发内容

和 HTML 元素一样，我们经常需要向一个组件传递内容，像这样：

```html
<alert-box>
  Something bad happened.
</alert-box>
```

可能会渲染出这样的东西：

<common-codepen-snippet title="Component basics: slots" slug="jOPeaob" :preview="false" />

幸好，Vue 自定义的 `<slot>` 元素让这变得非常简单：

```js
app.component('alert-box', {
  template: `
    <div class="demo-alert-box">
      <strong>Error!</strong>
      <slot></slot>
    </div>
  `
})
```

如你所见，我们只要在需要的地方加入插槽就行了——就这么简单！

到目前为止，关于插槽你需要了解的大概就这些了，如果你阅读完本页内容并掌握了它的内容，我们会推荐你再回来把[插槽](component-slots.md)读完。

## 动态组件

有的时候，在不同组件之间进行动态切换是非常有用的，比如在一个多标签的界面里：

<common-codepen-snippet title="Component basics: dynamic components" slug="oNXaoKy" :preview="false" />

上述内容可以通过 Vue 的 `<component>` 元素加一个特殊的 `is` attribute 来实现：

```html
<!-- 组件会在 `currentTabComponent` 改变时改变 -->
<component :is="currentTabComponent"></component>
```

在上述示例中，`currentTabComponent` 可以包括

- 已注册组件的名字，或
- 一个组件的选项对象

你可以在[这里](https://codepen.io/team/Vue/pen/oNXaoKy)查阅并体验完整的代码，或在[这个版本](https://codepen.io/team/Vue/pen/oNXapXM)了解绑定组件选项对象，而不是已注册组件名的示例。

你也可以使用 `is` attribute 来创建常规的 HTML 元素。

到目前为止，关于动态组件你需要了解的大概就这些了，如果你阅读完本页内容并掌握了它的内容，我们会推荐你再回来把[动态 & 异步组件](./components-dynamic-async.html)读完。

## 解析 DOM 模板时的注意事项

有些 HTML 元素，诸如 `<ul>`、`<ol>`、`<table>` 和 `<select>`，对于哪些元素可以出现在其内部是有严格限制的。而有些元素，诸如 `<li>`、`<tr>` 和 `<option>`，只能出现在其它某些特定的元素内部。

这会导致我们使用这些有约束条件的元素时遇到一些问题。例如：

```html
<table>
  <blog-post-row></blog-post-row>
</table>
```
这个自定义组件 `<blog-post-row>` 会被作为无效的内容提升到外部，并导致最终渲染结果出错。幸好这个特殊的 `v-is` attribute 给了我们一个变通的办法：

```html
<table>
  <tr v-is="'blog-post-row'"></tr>
</table>
```

::: warning
`v-is` 值应为 JavaScript 字符串文本：

```html
<!-- 错误的，这样不会渲染任何东西 -->
<tr v-is="blog-post-row"></tr>

<!-- 正确的 -->
<tr v-is="'blog-post-row'"></tr>
```

:::

另外，HTML attribute 名不区分大小写，因此浏览器将所有大写字符解释为小写。这意味着当你在 DOM 模板中使用时，驼峰 prop 名称和 event 处理器参数需要使用它们的 kebab-cased (横线字符分隔) 等效值：

```js
//  在JavaScript中的驼峰

app.component('blog-post', {
  props: ['postTitle'],
  template: `
    <h3>{{ postTitle }}</h3>
  `
})
```

```html
<!-- 在HTML则是横线字符分割 -->

<blog-post post-title="hello!"></blog-post>
```

需要注意的是**如果我们从以下来源使用模板的话，这条限制是*不存在*的**：

- 字符串模板 (例如：`template: '...'`)
- [单文件组件](single-file-component.html)
- `<script type="text/x-template">`

到这里，你需要了解的解析 DOM 模板时的注意事项——实际上也是 Vue 的全部*必要*内容，大概就是这些了。恭喜你！接下来还有很多东西要去学习，不过首先，我们推荐你先休息一下，试用一下 Vue，自己随意做些好玩的东西。

如果你感觉已经掌握了这些知识，我们推荐你再回来把完整的[组件&异步组件](component-dynamic-async.html)指南，包括侧边栏中组件深入章节的所有页面读完。
