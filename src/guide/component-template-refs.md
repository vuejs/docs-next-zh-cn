# 模板引用

> 该页面假设你已经阅读过了[组件基础](component-basics.md)。如果你还对组件不太了解，推荐你先阅读它。

尽管存在 prop 和事件，但有时你可能仍然需要直接访问 JavaScript 中的子组件。为此，可以使用 `ref` attribute 为子组件或 HTML 元素指定引用 ID。例如：

```html
<input ref="input" />
```

例如，你希望以编程的方式 focus 这个 input 在组件上挂载，这可能有用


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

当 `ref` 与 `v-for` 一起使用时，你得到的 `ref` 将是一个数组，其中包含镜像数据源的子组件。

:::warning
`$refs` 只会在组件渲染完成之后生效。这仅作为一个用于直接操作子元素的“逃生舱”——你应该避免在模板或计算属性中访问 `$refs`。
:::

**参考**：[在组合式 API 中使用 template refs](/guide/composition-api-template-refs.html#template-refs)
