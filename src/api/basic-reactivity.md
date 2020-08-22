# 响应式基础 API

> 本节例子中代码使用的[单文件组件](../guide/single-file-component.html)语法

## `reactive`

返回对象的响应式副本

```js
const obj = reactive({ count: 0 })
```

响应式转换是“深”的——它影响所有嵌套 property。在基于 [ES2015 Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) 的实现中，返回的代理是**不**等于原始对象。建议只使用响应式代理，避免依赖原始对象。

**类型声明：**

```ts
function reactive<T extends object>(target: T): UnwrapNestedRefs<T>
```

## `readonly`

获取一个对象 (响应式或纯对象) 或 [ref](./refs-api.html#ref) 并返回原始代理的只读代理。只读代理是深层的：访问的任何嵌套 property 也是只读的。

```js
const original = reactive({ count: 0 })

const copy = readonly(original)

watchEffect(() => {
  // 适用于响应式追踪
  console.log(copy.count)
})

// 变更original 会触发侦听器依赖副本
original.count++

// 变更副本将失败并导致警告
copy.count++ // 警告!
```

## `isProxy`

检查对象是 [`reactive`](#reactive) 还是 [`readonly`](#readonly)创建的代理

## `isReactive`

检查对象是否是 [`reactive`](#reactive)创建的响应式代理

```js
import { reactive, isReactive } from 'vue'
export default {
  setup() {
    const state = reactive({
      name: 'John'
    })
    console.log(isReactive(state)) // -> true
  }
}
```


如果代理是 [`readonly`](#readonly) 创建的，但还包装了由 [`reactive`](#reactive) 创建的另一个代理，它也会返回 `true`。


```js{7-15}
import { reactive, isReactive, readonly } from 'vue'
export default {
  setup() {
    const state = reactive({
      name: 'John'
    })
    // 从普通对象创建的只读代理
    const plain = readonly({
      name: 'Mary'
    })
    console.log(isReactive(plain)) // -> false

    // 从响应式代理创建的只读代理
    const stateCopy = readonly(state)
    console.log(isReactive(stateCopy)) // -> true
  }
}
```

## `isReadonly`

检查对象是否是由[`readonly`](#readonly)创建的只读代理。

## `toRaw`

返回 [`reactive`](#reactive) 或 [`readonly`](#readonly) 代理的原始对象。这是一个转义口，可用于临时读取而不会引起代理访问/跟踪开销，也可用于写入而不会触发更改。不建议保留对原始对象的持久引用。请谨慎使用。

```js
const foo = {}
const reactiveFoo = reactive(foo)

console.log(toRaw(reactiveFoo) === foo) // true
```

## `markRaw`

标记一个对象，使其永远不会转换为代理。返回对象本身。

```js
const foo = markRaw({})
console.log(isReactive(reactive(foo))) // false

// 嵌套在其他响应式对象中时也可以使用
const bar = reactive({ foo })
console.log(isReactive(bar.foo)) // false
```

:::warning

下方的 `markRaw` 和 shallowXXX API 使你可以有选择地选择退出默认的深度响应式/只读转换，并将原始的，非代理的对象嵌入状态图中。它们可以在各种情况下使用：

- 有些值不应被设置为被动的，例如复杂的第三方类实例或 Vue 组件对象。

当渲染具有不可变数据源的大列表时，跳过代理转换可以提高性能。


它们被认为是高级的，因为原始选择退出仅在根级别，因此，如果将嵌套的、未标记的原始对象设置为响应式对象，然后再次访问它，则可以得到代理版本。这可能会导致**本源危害**——即执行依赖于对象本身但同时使用同一对象的原始版本和代理版本的操作：

```js
const foo = markRaw({
  nested: {}
})

const bar = reactive({
  // 虽然 `foo` 被标记为原始，foo.nested 不是。
  nested: foo.nested
})

console.log(foo.nested === bar.nested) // false
```

本源危害通常很少见。然而，为了在安全地避免本源危害的同时正确地使用这些 api，需要对响应式系统的工作原理有一个坚实的理解。

:::

## `shallowReactive`

创建一个响应式代理，该代理跟踪其自身 property 的响应式，但不执行嵌套对象的深度响应式转换 (暴露原始值)。

```js
const state = shallowReactive({
  foo: 1,
  nested: {
    bar: 2
  }
})

// 改变状态本身的性质是响应式的
state.foo++
// ...但是不转换嵌套对象
isReactive(state.nested) // false
state.nested.bar++ // 非响应式
```

## `shallowReadonly`

创建一个代理，使其自身的 property 为只读，但不执行嵌套对象的深度只读转换 (暴露原始值)。


```js
const state = shallowReadonly({
  foo: 1,
  nested: {
    bar: 2
  }
})

// 改变状态本身的property将失败
state.foo++
// ...但适用于嵌套对象
isReadonly(state.nested) // false
state.nested.bar++ // 适用
```
