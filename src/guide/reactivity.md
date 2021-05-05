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
let val1 = 2
let val2 = 3
let sum = val1 + val2

console.log(sum) // 5

val1 = 3

console.log(sum) // Still 5
```

如果我们更新第一个值，sum 不会被修改。

那么我们如何用 JavaScript 实现这一点呢？

作为一个高阶的概述，我们需要做到以下几点：

1. **追踪当一个值被读取时**，例如，`val1 + val2` 读取了两个，即 `val1` 和 `val2`。
2. **检测当某个改变时**，例如，当我们赋值 `val1 = 3`。
3. **重新运行代码来读取原始值**，例如，再次运行 `sum = val1 + val2` 来更新 `sum` 的值。

我们不能直接用前面的例子中的代码来继续，但是我们后面会再来看看这个例子，以及如何调整它来兼容 Vue 的响应性系统。

首先，让我们深入了解一下 Vue 是如何实现上述核心响应性要求的。

## Vue 如何知道哪些代码在运行

为了能够在数值变化时，随时运行我们的总和，我们首先要做的是将其包裹在一个函数中。

```js
const updateSum = () => {
  sum = val1 + val2
}
```

But how do we tell Vue about this function?

Vue keeps track of which function is currently running by using an *effect*. An effect is a wrapper around the function that initiates tracking just before the function is called. Vue knows which effect is running at any given point and can run it again when required.

To understand that better, let's try to implement something similar ourselves, without Vue, to see how it might work.

What we need is something that can wrap our sum, like this:

```js
createEffect(() => {
  sum = val1 + val2
})
```

We need `createEffect` to keep track of when the sum is running. We might implement it something like this:

```js
// Maintain a stack of running effects
const runningEffects = []

const createEffect = fn => {
  // Wrap the passed fn in an effect function
  const effect = () => {
    runningEffects.push(effect)
    fn()
    runningEffects.pop()
  }

  // Automatically run the effect immediately
  effect()
}
```

When our effect is called it pushes itself onto the `runningEffects` array, before calling `fn`. Anything that needs to know which effect is currently running can check that array.

Effects act as the starting point for many key features. For example, both component rendering and computed properties use effects internally. Any time something magically responds to data changes you can be pretty sure it has been wrapped in an effect.

While Vue's public API doesn't include any way to create an effect directly, it does expose a function called `watchEffect` that behaves a lot like the `createEffect` function from our example. We'll discuss that in more detail [later in the guide](/guide/reactivity-computed-watchers.html#watcheffect).

But knowing what code is running is just one part of the puzzle. How does Vue know what values the effect uses and how does it know when they change?

## How Vue Tracks These Changes

We can't track reassignments of local variables like those in our earlier examples, there's just no mechanism for doing that in JavaScript. What we can track are changes to object properties.

When we return a plain JavaScript object from a component's `data` function, Vue will wrap that object in a [Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) with handlers for `get` and `set`. Proxies were introduced in ES6 and allow Vue 3 to avoid some of the reactivity caveats that existed in earlier versions of Vue. 

<div class="reactivecontent">
  <common-codepen-snippet title="Proxies and Vue's Reactivity Explained Visually" slug="VwmxZXJ" tab="result" theme="light" :height="500" :editable="false" :preview="false" />
</div>

That was rather quick and requires some knowledge of [Proxies](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) to understand! So let’s dive in a bit. There’s a lot of literature on Proxies, but what you really need to know is that a **Proxy is an object that encases another object and allows you to intercept any interactions with that object.**

We use it like this: `new Proxy(target, handler)`

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

Here we've intercepted attempts to read properties of the target object. A handler function like this is also known as a *trap*. There are many different types of trap available, each handling a different type of interaction.

Beyond a console log, we could do anything here we wish. We could even _not_ return the real value if we wanted to. This is what makes Proxies so powerful for creating APIs.

One challenge with using a Proxy is the `this` binding. We'd like any methods to be bound to the Proxy, rather than the target object, so that we can intercept them too. Thankfully, ES6 introduced another new feature, called `Reflect`, that allows us to make this problem disappear with minimal effort:

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

The implementation of `track` isn't shown here. It will check which *effect* is currently running and record that alongside the `target` and `property`. This is how Vue knows that the property is a dependency of the effect.

Finally, we need to re-run the effect when the property value changes. For this we're going to need a `set` handler on our proxy:

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

If we were to rewrite our original example using a component we might do it something like this:

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

The object returned by `data` will be wrapped in a reactive proxy and stored as `this.$data`. The properties `this.val1` and `this.val2` are aliases for `this.$data.val1` and `this.$data.val2` respectively, so they go through the same proxy.

Vue will wrap the function for `sum` in an effect. When we try to access `this.sum`, it will run that effect to calculate the value. The reactive proxy around `$data` will track that the properties `val1` and `val2` were read while that effect is running.

As of Vue 3, our reactivity is now available in a [separate package](https://github.com/vuejs/vue-next/tree/master/packages/reactivity). The function that wraps `$data` in a proxy is called [`reactive`](/api/basic-reactivity.html#reactive). We can call this directly ourselves, allowing us to wrap an object in a reactive proxy without needing to use a component:

```js
const proxy = reactive({
  val1: 2,
  val2: 3
})
```

We'll explore the functionality exposed by the reactivity package over the course of the next few pages of this guide. That includes functions like `reactive` and `watchEffect` that we've already met, as well as ways to use other reactivity features, such as `computed` and `watch`, without needing to create a component.

### Proxy 对象

Vue internally tracks all objects that have been made reactive, so it always returns the same proxy for the same object.

When a nested object is accessed from a reactive proxy, that object is _also_ converted into a proxy before being returned:

```js{6-7}
const handler = {
  get(target, property, receiver) {
    track(target, property)
    const value = Reflect.get(...arguments)
    if (isObject(value)) {
      // Wrap the nested object in its own reactive proxy
      return reactive(value)
    } else {
      return value
    }
  }
  // ...
}
```

### Proxy vs 原始标识

Proxy 的使用确实引入了一个需要注意的新警告：在身份比较方面，被代理对象与原始对象不相等 (`===`)。例如:

```js
const obj = {}
const wrapped = new Proxy(obj, handlers)

