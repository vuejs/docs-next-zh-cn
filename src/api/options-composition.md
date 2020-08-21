# 组合

## mixins

- **类型：**`Array<Object>`

- **详细：**

  `mixins` 选项接收一个混入对象的数组。这些混入对象可以像正常的实例对象一样包含实例选项，这些选项将会被合并到最终的选项中，使用特定的选项合并逻辑。例如，如果 mixin 包含一个 `created` 钩子，而创建组件本身也有一个，那么两个函数都会被调用。

  Mixin 钩子按照传入顺序依次调用，并在调用组件自身的钩子之前被调用。

- **示例：**

  ```js
  const mixin = {
    created: function() {
      console.log(1)
    }
  }

  Vue.createApp({
    created() {
      console.log(2)
    },
    mixins: [mixin]
  })

  // => 1
  // => 2
  ```

-  **参考** [Mixins](../guide/mixins.html)

## extends

- **类型：**`Object | Function`

- **详细：**

  允许声明扩展另一个组件 (可以是一个简单的选项对象或构造函数)。这主要是为了便于扩展单文件组件。

  这和 `mixins` 类似。

- **示例：**

  ```js
  const CompA = { ... }

  // 在没有调用 `Vue.extend` 时候继承 CompA
  const CompB = {
    extends: CompA,
    ...
  }
  ```

## provide / inject

- **类型：**

  - **provide：**`Object | () => Object`
  - **inject：**`Array<string> | { [key: string]: string | Symbol | Object }`

- **详细：**

  这对选项需要一起使用，以允许一个祖先组件向其所有子孙后代注入一个依赖，不论组件层次有多深，并在起上下游关系成立的时间里始终生效。如果你熟悉 React，这与 React 的 `context` 特性很相似。

  `provide` 选项应该是一个对象或返回一个对象的函数。该对象包含可注入其子孙的 property。在该对象中你可以使用 ES2015 Symbols 作为 key，但是只在原生支持 `Symbol` 和 `Reflect.ownKeys` 的环境下可工作。

  `inject` 选项应该是：

  - 一个字符串数组，或
  - 一个对象，对象的 key 是本地的绑定名，value 是：
    - 在可用的注入内容中搜索用的 key (字符串或 Symbol)，或
    - 一个对象，该对象的：
      - `from` property 是在可用的注入内容中搜索用的 key (字符串或 Symbol)
      - `default` property 是降级情况下使用的 value

  > 提示：提示：`provide` 和 `inject` 绑定并不是可响应的。这是刻意为之的。然而，如果你传入了一个可监听的对象，那么其对象的 property 还是可响应的。

- **示例：**

  ```js
  // 父级组件提供 'foo'
  const Provider = {
    provide: {
      foo: 'bar'
    }
    // ...
  }

  // 子组件注入 'foo'
  const Child = {
    inject: ['foo'],
    created() {
      console.log(this.foo) // => "bar"
    }
    // ...
  }
  ```

  利用 ES2015 Symbols、函数 `provide` 和对象 `inject`：
  
  ```js
  const s = Symbol()

  const Provider = {
    provide() {
      return {
        [s]: 'foo'
      }
    }
  }

  const Child = {
    inject: { s }
    // ...
  }
  ```

  使用一个注入的值作为一个 property 的默认值：

  ```js
  const Child = {
    inject: ['foo'],
    props: {
      bar: {
        default() {
          return this.foo
        }
      }
    }
  }
  ```

  使用一个注入的值作为数据入口：

  ```js
  const Child = {
    inject: ['foo'],
    data() {
      return {
        bar: this.foo
      }
    }
  }
  ```

  注入可以通过设置默认值使其变成可选项：

  ```js
  const Child = {
    inject: {
      foo: { default: 'foo' }
    }
  }
  ```

  如果它需要从一个不同名字的 property 注入，则使用 `from` 来表示其源 property：

  ```js
  const Child = {
    inject: {
      foo: {
        from: 'bar',
        default: 'foo'
      }
    }
  }
  ```

  与 prop 的默认值类似，你需要对非原始值使用一个工厂方法：

  ```js
  const Child = {
    inject: {
      foo: {
        from: 'bar',
        default: () => [1, 2, 3]
      }
    }
  }
  ```

