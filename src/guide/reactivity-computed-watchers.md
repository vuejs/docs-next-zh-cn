# 响应式计算和侦听

> 本节使用[单文件组件](single-file-component.html)语法作为代码示例

## 计算值

有时我们需要依赖于其他状态的状态——在 Vue 中，这是用组件[计算属性](computed.html#计算属性和侦听器)处理的，以直接创建计算值，我们可以使用 `computed` 函数：它接受 getter 函数并为 getter 返回的值返回一个不可变的响应式 [ref](reactivity-fundamentals.html#创建独立的响应式值作为-refs) 对象。

```js
const count = ref(1)
const plusOne = computed(() => count.value + 1)

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

### 调试 Computed <Badge text="3.2+" />

`computed` 可接受一个带有 `onTrack` 和 `onTrigger` 选项的对象作为第二个参数：

- `onTrack` 会在某个响应式 property 或 ref 作为依赖被追踪时调用。
- `onTrigger` 会在侦听回调被某个依赖的修改触发时调用。 

所有回调都会收到一个 debugger 事件，其中包含了一些依赖相关的信息。推荐在这些回调内放置一个 `debugger` 语句以调试依赖。

```js
const plusOne = computed(() => count.value + 1, {
  onTrack(e) {
    // 当 count.value 作为依赖被追踪时触发
    debugger
  },
  onTrigger(e) {
    // 当 count.value 被修改时触发
    debugger
  }
})
// 访问 plusOne，应该触发 onTrack
console.log(plusOne.value)
// 修改 count.value，应该触发 onTrigger
count.value++
```

`onTrack` 和 `onTrigger` 仅在开发模式下生效。

## `watchEffect`

为了根据响应式状态*自动应用*和*重新应用*副作用，我们可以使用 `watchEffect` 函数。它立即执行传入的一个函数，同时响应式追踪其依赖，并在其依赖变更时重新运行该函数。

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

有时副作用函数会执行一些异步的副作用，这些响应需要在其失效时清除 (即完成之前状态已改变了) 。所以侦听副作用传入的函数可以接收一个 `onInvalidate` 函数作入参，用来注册清理失效时的回调。当以下情况发生时，这个失效回调会被触发：

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
  onInvalidate(() => {
    /* ... */
  }) // 我们在Promise解析之前注册清除函数
  data.value = await fetchData(props.id)
})
```

我们知道异步函数都会隐式地返回一个 Promise，但是清理函数必须要在 Promise 被 resolve 之前被注册。另外，Vue 依赖这个返回的 Promise 来自动处理 Promise 链上的潜在错误。

### 副作用刷新时机

Vue 的响应性系统会缓存副作用函数，并异步地刷新它们，这样可以避免同一个“tick” 中多个状态改变导致的不必要的重复调用。在核心的具体实现中，组件的 `update` 函数也是一个被侦听的副作用。当一个用户定义的副作用函数进入队列时，默认情况下，会在所有的组件 `update` **前**执行：

```vue
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
- 更改 `count` 时，将在组件**更新前**执行副作用。

如果需要在组件更新(例如：当与[模板引用](./composition-api-template-refs.md#侦听模板引用)一起)**后**重新运行侦听器副作用，我们可以传递带有 `flush` 选项的附加 `options` 对象 (默认为 `'pre'`)：

```js

// 在组件更新后触发，这样你就可以访问更新的 DOM。
// 注意：这也将推迟副作用的初始运行，直到组件的首次渲染完成。
watchEffect(
  () => {
    /* ... */
  },
  {
    flush: 'post'
  }
)
```

`flush` 选项还接受 `sync`，这将强制效果始终同步触发。然而，这是低效的，应该很少需要。

从 Vue 3.2.0 开始，`watchPostEffect` 和 `watchSyncEffect` 别名也可以用来让代码意图更加明显。

### 侦听器调试

`onTrack` 和 `onTrigger` 选项可用于调试侦听器的行为。

- `onTrack` 将在响应式 property 或 ref 作为依赖项被追踪时被调用。
- `onTrigger` 将在依赖项变更导致副作用被触发时被调用。

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
const firstName = ref('')
const lastName = ref('')

watch([firstName, lastName], (newValues, prevValues) => {
  console.log(newValues, prevValues)
})

firstName.value = 'John' // logs: ["John", ""] ["", ""]
lastName.value = 'Smith' // logs: ["John", "Smith"] ["John", ""]
```

尽管如此，如果你在同一个函数里同时改变这些被侦听的来源，侦听器仍只会执行一次：

```js{9-13}
setup() {
  const firstName = ref('')
  const lastName = ref('')

  watch([firstName, lastName], (newValues, prevValues) => {
    console.log(newValues, prevValues)
  })

  const changeValues = () => {
    firstName.value = 'John'
    lastName.value = 'Smith'
    // 打印 ["John", "Smith"] ["", ""]
  }

  return { changeValues }
}
```

注意多个同步更改只会触发一次侦听器。

通过更改设置 `flush: 'sync'`，我们可以为每个更改都强制触发侦听器，尽管这通常是不推荐的。或者，可以用 [nextTick](/api/global-api.html#nexttick) 等待侦听器在下一步改变之前运行。例如：

```js
const changeValues = async () => {
  firstName.value = 'John' // 打印 ["John", ""] ["", ""]
  await nextTick()
  lastName.value = 'Smith' // 打印 ["John", "Smith"] ["John", ""]
}
```

### 侦听响应式对象

使用侦听器来比较一个数组或对象的值，这些值是响应式的，要求它有一个由值构成的副本。

```js
const numbers = reactive([1, 2, 3, 4])

watch(
  () => [...numbers],
  (numbers, prevNumbers) => {
    console.log(numbers, prevNumbers)
  }
)

numbers.push(5) // logs: [1,2,3,4,5] [1,2,3,4]
```

尝试检查深度嵌套对象或数组中的 property 变化时，仍然需要 `deep` 选项设置为 true。

```js
const state = reactive({ 
  id: 1,
  attributes: { 
    name: '',
  }
})

watch(
  () => state,
  (state, prevState) => {
    console.log('not deep', state.attributes.name, prevState.attributes.name)
  }
)

watch(
  () => state,
  (state, prevState) => {
    console.log('deep', state.attributes.name, prevState.attributes.name)
  },
  { deep: true }
)

state.attributes.name = 'Alex' // 日志: "deep" "Alex" "Alex"
```

然而，侦听一个响应式对象或数组将始终返回该对象的当前值和上一个状态值的引用。为了完全侦听深度嵌套的对象和数组，可能需要对值进行深拷贝。这可以通过诸如 [lodash.cloneDeep](https://lodash.com/docs/4.17.15#cloneDeep) 这样的实用工具来实现。

```js
import _ from 'lodash'

const state = reactive({
  id: 1,
  attributes: {
    name: '',
  }
})

watch(
  () => _.cloneDeep(state),
  (state, prevState) => {
    console.log(state.attributes.name, prevState.attributes.name)
  }
)

state.attributes.name = 'Alex' // 日志: "Alex" ""
```

### 与 `watchEffect` 共享的行为

`watch` 与 [`watchEffect`](#watcheffect)共享[停止侦听](#停止侦听)，[清除副作用](#清除副作用) (相应地 `onInvalidate` 会作为回调的第三个参数传入)、[副作用刷新时机](#副作用刷新时机)和[侦听器调试](#侦听器调试)行为。
