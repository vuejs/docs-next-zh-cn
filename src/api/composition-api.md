# 组合式 API

> 本节例子中代码使用的[单文件组件](../guide/single-file-component.html)语法

## `setup`

一个组件选项，在创建组件**之前**执行，一旦 `props` 被解析，并作为组合式 API 的入口点

- **入参：**

  - `{Data} props`
  - `{SetupContext} context`

  与 `this.$props` 类似，组合式 API 中的 `props` 对象将仅包含明确指定的参数。并且，所有声明了的参数，不管父组件是否向其传递了，都将出现在 `props` 对象中。可选且未被传递的参数值为 `undefined`。

  如果需要检测一个可选参数是否未被传递, 可以将其默认值设置为一个 Symbol：

  ```js
  const isAbsent = Symbol()
  export default {
    props: {
      foo: { default: isAbsent }
    },
    setup(props) {
      if (props.foo === isAbsent) {
        // foo was not provided.
      }
    }
  }
  ```

- **类型声明**：

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

  :::tip
  若要对传递给 `setup()` 的参数进行类型推断，你需要使用 [defineComponent](global-api.html#definecomponent)。
  :::

- **示例：**

  使用模板：

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

- **参考**：[组合式 API `setup`](../guide/composition-api-setup.html)

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

这些生命周期钩子注册函数只能在 [`setup()`](#setup) 期间同步使用，因为它们依赖于内部全局状态来定位当前活动实例 (此时正在调用其 `setup()` 的组件实例)。在没有当前活动实例的情况下调用它们将导致错误。

组件实例上下文也是在生命周期钩子的同步执行期间设置的，因此在生命周期钩子内同步创建的侦听器和计算属性也会在组件卸载时自动删除。

**选项 API 生命周期选项和组合式 API 之间的映射**

  - ~~`beforeCreate`~~ -> 使用 `setup()`
  - ~~`created`~~ -> 使用 `setup()`
  - `beforeMount` -> `onBeforeMount`
  - `mounted` -> `onMounted`
  - `beforeUpdate` -> `onBeforeUpdate`
  - `updated` -> `onUpdated`
  - `beforeUnmount` -> `onBeforeUnmount`
  - `unmounted` -> `onUnmounted`
  - `errorCaptured` -> `onErrorCaptured`
  - `renderTracked` -> `onRenderTracked`
  - `renderTriggered` -> `onRenderTriggered`
  - `activated` -> `onActivated`
  - `deactivated` -> `onDeactivated`

- **参考**：[组合式 API 生命周期钩子](../guide/composition-api-lifecycle-hooks.html)

## Provide / Inject

`provide` 和 `inject` 启用依赖注入。只有在使用当前活动实例的 [`setup()`](#setup) 期间才能调用这两者。

- **类型声明**：

  ```ts
  interface InjectionKey<T> extends Symbol {}

  function provide<T>(key: InjectionKey<T> | string, value: T): void

  // 没有默认值
  function inject<T>(key: InjectionKey<T> | string): T | undefined
  // 有默认值
  function inject<T>(key: InjectionKey<T> | string, defaultValue: T): T
  // 有工厂函数
  function inject<T>(
    key: InjectionKey<T> | string,
    defaultValue: () => T,
    treatDefaultAsFactory: true
  ): T
  ```

  Vue 提供了一个 `InjectionKey` 接口，该接口是扩展 `Symbol` 的泛型类型。它可用于在提供者和消费者之间同步 inject 值的类型：

  ```ts
  import { InjectionKey, provide, inject } from 'vue'

  const key: InjectionKey<string> = Symbol()

  provide(key, 'foo') // 提供非字符串值将导致错误

  const foo = inject(key) // foo 的类型: string | undefined
  ```

  如果使用字符串 key 或非类型化 symbols，则需要显式声明 inject 值的类型：

  ```ts
  const foo = inject<string>('foo') // string | undefined
  ```

- **参考**：
  - [Provide / Inject](../guide/component-provide-inject.html)
  - [组合式 API Provide / Inject](../guide/composition-api-provide-inject.html)

## `getCurrentInstance`

`getCurrentInstance` 支持访问内部组件实例。

:::warning
`getCurrentInstance` 只会暴露给高阶用户，通常是库作者。对 `getCurrentInstance` 的使用在应用代码里是非常不鼓励的。请**不要**把它在组合式 API 中作为获得等同于 `this` 的退路来使用。
:::

```ts
import { getCurrentInstance } from 'vue'

const MyComponent = {
  setup() {
    const internalInstance = getCurrentInstance()

    internalInstance.appContext.config.globalProperties // 访问 globalProperties
  }
}
```

`getCurrentInstance` **只能**在 [setup](#setup) 或[生命周期钩子](#生命周期钩子)中调用。

> 如需在 [setup](#setup) 或[生命周期钩子](#生命周期钩子)外使用，请先在 `setup` 中调用 `getCurrentInstance()` 获取该实例然后再使用。

```ts
const MyComponent = {
  setup() {
    const internalInstance = getCurrentInstance() // works

    const id = useComponentId() // works

    const handleClick = () => {
      getCurrentInstance() // doesn't work
      useComponentId() // doesn't work

      internalInstance // works
    }

    onMounted(() => {
      getCurrentInstance() // works
    })

    return () =>
      h(
        'button',
        {
          onClick: handleClick
        },
        `uid: ${id}`
      )
  }
}

// 在组合式函数中调用也可以正常执行
function useComponentId() {
  return getCurrentInstance().uid
}
```
