# 非 Prop 的 Attribute

> 该页面假设你已经阅读过了 [组件基础](component-basics.md) 。如果你还对组件不太了解，推荐你先阅读它。

一个非 prop 的 attribute 是指传向一个组件，但是该组件并没有相应 [props](component-props) 或 [emits](component-custom-events.html#defining-custom-events) 定义的 attribute。常见的示例包括 `class` 、`style` 和 `id` 属性。

## Attribute 继承

当组件返回单个根节点时，非prop attribute 将自动添加到根节点的 attribute 中。例如，在 date-picker 组件的实例中：

```js
app.component('date-picker', {
  template: `
    <div class="date-picker">
      <input type="datetime" />
    </div>
  `
})
```

如果我们需要通过`data status` property 定义 date-picker 组件的状态，它将应用于根节点（即 `div.date-picker`）。

```html
<!-- 具有非prop attribute的Date-picker组件-->
<date-picker data-status="activated"></date-picker>

<!-- 渲染 date-picker 组件 -->
<div class="date-picker" data-status="activated">
  <input type="datetime" />
</div>
```

同样的规则适用于事件监听器：

```html
<date-picker @change="submitChange"></date-picker>
```

```js
app.component('date-picker', {
  created() {
    console.log(this.$attrs) // { onChange: () => {}  }
  }
})
```

当有一个HTML元素将 `change` 事件作为 `date picker` 的根元素时，这可能会有帮助。

```js
app.component('date-picker', {
  template: `
    <select>
      <option value="1">Yesterday</option>
      <option value="2">Today</option>
      <option value="3">Tomorrow</option>
    </select>
  `
})
```

在这种情况下，`change` 事件监听器从父组件传递到子组件，它将在原生`select`的`change`事件上触发。我们不需要显式地从 `date-picker` 发出事件：

```html
<div id="date-picker" class="demo">
  <date-picker @change="showChange"></date-picker>
</div>
```

```js
const app = Vue.createApp({
  methods: {
    showChange(event) {
      console.log(event.target.value) // 将记录所选选项的值
    }
  }
})
```

## Disabling Attribute Inheritance

如果你 **不** 希望组件的根元素继承 attribute，你可以在组件的选项中设置 `inheritAttrs: false`。例如：

禁用 attribute 继承的常见情况是需要将 attribute 应用于根节点之外的其他元素。

通过将 `inheritAttrs` 选项设置为 `false`，你可以访问组件的 `$attrs` property，该property包括组件 `props`和 `emits` property 中未包含的所有属性（例如，`class`、`style`、`v-on` 监听器等）。

使用 [previous section](#attribute-inheritance) 中的 date-picker 组件示例，如果需要将所有非prop attribute 应用于 `input` 元素而不是根 `div` 元素，则可以使用 `v-bind` 缩写来完成。

```js{5}
app.component('date-picker', {
  inheritAttrs: false,
  template: `
    <div class="date-picker">
      <input type="datetime" v-bind="$attrs" />
    </div>
  `
})
```

有了这个新配置， `data status` attribute 将应用于 `input` 元素！

```html
<!-- Date-picker 组件 使用非 prop attribute -->
<date-picker data-status="activated"></date-picker>

<!-- 渲染 date-picker 组件 -->
<div class="date-picker">
  <input type="datetime" data-status="activated" />
</div>
```

## 多个根节点上的 Attribute 继承

与单个根节点组件不同，具有多个根节点的组件不具有自动 attribute 回退行为。如果未显式绑定 `$attrs`，将发出运行时警告.

```html
<custom-layout id="custom-layout" @click="changeValue"></custom-layout>
```

```js
// 这将发出警告
app.component('custom-layout', {
  template: `
    <header>...</header>
    <main>...</main>
    <footer>...</footer>
  `
})

// 没有警告，$attrs被传递到<main>元素
app.component('custom-layout', {
  template: `
    <header>...</header>
    <main v-bind="$attrs">...</main>
    <footer>...</footer>
  `
})
```
