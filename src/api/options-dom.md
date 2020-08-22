# DOM

## template

- **类型：**`string`

- **详细：**

  一个字符串模板作为 component 实例的标识使用。模板将会**替换**挂载的元素。挂载元素的内容都将被忽略，除非模板的内容有分发插槽。

  如果值以 `#` 开始，则它将被用作 `querySelector`，并使用匹配元素的 innerHTML 作为模板。常用的技巧是用 `<script type="x-template">` 包含模板。

  :::tip 注意
  出于安全考虑，你应该只使用你信任的 Vue 模板。避免使用其他人生成的内容作为你的模板。
  :::

  :::tip 注意
  如果 Vue 选项中包含渲染函数，该模板将被忽略。
  :::

-  **参考**
  - [生命周期图示](../guide/instance.html#lifecycle-diagram)
  - [通过插槽分发内容](../guide/component-basics.html#content-distribution-with-slots)

## render

- **类型：**`Function`

- **详细：**

  字符串模板的另一种选择，允许你充分利用 JavaScript 的编程功能。

- **用法：**

  ```html
  <div id="app" class="demo">
    <my-title blog-title="A Perfect Vue"></my-title>
  </div>
  ```

  ```js
  const app = Vue.createApp({})

  app.component('my-title', {
    render() {
      return Vue.h(
        'h1',           // 标签名称
        this.blogTitle  // 标签内容
      )
    },
    props: {
      blogTitle: {
        type: String,
        required: true
      }
    }
  })

  app.mount('#app')
  ```

  :::tip 注意
  `render` 函数的优先级高于从挂载元素 `template` 选项或内置 DOM 提取出的 HTML 模板编译渲染函数。
  :::

-  **参考** [Render Functions](../guide/render-function.html)
