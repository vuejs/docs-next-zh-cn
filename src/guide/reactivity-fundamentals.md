# 响应式原理

## 声明响应式状态

要从JavaScript对象创建响应式状态，可以使用 `reactive` 方法：

```js
import { reactive } from 'vue'

// 响应式状态
const state = reactive({
  count: 0
})
```

`reactive` 相当于`Vue.observable()` API在Vue 2.x中，重命名以避免与RxJS observables混淆。在这里，返回的状态是一个响应式对象。响应式转换是 “深入” 的 —— 它影响传递对象的所有嵌套property. 

Vue中响应式状态的基本用例是我们可以在渲染期间使用它。由于依赖关系跟踪，视图在被动状态更改时自动更新。

这就是Vue响应式系统的本质。当从组件中的 `data()` 返回一个对象时，它在内部由 `reactive()` 使其成为反应对象。模板被编译成 [渲染 function](render-function.html) 利用了这些响应式性质。


 在 [基础响应式API](../api/basic-reactivity.html) 章节你可以学习更多关于`响应式`的内容

## 创建独立的响应式值作为 `refs`

想象一下，我们有一个独立的原始值（例如，一个字符串），我们想让它成为响应式的。当然，我们可以用一个与字符串相等的property创建一个对象，并将其传递给 `reactive` 。Vue有一个方法可以为我们做同样的事情-它是一个 `ref` 。

```js
import { ref } from 'vue'

const count = ref(0)
```

`ref` will return a reactive and mutable object that serves as a reactive **ref**erence to the internal value it is holding - that's where the name comes from. This object contains the only one property named `value`:

`ref`将返回一个响应式和可变对象，该对象作为它所拥有的内部值 —— 一个响应式 **ref**的引用，这就是名称的来源。此对象只包含一个名为 `value` 的property` ：

```js
import { ref } from 'vue'

const count = ref(0)
console.log(count.value) // 0

count.value++
console.log(count.value) // 1
```

### Ref 展开

当ref作为渲染上下文 （从 [setup()](composition-api-setup.html)中返回的对象）上的property返回并在模板中访问时，它将自动展开为内部值。不需要在模板中追加 `.value`：

```vue-html
<template>
  <div>
    <span>{{ count }}</span>
    <button @click="count ++">Increment count</button>
  </div>
</template>

<script>
  import { ref } from 'vue'
  export default {
    setup() {
      const count = ref(0)
      return {
        count
      }
    }
  }
</script>
```

### 访问响应式对象

当 `ref`作为响应式对象的property被访问或更改时，它会自动展开为内部值，以便其行为类似于普通property性：

```js
const count = ref(0)
const state = reactive({
  count
})

console.log(state.count) // 0

state.count = 1
console.log(count.value) // 1
```

如果将新 ref 指定给链接到现有 ref 的property，则它将替换旧 ref：

```js
const otherCount = ref(2)

state.count = otherCount
console.log(state.count) // 2
console.log(count.value) // 1
```

Ref展开仅在嵌套在响应式 `Object` 中时发生。当从 `Array` 或原生集合类型如 [`Map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)访问ref时，不会执行展开:


```js
const books = reactive([ref('Vue 3 Guide')])
// 这里需要 .value
console.log(books[0].value)

const map = reactive(new Map([['count', ref(0)]]))
// 这里需要 .value
console.log(map.get('count').value)
```

## 响应式状态解构

当我们想使用大型响应式对象的一些property时，可能很容易使用[ES6 解构](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment) 要获得我们想要的property：

```js
import { reactive } from 'vue'

const book = reactive({
  author: 'Vue Team',
  year: '2020',
  title: 'Vue 3 Guide',
  description: 'You are reading this book right now ;)',
  price: 'free'
})

let { author, title } = book
```

遗憾的是，随着这种结构的破坏，这两个property的响应式都将丢失。对于这种情况，我们需要将我们的响应式对象转换为一组refs。这些 ref 将保留与源对象的响应式关联：

```js
import { reactive, toRefs } from 'vue'

const book = reactive({
  author: 'Vue Team',
  year: '2020',
  title: 'Vue 3 Guide',
  description: 'You are reading this book right now ;)',
  price: 'free'
})

let { author, title } = toRefs(book)

title.value = 'Vue 3 Detailed Guide' // 我们需要使用 .value 作为标题，现在是ref
console.log(book.title) // 'Vue 3 Detailed Guide'
```

你可以在 [Refs API](../api/refs-api.html#ref) 部分中了解有关 `refs' 的更多信息

## 防止使用 `readonly` 转换响应式对象

有时我们想跟踪反应对象（ `ref` 或 `reactive` ）的变化，但我们也希望防止从应用程序的某个位置更改它。例如，当我们有一个 [provide](component-provide-inject.html) 响应式对象，我们要防止它在注射的地方发生转换。为此，我们可以为原始对象创建一个只读proxy：


```js
import { reactive, readonly } from 'vue'

const original = reactive({ count: 0 })

const copy = readonly(original)

// 在copy上转换original 会触发侦听器依赖

original.count++

// 转换copy 将导失败并导致警告
copy.count++ // 警告: "Set operation on key 'count' failed: target is readonly."
```
