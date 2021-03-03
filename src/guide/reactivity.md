# 深入响应性原理

现在是时候深入了！Vue 最独特的特性之一，是其非侵入性的响应性系统。数据模型是被代理的 JavaScript 对象。而当你修改它们时，视图会进行更新。这让状态管理非常简单直观，不过理解其工作原理同样重要，这样你可以避开一些常见的问题。在这个章节，我们将研究一下 Vue 响应性系统的底层的细节。

<VideoLesson href="https://www.vuemastery.com/courses/vue-3-reactivity/vue3-reactivity" title="Learn how how reactivity works in depth with Vue Mastery">在 Vue Mastery 上免费观看关于深入响应性原理的视频。</VideoLesson>

## 什么是响应性

这个术语在程序设计中经常被提及，但这是什么意思呢？响应性是一种允许我们以声明式的方式去适应变化的编程范例。人们通常展示的典型例子，是一份 excel 电子表格 (一个非常好的例子)。

<video width="550" height="400" controls>
  <source src="/images/reactivity-spreadsheet.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video>

如果将数字 2 放在第一个单元格中，将数字 3 放在第二个单元格中并要求提供 SUM，则电子表格会将其计算出来给你。不要惊奇，同时，如果你更新第一个数字，SUM 也会自动更新。

JavaScript 通常不是这样工作的——如果我们想用 JavaScript 编写类似的内容：

```js
var val1 = 2
var val2 = 3
var sum = val1 + val2

// sum
// 5

val1 = 3

// sum
// 5
```

如果我们更新第一个值，sum 不会被修改。

那么我们如何用 JavaScript 实现这一点呢？

- 检测其中某一个值是否发生变化
- 用跟踪 (track) 函数修改值
- 用触发 (trigger) 函数更新为最新的值

## Vue 如何追踪变化？

当把一个普通的 JavaScript 对象作为 `data` 选项传给应用或组件实例的时候，Vue 会使用带有 getter 和 setter 的处理程序遍历其所有 property 并将其转换为 [Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy)。这是 ES6 仅有的特性，但是我们在 Vue 3 版本也使用了 `Object.defineProperty` 来支持 IE 浏览器。两者具有相同的 Surface API，但是 Proxy 版本更精简，同时提升了性能。

<div class="reactivecontent">
  <common-codepen-snippet title="Proxies and Vue's Reactivity Explained Visually" slug="zYYzjBg" tab="result" theme="light" :height="500" :team="false" user="sdras" name="Sarah Drasner" :editable="false" :preview="false" />
</div>

该部分需要稍微地了解下 [Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) 的某些知识！所以，让我们深入了解一下。关于 Proxy 的文献很多，但是你真正需要知道的是 **Proxy 是一个包含另一个对象或函数并允许你对其进行拦截的对象。**

我们是这样使用它的：`new Proxy(target, handler)`

```js
const dinner = {
  meal: 'tacos'
}

const handler = {
  get(target, prop) {
    return target[prop]
  }
}

const proxy = new Proxy(dinner, handler)
console.log(proxy.meal)

// tacos
```

好的，到目前为止，我们只是包装这个对象并返回它。很酷，但还不是那么有用。请注意，我们把对象包装在 Proxy 里的同时可以对其进行拦截。这种拦截被称为陷阱。

```js
const dinner = {
  meal: 'tacos'
}

const handler = {
  get(target, prop) {
    console.log('intercepted!')
    return target[prop]
  }
}

const proxy = new Proxy(dinner, handler)
console.log(proxy.meal)

// tacos
```

除了控制台日志，我们可以在这里做任何我们想做的事情。如果我们愿意，我们甚至可以不返回实际值。这就是为什么 Proxy 对于创建 API 如此强大。

此外，Proxy 还提供了另一个特性。我们不必像这样返回值：`target[prop]`，而是可以进一步使用一个名为 `Reflect` 的方法，它允许我们正确地执行 `this` 绑定，就像这样：

```js{7}
const dinner = {
  meal: 'tacos'
}

const handler = {
  get(target, prop, receiver) {
    return Reflect.get(...arguments)
  }
}

const proxy = new Proxy(dinner, handler)
console.log(proxy.meal)

// tacos
```

