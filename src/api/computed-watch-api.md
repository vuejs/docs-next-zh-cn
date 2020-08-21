# Computed 与 watch

> 本节例子中代码使用的[单文件组件](../guide/single-file-component.html)语法

## `computed`

使用 getter 函数，并为从 getter 返回的值返回一个不变的响应式 [ref](./refs-api.html#ref) 对象。

```js
const count = ref(1)
const plusOne = computed(() => count.value + 1)

console.log(plusOne.value) // 2

plusOne.value++ // error
```

或者，它可以使用具有 `get` 和 `set` 函数的对象来创建可写的 ref 对象。

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
// read-only
function computed<T>(getter: () => T): Readonly<Ref<Readonly<T>>>

// writable
function computed<T>(options: { get: () => T; set: (value: T) => void }): Ref<T>
```

## `watchEffect`

在响应式地跟踪其依赖项时立即运行一个函数，并在更改依赖项时重新运行它。

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
  flush?: 'pre' | 'post' | 'sync'
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

**See also**：[`watchEffect` guide](../guide/reactivity-computed-watchers.html#watcheffect)

## `watch`

 `watch` API 与选项 API [this.$watch](./instance-methods.html#watch) (以及相应的 [watch](./options-data.html#watch) 选项) 完全等效。`watch` 需要帧听特定的 data 源，并在单独的回调函数中副作用。默认情况下，它也是惰性的——即，回调是仅在帧听源发生更改时调用。

- 与 [watchEffect](#watcheffect) 比较，`watch` 允许我们：

  - 惰性地执行副作用；
  - 更具体地说明应触发侦听器重新运行的状态；
  - 访问帧听状态的先前值和当前值。

### 帧听一个单一源

侦听器 data 源可以是返回值的 getter 函数，也可以是 [ref](./refs-api.html#ref)：


```js
// 帧听一个getter
const state = reactive({ count: 0 })
watch(
  () => state.count,
  (count, prevCount) => {
    /* ... */
  }
)

// 直接帧听一个ref
const count = ref(0)
watch(count, (count, prevCount) => {
  /* ... */
})
```

### 帧听多个源

侦听器还可以使用数组同时帧听多个源：

```js
watch([fooRef, barRef], ([foo, bar], [prevFoo, prevBar]) => {
  /* ... */
})
```

### 与 `watchEffect` 共享行为

`watch` 与 [`watchEffect`](#watcheffect) 在[手动停止](stopping-the-watcher)，[副作用无效](side-effect-invalidation) (将 `onInvalidate` 作为第三个参数传递给回调)，[flush timing](#effect-flush-timing) 和 [debugging](#watcher-debugging)。

**类型声明：**

```ts
// 帧听单一源
function watch<T>(
  source: WatcherSource<T>,
  callback: (
    value: T,
    oldValue: T,
    onInvalidate: InvalidateCbRegistrator
  ) => void,
  options?: WatchOptions
): StopHandle

// 帧听多个源
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

// 参见 `watchEffect` 类型声明共享选项
interface WatchOptions extends WatchEffectOptions {
  immediate?: boolean // default: false
  deep?: boolean
}
```

**参考**：[`watch` 指南](../guide/reactivity-computed-watchers.html#watch)
