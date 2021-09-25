# 实例方法

## $watch

- **参数：**

  - `{string | Function} source`
  - `{Function | Object} callback`
  - `{Object} [options]`
    - `{boolean} deep`
    - `{boolean} immediate`
    - `{string} flush`

- **返回：**`{Function} unwatch`

- **用法：**

  侦听组件实例上的响应式 property 或函数计算结果的变化。回调函数得到的参数为新值和旧值。我们只能将顶层的 `data`、`props` 或 `computed` property 名作为字符串传递。对于更复杂的表达式，用一个函数取代。

- **示例：**

  ```js
  const app = createApp({
    data() {
      return {
        a: 1,
        b: 2,
        c: {
          d: 3,
          e: 4
        }
      }
    },
    created() {
      // 顶层property 名
      this.$watch('a', (newVal, oldVal) => {
        // 做点什么
      })

      // 用于监视单个嵌套property 的函数
      this.$watch(
        () => this.c.d,
        (newVal, oldVal) => {
          // 做点什么
        }
      )

      // 用于监视复杂表达式的函数
      this.$watch(
        // 表达式 `this.a + this.b` 每次得出一个不同的结果时
        // 处理函数都会被调用。
        // 这就像监听一个未被定义的计算属性
        () => this.a + this.b,
        (newVal, oldVal) => {
          // 做点什么
        }
      )
    }
  })
  ```

  当侦听的值是一个对象或者数组时，对其属性或元素的任何更改都不会触发侦听器，因为它们引用相同的对象/数组：

  ```js
  const app = createApp({
    data() {
      return {
        article: {
          text: 'Vue is awesome!'
        },
        comments: ['Indeed!', 'I agree']
      }
    },
    created() {
      this.$watch('article', () => {
        console.log('Article changed!')
      })

      this.$watch('comments', () => {
        console.log('Comments changed!')
      })
    },
    methods: {
      // 这些方法不会触发侦听器，因为我们只更改了Object/Array的一个property，
      // 不是对象/数组本身
      changeArticleText() {
        this.article.text = 'Vue 3 is awesome'
      },
      addComment() {
        this.comments.push('New comment')
      },

      // 这些方法将触发侦听器，因为我们完全替换了对象/数组
      changeWholeArticle() {
        this.article = { text: 'Vue 3 is awesome' }
      },
      clearComments() {
        this.comments = []
      }
    }
  })
  ```

  `$watch` 返回一个取消侦听函数，用来停止触发回调：

  ```js
  const app = createApp({
    data() {
      return {
        a: 1
      }
    }
  })

  const vm = app.mount('#app')

  const unwatch = vm.$watch('a', cb)
  // later, teardown the watcher
  unwatch()
  ```

- **选项：deep**

  为了发现对象内部值的变化，可以在选项参数中指定 `deep: true`。这个选项同样适用于监听数组变更。
  
  > 注意：当变更（不是替换）对象或数组并使用 deep 选项时，旧值将与新值相同，因为它们的引用指向同一个对象/数组。Vue 不会保留变更之前值的副本。

  ```js
  vm.$watch('someObject', callback, {
    deep: true
  })
  vm.someObject.nestedValue = 123
  // callback is fired
  ```

- **选项：immediate**

  在选项参数中指定 `immediate: true` 将立即以表达式的当前值触发回调：

  ```js
  vm.$watch('a', callback, {
    immediate: true
  })
  // 立即以 `a` 的当前值触发 `callback`
  ```

  注意，在带有 `immediate` 选项时，你不能在第一次回调时取消侦听给定的 property。

  ```js
  // 这会导致报错
  const unwatch = vm.$watch(
    'value',
    function() {
      doSomething()
      unwatch()
    },
    { immediate: true }
  )
  ```

  如果你仍然希望在回调内部调用一个取消侦听的函数，你应该先检查其函数的可用性：

  ```js
  let unwatch = null

  unwatch = vm.$watch(
    'value',
    function() {
      doSomething()
      if (unwatch) {
        unwatch()
      }
    },
    { immediate: true }
  )
  ```

