# 响应式

现在是时候深入一下了！Vue 最独特的特性之一，是其非侵入性的响应式系统。数据模型仅仅是普通的 JavaScript 对象。而当你修改它们时，视图会进行更新。这使得状态管理非常简单直接，不过理解其工作原理同样重要，这样你可以避开一些常见的问题。在这个章节，我们将研究一下 Vue 响应式系统的底层的细节。

## 什么是响应式

这些天在编程中经常出现，但是人们说的意思是什么？响应式是一种编程范例，允许我们以声明的方式适应变化。人们经常展示的典型示例 (因为它是一个很棒的示例) 是 excel 电子表格。

<video width="550" height="400" controls>
  <source src="/images/reactivity-spreadsheet.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video>

如果将数字 2 放在第一个单元格中，将数字 3 放在第二个单元格中并要求提供 SUM，则电子表格会将其计算出来给你。没有惊喜，但是，如果你更新第一个数字，SUM 也会自动更新。

JavaScript 通常不是这样工作的——如果我们要用 JavaScript 编写类似的东西：

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

如果我们更新第一个值，则不会调整总和。

那么我们如何用 JavaScript 做到这一点呢？

- 检测其中一个值是否发生变化
- 跟踪更改它的函数
- 触发函数，以便可以更新最终值

## Vue 如何追踪变化？

当你把一个普通的 JavaScript 对象传入应用或组件实例作为 data 选项，Vue 将遍历其所有属性并将其转换为 [proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy)，使用带有 getter 和 setter 的处理程序。这是仅 ES6 的功能，但是我们提供了 Vue 3 版本，该版本使用较旧的 `Object.defineProperty` 支持 IE 浏览器。两者具有相同的 Surface API，但是 proxy 版本更精简，并提供了改进的性能。

<div class="reactivecontent">
  <iframe height="500" style="width: 100%;" scrolling="no" title="Proxies and Vue's Reactivity Explained Visually" src="https://codepen.io/sdras/embed/zYYzjBg?height=500&theme-id=light&default-tab=result" frameborder="no" allowtransparency="true" allowfullscreen="true">
    See the Pen <a href='https://codepen.io/sdras/pen/zYYzjBg'>Proxies and Vue's Reactivity Explained Visually</a> by Sarah Drasner
    (<a href='https://codepen.io/sdras'>@sdras</a>) on <a href='https://codepen.io'>CodePen</a>.
  </iframe>
</div>

这需要稍微地了解下 [proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) 的某些知识！因此，让我们深入一点。关于 proxy 的文献很多，但是你真正需要知道的是 **proxy 是一个包含另一个对象或函数并允许你对其进行拦截的对象。**

我们像这样使用它：`new Proxy(target, handler)`

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

好的，到目前为止，我们只是包装这个对象并返回它。很酷，但还没那么有用。但请注意，我们也可以截获这个对象，同时将它包装在 proxy 中。这种拦截被称为陷阱。

```js
const dinner = {
  meal: 'tacos'
}

const handler = {
  get(target, prop) {
    console.log(‘intercepted!’)
    return target[prop]
  }
}

const proxy = new Proxy(dinner, handler)
console.log(proxy.meal)

// intercepted!
// tacos
```

除了控制台日志，我们可以在这里做任何我们想做的事情。如果我们愿意，我们甚至可以不返回实际值。这就是为什么 proxy 对于创建 API 如此强大。

此外，proxy 还提供了另一个特性。我们不必像这样返回值：`target[prop]`，而是可以进一步使用一个名为 `Reflect` 的特性，它允许我们正确地执行 `this` 绑定，看起来像这样：

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

// intercepted!
// tacos
```

我们之前提到过，为了有一个 API 在某些东西发生变化时更新最终值，我们必须在某些东西发生变化时设置新的值。我们在处理程序中，在一个名为 `track` 的函数中执行此操作，其中传入 `target` 和 `key`。

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

// intercepted!
// tacos
```

最后，我们还设置了一些新的值。为此，我们将通过触发这些更改来设置新 proxy 的更改：

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

// intercepted!
// tacos
```

还记得几段前的列表吗？现在我们有了一些关于 Vue 如何处理这些更改的答案：

- `<strike>` 当某个值发生变化时进行检测 `</strike>`：我们不再需要这样做，因为 proxy 允许我们拦截它
- **跟踪更改它的函数**：我们在 proxy 中的 getter 中执行此操作，称为 `effect`
- **触发函数以便它可以更新最终值**：我们在 proxy 中使用了一个 setter，名为 `Trigger`

proxy 对象对用户是不可见的，但是在后台，它们使 Vue 在访问或修改属性时能够执行依赖项跟踪和更改通知。从 Vue 3 开始，我们的响应式现在可以在 [separate package](https://github.com/vuejs/vue-next/tree/master/packages/reactivity) 中使用。需要注意的是，记录转换后的数据对象时，浏览器控制台的格式会有所不同，因此你可能需要安装 [vue-devtools](https://github.com/vuejs/vue-devtools)，以提供一种更易于检查的界面。


### proxy 对象

Vue 在内部跟踪所有已被激活的对象，因此它始终为同一对象返回相同的 proxy。

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

proxy 的使用确实引入了一个需要注意的新警告：在身份比较方面，被代理对象与原始对象不相等 (`===`)。例如：

```js
const obj = {}
const wrapped = new Proxy(obj, handlers)

console.log(obj === wrapped) // false
```

在大多数情况下，原始版本和包装版本的行为相同，但请注意，它们将失败依赖恒等于比较的操作，例如 `.filter()` 或 `.map()`。使用选项 API 时，这种警告不太可能出现，因为所有响应式都是从 `this` 访问的，并保证已经是 proxy。

但是，当使用合成 API 显式创建响应式对象时，最佳做法是从不保留对原始原始对象的引用，而只使用响应式版本：

```js
const obj = reactive({
  count: 0
}) // no reference to original
```

## 侦听器

每个组件实例都有一个相应的侦听器实例，该实例将在组件渲染期间“触摸”的所有 property 记录为依赖项。稍后，当触发依赖项的 setter 时，它会通知侦听器，从而使得组件重新渲染。

<div class="reactivecontent">
  <iframe height="500" style="width: 100%;" scrolling="no" title="Second Reactivity with Proxies in Vue 3 Explainer" src="https://codepen.io/sdras/embed/GRJZddR?height=500&theme-id=light&default-tab=result" frameborder="no" allowtransparency="true" allowfullscreen="true">
    See the Pen <a href='https://codepen.io/sdras/pen/GRJZddR'>Second Reactivity with Proxies in Vue 3 Explainer</a> by Sarah Drasner
    (<a href='https://codepen.io/sdras'>@sdras</a>) on <a href='https://codepen.io'>CodePen</a>.
  </iframe>
</div>

将对象作为数据传递给组件实例时，Vue 会将其转换为 proxy。此 proxy 使 Vue 能够在访问或修改属性时执行依赖项跟踪和更改通知。每个 property 都被视为一个依赖项。

在第一次渲染之后，组件将跟踪依赖项列表——即在渲染过程中访问的 property。相反，组件成为这些 property 中每个 property 的订阅者。当 proxy 拦截 set 操作时，该 property 将通知其所有订阅的组件重新渲染

[//]: # 'TODO: Insert diagram'

> 如果你使用的是 Vue2.x 及以下版本，你可能会对这些版本中存在的一些更改检测警告感兴趣，[在这里进行更详细的探讨](change-detection.md)。
