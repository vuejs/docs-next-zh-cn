# 提供 / 注入

> 该页面假设你已经阅读过了 [组件基础](component-basics.md) 。如果你还对组件不太了解，推荐你先阅读它。

通常，当我们需要将数据从父组件传递到子组件时，我们使用 [props](component-props.md)。想象一下这样的结构：你有一些深嵌套的组件，而你只需要来自深嵌套子组件中父组件的某些内容。在这种情况下，你仍然需要将prop传递到整个组件链中，这可能会很烦人。

对于这种情况，我们可以使用 `provide` 和 `inject` 对。父组件可以作为其所有子组件的依赖项提供程序，而不管组件层次结构有多深。这个特性有两个部分：父组件有一个 `provide` 选项来提供数据，子组件有一个 `inject` 选项来开始使用这个数据。


![Provide/inject scheme](/images/components_provide.png)

例如，如果我们有这样的层次结构：

```
Root
└─ TodoList
   ├─ TodoItem
   └─ TodoListFooter
      ├─ ClearTodosButton
      └─ TodoListStatistics
```

如果要将 todo-items 的长度直接传递给 `TodoListStatistics` ，我们将把这个属性向下传递到层次结构：`TodoList` -> `TodoListFooter` -> `TodoListStatistics`。通过 provide/inject 方法，我们可以直接执行以下操作：

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
    console.log(`Injected property: ${this.user}`) // > 注入 property: John Doe
  }
})
```

但是，如果我们尝试在此处提供一些组件实例property，则这将不起作用：

```js
app.component('todo-list', {
  data() {
    return {
      todos: ['Feed a cat', 'Buy tickets']
    }
  },
  provide: {
    todoLength: this.todos.length // 将会导致错误 'Cannot read property 'length' of undefined`
  },
  template: `
    ...
  `
})
```

要访问组件实例 property，我们需要将 `provide` 转换为返回对象的函数

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

这使我们能够更安全地继续开发该组件，而不必担心可能会 更改/删除 子组件所依赖的某些内容。这些组件之间的接口仍然是明确定义的，就像prop一样。

实际上，你可以将依赖注入看作是“long range props”，除了：

- 父组件不需要知道哪些子组件使用它提供的property
- 子组件不需要知道 inject property 来自哪里

## 与响应式一起工作

在上面的例子中，如果我们更改了 `todos` 的列表，这个更改将不会反映在注入的 `todoLength`  property 中。这是因为默认情况下，`provide/inject` 绑定 *不* 是被动绑定。我们可以通过将 `ref` property 或 `reactive` 对象传递给 `provide` 来更改此行为。在我们的例子中，如果我们想对祖先组件中的更改做出反应，我们需要为我们提供的 `todoLength` 分配一个组合API `computed` property：

```js
app.component('todo-list', {
  // ...
  provide() {
    return {
      todoLength: Vue.computed(() => this.todos.length)
    }
  }
})
```

在这种情况下，对 `todos.length` 将正确反映在组件中，其中“todoLength”被注入。在 [Composition API部分](composition-api-provide-inject.html#injection-reactivity) 中阅读关于 `reactiv` provide/inject 的更多信息。