- **选项：flush**

  `flush` 选项可以更好地控制回调的时间。它可以设置为 `'pre'`、`'post'` 或 `'sync'`。
  
  默认值是 `'pre'`，指定的回调应该在渲染前被调用。它允许回调在模板运行前更新了其他值。
  
  `'post'` 值是可以用来将回调推迟到渲染之后的。如果回调需要通过 `$refs` 访问更新的 DOM 或子组件，那么则使用该值。

  如果 `flush` 被设置为 `'sync'`，一旦值发生了变化，回调将被同步调用。

  对于 `'pre'` 和 `'post'`，回调使用队列进行缓冲。回调只被添加到队列中一次，即使观察值变化了多次。值的中间变化将被跳过，不会传递给回调。
  
  缓冲回调不仅可以提高性能，还有助于保证数据的一致性。在执行数据更新的代码完成之前，侦听器不会被触发。
  
  `'sync'` 侦听器应少用，因为它们没有这些好处。

  更多关于 `flush` 的信息，请参阅[副作用刷新时机](../guide/reactivity-computed-watchers.html#副作用刷新时机)。

-  **参考** [Watchers](../guide/computed.html#侦听器)

## $emit

- **参数：**

  - `{string} eventName`
  - `[...args]`

  触发当前实例上的事件。附加参数都会传给监听器回调。

- **示例：**

  只配合一个事件名使用 $emit：

  ```html
  <div id="emit-example-simple">
    <welcome-button v-on:welcome="sayHi"></welcome-button>
  </div>
  ```

  ```js
  const app = createApp({
    methods: {
      sayHi() {
        console.log('Hi!')
      }
    }
  })

  app.component('welcome-button', {
    emits: ['welcome'],
    template: `
      <button v-on:click="$emit('welcome')">
        Click me to be welcomed
      </button>
    `
  })

  app.mount('#emit-example-simple')
  ```

  配合额外的参数使用 `$emit`：

  ```html
  <div id="emit-example-argument">
    <advice-component v-on:advise="showAdvice"></advice-component>
  </div>
  ```

  ```js
  const app = createApp({
    methods: {
      showAdvice(advice) {
        alert(advice)
      }
    }
  })

  app.component('advice-component', {
    emits: ['advise'],
    data() {
      return {
        adviceText: 'Some advice'
      }
    },
    template: `
      <div>
        <input type="text" v-model="adviceText">
        <button v-on:click="$emit('advise', adviceText)">
          Click me for sending advice
        </button>
      </div>
    `
  })

  app.mount('#emit-example-argument')
  ```

-  **参考**
  - [`emits` 选项](./options-data.html#emits)
  - [事件抛出一个值](../guide/component-basics.html#使用事件抛出一个值)

## $forceUpdate

- **用法：**

  在组合式API中,你可以通过 `getCurrentInstance().proxy.$foreUpdate()`去使用。
  
  迫使组件实例重新渲染。注意它仅仅影响实例本身和插入插槽内容的子组件，而不是所有子组件。

## $nextTick

- **参数：**

  - `{Function} [callback]`

- **用法：**

  将回调延迟到下次 DOM 更新循环之后执行。在修改数据之后立即使用它，然后等待 DOM 更新。它跟全局方法 `nextTick` 一样，不同的是回调的 `this` 自动绑定到调用它的实例上。

- **示例：**

  ```js
  createApp({
    // ...
    methods: {
      // ...
      example() {
        // 修改数据
        this.message = 'changed'
        // DOM 尚未更新
        this.$nextTick(function() {
          // DOM 现在更新了
          // `this` 被绑定到当前实例
          this.doSomethingElse()
        })
      }
    }
  })
  ```

-  **参考** [nextTick](global-api.html#nexttick)
