# 生命周期钩子

:::tip 注意
所有生命周期钩子的 `this` 上下文将自动绑定至实例中，因此你可以访问 data、computed 和 methods。这意味着**你不应该使用箭头函数来定义一个生命周期方法** (例如 `created: () => this.fetchTodos()`) 。因为箭头函数绑定了父级上下文，所以 `this` 不会指向预期的组件实例，并且`this.fetchTodos` 将会是 undefined。
:::

## beforeCreate

- **类型：**`Function`

- **详细：**

  在实例初始化之后，data observation (数据观测) 和 event/watcher (事件/侦听器) 配置之前被立即同步调用。

-  **参考：**[生命周期图示](../guide/instance.html#生命周期图示)

## created

- **类型：**`Function`

- **详细：**

  在实例创建完成后被立即同步调用。在这一步中，实例已完成对选项的处理，意味着以下内容已被配置完毕：data observation (数据观测)，computed property (计算属性)，methods，event/watcher (事件/侦听器) 的回调函数。然而，挂载阶段还没开始，且 `$el` property 目前尚不可用。

-  **参考：**[生命周期图示](../guide/instance.html#生命周期图示)

## beforeMount

- **类型：**`Function`

- **详细：**

  在挂载开始之前被调用：相关的 `render` 函数首次被调用。

  **该钩子在服务器端渲染期间不被调用。**

-  **参考：**[生命周期图示](../guide/instance.html#生命周期图示)

## mounted

- **类型：**`Function`

- **详细：**

  在实例挂载完成后被调用，这时候传递给 [`app.mount`](/api/application-api.html#mount) 的元素已经被新创建的 `vm.$el` 替换了。如果根实例被挂载到了一个文档内的元素上，当 `mounted` 被调用时， `vm.$el` 也会在文档内。
  注意 `mounted` **不会**保证所有的子组件也都被挂载完成。如果你希望等到整个视图都渲染完毕再执行某些操作，可以在 `mounted` 内部使用 [vm.$nextTick](../api/instance-methods.html#nexttick)：

  ```js
  mounted() {
    this.$nextTick(function () {
      // 仅在整个视图都被渲染之后才会运行的代码
    })
  }
  ```

  **该钩子在服务器端渲染期间不被调用。**

-  **参考：**[生命周期图示](../guide/instance.html#生命周期图示)

## beforeUpdate

- **类型：**`Function`

- **详细：**

  在数据发生改变后，DOM 被更新之前被调用。这里适合在现有 DOM 将要被更新之前访问它，比如移除手动添加的事件监听器。

  **该钩子在服务器端渲染期间不被调用，因为只有初次渲染会在服务器端进行。**

-  **参考：**[生命周期图示](../guide/instance.html#生命周期图示)

## updated

- **类型：**`Function`

- **详细：**

  在数据更改导致的虚拟 DOM 重新渲染和更新完毕之后被调用。

  当这个钩子被调用时，组件 DOM 已经更新，所以你现在可以执行依赖于 DOM 的操作。然而在大多数情况下，你应该避免在此期间更改状态。如果要相应状态改变，通常最好使用[计算属性](./options-data.html#computed)或[侦听器](./options-data.html#watch)取而代之。

  注意，`updated` **不会**保证所有的子组件也都被重新渲染完毕。如果你希望等待整个视图都渲染完毕，可以在 `updated` 内部使用 [vm.$nextTick](../api/instance-methods.html#nexttick)：

  ```js
  updated() {
    this.$nextTick(function () {
      // 仅在整个视图都被重新渲染完毕之后才会运行的代码
    })
  }
  ```

  **该钩子在服务器端渲染期间不被调用。**

-  **参考：**[生命周期图示](../guide/instance.html#生命周期图示)

## activated

- **类型：**`Function`

- **详细：**

  被 keep-alive 缓存的组件激活时调用。

  **该钩子在服务器端渲染期间不被调用。**

-  **参考：**
  - [动态组件 - keep-alive](../guide/component-dynamic-async.html#在动态组件上使用-keep-alive)

## deactivated

- **类型：**`Function`

- **详细：**

  被 keep-alive 缓存的组件失活时调用。

  **该钩子在服务器端渲染期间不被调用。**

-  **参考：**
  - [动态组件 - keep-alive](../guide/component-dynamic-async.html#在动态组件上使用-keep-alive)

## beforeUnmount

- **类型：**`Function`

- **详细：**

  在卸载组件实例之前调用。在这个阶段，实例仍然是完全正常的。

  **该钩子在服务器端渲染期间不被调用。**

-  **参考：**[生命周期图示](../guide/instance.html#生命周期图示)

## unmounted

- **类型：**`Function`

- **详细：**

  卸载组件实例后调用。调用此钩子时，组件实例的所有指令都被解除绑定，所有事件侦听器都被移除，所有子组件实例被卸载。

  **该钩子在服务器端渲染期间不被调用。**

-  **参考：**[生命周期图示](../guide/instance.html#生命周期图示)

## errorCaptured

- **类型：**`(err: Error, instance: Component, info: string) => ?boolean`

- **详细：**

  在捕获一个来自后代组件的错误时被调用。此钩子会收到三个参数：错误对象、发生错误的组件实例以及一个包含错误来源信息的字符串。此钩子可以返回 `false` 以阻止该错误继续向上传播。

  :::tip
  你可以在此钩子中修改组件的状态。因此在捕获错误时，在模板或渲染函数中有一个条件判断来绕过其它内容就很重要；不然该组件可能会进入一个无限的渲染循环。
  :::

  **错误传播规则**

  - 默认情况下，如果全局的 `config.errorHandler` 被定义，所有的错误仍会发送它，因此这些错误仍然会向单一的分析服务的地方进行汇报。
  
  - 如果一个组件的 inheritance chain (继承链)或 parent chain (父链)中存在多个 `errorCaptured` 钩子，则它们将会被相同的错误逐个唤起。

  - 如果此 `errorCaptured` 钩子自身抛出了一个错误，则这个新错误和原本被捕获的错误都会发送给全局的 `config.errorHandler`。

  - 一个 `errorCaptured` 钩子能够返回 `false` 以阻止错误继续向上传播。本质上是说“这个错误已经被搞定了且应该被忽略”。它会阻止其它任何会被这个错误唤起的 `errorCaptured` 钩子和全局的 `config.errorHandler`。

## renderTracked

- **类型：**`(e: DebuggerEvent) => void`

- **详细：**

  跟踪虚拟 DOM 重新渲染时调用。钩子接收 `debugger event` 作为参数。此事件告诉你哪个操作跟踪了组件以及该操作的目标对象和键。

- **用法：**

  ```html
  <div id="app">
    <button v-on:click="addToCart">Add to cart</button>
    <p>Cart({{ cart }})</p>
  </div>
  ```

  ```js
  const app = createApp({
    data() {
      return {
        cart: 0
      }
    },
    renderTracked({ key, target, type }) {
      console.log({ key, target, type })
      /* 当组件第一次渲染时，这将被记录下来:
      {
        key: "cart",
        target: {
          cart: 0
        },
        type: "get"
      }
      */
    },
    methods: {
      addToCart() {
        this.cart += 1
      }
    }
  })

  app.mount('#app')
  ```

## renderTriggered

- **类型：**`(e: DebuggerEvent) => void`

- **详细：**

  当虚拟 DOM 重新渲染被触发时调用。和 [`renderTracked`](#rendertracked) 类似，接收 `debugger event` 作为参数。此事件告诉你是什么操作触发了重新渲染，以及该操作的目标对象和键。

- **用法：**

  ```html
  <div id="app">
    <button v-on:click="addToCart">Add to cart</button>
    <p>Cart({{ cart }})</p>
  </div>
  ```

  ```js
  const app = createApp({
    data() {
      return {
        cart: 0
      }
    },
    renderTriggered({ key, target, type }) {
      console.log({ key, target, type })
    },
    methods: {
      addToCart() {
        this.cart += 1
        /* 这将导致 renderTriggered 被调用
          {
            key: "cart",
            target: {
              cart: 1
            },
            type: "set"
          }
        */
      }
    }
  })

  app.mount('#app')
  ```
