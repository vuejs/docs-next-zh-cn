---
badges:
  - breaking
---

# 事件 API <MigrationBadges :badges="$frontmatter.badges" />

## 概览

`$on`, `$off` 和 `$once` 实例方法已被移除，应用实例不再实现事件触发接口。

## 2.x 语法

在 2.x 中, Vue实例可用于触发通过事件触发API强制附加的处理程序 (`$on`, `$off` 和 `$once`)，这用于创建 event hub，以创建在整个应用程序中使用的全局事件侦听器：

```js
// eventHub.js

const eventHub = new Vue()

export default eventHub
```

```js
// ChildComponent.vue
import eventHub from './eventHub'

export default {
  mounted() {
    // 添加 eventHub listener
    eventHub.$on('custom-event', () => {
      console.log('Custom event triggered!')
    })
  },
  beforeDestroy() {
    // 移除 eventHub listener
    eventHub.$off('custom-event')
  }
}
```

```js
// ParentComponent.vue
import eventHub from './eventHub'

export default {
  methods: {
    callGlobalCustomEvent() {
      eventHub.$emit('custom-event') // 如果ChildComponent mounted，控制台中将显示一条消息
    }
  }
}
```

## 3.x 更新

我们整个从实例中移除了 `$on`, `$off` 和 `$once` 方法， `$emit` 仍然是现有API的一部分，因为它用于触发由父组件以声明方式附加的事件处理程序

## 迁移策略

例如，可以通过使用实现事件发射器接口的外部库来替换现有的 event hub [mitt](https://github.com/developit/mitt).

在兼容性构建中也可以支持这些方法。
