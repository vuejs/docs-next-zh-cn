# 深入响应性原理

现在是时候深入了！Vue 最独特的特性之一，是其非侵入性的响应性系统。数据模型是被代理的 JavaScript 对象。而当你修改它们时，视图会进行更新。这让状态管理非常简单直观，不过理解其工作原理同样重要，这样你可以避开一些常见的问题。在这个章节，我们将研究一下 Vue 响应性系统的底层的细节。

<VideoLesson href="https://www.vuemastery.com/courses/vue-3-reactivity/vue3-reactivity" title="在 Vue Mastery 上深入学习响应性原理">在 Vue Mastery 上免费观看关于深入响应性原理的视频</VideoLesson>

## 什么是响应性

这个术语在程序设计中经常被提及，但这是什么意思呢？响应性是一种允许我们以声明式的方式去适应变化的编程范例。人们通常展示的典型例子，是一份 excel 电子表格 (一个非常好的例子)。

<video width="550" height="400" controls>
  <source src="/images/reactivity-spreadsheet.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video>

如果将数字 2 放在第一个单元格中，将数字 3 放在第二个单元格中并要求提供 SUM，则电子表格会将其计算出来给你。不要惊奇，同时，如果你更新第一个数字，SUM 也会自动更新。

JavaScript 通常不是这样工作的——如果我们想用 JavaScript 编写类似的内容：

```js
let val1 = 2
let val2 = 3
let sum = val1 + val2

console.log(sum) // 5

val1 = 3

console.log(sum) // 仍然是 5
```

如果我们更新第一个值，sum 不会被修改。

那么我们如何用 JavaScript 实现这一点呢？

作为一个高阶的概述，我们需要做到以下几点：

1. **当一个值被读取时进行追踪**，例如 `val1 + val2` 会同时读取 `val1` 和 `val2`。
2. **当某个值改变时进行检测**，例如，当我们赋值 `val1 = 3`。
3. **重新运行代码来读取原始值**，例如，再次运行 `sum = val1 + val2` 来更新 `sum` 的值。

我们不能直接用前面的例子中的代码来继续，但是我们后面会再来看看这个例子，以及如何调整它来兼容 Vue 的响应性系统。

首先，让我们深入了解一下 Vue 是如何实现上述核心响应性要求的。

## Vue 如何知道哪些代码在执行

为了能够在数值变化时，随时运行我们的总和，我们首先要做的是将其包裹在一个函数中。

```js
const updateSum = () => {
  sum = val1 + val2
}
```

但我们如何告知 Vue 这个函数呢？

Vue 通过一个*副作用 (effect)* 来跟踪当前正在运行的函数。副作用是一个函数的包裹器，在函数被调用之前就启动跟踪。Vue 知道哪个副作用在何时运行，并能在需要时再次执行它。

为了更好地理解这一点，让我们尝试脱离 Vue 实现类似的东西，以看看它如何工作。

我们需要的是能够包裹总和的东西，像这样：

```js
createEffect(() => {
  sum = val1 + val2
})
```

我们需要 `createEffect` 来跟踪和执行。我们的实现如下：

```js
// 维持一个执行副作用的栈
const runningEffects = []

const createEffect = fn => {
  // 将传来的 fn 包裹在一个副作用函数中
  const effect = () => {
    runningEffects.push(effect)
    fn()
    runningEffects.pop()
  }

  // 立即自动执行副作用
  effect()
}
```

当我们的副作用被调用时，在调用 `fn` 之前，它会把自己推到 `runningEffects` 数组中。这个数组可以用来检查当前正在运行的副作用。

副作用是许多关键功能的起点。例如，组件的渲染和计算属性都在内部使用副作用。任何时候，只要有东西对数据变化做出奇妙的回应，你就可以肯定它已经被包裹在一个副作用中了。

