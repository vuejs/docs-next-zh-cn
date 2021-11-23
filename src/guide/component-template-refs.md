# 模板引用

> 该页面假设你已经阅读过了[组件基础](component-basics.md)。如果你对组件还不太了解，推荐你先阅读它。

尽管存在 prop 和事件，但有时你可能仍然需要在 JavaScript 中直接访问子组件。为此，可以使用 `ref` attribute 为子组件或 HTML 元素指定引用 ID。例如：

```html
<input ref="input" />
```

例如，你希望在组件挂载时，以编程的方式 focus 到这个 input 上，这可能有用：

```js
const app = Vue.createApp({})

app.component('base-input', {
  template: `
    <input ref="input" />
  `,
  methods: {
    focusInput() {
      this.$refs.input.focus()
    }
  },
  mounted() {
    this.focusInput()
  }
})
```

此外，还可以向组件本身添加另一个 `ref`，并使用它从父组件触发 `focusInput` 事件：

```html
<base-input ref="usernameInput"></base-input>
```

```js
this.$refs.usernameInput.focusInput()
```

:::warning
`$refs` 只会在组件渲染完成之后生效。这仅作为一个用于直接操作子元素的“逃生舱”——你应该避免在模板或计算属性中访问 `$refs`。
:::

**参考**：[在组合式 API 中使用模板引用](/guide/composition-api-template-refs.html#模板引用)
