# 生命周期钩子

:::tip 注意
所有的生命周期钩子自动绑定 `this` 上下文到实例中，因此你可以访问数据，对 property 和方法进行运算。这意味着 **你不能使用箭头函数来定义一个生命周期方法** (例如 `created: () => this.fetchTodos()`) 。这是因为箭头函数绑定了父上下文，因此 `this` 与你期待的组件实例不同， `this.fetchTodos` 的行为未定义。
:::

## beforeCreate

- **类型：** `Function`

- **详细：**

  在实例初始化之后，数据观测 (data observer) 和 event/watcher 事件配置之前被调用。

-  **参考** [生命周期图示](../guide/instance.html#lifecycle-diagram)

## created

- **类型：** `Function`

- **详细：**

  在实例创建完成后被立即调用。在这一步，实例已完成以下的配置：数据观测 (data observer)，property 和方法的运算，watch/event 事件回调。然而，挂载阶段还没开始，`$el` property 目前尚不可用。

-  **参考** [生命周期图示](../guide/instance.html#lifecycle-diagram)

## beforeMount

- **类型：** `Function`

- **详细：**

  在挂载开始之前被调用：相关的 `render` 函数首次被调用。

  **该钩子在服务器端渲染期间不被调用。**

-  **参考** [生命周期图示](../guide/instance.html#lifecycle-diagram)

## mounted

- **类型：** `Function`

- **详细：**

  实例被挂载后调用，这时 `Vue.createApp({}).mount()` 被新创建的 `vm.$el` 替换了。如果根实例挂载到了一个文档内的元素上，当 mounted 被调用时 `vm.$el` 也在文档内。

  注意 `mounted` 不会保证所有的子组件也都一起被挂载。如果你希望等到整个视图都渲染完毕，可以在 `mounted` 内部使用 [vm.\$nextTick](../api/instance-methods.html#nexttick)：

  ```js
  mounted() {
    this.$nextTick(function () {
      // 仅在渲染整个视图之后运行的代码
    })
  }
  ```

  **该钩子在服务器端渲染期间不被调用。**

-  **参考** [生命周期图示](../guide/instance.html#lifecycle-diagram)

## beforeUpdate

- **类型：** `Function`

- **详细：**

  数据更新时调用，发生在虚拟 DOM 打补丁之前。这里适合在更新之前访问现有的 DOM，比如手动移除已添加的事件监听器。

  **该钩子在服务器端渲染期间不被调用，因为只有初次渲染会在服务端进行。**

-  **参考** [生命周期图示](../guide/instance.html#lifecycle-diagram)

## updated

- **类型：** `Function`

- **详细：**

  由于数据更改导致的虚拟 DOM 重新渲染和打补丁，在这之后会调用该钩子。

  当这个钩子被调用时，组件 DOM 已经更新，所以你现在可以执行依赖于 DOM 的操作。然而在大多数情况下，你应该避免在此期间更改状态。如果要相应状态改变，通常最好使用[计算属性](./options-data.html#computed) 或 [watcher](./options-data.html#watch) 取而代之。

  注意， `updated` **不会**保证所有的子组件也都一起被重绘。如果你希望等到整个视图都重绘完毕，可以在 `updated` 里使用 [vm.\$nextTick](../api/instance-methods.html#nexttick)：

  ```js
  updated() {
    this.$nextTick(function () {
      // 仅在渲染整个视图之后运行的代码
    })
  }
  ```

  **该钩子在服务器端渲染期间不被调用。**

-  **参考** [生命周期图示](../guide/instance.html#lifecycle-diagram)

## activated

- **类型：** `Function`

- **详细：**

  被 keep-alive 缓存的组件激活时调用。

  **该钩子在服务器端渲染期间不被调用。**

-  **参考**
  - [动态组件 - keep-alive](../guide/component-basics.html#keep-alive)

## deactivated

- **类型：** `Function`

- **详细：**

  被 keep-alive 缓存的组件停用时调用。

  **该钩子在服务器端渲染期间不被调用。**

-  **参考**
  - [动态组件 - keep-alive](../guide/component-basics.html#keep-alive)

## beforeUnmount

- **类型：** `Function`

- **详细：**

  在卸载组件实例之前调用。在这个阶段，实例仍然是完全正常的。

  **该钩子在服务器端渲染期间不被调用。**

-  **参考** [生命周期图示](../guide/instance.html#lifecycle-diagram)

## unmounted

- **类型：** `Function`

- **详细：**

  卸载组件实例后调用。调用此钩子时，组件实例的所有指令都被解除绑定，所有事件侦听器都被移除，所有子组件实例被卸载。

  **该钩子在服务器端渲染期间不被调用。**

-  **参考** [生命周期图示](../guide/instance.html#lifecycle-diagram)

## errorCaptured

- **类型：** `(err: Error, instance: Component, info: string) => ?boolean`

- **详细：**

  当捕获一个来自子孙组件的错误时被调用。此钩子会收到三个参数：错误对象、发生错误的组件实例以及一个包含错误来源信息的字符串。此钩子可以返回 `false` 以阻止该错误继续向上传播。

  :::tip
  你可以在此钩子中修改组件的状态。因此在捕获错误时，在模板或渲染函数中有一个条件判断来绕过其它内容就很重要；不然该组件可能会进入一个无限的渲染循环。
  :::

  **错误传播规则**

  - 默认情况下，如果全局的 `config.errorHandler` 被定义，所有的错误仍会发送它，因此这些错误仍然会向单一的分析服务的地方进行汇报。
  
  - 如果一个组件的继承或父级从属链路中存在多个 `errorCaptured` 钩子，则它们将会被相同的错误逐个唤起。

  - 如果此 `errorCaptured` 钩子自身抛出了一个错误，则这个新错误和原本被捕获的错误都会发送给全局的 `config.errorHandler`。

  - 一个 `errorCaptured` 钩子能够返回 `false` 以阻止错误继续向上传播。本质上是说“这个错误已经被搞定了且应该被忽略”。它会阻止其它任何会被这个错误唤起的 `errorCaptured` 钩子和全局的 `config.errorHandler`。

## renderTracked

- **类型：** `(e: DebuggerEvent) => void`

- **详细：**

  跟踪虚拟DOM重新渲染时调用。钩子接收 `debugger event` 作为参数。此事件告诉你哪个操作跟踪了组件以及该操作的目标对象和键。

- **用法：**

  ```html
  <div id="app">
    <button v-on:click="addToCart">Add to cart</button>
    <p>Cart({{ cart }})</p>
  </div>
  ```

  ```js
  const app = Vue.createApp({
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

- **类型：** `(e: DebuggerEvent) => void`

- **详细：**

  当虚拟DOM重新渲染为triggered.Similarly为[`renderTracked`](#rendertracked)，接收 `debugger event` 作为参数。此事件告诉你是什么操作触发了重新渲染，以及该操作的目标对象和键。

- **用法：**

  ```html
  <div id="app">
    <button v-on:click="addToCart">Add to cart</button>
    <p>Cart({{ cart }})</p>
  </div>
  ```

  ```js
  const app = Vue.createApp({
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
        /* 这将导致renderTriggered调用
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
