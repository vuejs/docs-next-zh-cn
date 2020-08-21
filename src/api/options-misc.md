# 其他

## name

- **类型：** `string`

- **限制：** 只有作为组件选项时起作用。

- **详细：**

  允许组件模板递归地调用自身。注意，组件在全局用 `Vue.createApp({}).component({})` 注册时，全局 ID 自动作为组件的 name。

  指定 `name` 选项的另一个好处是便于调试。有名字的组件有更友好的警告信息。另外，当在有 [vue-devtools](https://github.com/vuejs/vue-devtools) ，未命名组件将显示成 `<AnonymousComponent>`，这很没有语义。通过提供 `name` 选项，可以获得更有语义信息的组件树。

## inheritAttrs

- **类型：** `boolean`

- **默认：** `true`

- **详细：**

  默认情况下父作用域的不被认作 props 的 attribute 绑定 (attribute bindings) 将会“回退”且作为普通的 HTML attribute 应用在子组件的根元素上。当撰写包裹一个目标元素或另一个组件的组件时，这可能不会总是符合预期行为。通过设置 `inheritAttrs` 到 `false` ，这些默认行为将会被去掉。而通过实例 property `$attrs` 可以让这些 attribute 生效，且可以通过 `v-bind` 显性的绑定到非根元素上。

  注意：这个选项**不**影响 `class` 和 `style` 绑定。

- **用法：**

  ```js
  app.component('base-input', {
    inheritAttrs: false,
    props: ['label', 'value'],
    template: `
      <label>
        {{ label }}
        <input
          v-bind="$attrs"
          v-bind:value="value"
          v-on:input="$emit('input', $event.target.value)"
        >
      </label>
    `
  })
  ```

-  **参考** [禁用Attribute继承](../guide/component-props.html#disabling-attribute-inheritance)