我们之前提到过，为了有一个 API 能够在某些内容发生变化时更新最终值，我们必须在内容发生变化时设置新的值。我们在处理器，一个名为 `track` 的函数中执行此操作，该函数可以传入 `target` 和 `key` 两个参数。

```js{7}
const dinner = {
  meal: 'tacos'
}

const handler = {
  get(target, prop, receiver) {
    track(target, prop)
    return Reflect.get(...arguments)
  }
}

const proxy = new Proxy(dinner, handler)
console.log(proxy.meal)

// tacos
```

最后，当某些内容发生改变时我们会设置新的值。为此，我们将通过触发这些更改来设置新 proxy 的更改：

```js
const dinner = {
  meal: 'tacos'
}

const handler = {
  get(target, prop, receiver) {
    track(target, prop)
    return Reflect.get(...arguments)
  },
  set(target, key, value, receiver) {
    trigger(target, key)
    return Reflect.set(...arguments)
  }
}

const proxy = new Proxy(dinner, handler)
console.log(proxy.meal)

// tacos
```

还记得几段前的列表吗？现在我们有了一些关于 Vue 如何处理这些更改的答案：

- <strike>当某个值发生变化时进行检测</strike>：我们不再需要这样做，因为 Proxy 允许我们拦截它
- **跟踪更改它的函数**：我们在 proxy 中的 getter 中执行此操作，称为 `effect`
- **触发函数以便它可以更新最终值**：我们在 proxy 中的 setter 中进行该操作，名为 `trigger`

proxy 对象对于用户来说是不可见的，但是在内部，它们使 Vue 能够在 property 的值被访问或修改的情况下进行依赖跟踪和变更通知。从 Vue 3 开始，我们的响应性现在可以在[独立的包](https://github.com/vuejs/vue-next/tree/master/packages/reactivity)中使用。需要注意的是，记录转换后的数据对象时，浏览器控制台输出的格式会有所不同，因此你可能需要安装 [vue-devtools](https://github.com/vuejs/vue-devtools)，以提供一种更易于检查的界面。

### Proxy 对象

Vue 在内部跟踪所有已被设置为响应式的对象，因此它始终会返回同一个对象的 proxy 版本。

从响应式 proxy 访问嵌套对象时，该对象在返回之前*也*被转换为 proxy：

```js
const handler = {
  get(target, prop, receiver) {
    track(target, prop)
    const value = Reflect.get(...arguments)
    if (isObject(value)) {
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

在大多数情况下，原始版本和包装版本的行为相同，但请注意，它们在依赖严格比对的操作下将是失败的，例如 `.filter()` 或 `.map()`。使用选项式 API 时，这种警告不太可能出现，因为所有响应式都是从 `this` 访问的，并保证已经是 proxy。

但是，当使用合成 API 显式创建响应式对象时，最佳做法是不要保留对原始对象的引用，而只使用响应式版本：

```js
const obj = reactive({
  count: 0
}) // no reference to original
```

## 侦听器

每个组件实例都有一个相应的侦听器实例，该实例将在组件渲染期间把“触碰”的所有 property 记录为依赖项。之后，当触发依赖项的 setter 时，它会通知侦听器，从而使得组件重新渲染。

<div class="reactivecontent">
  <common-codepen-snippet title="Second Reactivity with Proxies in Vue 3 Explainer" slug="GRJZddR" tab="result" theme="light" :height="500" :team="false" user="sdras" name="Sarah Drasner" :editable="false" :preview="false" />
</div>

将对象作为数据传递给组件实例时，Vue 会将其转换为 proxy。这个 proxy 使 Vue 能够在 property 被访问或修改时执行依赖项跟踪和更改通知。每个 property 都被视为一个依赖项。

首次渲染后，组件将跟踪一组依赖列表——即在渲染过程中被访问的 property。反过来，组件就成为了其每个 property 的订阅者。当 proxy 拦截到 set 操作时，该 property 将通知其所有订阅的组件重新渲染。

[//]: # 'TODO: Insert diagram'

> 如果你使用的是 Vue2.x 及以下版本，你可能会对这些版本中存在的一些更改检测警告感兴趣，[在这里进行更详细的探讨](change-detection.md)。
