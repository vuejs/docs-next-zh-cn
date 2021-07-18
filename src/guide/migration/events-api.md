---
badges:
  - breaking
---

# 事件 API <MigrationBadges :badges="$frontmatter.badges" />

## 概览

`$on`，`$off` 和 `$once` 实例方法已被移除，组件实例不再实现事件触发接口。

## 2.x 语法

在 2.x 中，Vue 实例可用于触发由事件触发 API 通过指令式方式添加的处理函数 (`$on`，`$off` 和 `$once`)。这可以创建 event bus，用来创建在整个应用程序中可用的全局事件监听器：

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
      eventBus.$emit('custom-event') // 当 ChildComponent 被挂载，控制台中将显示一条消息
    }
  }
}
```

## 3.x 更新

我们从实例中完全移除了 `$on`、`$off` 和 `$once` 方法。`$emit` 仍然包含于现有的 API 中，因为它用于触发由父组件声明式添加的事件处理函数。

## 迁移策略

[迁移构建标记：`INSTANCE_EVENT_EMITTER`](migration-build.html#兼容性配置)

<!-- TODO: translation -->
In Vue 3, it is no longer possible to use these APIs to listen to a component's own emitted events from within a component. There is no migration path for that use case.

### Root Component Events

Static event listeners can be added to the root component by passing them as props to `createApp`:

```js
createApp(App, {
  // Listen for the 'expand' event
  onExpand() {
    console.log('expand')
  }
})
```

### Event Bus

Event bus 模式可以被替换为实现了事件触发器接口的外部库，例如 [mitt](https://github.com/developit/mitt) 或 [tiny-emitter](https://github.com/scottcorgan/tiny-emitter)。

示例:

```js
//eventBus.js
import emitter from 'tiny-emitter/instance'

export default {
  $on: (...args) => emitter.on(...args),
  $once: (...args) => emitter.once(...args),
  $off: (...args) => emitter.off(...args),
  $emit: (...args) => emitter.emit(...args)
}
```

它提供了与 Vue 2 相同的事件触发器 API。

<!-- TODO: translation -->
In most circumstances, using a global event bus for communicating between components is discouraged. While it is often the simplest solution in the short term, it almost invariably proves to be a maintenance headache in the long term. Depending on the circumstances, there are various alternatives to using an event bus:

* [Props](/guide/component-basics.html#passing-data-to-child-components-with-props) and [events](/guide/component-basics.html#listening-to-child-components-events) should be your first choice for parent-child communication. Siblings can communicate via their parent.
* [Provide and inject](/guide/component-provide-inject.html) allow a component to communicate with its slot contents. This is useful for tightly-coupled components that are always used together.
* `provide`/`inject` can also be used for long-distance communication between components. It can help to avoid 'prop drilling', where props need to be passed down through many levels of components that don't need those props themselves.
* Prop drilling can also be avoided by refactoring to use slots. If an interim component doesn't need the props then it might indicate a problem with separation of concerns. Introducing a slot in that component allows the parent to create the content directly, so that props can be passed without the interim component needing to get involved.
* [Global state management](/guide/state-management.html), such as [Vuex](https://next.vuex.vuejs.org/).
