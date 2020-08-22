# 自定义指令

## 简介

除了核心功能默认内置的指令 (v-model 和 v-show)，Vue 也允许注册自定义指令。注意，在 Vue2.0 中，代码复用和抽象的主要形式是组件。然而，有的情况下，你仍然需要对普通 DOM 元素进行底层操作，这时候就会用到自定义指令。举个聚焦输入框的例子，如下：

<p class="codepen" data-height="300" data-theme-id="39028" data-default-tab="result" data-user="Vue" data-slug-hash="JjdxaJW" data-editable="true" style="height: 300px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="Custom directives: basic example">
  <span>See the Pen <a href="https://codepen.io/team/Vue/pen/JjdxaJW">
  Custom directives: basic example</a> by Vue (<a href="https://codepen.io/Vue">@Vue</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

当页面加载时，该元素将获得焦点 (注意：`autofocus` 在移动版 Safari 上不工作)。事实上，只要你在打开这个页面后还没点击过任何内容，这个输入框就应当还是处于聚焦状态。此外，你可以单击 `Rerun` 按钮，输入将被聚焦。

现在让我们用指令来实现这个功能：

```js
const app = Vue.createApp({})
// 注册一个全局自定义指令 `v-focus`
app.directive('focus', {
  // 当被绑定的元素插入到 DOM 中时……
  mounted(el) {
    // Focus the element
    el.focus()
  }
})
```

如果想注册局部指令，组件中也接受一个 `directives` 的选项：

```js
directives: {
  focus: {
    // 指令的定义
    mounted(el) {
      el.focus()
    }
  }
}
```

然后你可以在模板中任何元素上使用新的 `v-focus` property，如下：

```html
<input v-focus />
```

## 钩子函数

一个指令定义对象可以提供如下几个钩子函数 (均为可选)：

- `beforeMount`：当指令第一次绑定到元素并且在挂载父组件之前调用。在这里你可以做一次性的初始化设置。

- `mounted`：在挂载绑定元素的父组件时调用。

- `beforeUpdate`：在更新包含组件的 VNode 之前调用。

:::tip 提示
我们会在[稍后] (我们会在稍后讨论渲染函数时介绍更多 VNodes 的细节。) 讨论渲染函数时介绍更多 VNodes 的细节。
:::

- `updated`：在包含组件的 VNode **及其子组件的 VNode** 更新后调用。

- `beforeUnmount`：在卸载绑定元素的父组件之前调用

- `unmounted`：当指令与元素解除绑定且父组件已卸载时，只调用一次。

接下来我们来看一下在[自定义指令 API](../api/application-api.html#directive) 钩子函数的参数 (即 `el`、`binding`、`vnode` 和 `prevNnode`)

### 动态指令参数

指令的参数可以是动态的。例如，在 `v-mydirective:[argument]="value"` 中，`argument` 参数可以根据组件实例数据进行更新！这使得自定义指令可以在应用中被灵活使用。

例如你想要创建一个自定义指令，用来通过固定布局将元素固定在页面上。我们可以像这样创建一个通过指令值来更新竖直位置像素值的自定义指令：

```vue-html
<div id="dynamic-arguments-example" class="demo">
  <p>Scroll down the page</p>
  <p v-pin="200">Stick me 200px from the top of the page</p>
</div>
```

```js
const app = Vue.createApp({})

app.directive('pin', {
  mounted(el, binding) {
    el.style.position = 'fixed'
    // binding.value is the value we pass to directive - in this case, it's 200
    el.style.top = binding.value + 'px'
  }
})

app.mount('#dynamic-arguments-example')
```

这会把该元素固定在距离页面顶部 200 像素的位置。但如果场景是我们需要把元素固定在左侧而不是顶部又该怎么办呢？这时使用动态参数就可以非常方便地根据每个组件实例来进行更新。

```vue-html
<div id="dynamicexample">
  <h3>Scroll down inside this section ↓</h3>
  <p v-pin:[direction]="200">I am pinned onto the page at 200px to the left.</p>
</div>
```

```js
const app = Vue.createApp({
  data() {
    return {
      direction: 'right'
    }
  }
})

app.directive('pin', {
  mounted(el, binding) {
    el.style.position = 'fixed'
    // binding.arg is an argument we pass to directive
    const s = binding.arg || 'top'
    el.style[s] = binding.value + 'px'
  }
})

app.mount('#dynamic-arguments-example')
```

结果:

<p class="codepen" data-height="300" data-theme-id="39028" data-default-tab="result" data-user="Vue" data-slug-hash="YzXgGmv" data-editable="true" style="height: 300px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="Custom directives: dynamic arguments">
  <span>See the Pen <a href="https://codepen.io/team/Vue/pen/YzXgGmv">
  Custom directives: dynamic arguments</a> by Vue (<a href="https://codepen.io/Vue">@Vue</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

我们的定制指令现在已经足够灵活，可以支持一些不同的用例。为了使其更具动态性，我们还可以允许修改绑定值。让我们创建一个附加属性 `pinPadding`，并将其绑定到 `<input type="range">`。

```vue-html{4}
<div id="dynamicexample">
  <h2>Scroll down the page</h2>
  <input type="range" min="0" max="500" v-model="pinPadding">
  <p v-pin:[direction]="pinPadding">Stick me 200px from the {{ direction }} of the page</p>
</div>
```

```js{5}
const app = Vue.createApp({
  data() {
    return {
      direction: 'right',
      pinPadding: 200
    }
  }
})
```

让我们扩展我们的指令逻辑来重新计算固定元件更新的距离。

```js{7-10}
app.directive('pin', {
  mounted(el, binding) {
    el.style.position = 'fixed'
    const s = binding.arg || 'top'
    el.style[s] = binding.value + 'px'
  },
  updated(el, binding) {
    const s = binding.arg || 'top'
    el.style[s] = binding.value + 'px'
  }
})
```

结果:

<p class="codepen" data-height="300" data-theme-id="39028" data-default-tab="result" data-user="Vue" data-slug-hash="rNOaZpj" data-editable="true" style="height: 300px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="Custom directives: dynamic arguments + dynamic binding">
  <span>See the Pen <a href="https://codepen.io/team/Vue/pen/rNOaZpj">
  Custom directives: dynamic arguments + dynamic binding</a> by Vue (<a href="https://codepen.io/Vue">@Vue</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

## 函数简写

在很多时候，你可能想在 `mounted` 和 `updated` 时触发相同行为，而不关心其它的钩子。比如这样写：

```js
app.directive('pin', (el, binding) => {
  el.style.position = 'fixed'
  const s = binding.arg || 'top'
  el.style[s] = binding.value + 'px'
})
```

## 对象字面量

如果指令需要多个值，可以传入一个 JavaScript 对象字面量。记住，指令函数能够接受所有合法的 JavaScript 表达式。

```vue-html
<div v-demo="{ color: 'white', text: 'hello!' }"></div>
```

```js
app.directive('demo', (el, binding) => {
  console.log(binding.value.color) // => "white"
  console.log(binding.value.text) // => "hello!"
})
```

## 在组件中使用

在 3.0 中，有了片段支持，组件可能有多个根节点。如果在具有多个根节点的组件上使用自定义指令，则会产生问题。

要解释自定义指令如何在 3.0 中的组件上工作的详细信息，我们首先需要了解自定义指令在 3.0 中是如何编译的。对于这样的指令：


```vue-html
<div v-demo="test"></div>
```

将大概编译成：

```js
const vDemo = resolveDirective('demo')

return withDirectives(h('div'), [[vDemo, test]])
```

其中 `vDemo` 是用户编写的指令对象，其中包含 `mounted` 和 `updated` 等钩子。

`withDirectives` 返回一个克隆的 VNode，其中用户钩子被包装并作为 VNode 生命周期钩子注入（请参见[渲染函数](ender-function.html)）更多详情）：

```js
{
  onVnodeMounted(vnode) {
    // call vDemo.mounted(...)
  }
}
```
**因此，自定义指令作为 VNode 数据的一部分完全包含在内。当在组件上使用自定义指令时，这些 `onVnodeXXX` 钩子作为无关的 prop 传递给组件，并以 `this.$attrs` 结束**

这也意味着可以像这样在模板中直接挂接到元素的生命周期中，这在涉及到自定义指令时非常方便：

```vue-html
<div @vnodeMounted="myHook" />
```

这与 [attribute fallthrough behavior](component-attrs.html)。因此，组件上自定义指令的规则将与其他无关 attribute 相同：由子组件决定在哪里以及是否应用它。当子组件在内部元素上使用 `v-bind="$attrs"` 时，它也将应用对其使用的任何自定义指令。
