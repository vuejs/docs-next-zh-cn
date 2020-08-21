# 响应式计算和帧听

> 本节使用[单文件组件](single-file-component.html)语法作为代码示例

## 计算值

有时我们需要依赖于其他状态的状态——在 Vue 中，这是用组件[计算属性](computed.html#computed-properties)处理的，以直接创建计算值，我们可以使用 `computed` 方法：它接受 getter 函数并为 getter 返回的值返回一个不可变的响应式 [ref](reactivity-fundamentals.html#creating-standalone-reactive-values-as-refs) 对象。

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

为了根据反应状态*自动应用*和*重新应用*副作用，我们可以使用 `watchEffect` 方法。它立即运行一个函数，同时反应性地跟踪其依赖项，并在依赖项发生更改时重新运行它。

```js
const count = ref(0)

watchEffect(() => console.log(count.value))
// -> logs 0

setTimeout(() => {
  count.value++
  // -> logs 1
}, 100)
```

### 阻止侦听器

当在组件的 [setup ()](composition-api-setup.html) 函数或[生命周期钩子](composition-api-lifecycle-hooks.html)期间调用 `watchEffect` 时，侦听器链接到组件的生命周期，并在组件卸载时自动停止。

在其他情况下，它返回一个停止句柄，可以调用该句柄显式停止侦听器：

```js
const stop = watchEffect(() => {
  /* ... */
})

// later
stop()
```

### 副作用失效

有时监视效果函数会执行异步副作用，当它失效时 (即在效果完成之前状态改变) 需要清除这些副作用。effect 函数接收一个 `onInvalidate` 函数，该函数可用于注册无效回调。此无效回调在以下情况下调用：

- 效果将重新运行
- <a id="argue-3"></a>TODO 侦听器被停止 (即，当组件卸载时，如果在 `setup()` 或生命周期钩子使用了 `watchEffect`)

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

我们通过传入函数注册无效回调，而不是从回调返回它，因为返回值对于异步错误处理很重要。在执行数据获取时，effect 函数通常是异步函数：

```js
const data = ref(null)
watchEffect(async onInvalidate => {
  onInvalidate(() => {...}) // 我们在Promise解析之前注册清除函数
  data.value = await fetchData(props.id)
})
```

异步函数隐式返回一个 Promise，但需要在 Promise 解析之前立即注册清除 p 函数。此外，Vue 依赖于返回的 Promise 来自动处理 Promise 链中的潜在错误。

###<a id="argue-2"></a>TODO 效果冲刷 Timing？

Vue 的响应性系统缓冲无效的效果，并异步刷新它们，以避免在同一个“tick”中发生许多状态转换时不必要的重复调用。在内部，组件的 `update` 功能也是一种监视效果。当把用户效果加入队列时，它总是在所有组件 `update` 效果之后调用：

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

在这例子中：

- 计数将在首次运行时同步记录。
- 当 `count` 发生变化时，将在**组件更新后调用**回调。

Note the first run is executed before the component is mounted。So if you wish to access the DOM (or template refs) in a watched effect，do it in the mounted hook：

```js
onMounted(() => {
  watchEffect(() => {
    // 访问DOM 或者 模板引用
  })
})
```

在需要同步或在组件更新之前重新运行侦听器效果的情况下，我们可以使用 `flush` 选项传递一个附加的 `options` 对象 (默认为 `post`)：

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

- 当响应式 property 或 ref 作为依赖项被跟踪时，将调用 `onTrack`
- 当依赖项的变化触发侦听器回调时，将调用 `onTrigger`

两个回调都将接收一个调试器事件，其中包含有关相关依赖项的信息。建议在这些回调中放置 `debugger` 语句以交互方式检查依赖关系：

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

`watch` API 完全等同于组件[侦听](computed.html#侦听器) property。`watch` 需要监视特定的数据源，并在单独的回调函数中应用副作用。默认情况下，它也是惰性的，即只有当被监视的源发生变化时才调用回调。

- 与 [watchEffect](#watcheffect) 比较，`watch` 允许我们：

  - 懒性地执行副作用；
  - 更具体地说明什么状态应该触发侦听器重新运行；
  - 访问被侦听状态的先前值和当前值。

### 侦听单一源

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

### 侦听多个源

侦听器还可以使用数组同时监视多个源：

```js
watch([fooRef, barRef], ([foo, bar], [prevFoo, prevBar]) => {
  /* ... */
})
```

### 使用 `watchEffect` 共享行为

`watch` 与 [`watchEffect`](#watcheffect) 共享 [manual stoppage](#stopping-the-watcher)，[side effect invalidation](#side-effect-invalidation) (改造将 `onInvalidate` 作为第三个参数传递给回调)、[flush timing](#effect-flush-timing 和 [debugging](#watcher-debugging) 行为。
