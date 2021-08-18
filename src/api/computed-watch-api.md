# Computed 与 watch

> 本节例子中的代码使用[单文件组件](../guide/single-file-component.html)语法

## `computed`

接受一个 getter 函数，并返回一个不可变的响应式 [ref](./refs-api.html#ref) 对象。

```js
const count = ref(1)
const plusOne = computed(() => count.value + 1)

console.log(plusOne.value) // 2

plusOne.value++ // 错误
```

或者，它也可以是具有 `get` 和 `set` 函数的对象，以创建可写的 ref 对象。

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

**类型声明：**

```ts
// 只读的
function computed<T>(
  getter: () => T,
  debuggerOptions?: DebuggerOptions
): Readonly<Ref<Readonly<T>>>

// 可写的
function computed<T>(
  options: {
    get: () => T
    set: (value: T) => void
  },
  debuggerOptions?: DebuggerOptions
): Ref<T>
interface DebuggerOptions {
  onTrack?: (event: DebuggerEvent) => void
  onTrigger?: (event: DebuggerEvent) => void
}
interface DebuggerEvent {
  effect: ReactiveEffect
  target: any
  type: OperationTypes
  key: string | symbol | undefined
}
```

## `watchEffect`

在响应式地跟踪其依赖项时立即运行一个函数，并在依赖项发生变化时重新运行它。

```js
const count = ref(0)

watchEffect(() => console.log(count.value))
// -> logs 0

setTimeout(() => {
  count.value++
  // -> logs 1
}, 100)
```

**类型声明：**

```ts
function watchEffect(
  effect: (onInvalidate: InvalidateCbRegistrator) => void,
  options?: WatchEffectOptions
): StopHandle

interface WatchEffectOptions {
  flush?: 'pre' | 'post' | 'sync' // 默认：'pre'
  onTrack?: (event: DebuggerEvent) => void
  onTrigger?: (event: DebuggerEvent) => void
}

interface DebuggerEvent {
  effect: ReactiveEffect
  target: any
  type: OperationTypes
  key: string | symbol | undefined
}

type InvalidateCbRegistrator = (invalidate: () => void) => void

type StopHandle = () => void
```

**参考**：[`watchEffect` 指南](../guide/reactivity-computed-watchers.html#watcheffect)

## `watchPostEffect` <Badge text="3.2+" />

`watchEffect` 的别名，带有 `flush: 'post'` 选项。

## `watchSyncEffect` <Badge text="3.2+" />

`watchEffect` 的别名，带有 `flush: 'sync'` 选项。

## `watch`

`watch` API 与选项式 API [this.$watch](./instance-methods.html#watch) (以及相应的 [watch](./options-data.html#watch) 选项) 完全等效。`watch` 需要侦听特定的数据源，并在单独的回调函数中执行副作用。默认情况下，它也是惰性的——即回调仅在侦听源发生变化时被调用。

- 与 [watchEffect](#watcheffect) 相比，`watch` 允许我们：

  - 惰性地执行副作用；
  - 更具体地说明应触发侦听器重新运行的状态；
  - 访问被侦听状态的先前值和当前值。

### 侦听单一源

侦听器数据源可以是一个具有返回值的 getter 函数，也可以直接是一个 [ref](./refs-api.html#ref)：

```js
// 侦听一个 getter
const state = reactive({ count: 0 })
watch(
  () => state.count,
  (count, prevCount) => {
    /* ... */
  }
)

// 直接侦听一个 ref
const count = ref(0)
watch(count, (count, prevCount) => {
  /* ... */
})
```

### 侦听多个源

侦听器还可以使用数组以同时侦听多个源：

```js
watch([fooRef, barRef], ([foo, bar], [prevFoo, prevBar]) => {
  /* ... */
})
```

### 与 `watchEffect` 相同的行为

`watch` 与 [`watchEffect`](#watcheffect) 在[手动停止侦听](../guide/reactivity-computed-watchers.html#停止侦听)、[清除副作用](../guide/reactivity-computed-watchers.html#清除副作用) (将 `onInvalidate` 作为第三个参数传递给回调)、[刷新时机](../guide/reactivity-computed-watchers.html#副作用刷新时机)和[调试](../guide/reactivity-computed-watchers.html#侦听器调试)方面有相同的行为。

**类型声明：**

```ts
// 侦听单一源
function watch<T>(
  source: WatcherSource<T>,
  callback: (
    value: T,
    oldValue: T,
    onInvalidate: InvalidateCbRegistrator
  ) => void,
  options?: WatchOptions
): StopHandle

// 侦听多个源
function watch<T extends WatcherSource<unknown>[]>(
  sources: T
  callback: (
    values: MapSources<T>,
    oldValues: MapSources<T>,
    onInvalidate: InvalidateCbRegistrator
  ) => void,
  options? : WatchOptions
): StopHandle

type WatcherSource<T> = Ref<T> | (() => T)

type MapSources<T> = {
  [K in keyof T]: T[K] extends WatcherSource<infer V> ? V : never
}

// 参见 `watchEffect` 共享选项的类型声明
interface WatchOptions extends WatchEffectOptions {
  immediate?: boolean // 默认：false
  deep?: boolean
}
```

**参考**：[`watch` 指南](../guide/reactivity-computed-watchers.html#watch)
