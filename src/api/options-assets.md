# 选项/资源

## directives

- **类型：**`Object`

- **详细：**

  包含组件实例可用指令的哈希表。

- **用法：**
  ```js
  const app = createApp({})

  app.component('focused-input', {
    directives: {
      focus: {
        mounted(el) {
          el.focus()
        }
      }
    },
    template: `<input v-focus>`
  })
  ```

-  **参考**[自定义指令](../guide/custom-directive.html)

## components

- **类型：**`Object`

- **详细：** 

  包含组件实例可用组件的哈希表。

- **用法：**
  ```js
  const Foo = {
    template: `<div>Foo</div>`
  }

  const app = createApp({
    components: {
      Foo
    },
    template: `<Foo />`
  })
  ```

-  **参考** [Components](../guide/component-basics.html)
