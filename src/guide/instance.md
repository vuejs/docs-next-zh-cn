# 应用实例

## 创建一个实例

每个 Vue 应用 都是通过用 `createApp` 函数创建一个新的**应用实例**开始的：

```js
Vue.createApp(/* 选项 */)
```

创建实例后，我们可以 _挂载_ 它，将容器传递给 `mount` 方法。例如，如果要在 `<div id="app"></div>`上挂载Vue应用，则应传递 `#app`：

```js
Vue.createApp(/* 选项 */).mount('#app')
```

虽然没有完全遵循 [MVVM 模型](https://en.wikipedia.org/wiki/Model_View_ViewModel)，但是 Vue 的设计也受到了它的启发。因此在文档中经常会使用 `vm` (ViewModel 的缩写) 这个变量名表示实例。

当创建一个实例时，你可以传入一个**选项对象**。这篇教程主要描述的就是如何使用这些选项来创建你想要的行为。作为参考，你也可以在 [API 文档](../api/options-data.html) 中浏览完整的选项列表。

一个 Vue 应用由一个通过 `createApp` 创建的**根实例**，以及可选的嵌套的、可复用的组件树组成。举个例子，一个 `todo` 应用的组件树可以是这样的：

```
根实例
└─ TodoList
   ├─ TodoItem
   │  ├─ DeleteTodoButton
   │  └─ EditTodoButton
   └─ TodoListFooter
      ├─ ClearTodosButton
      └─ TodoListStatistics
```

我们会在稍后的 [组件系统](component-basics.html)章节具体展开。不过现在，你只需要明白所有的 Vue 组件都是实例，并且接受相同的选项对象。

## Data 和 Methods

当一个实例被创建时，它将 `data` 对象中的所有的 property 加入到 [Vue 的**响应式系统**中](reactivity.html)。当这些 property 的值发生改变时，视图将会产生“响应”，即匹配更新为新的值。

```js
// 我们 data 对象
const data = { a: 1 }

// 该对象被加入到一个根实例中
const vm = Vue.createApp({
  data() {
    return data
  }
}).mount('#app')

// 获得这个实例上的 property
// 返回源数据中对应的字段
vm.a === data.a // => true

// 设置 property 也会影响到原始数据
vm.a = 2
data.a // => 2
```

当这些数据改变时，视图会进行重渲染。值得注意的是只有当实例被创建时就已经存在于 `data` 中的 property 才是**响应式**的。也就是说如果你添加一个新的 property，比如：

```js
vm.b = 'hi'
```

那么对 `b` 的改动将不会触发任何视图的更新。如果你知道你会在晚些时候需要一个 property，但是一开始它为空或不存在，那么你仅需要设置一些初始值。比如：

```js
data() {
  return {
    newTodoText: '',
    visitCount: 0,
    hideCompletedTodos: false,
    todos: [],
    error: null
  }
}
```

这里唯一的例外是使用 `Object.freeze()`，这会阻止修改现有的 property，也意味着响应系统无法再 *追踪* 变化。

```js
const obj = {
  foo: 'bar'
}

Object.freeze(obj)

const vm = Vue.createApp({
  data() {
    return obj
  }
}).mount('#app')
```

```html
<div id="app">
  <p>{{ foo }}</p>
  <!-- 这里的`foo`不会更新! -->
  <button v-on:click="foo = 'baz'">Change it</button>
</div>
```

除了data property，实例还暴露了一些有用的实例 property 与方法。它们都有前缀 `$`，以便与用户定义的 property 区分开来。例如：

```js
const vm = Vue.createApp({
  data() {
    return {
      a: 1
    }
  }
}).mount('#example')

vm.$data.a // => 1
```
以后你可以在 [API 参考](../api/instance-properties.html) 中查阅到完整的实例 property 和方法的列表。

## 实例生命周期钩子

每个实例在被创建时都要经过一系列的初始化过程——例如，需要设置数据监听、编译模板、将实例挂载到 DOM 并在数据变化时更新 DOM 等。同时在这个过程中也会运行一些叫做**生命周期钩子**的函数，这给了用户在不同阶段添加自己的代码的机会。

比如  [created](../api/options-lifecycle-hooks.html#created) 钩子可以用来在一个实例被创建之后执行代码：

```js
Vue.createApp({
  data() {
    return {
      a: 1
    }
  },
  created() {
    // `this` 指向 vm 实例
    console.log('a is: ' + this.a) // => "a is: 1"
  }
})
```

也有一些其它的钩子，在实例生命周期的不同阶段被调用，如 [mounted](../api/options-lifecycle-hooks.html#mounted)、[updated](../api/options-lifecycle-hooks.html#updated) 和 [unmounted](../api/options-lifecycle-hooks.html#unmounted)。生命周期钩子的 `this` 上下文指向调用它的当前活动实例。

::: tip
不要在选项 property 或回调上使用[箭头函数]((https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Functions/Arrow_functions))，比如 `created: () => console.log(this.a)` 或 `vm.$watch('a', newValue => this.myMethod())`。因为箭头函数并没有 `this`，`this` 会作为变量一直向上级词法作用域查找，直至找到为止，经常导致 `Uncaught TypeError: Cannot read property of undefined` 或 `Uncaught TypeError: this.myMethod is not a function` 之类的错误。
:::


## 生命周期图示

下图展示了实例的生命周期。你不需要立马弄明白所有的东西，不过随着你的不断学习和使用，它的参考价值会越来越高。

<img src="/images/lifecycle.png" width="840" height="auto" style="margin: 0px auto; display: block; max-width: 100%;" loading="lazy" alt="实例的生命周期">
