# Provide / Inject

> 该页面假设你已经阅读过了[组件基础](component-basics.md)。如果你对组件还不太了解，推荐你先阅读它。

通常，当我们需要从父组件向子组件传递数据时，我们使用 [props](component-props.md)。想象一下这样的结构：有一些深度嵌套的组件，而深层的子组件只需要父组件的部分内容。在这种情况下，如果仍然将 prop 沿着组件链逐级传递下去，可能会很麻烦。

对于这种情况，我们可以使用一对 `provide` 和 `inject`。无论组件层次结构有多深，父组件都可以作为其所有子组件的依赖提供者。这个特性有两个部分：父组件有一个 `provide` 选项来提供数据，子组件有一个 `inject` 选项来开始使用这些数据。

![Provide/inject scheme](/images/components_provide.png)

例如，我们有这样的层次结构：

```
Root
└─ TodoList
   ├─ TodoItem
   └─ TodoListFooter
      ├─ ClearTodosButton
      └─ TodoListStatistics
```

如果要将 todo-items 的长度直接传递给 `TodoListStatistics`，我们要将 prop 逐级传递下去：`TodoList` -> `TodoListFooter` -> `TodoListStatistics`。通过 provide/inject 的方式，我们可以直接执行以下操作：

```js
const app = Vue.createApp({})

app.component('todo-list', {
  data() {
    return {
      todos: ['Feed a cat', 'Buy tickets']
    }
  },
  provide: {
    user: 'John Doe'
  },
  template: `
    <div>
      {{ todos.length }}
      <!-- 模板的其余部分 -->
    </div>
  `
})

app.component('todo-list-statistics', {
  inject: ['user'],
  created() {
    console.log(`Injected property: ${this.user}`) // > 注入的 property: John Doe
  }
})
```

但是，如果我们尝试在此处 provide 一些组件的实例 property，这将是不起作用的：

```js
app.component('todo-list', {
  data() {
    return {
      todos: ['Feed a cat', 'Buy tickets']
    }
  },
  provide: {
    todoLength: this.todos.length // 将会导致错误 `Cannot read property 'length' of undefined`
  },
  template: `
    ...
  `
})
```

要访问组件实例 property，我们需要将 `provide` 转换为返回对象的函数：

```js
app.component('todo-list', {
  data() {
    return {
      todos: ['Feed a cat', 'Buy tickets']
    }
  },
  provide() {
    return {
      todoLength: this.todos.length
    }
  },
  template: `
    ...
  `
})
```

这使我们能够更安全地继续开发该组件，而不必担心可能会更改/删除子组件所依赖的某些内容。这些组件之间的接口仍然是明确定义的，就像 prop 一样。

实际上，你可以将依赖注入看作是“长距离的 prop”，除了：

- 父组件不需要知道哪些子组件使用了它 provide 的 property
- 子组件不需要知道 inject 的 property 来自哪里

## 处理响应性

在上面的例子中，如果我们更改了 `todos` 的列表，这个变化并不会反映在 inject 的 `todoLength` property 中。这是因为默认情况下，`provide/inject` 绑定*并不是*响应式的。我们可以通过传递一个 `ref` property 或 `reactive` 对象给 `provide` 来改变这种行为。在我们的例子中，如果我们想对祖先组件中的更改做出响应，我们需要为 provide 的 `todoLength` 分配一个组合式 API `computed` property：

```js
app.component('todo-list', {
  // ...
  provide() {
    return {
      todoLength: Vue.computed(() => this.todos.length)
    }
  }
})

app.component('todo-list-statistics', {
  inject: ['todoLength'],
  created() {
    console.log(`Injected property: ${this.todoLength.value}`) // > 注入的 property: 5
  }
})
```

在这种情况下，任何对 `todos.length` 的改变都会被正确地反映在注入 `todoLength` 的组件中。在[响应式计算和侦听章节](reactivity-computed-watchers.html#计算值)中阅读更多关于 `computed` 的信息，以及在[组合式 API 章节](composition-api-provide-inject.html#响应性)中阅读更多关于 `reactive` provide/inject 的信息。
