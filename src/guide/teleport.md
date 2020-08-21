# 传入

Vue 鼓励我们通过将 UI 和相关行为封装到组件中来构建 UI。我们可以将它们嵌套在另一个内部，以构建一个组成应用程序 UI 的树。

然而，有时组件模板的一部分逻辑上属于该组件，而从技术角度来看，最好将模板的这一部分移动到 DOM 中 Vue app 之外的其他位置。

一个常见的场景是创建一个包含全屏模式的组件。在大多数情况下，你希望模态的逻辑存在于组件中，但是模态的定位很快就很难通过CSS来解决，或者需要更改组件组合。

考虑下面的HTML结构。

```html
<body>
  <div style="position: relative;">
    <h3>Tooltips with Vue 3 Teleport</h3>
    <div>
      <modal-button></modal-button>
    </div>
  </div>
</body>
```

为此，我们可以使用 Vue 的内置 `<modal-button>` 组件：

组件将有一个 `button` 元素来触发模态的打开，以及一个具有类 `.modal` 的 `div` 元素，它将包含模态的内容和一个用于自关闭的按钮。

```js
const app = Vue.createApp({});

app.component('modal-button', {
  template: `
    <button @click="modalOpen = true">
        Open full screen modal!
    </button>

    <div v-if="modalOpen" class="modal">
      <div>
        I'm a modal! 
        <button @click="modalOpen = false">
          Close
        </button>
      </div>
    </div>
  `,
  data() {
    return { 
      modalOpen: false
    }
  }
})
```

当在初始的HTML结构中使用这个组件时，我们可以看到一个问题 —— 模态是在深度嵌套的 `div`中渲染的，而模态的 `position:absolute` 以父级相对定位的 `div` 作为引用。

Teleport提供了一种干净的方法，允许我们控制在DOM中哪个父节点下呈现HTML，而不必求助于全局状态或将其拆分为两个组件。

让我们修改 `modal-button` 以使用 `<teleport>` ，并告诉Vue “**teleport** 这个HTML **to** ” 该“**body** 标记 ”。

```js
app.component('modal-button', {
  template: `
    <button @click="modalOpen = true">
        Open full screen modal! (With teleport!)
    </button>

    <teleport to="body">
      <div v-if="modalOpen" class="modal">
        <div>
          I'm a teleported modal! 
          (My parent is "body")
          <button @click="modalOpen = false">
            Close
          </button>
        </div>
      </div>
    </teleport>
  `,
  data() {
    return { 
      modalOpen: false
    }
  }
})
```

因此，一旦我们单击按钮打开模式，Vue将正确地将模态内容渲染为 `body` 标签的子级。

<p class="codepen" data-height="300" data-theme-id="39028" data-default-tab="js,result" data-user="Vue" data-slug-hash="gOPNvjR" data-preview="true" data-editable="true" style="height: 300px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="Vue 3 Teleport">
  <span>See the Pen <a href="https://codepen.io/team/Vue/pen/gOPNvjR">
  Vue 3 Teleport</a> by Vue (<a href="https://codepen.io/Vue">@Vue</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

## 与 Vue components 一起使用

如果 `<teleport>` 包含 Vue 组件，则它仍将是 `<teleport>` 父组件的逻辑子组件：

```js
const app = Vue.createApp({
  template: `
    <h1>Root instance</h1>
    <parent-component />
  `
})

app.component('parent-component', {
  template: `
    <h2>This is a parent component</h2>
    <teleport to="#endofbody">
      <child-component name="John" />
    </teleport>
  `
})

app.component('child-component', {
  props: ['name'],
  template: `
    <div>Hello, {{ name }}</div>
  `
})
```

在这种情况下，即使在不同的地方渲染 `child-component` ，它仍将是 `parent-component` 的子级，并将从中接收 `name` prop。

这也意味着来自父组件的注入按预期工作，并且子组件将嵌套在 Vue Devtools 中的父组件之下，而不是放在实际内容移动到的位置。

## 在同一目标上使用多个传送

A common use case scenario would be a reusable `<Modal>` component of which there might be multiple instances active at the same time. For this kind of scenario, multiple `<teleport>` components can mount their content to the same target element. The order will be a simple append - later mounts will be located after earlier ones within the target element.

一个常见的用例场景是一个可重用的 `<Modal>` 组件，它可能同时有多个实例处于活动状态。对于这种情况，多个 `<teleport>` 组件可以将其内容挂载到同一个目标元素。顺序将是一个简单的追加 —— 稍后挂载将位于目标元素中较早的挂载之后。

```html
<teleport to="#modals">
  <div>A</div>
</teleport>
<teleport to="#modals">
  <div>B</div>
</teleport>

<!-- result-->
<div id="modals">
  <div>A</div>
  <div>B</div>
</div>
```

你可以在[API reference](../api/built-in-components.html#teleport)查看 `teleport` 组件。