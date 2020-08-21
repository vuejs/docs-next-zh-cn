# 实例方法

## \$watch

- **参数：**

  - `{string | Function} source`
  - `{Function | Object} callback`
  - `{Object} [options]`
    - `{boolean} deep`
    - `{boolean} immediate`

- **返回：** `{Function} unwatch`

- **用法：**

  帧听组件实例上的响应式 property 或函数计算结果的变化。回调函数得到的参数为新值和旧值。我们只能将顶层的 `data`、 `prop` 或 `computed` property名作为字符串传递。对于更复杂的表达式，用一个函数取代。

- **示例：**

  ```js
  const app = Vue.createApp({
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

  当帧听的值是一个对象或者数组时，对其属性或元素的任何更改都不会触发侦听器，因为它们引用相同的对象/数组：

  ```js
  const app = Vue.createApp({
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

  `$watch` 返回一个取消帧听函数，用来停止触发回调：

  ```js
  const app = Vue.createApp({
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

- **选项: deep**

  为了发现对象内部值的变化，可以在选项参数中指定 `deep: true`。注意监听数组的变更不需要这么做。

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

  注意，在带有 `immediate` 选项时，你不能在第一次回调时取消帧听给定的 property。

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
  const unwatch = vm.$watch(
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

-  **参考** [Watchers](../guide/computed.html#watchers)

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
  const app = Vue.createApp({
    methods: {
      sayHi() {
        console.log('Hi!')
      }
    }
  })

  app.component('welcome-button', {
    template: `
      <button v-on:click="$emit('welcome')">
        Click me to be welcomed
      </button>
    `
  })

  app.mount('#emit-example-simple')
  ```

  配合额外的参数使用 `$emit` ：

  ```html
  <div id="emit-example-argument">
    <advice-component v-on:give-advice="showAdvice"></advice-component>
  </div>
  ```

  ```js
  const app = Vue.createApp({
    methods: {
      showAdvice(advice) {
        alert(advice)
      }
    }
  })

  app.component('advice-component', {
    data() {
      return {
        adviceText: 'Some advice'
      }
    },
    template: `
      <div>
        <input type="text" v-model="adviceText">
        <button v-on:click="$emit('give-advice', adviceText)">
          Click me for sending advice
        </button>
      </div>
    `
  })
  ```

-  **参考**
  - [`emits` 选项](./options-data.html#emits)
  - [事件抛出一个值](../guide/component-basics.html#emitting-a-value-with-an-event)

## $forceUpdate

- **用法：**

  迫使组件实例重新渲染。注意它仅仅影响实例本身和插入插槽内容的子组件，而不是所有子组件。

## $nextTick

- **参数：**

  - `{Function} [callback]`

- **用法：**

  将回调延迟到下次 DOM 更新循环之后执行。在修改数据之后立即使用它，然后等待 DOM 更新。它跟全局方法 `nextTick` 一样，不同的是回调的 `this` 自动绑定到调用它的实例上。

- **示例：**

  ```js
  Vue.createApp({
    // ...
    methods: {
      // ...
      example() {
        // modify data
        this.message = 'changed'
        // DOM is not updated yet
        this.$nextTick(function() {
          // DOM is now updated
          // `this` is bound to the current instance
          this.doSomethingElse()
        })
      }
    }
  })
  ```

-  **参考** [nextTick](global-api.html#nexttick)