console.log(obj === wrapped) // false
```

在大多数情况下，原始版本和被包裹版本的行为相同，但请注意，它们在依赖严格比对的操作下将是失败的，例如 `.filter()` 或 `.map()`。使用选项式 API 时，这种警告不太可能出现，因为所有响应式都是从 `this` 访问的，并保证已经是 proxy。

但是，当使用组合式 API 显式创建响应式对象时，最佳做法是不要保留对原始对象的引用，而只使用响应式版本：

```js
const obj = reactive({
  count: 0
}) // no reference to original
```

This ensures that both equality comparisons and reactivity behave as expected.

Note that Vue does not wrap primitive values such as numbers or strings in a Proxy, so you can still use `===` directly with those values:

```js
const obj = reactive({
  count: 0
})

console.log(obj.count === 0) // true
```

## 侦听器

The template for a component is compiled down into a [`render`](/guide/render-function.html) function. The `render` function creates the [VNodes](/guide/render-function.html#the-virtual-dom-tree) that describe how the component should be rendered. It is wrapped in an effect, allowing Vue to track the properties that are 'touched' while it is running.

A `render` function is conceptually very similar to a `computed` property. Vue doesn't track exactly how dependencies are used, it only knows that they were used at some point while the function was running. If any of those properties subsequently changes, it will trigger the effect to run again, re-running the `render` function to generate new VNodes. These are then used to make the necessary changes to the DOM.

<div class="reactivecontent">
  <common-codepen-snippet title="Second Reactivity with Proxies in Vue 3 Explainer" slug="GRJZddR" tab="result" theme="light" :height="500" :team="false" user="sdras" name="Sarah Drasner" :editable="false" :preview="false" />
</div>

> 如果你使用的是 Vue2.x 及以下版本，你可能会对这些版本中存在的一些更改检测警告感兴趣，[在这里进行更详细的探讨](change-detection.md)。
