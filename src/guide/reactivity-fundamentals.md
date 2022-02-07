# 响应性基础

> 本章节的代码示例使用[单文件组件](single-file-component.html)语法

## 声明响应式状态

要为 JavaScript 对象创建响应式状态，可以使用 `reactive` 方法：

```js
import { reactive } from 'vue'

// 响应式状态
const state = reactive({
  count: 0
})
```

`reactive` 相当于 Vue 2.x 中的 `Vue.observable()` API，为避免与 RxJS 中的 observables 混淆因此对其重命名。该 API 返回一个响应式的对象状态。该响应式转换是“深度转换”——它会影响传递对象的所有嵌套 property。

Vue 中响应式状态的基本用例是我们可以在渲染期间使用它。因为依赖跟踪的关系，当响应式状态改变时视图会自动更新。

这就是 Vue 响应性系统的本质。当从组件中的 `data()` 返回一个对象时，它在内部交由 `reactive()` 使其成为响应式对象。模板会被编译成能够使用这些响应式 property 的[渲染函数](render-function.html)。

在[响应性基础 API](../api/basic-reactivity.html) 章节你可以学习更多关于 `reactive` 的内容。

## 创建独立的响应式值作为 `refs`

想象一下，我们有一个独立的原始值 (例如，一个字符串)，我们想让它变成响应式的。当然，我们可以创建一个拥有相同字符串 property 的对象，并将其传递给 `reactive`。Vue 为我们提供了一个可以做相同事情的方法——`ref`：

```js
import { ref } from 'vue'

const count = ref(0)
```

`ref` 会返回一个可变的响应式对象，该对象作为一个**响应式的引用**维护着它内部的值，这就是 `ref` 名称的来源。该对象只包含一个名为 `value` 的 property：

```js
import { ref } from 'vue'

const count = ref(0)
console.log(count.value) // 0

count.value++
console.log(count.value) // 1
```

### Ref 解包

当 ref 作为渲染上下文 (从 [setup()](composition-api-setup.html) 中返回的对象) 上的 property 返回并可以在模板中被访问时，它将自动浅层次解包内部值。只有访问嵌套的 ref 时需要在模板中添加 `.value`：

```vue-html
<template>
  <div>
    <span>{{ count }}</span>
    <button @click="count ++">Increment count</button>
    <button @click="nested.count.value ++">Nested Increment count</button>
  </div>
</template>

<script>
  import { ref } from 'vue'
  export default {
    setup() {
      const count = ref(0)
      return {
        count,

        nested: {
          count
        }
      }
    }
  }
</script>
```

:::tip
如果你不想要访问实际的对象实例，可将其用 `reactive` 包裹:

```js
nested: reactive({
  count
})
```
:::

### 访问响应式对象

当 `ref` 作为响应式对象的 property 被访问或更改时，为使其行为类似于普通 property，它会自动解包内部值：

```js
const count = ref(0)
const state = reactive({
  count
})

console.log(state.count) // 0

state.count = 1
console.log(count.value) // 1
```

如果将新的 ref 赋值给现有 ref 的 property，将会替换旧的 ref：

```js
const otherCount = ref(2)

state.count = otherCount
console.log(state.count) // 2
console.log(count.value) // 1
```

Ref 解包仅发生在被响应式 `Object` 嵌套的时候。当从 `Array` 或原生集合类型如 [`Map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)访问 ref 时，不会进行解包：

```js
const books = reactive([ref('Vue 3 Guide')])
// 这里需要 .value
console.log(books[0].value)

const map = reactive(new Map([['count', ref(0)]]))
// 这里需要 .value
console.log(map.get('count').value)
```

## 响应式状态解构

当我们想使用大型响应式对象的一些 property 时，可能很想使用 [ES6 解构](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment)来获取我们想要的 property：

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

遗憾的是，使用解构的两个 property 的响应性都会丢失。对于这种情况，我们需要将我们的响应式对象转换为一组 ref。这些 ref 将保留与源对象的响应式关联：

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

title.value = 'Vue 3 Detailed Guide' // 我们需要使用 .value 作为标题，现在是 ref
console.log(book.title) // 'Vue 3 Detailed Guide'
```

你可以在 [Refs API](../api/refs-api.html#ref) 部分中了解更多有关 `refs` 的信息

## 使用 `readonly` 防止更改响应式对象

有时我们想跟踪响应式对象 (`ref` 或 `reactive`) 的变化，但我们也希望防止在应用程序的某个位置更改它。例如，当我们有一个被 [provide](component-provide-inject.html) 的响应式对象时，我们不想让它在注入之后被改变。为此，我们可以基于原始对象创建一个只读的 proxy 对象：

```js
import { reactive, readonly } from 'vue'

const original = reactive({ count: 0 })

const copy = readonly(original)

// 通过 original 修改 count，将会触发依赖 copy 的侦听器

original.count++

// 通过 copy 修改 count，将导致失败并出现警告
copy.count++ // 警告: "Set operation on key 'count' failed: target is readonly."
```
