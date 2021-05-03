# Refs

> 本节例子中代码使用的[单文件组件](../guide/single-file-component.html)语法

## `ref`

接受一个内部值并返回一个响应式且可变的 ref 对象。ref 对象具有指向内部值的单个 property `.value`。

**示例：**

```js
const count = ref(0)
console.log(count.value) // 0

count.value++
console.log(count.value) // 1
```

如果将对象分配为 ref 值，则可以通过 [reactive](./basic-reactivity.html#reactive) 方法使该对象具有高度的响应式。

**类型声明：**

```ts
interface Ref<T> {
  value: T
}

function ref<T>(value: T): Ref<T>
```

有时我们可能需要为 ref 的内部值指定复杂类型。想要简洁地做到这一点，我们可以在调用 `ref` 覆盖默认推断时传递一个泛型参数：

```ts
const foo = ref<string | number>('foo') // foo 的类型：Ref<string | number>

foo.value = 123 // ok!
```

如果泛型的类型未知，建议将 `ref` 转换为 `Ref<T>`：

```ts
function useState<State extends string>(initial: State) {
  const state = ref(initial) as Ref<State> // state.value -> State extends string
  return state
}
```

## `unref`

如果参数是一个 [`ref`](#ref)，则返回内部值，否则返回参数本身。这是 `val = isRef(val) ? val.value : val` 的语法糖函数。

```ts
function useFoo(x: number | Ref<number>) {
  const unwrapped = unref(x) // unwrapped 现在一定是数字类型
}
```

## `toRef`

可以用来为源响应式对象上的某个 property 新创建一个 [`ref`](#ref)。然后，ref 可以被传递，它会保持对其源 property 的响应式连接。

```js
const state = reactive({
  foo: 1,
  bar: 2
})

const fooRef = toRef(state, 'foo')

fooRef.value++
console.log(state.foo) // 2

state.foo++
console.log(fooRef.value) // 3
```

当你要将 prop 的 ref 传递给复合函数时，`toRef` 很有用：

```js
export default {
  setup(props) {
    useSomeFeature(toRef(props, 'foo'))
  }
}
```

即使源 property 不存在，`toRef` 也会返回一个可用的 ref。这使得它在使用可选 prop 时特别有用，可选 prop 并不会被 [`toRefs`](#torefs) 处理。

## `toRefs`

将响应式对象转换为普通对象，其中结果对象的每个 property 都是指向原始对象相应 property 的 [`ref`](#ref)。

```js
const state = reactive({
  foo: 1,
  bar: 2
})

const stateAsRefs = toRefs(state)
/*
stateAsRefs 的类型:

{
  foo: Ref<number>,
  bar: Ref<number>
}
*/

// ref 和原始 property 已经“链接”起来了
state.foo++
console.log(stateAsRefs.foo.value) // 2

stateAsRefs.foo.value++
console.log(state.foo) // 3
```

当从组合式函数返回响应式对象时，`toRefs` 非常有用，这样消费组件就可以在不丢失响应性的情况下对返回的对象进行分解/扩散：

```js
function useFeatureX() {
  const state = reactive({
    foo: 1,
    bar: 2
  })

  // 操作 state 的逻辑

  // 返回时转换为ref
  return toRefs(state)
}

export default {
  setup() {
    // 可以在不失去响应性的情况下解构
    const { foo, bar } = useFeatureX()

    return {
      foo,
      bar
    }
  }
}
```

`toRefs` 只会为源对象中包含的 property 生成 ref。如果要为特定的 property 创建 ref，则应当使用 [`toRef`](#toref)

## `isRef`

检查值是否为一个 ref 对象。

## `customRef`

创建一个自定义的 ref，并对其依赖项跟踪和更新触发进行显式控制。它需要一个工厂函数，该函数接收 `track` 和 `trigger` 函数作为参数，并且应该返回一个带有 `get` 和 `set` 的对象。

- 使用自定义 ref 通过 `v-model` 实现 debounce 的示例：

  ```html
  <input v-model="text" />
  ```

  ```js
  function useDebouncedRef(value, delay = 200) {
    let timeout
    return customRef((track, trigger) => {
      return {
        get() {
          track()
          return value
        },
        set(newValue) {
          clearTimeout(timeout)
          timeout = setTimeout(() => {
            value = newValue
            trigger()
          }, delay)
        }
      }
    })
  }

  export default {
    setup() {
      return {
        text: useDebouncedRef('hello')
      }
    }
  }
  ```

**类型声明**：

```ts
function customRef<T>(factory: CustomRefFactory<T>): Ref<T>

type CustomRefFactory<T> = (
  track: () => void,
  trigger: () => void
) => {
  get: () => T
  set: (value: T) => void
}
```

## `shallowRef`

创建一个跟踪自身 `.value` 变化的 ref，但不会使其值也变成响应式的。

```js
const foo = shallowRef({})
// 改变 ref 的值是响应式的
foo.value = {}
// 但是这个值不会被转换。
isReactive(foo.value) // false
```

**参考**：[创建独立的响应式值作为 `refs`](../guide/reactivity-fundamentals.html#创建独立的响应式值作为-refs)

## `triggerRef`

手动执行与 [`shallowRef`](#shallowref) 关联的任何副作用。

```js
const shallow = shallowRef({
  greet: 'Hello, world'
})

// 第一次运行时记录一次 "Hello, world"
watchEffect(() => {
  console.log(shallow.value.greet)
})

// 这不会触发副作用，因为 ref 是浅层的
shallow.value.greet = 'Hello, universe'

// 记录 "Hello, universe"
triggerRef(shallow)
```

**参考**[计算和侦听 - watchEffect](./computed-watch-api.html#watcheffect)
