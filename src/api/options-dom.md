# DOM

## template

- **类型：**`string`

- **详细：**

  一个字符串模板，用作 component 实例的标记。模板将会**替换**所挂载元素的 `innerHTML`。挂载元素的任何现有标记都将被忽略，除非模板中存在通过插槽分发的内容。

  如果字符串以 `#` 开始，则它将被用作 `querySelector`，并使用匹配元素的 innerHTML 作为模板字符串。这允许使用常见的 `<script type="x-template">` 技巧来包含模板。

  :::tip 注意
  出于安全考虑，你应该只使用你信任的 Vue 模板。永远不要使用用户生成的内容作为你的模板。
  :::

  :::tip 注意
  如果 Vue 选项中包含渲染函数，模板将被忽略。
  :::

-  **参考**
  - [生命周期图示](../guide/instance.html#生命周期图示)
  - [通过插槽分发内容](../guide/component-basics.html#通过插槽分发内容)

## render

- **类型：**`Function`

- **详细：**

  字符串模板之外的另一种选择，允许你充分利用 JavaScript 的编程功能。

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
  `render` 函数的优先级高于根据 `template` 选项或挂载元素的 DOM 内 HTML 模板编译的渲染函数。
  :::

-  **参考** [渲染函数](../guide/render-function.html)
