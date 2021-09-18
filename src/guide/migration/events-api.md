---
badges:
  - breaking
---

# 事件 API <MigrationBadges :badges="$frontmatter.badges" />

## 概览

`$on`，`$off` 和 `$once` 实例方法已被移除，组件实例不再实现事件触发接口。

## 2.x 语法

在 2.x 中，Vue 实例可用于触发由事件触发器 API 通过指令式方式添加的处理函数 (`$on`，`$off` 和 `$once`)。这可以用于创建一个*事件总线*，以创建在整个应用中可用的全局事件监听器：

```js
// eventBus.js

const eventBus = new Vue()

export default eventBus
```

```js
// ChildComponent.vue
import eventBus from './eventBus'

export default {
  mounted() {
    // 添加 eventBus 监听器
    eventBus.$on('custom-event', () => {
      console.log('Custom event triggered!')
    })
  },
  beforeDestroy() {
    // 移除 eventBus 监听器
    eventBus.$off('custom-event')
  }
}
```

```js
// ParentComponent.vue
import eventBus from './eventBus'

export default {
  methods: {
    callGlobalCustomEvent() {
      eventBus.$emit('custom-event') // 当 ChildComponent 已被挂载时，控制台中将显示一条消息
    }
  }
}
```

## 3.x 更新

我们从实例中完全移除了 `$on`、`$off` 和 `$once` 方法。`$emit` 仍然包含于现有的 API 中，因为它用于触发由父组件声明式添加的事件处理函数。

## 迁移策略

[迁移构建开关：`INSTANCE_EVENT_EMITTER`](migration-build.html#兼容性配置)

在 Vue 3 中，借助这些 API 从一个组件内部监听其自身触发的事件已经不再可能了。该用例没有办法迁移。

### 根组件事件

静态的事件监听器可以通过 prop 的形式传递给 `createApp` 以添加到根组件中。

```js
createApp(App, {
  // 监听 'expand' 事件
  onExpand() {
    console.log('expand')
  }
})
```

### 事件总线

事件总线模式可以被替换为使用外部的、实现了事件触发器接口的库，例如 [mitt](https://github.com/developit/mitt) 或 [tiny-emitter](https://github.com/scottcorgan/tiny-emitter)。

示例:

```js
// eventBus.js
import emitter from 'tiny-emitter/instance'

export default {
  $on: (...args) => emitter.on(...args),
  $once: (...args) => emitter.once(...args),
  $off: (...args) => emitter.off(...args),
  $emit: (...args) => emitter.emit(...args),
}
```

它提供了与 Vue 2 相同的事件触发器 API。

在绝大多数情况下，不鼓励使用全局的事件总线在组件之间进行通信。虽然在短期内往往是最简单的解决方案，但从长期来看，它维护起来总是令人头疼。根据具体情况来看，有多种事件总线的替代方案：

* [Prop](/guide/component-basics.html#passing-data-to-child-components-with-props) 和[事件](/guide/component-basics.html#listening-to-child-components-events)应该是父子组件之间沟通的首选。兄弟节点可以通过它们的父节点通信。
* [Provide 和 inject](/guide/component-provide-inject.html) 允许一个组件与它的插槽内容进行通信。这对于总是一起使用的紧密耦合的组件非常有用。
* `provide`/`inject` 也能够用于组件之间的远距离通信。它可以帮助避免“prop 逐级透传”，即 prop 需要通过许多层级的组件传递下去，但这些组件本身可能并不需要那些 prop。
* Prop 逐级透传也可以通过重构以使用插槽来避免。如果一个中间组件不需要某些 prop，那么表明它可能存在关注点分离的问题。在该类组件中使用 slot 可以允许父节点直接为它创建内容，因此 prop 可以被直接传递而不需要中间组件的参与。
* [全局状态管理](/guide/state-management.html)，比如 [Vuex](https://next.vuex.vuejs.org/zh/index.html)。