虽然 Vue 的公开 API 不包括任何直接创建副作用的方法，但它确实暴露了一个叫做 `watchEffect` 的函数，它的行为很像我们例子中的 `createEffect` 函数。我们会在[该指南后面的部分](/guide/reactivity-computed-watchers.html#watcheffect)详细讨论这个问题。

但知道什么代码在执行只是难题的一部分。Vue 如何知道副作用使用了什么值，以及如何知道它们何时发生变化？

## Vue 如何跟踪变化

我们不能像前面的例子中那样跟踪局部变量的重新分配，在 JavaScript 中没有这样的机制。我们可以跟踪的是对象 property 的变化。

当我们从一个组件的 `data` 函数中返回一个普通的 JavaScript 对象时，Vue 会将该对象包裹在一个带有 `get` 和 `set` 处理程序的 [Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) 中。Proxy 是在 ES6 中引入的，它使 Vue 3 避免了 Vue 早期版本中存在的一些响应性问题。

<div class="reactivecontent">
  <common-codepen-snippet title="Proxies and Vue's Reactivity Explained Visually" slug="VwmxZXJ" tab="result" theme="light" :height="500" :editable="false" :preview="false" />
</div>

那看起来灵敏，不过，需要一些 [Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) 的知识才能理解！所以让我们深入了解一下。有很多关于 Proxy 的文档，但你真正需要知道的是，**Proxy 是一个对象，它包装了另一个对象，并允许你拦截对该对象的任何交互。**

我们这样使用它：`new Proxy(target, handler)`

```js
const dinner = {
  meal: 'tacos'
}

const handler = {
  get(target, property) {
    console.log('intercepted!')
    return target[property]
  }
}

const proxy = new Proxy(dinner, handler)
console.log(proxy.meal)

// intercepted!
// tacos
```

这里我们截获了读取目标对象 property 的举动。像这样的处理函数也称为一个*捕捉器 (trap)*。有许多可用的不同类型的捕捉器，每个都处理不同类型的交互。

除了控制台日志，我们可以在这里做任何我们想做的事情。如果我们愿意，我们甚至可以不返回实际值。这就是为什么 Proxy 对于创建 API 如此强大。

使用 Proxy 的一个难点是 `this` 绑定。我们希望任何方法都绑定到这个 Proxy，而不是目标对象，这样我们也可以拦截它们。值得庆幸的是，ES6 引入了另一个名为 `Reflect` 的新特性，它允许我们以最小的代价消除了这个问题：

```js{7}
const dinner = {
  meal: 'tacos'
}

const handler = {
  get(target, property, receiver) {
    return Reflect.get(...arguments)
  }
}

const proxy = new Proxy(dinner, handler)
console.log(proxy.meal)

// tacos
```

使用 Proxy 实现响应性的第一步就是跟踪一个 property 何时被读取。我们在一个名为 `track` 的处理器函数中执行此操作，该函数可以传入 `target` 和 `property` 两个参数。

```js{7}
const dinner = {
  meal: 'tacos'
}

const handler = {
  get(target, property, receiver) {
    track(target, property)
    return Reflect.get(...arguments)
  }
}

const proxy = new Proxy(dinner, handler)
console.log(proxy.meal)

// tacos
```

这里没有展示 `track` 的实现。它将检查当前运行的是哪个*副作用*，并将其与 `target` 和 `property` 记录在一起。这就是 Vue 如何知道这个 property 是该副作用的依赖项。

最后，我们需要在 property 值更改时重新运行这个副作用。为此，我们需要在代理上使用一个 `set` 处理函数：

```js
const dinner = {
  meal: 'tacos'
}

const handler = {
  get(target, property, receiver) {
    track(target, property)
    return Reflect.get(...arguments)
  },
  set(target, property, value, receiver) {
    trigger(target, property)
    return Reflect.set(...arguments)
  }
}

const proxy = new Proxy(dinner, handler)
console.log(proxy.meal)

// tacos
```

还记得前面的表格吗？现在，我们对 Vue 如何实现这些关键步骤有了答案：

1. **当一个值被读取时进行追踪**：proxy 的 `get` 处理函数中 `track` 函数记录了该 property 和当前副作用。
2. **当某个值改变时进行检测**：在 proxy 上调用 `set` 处理函数。
3. **重新运行代码来读取原始值**：`trigger` 函数查找哪些副作用依赖于该 property 并执行它们。

该被代理的对象对于用户来说是不可见的，但是在内部，它们使 Vue 能够在 property 的值被访问或修改的情况下进行依赖跟踪和变更通知。有一点需要注意，控制台日志会以不同的方式对 proxy 对象进行格式化，因此你可能需要安装 [vue-devtools](https://github.com/vuejs/vue-devtools)，以提供一种更易于检查的界面。

如果我们要用一个组件重写我们原来的例子，我们可以这样做：

```js
const vm = createApp({
  data() {
    return {
      val1: 2,
      val2: 3
    }
  },
  computed: {
    sum() {
      return this.val1 + this.val2
    }
  }
}).mount('#app')

console.log(vm.sum) // 5

vm.val1 = 3

console.log(vm.sum) // 6
```

`data` 返回的对象将被包裹在响应式代理中，并存储为 `this.$data`。Property `this.val1` 和 `this.val2` 分别是 `this.$data.val1` 和 `this.$data.val2` 的别名，因此它们通过相同的代理。

Vue 将把 `sum` 的函数包裹在一个副作用中。当我们试图访问 `this.sum` 时，它将运行该副作用来计算数值。包裹 `$data` 的响应式代理将会追踪到，当副作用运行时，property `val1` 和 `val2` 被读取了。

从 Vue 3 开始，我们的响应性现在可以在一个[独立包](https://github.com/vuejs/vue-next/tree/master/packages/reactivity)中使用。将 `$data` 包裹在一个代理中的函数被称为 [`reactive`](/api/basic-reactivity.html#reactive)。我们可以自己直接调用这个函数，允许我们在不需要使用组件的情况下将一个对象包裹在一个响应式代理中。

```js
const proxy = reactive({
  val1: 2,
  val2: 3
})
```

在指南接下来的几页中，我们将探索响应性包所暴露的功能。这包括我们已经见过的 `reactive` 和 `watchEffect` 等函数，以及使用其他响应性特性的方法，如不需要创建组件的 `computed` 和 `watch`。

### 被代理的对象

Vue 在内部跟踪所有已经被转成响应式的对象，所以它总是为同一个对象返回相同的代理。

当从一个响应式代理中访问一个嵌套对象时，该对象在被返回之前*也*被转换为一个代理：

```js{6-7}
const handler = {
  get(target, property, receiver) {
    track(target, property)
    const value = Reflect.get(...arguments)
    if (isObject(value)) {
      // 将嵌套对象包裹在自己的响应式代理中
      return reactive(value)
    } else {
      return value
    }
  }
  // ...
}
```

### Proxy vs 原始标识

Proxy 的使用确实引入了一个需要注意的新警告：在身份比较方面，被代理对象与原始对象不相等 (`===`)。例如：

```js
const obj = {}
const wrapped = new Proxy(obj, handlers)

console.log(obj === wrapped) // false
```

其他依赖严格等于比较的操作也会受到影响，例如 `.includes()` 或 `.indexOf()`。

这里的最佳实践是永远不要持有对原始对象的引用，而只使用响应式版本。

```js
const obj = reactive({
  count: 0
}) // 未引用原始
```

这确保了等值的比较和响应性的行为都符合预期。

请注意，Vue 不会在 Proxy 中包裹数字或字符串等原始值，所以你仍然可以对这些值直接使用 `===` 来比较：

```js
const obj = reactive({
  count: 0
})

console.log(obj.count === 0) // true
```

## 如何让渲染响应变化

一个组件的模板被编译成一个 [`render`](/guide/render-function.html) 函数。渲染函数创建 [VNodes](/guide/render-function.html#虚拟-dom-树)，描述该组件应该如何被渲染。它被包裹在一个副作用中，允许 Vue 在运行时跟踪被“触达”的 property。

一个 `render` 函数在概念上与一个 `computed` property 非常相似。Vue 并不确切地追踪依赖关系是如何被使用的，它只知道在函数运行的某个时间点上使用了这些依赖关系。如果这些 property 中的任何一个随后发生了变化，它将触发副作用再次运行，重新运行 `render` 函数以生成新的 VNodes。然后这些举动被用来对 DOM 进行必要的修改。

<div class="reactivecontent">
  <common-codepen-snippet title="Second Reactivity with Proxies in Vue 3 Explainer" slug="wvgqyJK" tab="result" theme="light" :height="500" :editable="false" :preview="false" />
</div>

> 如果你使用的是 Vue2.x 及以下版本，你可能会对这些版本中存在的一些更改检测警告感兴趣，[在这里进行更详细的探讨](change-detection.md)。