-  **参考** [Provide / Inject](../guide/component-provide-inject.html)

## setup

- **类型：**`Function`

`setup` 函数是一个新的组件选项。它作为在组件内部使用组合 API 的入口点。

- **调用时间**

  在创建组件实例时，在初始 prop 解析之后立即调用 `setup`。在生命周期方面，它是在 [beforeCreate](./options-lifecycle-hooks.html#beforecreate) 钩子之前调用的。

- **模板使用**

  如果 `setup` 返回一个对象，则该对象的属性将合并到组件模板的渲染上下文中：

  ```html
  <template>
    <div>{{ count }} {{ object.foo }}</div>
  </template>

  <script>
    import { ref, reactive } from 'vue'

    export default {
      setup() {
        const count = ref(0)
        const object = reactive({ foo: 'bar' })

        // 暴露到template中
        return {
          count,
          object
        }
      }
    }
  </script>
  ```

  请注意，从 `setup` 返回的 [refs](refs-api.html#ref) 在模板中访问时会自动展开，因此模板中不需要 `.value`。

- **渲染函数/JSX 的方法**

  `setup` 还可以返回一个 render 函数，该函数可以直接使用在同一作用域中声明的反应状态：

  ```js
  import { h, ref, reactive } from 'vue'

  export default {
    setup() {
      const count = ref(0)
      const object = reactive({ foo: 'bar' })

      return () => h('div', [count.value, object.foo])
    }
  }
  ```

- **参数**

  该函数将接收到的 prop 作为其第一个参数：

  ```js
  export default {
    props: {
      name: String
    },
    setup(props) {
      console.log(props.name)
    }
  }
  ```

  请注意，此 `props` 对象是响应式的——即在传入新的 props 时会对其进行更新，并且可以通过使用 `watchEffect` 或 `watch` 进行观测和响应：

  ```js
  export default {
    props: {
      name: String
    },
    setup(props) {
      watchEffect(() => {
        console.log(`name is: ` + props.name)
      })
    }
  }
  ```

  但是，请不要破坏 `props` 对象，因为它会失去响应式：

  ```js
  export default {
    props: {
      name: String
    },
    setup({ name }) {
      watchEffect(() => {
        console.log(`name is: ` + name) // 没有响应式
      })
    }
  }
  ```

  `props` 对象在开发过程中对于用户区代码是不可变的 (如果用户代码尝试对其进行更改，则会发出警告)。

  第二个参数提供了一个上下文对象，该对象暴露了以前在 `this` 上暴露的 property 的选择列表：

  ```js
  const MyComponent = {
    setup(props, context) {
      context.attrs
      context.slots
      context.emit
    }
  }
  ```

  `attrs` 和 `slots` 是内部组件实例上相应值的代理。这样可以确保它们即使在更新后也始终会显示最新值，以便我们可以对它们进行结构分解，而不必担心访问老的引用：

  ```js
  const MyComponent = {
    setup(props, { attrs }) {
      // 稍后可能会调用的函数
      function onClick() {
        console.log(attrs.foo) // 保证是最新引用
      }
    }
  }
  ```
  
  有很多理由将 `props` 作为单独的第一个参数而不是将其包含在上下文中：

  - 组件使用 `props` 比其他 property 更常见，并且很多情况下组件仅使用 `props`。

  - 将 `props` 作为单独的参数可以使单独键入更容易，而不会弄乱上下文中其他 property 的类型。这也使得在具有 TSX 支持的 `setup`、`render` 和普通功能组件之间保持一致的签名成为可能。

-  **参考** [Composition API](composition-api.html)
