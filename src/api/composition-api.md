# 组合式 API

> 本节例子中代码使用的[单文件组件](../guide/single-file-component.html)语法

## `setup`

一个组件选项，在组件被创建**之前**，`props` 被解析之后执行。它是组合式 API 的入口。

- **入参：**

  - `{Data} props`
  - `{SetupContext} context`

  与使用选项式 API 时的 `this.$props` 类似，该 `props` 对象将仅包含显性声明的 prop。并且，所有声明了的 prop，不管父组件是否向其传递了，都将出现在 `props` 对象中。其中未被传入的可选的 prop 的值会是 `undefined`。

  如果需要检测一个可选的 prop 是否未被传递，你可以将其默认值设置为一个 Symbol：

  ```js
  import { defineComponent } from 'vue'
  
  const isAbsent = Symbol()
  
  export default defineComponent({
    props: {
      foo: { default: isAbsent }
    },
    setup(props) {
      if (props.foo === isAbsent) {
        // foo 没有被传入。
      }
    }
  })
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
    expose: (exposed?: Record<string, any>) => void
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
    import { ref, reactive, defineComponent } from 'vue'

    export default defineComponent({
      setup() {
        const readersNumber = ref(0)
        const book = reactive({ title: 'Vue 3 Guide' })

        // 暴露给模板
        return {
          readersNumber,
          book
        }
      }
    })
  </script>
  ```

  使用渲染函数：

  ```js
  // MyBook.vue

  import { h, ref, reactive, defineComponent } from 'vue'

  export default defineComponent({
    setup() {
      const readersNumber = ref(0)
      const book = reactive({ title: 'Vue 3 Guide' })
      // 请注意，我们需要在这里显式地使用 ref 值
      return () => h('div', [readersNumber.value, book.title])
    }
  })
  ```

  如果返回了渲染函数，则不能再返回其他 property。如果需要将 property 暴露给外部访问，比如通过父组件的 `ref`，可以使用 `expose`：

  ```js
  // MyBook.vue

  import { h, defineComponent } from 'vue'

  export default defineComponent({
    setup(props, { expose }) {
      const reset = () => {
        // 某些重置逻辑
      }

      // expose 只能被调用一次。
      // 如果需要暴露多个 property，则它们
      // 必须全部包含在传递给 expose 的对象中。
      expose({
        reset
      })

      return () => h('div')
    }
  })
  ```

- **参考**：[组合式 API `setup`](../guide/composition-api-setup.html)

## 生命周期钩子

可以通过直接导入 `onX` 函数来注册生命周期钩子：

```js
import { onMounted, onUpdated, onUnmounted, defineComponent } from 'vue'

const MyComponent = defineComponent({
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
})
```

这些生命周期钩子注册函数只能在 [`setup()`](#setup) 期间同步使用，因为它们依赖于内部的全局状态来定位当前活动的实例 (此时正在调用其 `setup()` 的组件实例)。在没有当前活动实例的情况下，调用它们将会出错。

组件实例的上下文也是在生命周期钩子的同步执行期间设置的，因此，在生命周期钩子内同步创建的侦听器和计算属性也会在组件卸载时自动删除。

**选项式 API 的生命周期选项和组合式 API 之间的映射**

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

`provide` 和 `inject` 启用依赖注入。这两者只能在使用当前活动实例的 [`setup()`](#setup) 期间被调用。

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

  Vue 提供了一个 `InjectionKey` 接口，该接口是扩展了 `Symbol` 的泛型类型。它可用于在生产者和消费者之间同步 inject 值的类型：

  ```ts
  import { InjectionKey, provide, inject } from 'vue'

  const key: InjectionKey<string> = Symbol()

  provide(key, 'foo') // 若提供非字符串值将出错

  const foo = inject(key) // foo 的类型: string | undefined
  ```

  如果使用了字符串 key 或非类型化的 symbol，则需要显式声明 inject 值的类型：

  ```ts
  const foo = inject<string>('foo') // string | undefined
  ```

- **参考**：
  - [Provide / Inject](../guide/component-provide-inject.html)
  - [组合式 API Provide / Inject](../guide/composition-api-provide-inject.html)

## `getCurrentInstance`

`getCurrentInstance` 支持访问内部组件实例。

:::warning
`getCurrentInstance` 只暴露给高阶使用场景，典型的比如在库中。强烈反对在应用的代码中使用 `getCurrentInstance`。请**不要**把它当作在组合式 API 中获取 `this` 的替代方案来使用。
:::

```ts
import { getCurrentInstance, defineComponent } from 'vue'

const MyComponent = defineComponent({
  setup() {
    const internalInstance = getCurrentInstance()

    internalInstance.appContext.config.globalProperties // 访问 globalProperties
  }
})
```

`getCurrentInstance` **只能**在 [setup](#setup) 或[生命周期钩子](#生命周期钩子)中调用。

> 如需在 [setup](#setup) 或[生命周期钩子](#生命周期钩子)外使用，请先在 `setup` 中调用 `getCurrentInstance()` 获取该实例然后再使用。

```ts
const MyComponent = {
  setup() {
    const internalInstance = getCurrentInstance() // 有效

    const id = useComponentId() // 有效

    const handleClick = () => {
      getCurrentInstance() // 无效
      useComponentId() // 无效

      internalInstance // 有效
    }

    onMounted(() => {
      getCurrentInstance() // 有效
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
