# 响应式计算和帧听

> 本节使用[单文件组件](single-file-component.html)语法作为代码示例

## 计算值

有时我们需要依赖于其他状态的状态——在 Vue 中，这是用组件[计算属性](computed.html#计算属性和侦听器)处理的，以直接创建计算值，我们可以使用 `computed` 方法：它接受 getter 函数并为 getter 返回的值返回一个不可变的响应式 [ref](reactivity-fundamentals.html#创建独立的响应式值作为-refs) 对象。

```js
const count = ref(1)
const plusOne = computed(() => count.value++)

console.log(plusOne.value) // 2

plusOne.value++ // error
```

或者，它可以使用一个带有 `get` 和 `set` 函数的对象来创建一个可写的 ref 对象。

```js
const count = ref(1)
const plusOne = computed({
  get: () => count.value + 1,
  set: val => {
    count.value = val - 1
  }
})

plusOne.value = 1
console.log(count.value) // 0
```

## `watchEffect`

为了根据反应状态*自动应用*和*重新应用*副作用，我们可以使用 `watchEffect` 方法。它立即执行传入的一个函数，同时响应式追踪其依赖，并在其依赖变更时重新运行该函数。

```js
const count = ref(0)

watchEffect(() => console.log(count.value))
// -> logs 0

setTimeout(() => {
  count.value++
  // -> logs 1
}, 100)
```

### 停止侦听

当 `watchEffect` 在组件的 [setup()](composition-api-setup.html) 函数或[生命周期钩子](composition-api-lifecycle-hooks.html)被调用时，侦听器会被链接到该组件的生命周期，并在组件卸载时自动停止。

在一些情况下，也可以显式调用返回值以停止侦听：

```js
const stop = watchEffect(() => {
  /* ... */
})

// later
stop()
```

### 清除副作用

有时副作用函数会执行一些异步的副作用, 这些响应需要在其失效时清除（即完成之前状态已改变了）。所以侦听副作用传入的函数可以接收一个 `onInvalidate` 函数作入参, 用来注册清理失效时的回调。当以下情况发生时，这个失效回调会被触发:

- 副作用即将重新执行时
- 侦听器被停止 (如果在 `setup()` 或生命周期钩子函数中使用了 `watchEffect`，则在组件卸载时)

```js
watchEffect(onInvalidate => {
  const token = performAsyncOperation(id.value)
  onInvalidate(() => {
    // id has changed or watcher is stopped.
    // invalidate previously pending async operation
    token.cancel()
  })
})
```

我们之所以是通过传入一个函数去注册失效回调，而不是从回调返回它，是因为返回值对于异步错误处理很重要。

在执行数据请求时，副作用函数往往是一个异步函数：

```js
const data = ref(null)
watchEffect(async onInvalidate => {
  onInvalidate(() => {...}) // 我们在Promise解析之前注册清除函数
  data.value = await fetchData(props.id)
})
```

我们知道异步函数都会隐式地返回一个 Promise，但是清理函数必须要在 Promise 被 resolve 之前被注册。另外，Vue 依赖这个返回的 Promise 来自动处理 Promise 链上的潜在错误。

### 副作用刷新时机

Vue 的响应式系统会缓存副作用函数，并异步地刷新它们，这样可以避免同一个 “tick” 中多个状态改变导致的不必要的重复调用。在核心的具体实现中, 组件的 `update` 函数也是一个被侦听的副作用。当一个用户定义的副作用函数进入队列时, 会在所有的组件 `update` 后执行：

```html
<template>
  <div>{{ count }}</div>
</template>

<script>
  export default {
    setup() {
      const count = ref(0)

      watchEffect(() => {
        console.log(count.value)
      })

      return {
        count
      }
    }
  }
</script>
```

在这个例子中：

- `count` 会在初始运行时同步打印出来
- 更改 `count` 时，将在组件**更新后**执行副作用。

请注意，初始化运行是在组件 mounted 之前执行的。因此，如果你希望在编写副作用函数时访问 DOM（或模板 ref），请在 `onMounted` 钩子中进行：

```js
onMounted(() => {
  watchEffect(() => {
    // 访问DOM 或者 模板引用
  })
})
```

如果副作用需要同步或在组件更新之前重新运行，我们可以传递一个拥有 `flush` 属性的对象作为 `options`（默认为 `post` ）：

```js
// 同步交火
watchEffect(
  () => {
    /* ... */
  },
  {
    flush: 'sync'
  }
)

// fire before component updates
watchEffect(
  () => {
    /* ... */
  },
  {
    flush: 'pre'
  }
)
```

### 侦听器调试

`onTrack` 和 `onTrigger` 选项可用于调试侦听器的行为。

- 当响应式 property 或 ref 作为依赖项被追踪时，将调用 `onTrack`
- 当依赖项变更导致副作用被触发时，将调用 `onTrigger`

这两个回调都将接收到一个包含有关所依赖项信息的调试器事件。建议在以下回调中编写 `debugger` 语句来检查依赖关系：

```js
watchEffect(
  () => {
    /* 副作用 */
  },
  {
    onTrigger(e) {
      debugger
    }
  }
)
```

`onTrack` 和 `onTrigger` 只能在开发模式下工作。

## `watch`

`watch` API 完全等同于组件[侦听器](computed.html#侦听器) property。`watch` 需要侦听特定的数据源，并在回调函数中执行副作用。默认情况下，它也是惰性的，即只有当被侦听的源发生变化时才执行回调。

- 与 [watchEffect](#watcheffect) 比较，`watch` 允许我们：

  - 懒执行副作用；
  - 更具体地说明什么状态应该触发侦听器重新运行；
  - 访问侦听状态变化前后的值。

### 侦听单个数据源

侦听器数据源可以是返回值的 getter 函数，也可以直接是 `ref`：

```js
// 侦听一个 getter
const state = reactive({ count: 0 })
watch(
  () => state.count,
  (count, prevCount) => {
    /* ... */
  }
)

// 直接侦听ref
const count = ref(0)
watch(count, (count, prevCount) => {
  /* ... */
})
```

### 侦听多个数据源

侦听器还可以使用数组同时侦听多个源：

```js
watch([fooRef, barRef], ([foo, bar], [prevFoo, prevBar]) => {
  /* ... */
})
```

### 与 `watchEffect` 共享的行为

`watch` 与 [`watchEffect`](#watcheffect) 共享 [停止侦听](#停止侦听)，[清除副作用](#清除副作用) (相应地 `onInvalidate` 会作为回调的第三个参数传入)、[副作用刷新时机](#副作用刷新时机) 和 [侦听器调试](#侦听器调试) 行为。
