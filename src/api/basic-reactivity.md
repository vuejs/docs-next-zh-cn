# 响应性基础 API

> 本节例子中代码使用[单文件组件](../guide/single-file-component.html)语法

## `reactive`

返回对象的响应式副本

```js
const obj = reactive({ count: 0 })
```

响应式转换是“深层”的——它影响所有嵌套 property。在基于 [ES2015 Proxy](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy) 的实现中，返回的 proxy 是**不**等于原始对象的。建议只使用响应式 proxy，避免依赖原始对象。

**类型声明：**

```ts
function reactive<T extends object>(target: T): UnwrapNestedRefs<T>
```

## `readonly`

接受一个对象 (响应式或纯对象) 或 [ref](./refs-api.html#ref) 并返回原始对象的只读代理。只读代理是深层的：任何被访问的嵌套 property 也是只读的。

```js
const original = reactive({ count: 0 })

const copy = readonly(original)

watchEffect(() => {
  // 用于响应性追踪
  console.log(copy.count)
})

// 变更 original 会触发依赖于副本的侦听器
original.count++

// 变更副本将失败并导致警告
copy.count++ // 警告!
```

## `isProxy`

检查对象是否是由 [`reactive`](#reactive) 或 [`readonly`](#readonly) 创建的 proxy。

## `isReactive`

检查对象是否是由 [`reactive`](#reactive) 创建的响应式代理。

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

如果该代理是 [`readonly`](#readonly) 创建的，但包装了由 [`reactive`](#reactive) 创建的另一个代理，它也会返回 `true`。

```js{7-15}
import { reactive, isReactive, readonly } from 'vue'
export default {
  setup() {
    const state = reactive({
      name: 'John'
    })
    // 从普通对象创建的只读 proxy
    const plain = readonly({
      name: 'Mary'
    })
    console.log(isReactive(plain)) // -> false

    // 从响应式 proxy 创建的只读 proxy
    const stateCopy = readonly(state)
    console.log(isReactive(stateCopy)) // -> true
  }
}
```

## `isReadonly`

检查对象是否是由 [`readonly`](#readonly) 创建的只读代理。

## `toRaw`

返回 [`reactive`](#reactive) 或 [`readonly`](#readonly) 代理的原始对象。这是一个“逃生舱”，可用于临时读取数据而无需承担代理访问/跟踪的开销，也可用于写入数据而避免触发更改。**不**建议保留对原始对象的持久引用。请谨慎使用。

```js
const foo = {}
const reactiveFoo = reactive(foo)

console.log(toRaw(reactiveFoo) === foo) // true
```

## `markRaw`

标记一个对象，使其永远不会转换为 proxy。返回对象本身。

```js
const foo = markRaw({})
console.log(isReactive(reactive(foo))) // false

// 嵌套在其他响应式对象中时也可以使用
const bar = reactive({ foo })
console.log(isReactive(bar.foo)) // false
```

:::warning 重要

`markRaw` 和下方的 shallowXXX API 使你可以有选择地退出默认的深度响应式/只读转换模式，并将原始的，未被代理的对象嵌入状态图中。它们可以根据情况灵活运用：

- 有些值不应该是响应式的，例如复杂的第三方类实例或 Vue 组件对象。
- 当渲染具有不可变数据源的大列表时，跳过 proxy 转换可以提高性能。

这些例子是进阶的运用，因为原始选择退出仅在根级别，因此，如果将嵌套在内的、未标记的原始对象添加进响应式对象，然后再次访问该响应式对象，就会得到原始对象被代理后的版本。这可能会导致**同一性风险**——即执行一个依赖于对象本身的操作，但同时使用同一对象的原始版本和被代理后的版本：

```js
const foo = markRaw({
  nested: {}
})

const bar = reactive({
  // 虽然 `foo` 被标记为原始，但 foo.nested 不是。
  nested: foo.nested
})

console.log(foo.nested === bar.nested) // false
```

同一性风险通常很少见。然而，为了正确地使用这些 API，同时安全地避免同一性风险，就需要对响应性系统的工作原理有一个充分的理解。

:::

## `shallowReactive`

创建一个响应式代理，它跟踪其自身 property 的响应性，但不执行嵌套对象的深层响应式转换 (暴露原始值)。

```js
const state = shallowReactive({
  foo: 1,
  nested: {
    bar: 2
  }
})

// 改变 state 本身的性质是响应式的
state.foo++
// ...但是不转换嵌套对象
isReactive(state.nested) // false
state.nested.bar++ // 非响应式
```

## `shallowReadonly`

创建一个 proxy，使其自身的 property 为只读，但不执行嵌套对象的深度只读转换 (暴露原始值)。

```js
const state = shallowReadonly({
  foo: 1,
  nested: {
    bar: 2
  }
})

// 改变 state 本身的 property 将失败
state.foo++
// ...但适用于嵌套对象
isReadonly(state.nested) // false
state.nested.bar++ // 适用
```
