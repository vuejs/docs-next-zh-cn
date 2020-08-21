# 状态管理

## 类 Flux 状态管理的官方实现

由于状态零散地分布在许多组件和组件之间的交互中，大型应用复杂度也经常逐渐增长。为了解决这个问题，Vue 提供 [vuex](https://github.com/vuejs/vuex)：我们有受到 Elm 启发的状态管理库。vuex 甚至集成到 [vue-devtools](https://github.com/vuejs/vue-devtools)，无需配置即可进行[时光旅行调试 (time travel debugging)](https://raw.githubusercontent.com/vuejs/vue-devtools/master/media/demo.gif)。

### React 的开发者请参考以下信息

如果你是来自 React 的开发者，你可能会对 Vuex 和 [Redux](https://github.com/reactjs/redux) 间的差异表示关注，Redux 是 React 生态环境中最流行的 Flux 实现。Redux 事实上无法感知视图层，所以它能够轻松的通过一些[简单绑定](https://classic.yarnpkg.com/en/packages?q=redux%20vue&p=1)和 Vue 一起使用。Vuex 区别在于它是一个专门为 Vue 应用所设计。这使得它能够更好地和 Vue 进行整合，同时提供简洁的 API 和改善过的开发体验。

## 简单状态管理起步使用

经常被忽略的是，Vue 应用中响应式 `data` 对象的实际来源——当访问数据对象时，一个组件实例只是简单的代理访问。所以，如果你有一处需要被多个实例间共享的状态，你可以使用一个 [reactive](/guide/reactivity-fundamentals.html#declaring-reactive-state) 方法让对象作为响应式对象。

```js
const sourceOfTruth = Vue.reactive({
  message: 'Hello'
})

const appA = Vue.createApp({
  data() {
    return sourceOfTruth
  }
}).mount('#app-a')

const appB = Vue.createApp({
  data() {
    return sourceOfTruth
  }
}).mount('#app-b')
```

```html
<div id="app-a">App A: {{ message }}</div>

<div id="app-b">App B: {{ message }}</div>
```

现在当 `sourceOfTruth` 发生变更，`appA` 和 `appB` 都将自动地更新它们的视图。我们现在只有一个真实来源，但调试将是一场噩梦。我们应用的任何部分都可以随时更改任何数据，而不会留下变更过的记录。

```js
const appB = Vue.createApp({
  data() {
    return sourceOfTruth
  },
  mounted() {
    sourceOfTruth.message = 'Goodbye' // both apps will render 'Goodbye' message now
  }
}).mount('#app-b')
```

为了解决这个问题，我们采用一个简单的 **store 模式**：

```js
const store = {
  debug: true,

  state: Vue.reactive({
    message: 'Hello!'
  }),

  setMessageAction(newValue) {
    if (this.debug) {
      console.log('setMessageAction triggered with', newValue)
    }

    this.state.message = newValue
  },

  clearMessageAction() {
    if (this.debug) {
      console.log('clearMessageAction triggered')
    }

    this.state.message = ''
  }
}
```

需要注意，所有 store 中 state 的变更，都放置在 store 自身的 action 中去管理。这种集中式状态管理能够被更容易地理解哪种类型的变更将会发生，以及它们是如何被触发。当错误出现时，我们现在也会有一个 log 记录 bug 之前发生了什么。

此外，每个实例/组件仍然可以拥有和管理自己的私有状态：

```html
<div id="app-a">{{sharedState.message}}</div>

<div id="app-b">{{sharedState.message}}</div>
```

```js
const appA = Vue.createApp({
  data() {
    return {
      privateState: {},
      sharedState: store.state
    }
  },
  mounted() {
    store.setMessageAction('Goodbye!')
  }
}).mount('#app-a')

const appB = Vue.createApp({
  data() {
    return {
      privateState: {},
      sharedState: store.state
    }
  }
}).mount('#app-b')
```

![State Management](/images/state.png)

:::tip
重要的是，注意你不应该在 action 中替换原始的状态对象 - 组件和 store 需要引用同一个共享对象，变更才能够被观察到。
:::

接着我们继续延伸约定，组件不允许直接变更属于 store 实例的 state，而应执行 action 来分发 (dispatch) 事件通知 store 去改变，我们最终达成了 [Flux](https://facebook.github.io/flux/) 架构。这样约定的好处是，我们能够记录所有 store 中发生的 state 变更，同时实现能做到记录变更、保存状态快照、历史回滚/时光旅行的先进的调试工具。

说了一圈其实又回到了 [Vuex](https://github.com/vuejs/vuex)，如果你已经读到这儿，或许可以去尝试一下！
