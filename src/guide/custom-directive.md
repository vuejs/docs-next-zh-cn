# 自定义指令

## 简介

除了核心功能默认内置的指令 (例如 `v-model` 和 `v-show`)，Vue 也允许注册自定义指令。注意，在 Vue 中，代码复用和抽象的主要形式是组件。然而，有的情况下，你仍然需要对普通 DOM 元素进行底层操作，这时候就会用到自定义指令。举个聚焦输入框的例子，如下：

<common-codepen-snippet title="Custom directives: basic example" slug="JjdxaJW" :preview="false" />

当页面加载时，该元素将获得焦点 (注意：`autofocus` 在移动版 Safari 上不工作)。事实上，如果你在打开这个页面后还没有点击过任何内容，那么此时这个输入框就应当处于聚焦状态。此外，你可以单击 `Rerun` 按钮，输入框将被聚焦。

现在让我们用指令来实现这个功能：

```js
const app = Vue.createApp({})
// 注册一个全局自定义指令 `v-focus`
app.directive('focus', {
  // 当被绑定的元素挂载到 DOM 中时……
  mounted(el) {
    // 聚焦元素
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

然后你可以在模板中任何元素上使用新的 `v-focus` attribute，如下：

```html
<input v-focus />
```

## 钩子函数

一个指令定义对象可以提供如下几个钩子函数 (均为可选)：

- `created`：在绑定元素的 attribute 或事件监听器被应用之前调用。在指令需要附加在普通的 `v-on` 事件监听器调用前的事件监听器中时，这很有用。

- `beforeMount`：当指令第一次绑定到元素并且在挂载父组件之前调用。

- `mounted`：在绑定元素的父组件被挂载前调用。

- `beforeUpdate`：在更新包含组件的 VNode 之前调用。

:::tip 提示
我们会在[稍后](render-function.html#虚拟-dom-树)讨论渲染函数时介绍更多 VNodes 的细节。
:::

- `updated`：在包含组件的 VNode **及其子组件的 VNode** 更新后调用。

- `beforeUnmount`：在卸载绑定元素的父组件之前调用

- `unmounted`：当指令与元素解除绑定且父组件已卸载时，只调用一次。

接下来我们来看一下在[自定义指令 API](../api/application-api.html#directive) 钩子函数的参数 (即 `el`、`binding`、`vnode` 和 `prevVnode`)

### 动态指令参数

指令的参数可以是动态的。例如，在 `v-mydirective:[argument]="value"` 中，`argument` 参数可以根据组件实例数据进行更新！这使得自定义指令可以在应用中被灵活使用。

例如你想要创建一个自定义指令，用来通过固定布局将元素固定在页面上。我们可以创建一个自定义指令，它的值以像素为单位更新被固定元素的垂直位置，如下所示：

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
    // binding.value 是我们传递给指令的值——在这里是 200
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
    // binding.arg 是我们传递给指令的参数
    const s = binding.arg || 'top'
    el.style[s] = binding.value + 'px'
  }
})

app.mount('#dynamic-arguments-example')
```

结果：

<common-codepen-snippet title="Custom directives: dynamic arguments" slug="YzXgGmv" :preview="false" />

我们的自定义指令现在已经足够灵活，可以支持一些不同的用例。为了使其更具动态性，我们还可以允许修改绑定值。让我们创建一个附加属性 `pinPadding`，并将其绑定到 `<input type="range">`。

```vue-html{4}
<div id="dynamicexample">
  <h2>Scroll down the page</h2>
  <input type="range" min="0" max="500" v-model="pinPadding">
  <p v-pin:[direction]="pinPadding">Stick me {{ pinPadding + 'px' }} from the {{ direction || 'top' }} of the page</p>
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

让我们扩展指令逻辑以在组件更新后重新计算固定的距离。

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

结果：

<common-codepen-snippet title="Custom directives: dynamic arguments + dynamic binding" slug="rNOaZpj" :preview="false" />

## 函数简写

在前面的例子中，你可能想在 `mounted` 和 `updated` 时触发相同行为，而不关心其他的钩子函数。那么你可以通过将这个回调函数传递给指令来实现：

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

和[非 prop 的 attribute](component-attrs.html) 类似，当在组件中使用时，自定义指令总是会被应用在组件的根节点上。

```vue-html
<my-component v-demo="test"></my-component>
```

```js
app.component('my-component', {
  template: `
    <div> // v-demo 指令将会被应用在这里
      <span>My component content</span>
    </div>
  `
})
```

和 attribute 不同，指令不会通过 `v-bind="$attrs"` 被传入另一个元素。

有了[片段](/guide/migration/fragments.html#概览)支持以后，组件可能会有多个根节点。当被应用在一个多根节点的组件上时，指令会被忽略，并且会抛出一个警告。
