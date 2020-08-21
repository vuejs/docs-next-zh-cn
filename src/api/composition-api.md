# 组合 API

> 本节例子中代码使用的 [单文件组件](../guide/single-file-component.html) 语法

## `setup`

一个组件选项，在创建组件**之前**执行，一旦 `props` 被解析，并作为组合API的入口点

- **入参：**

  - `{Data} props`
  - `{SetupContext} context`

- **类型声明**:

```ts
interface Data {
  [key: string]: unknown
}

interface SetupContext {
  attrs: Data
  slots: Slots
  emit: (event: string, ...args: unknown[]) => void
}

function setup(props: Data, context: SetupContext): Data
```

::: tip
若要获取传递给 `setup()` 的参数的类型推断，请使用 [defineComponent](global-api.html#definecomponent) 是需要的。
:::

- **示例：**

  使用模板:

  ```vue-html
  <!-- MyBook.vue -->
  <template>
    <div>{{ readersNumber }} {{ book.title }}</div>
  </template>

  <script>
    import { ref, reactive } from 'vue'

    export default {
      setup() {
        const readersNumber = ref(0)
        const book = reactive({ title: 'Vue 3 Guide' })

        // expose to template
        return {
          readersNumber,
          book
        }
      }
    }
  </script>
  ```

  使用渲染函数：

  ```js
  // MyBook.vue

  import { h, ref, reactive } from 'vue'

  export default {
    setup() {
      const readersNumber = ref(0)
      const book = reactive({ title: 'Vue 3 Guide' })
      // 请注意，我们需要在这里显式地暴露ref值
      return () => h('div', [readersNumber.value, book.title])
    }
  }
  ```

- **参考**: [Composition API `setup`](../guide/composition-api-setup.html)

## 生命周期钩子

可以使用直接导入的 `onX` 函数注册生命周期钩子：

```js
import { onMounted, onUpdated, onUnmounted } from 'vue'

const MyComponent = {
  setup() {
    onMounted(() => {
      console.log('mounted!')
    })
    onUpdated(() => {
      console.log('updated!')
    })
    onUnmounted(() => {
      console.log('unmounted!')
    })
  }
}
```

这些生命周期钩子注册函数只能在 [`setup()`](#setup) 期间同步使用，因为它们依赖于内部全局状态来定位当前活动实例（此时正在调用其 `setup()` 的组件实例）。在没有当前活动实例的情况下调用它们将导致错误。

组件实例上下文也是在生命周期钩子的同步执行期间设置的，因此在生命周期钩子内同步创建的侦听器和计算属性也会在组件卸载时自动删除。

**选项API生命周期选项和组合API之间的映射**

  - ~~`beforeCreate`~~ -> use `setup()`
  - ~~`created`~~ -> use `setup()`
  - `beforeMount` -> `onBeforeMount`
  - `mounted` -> `onMounted`
  - `beforeUpdate` -> `onBeforeUpdate`
  - `updated` -> `onUpdated`
  - `beforeUnmount` -> `onBeforeUnmount`
  - `unmounted` -> `onUnmounted`
  - `errorCaptured` -> `onErrorCaptured`
  - `renderTracked` -> `onRenderTracked`
  - `renderTriggered` -> `onRenderTriggered`

- **参考**: [组合API 生命周期钩子](../guide/composition-api-lifecycle-hooks.html)

## Provide / Inject

`provide` 和 `inject` 启用依赖注入。只有在使用当前活动实例的 [`setup()`](#setup) 期间才能调用这两者。

- **类型声明**:

```ts
interface InjectionKey<T> extends Symbol {}

function provide<T>(key: InjectionKey<T> | string, value: T): void

// without default value
function inject<T>(key: InjectionKey<T> | string): T | undefined
// with default value
function inject<T>(key: InjectionKey<T> | string, defaultValue: T): T
```

Vue提供了一个 `InjectionKey` 接口，该接口是扩展 `Symbol` 的泛型类型。它可用于在提供者和消费者之间同步注入值的类型：

```ts
import { InjectionKey, provide, inject } from 'vue'

const key: InjectionKey<string> = Symbol()

provide(key, 'foo') // 提供非字符串值将导致错误

const foo = inject(key) // foo 的类型: string | undefined
```

如果使用字符串 key 或非类型化 symbols ，则需要显式声明注入值的类型：

```ts
const foo = inject<string>('foo') // string | undefined
```

- **参考**:
  - [Provide / Inject](../guide/component-provide-inject.html)
  - [组合 API Provide / Inject](../guide/composition-api-provide-inject.html)
