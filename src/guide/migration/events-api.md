---
badges:
  - breaking
---

# 事件 API <MigrationBadges :badges="$frontmatter.badges" />

## 概览

`$on`，`$off` 和 `$once` 实例方法已被移除，应用实例不再实现事件触发接口。

## 2.x 语法

在 2.x 中，Vue 实例可用于触发由事件触发 API 强制附加的处理函数 (`$on`，`$off` 和 `$once`)。这可以创建 event hub，用来创建在整个应用程序中可用的全局事件监听器：

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
    // 添加 eventHub 监听器
    eventHub.$on('custom-event', () => {
      console.log('Custom event triggered!')
    })
  },
  beforeDestroy() {
    // 移除 eventHub 监听器
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
      eventHub.$emit('custom-event') // 当 ChildComponent 被挂载，控制台中将显示一条消息
    }
  }
}
```

## 3.x 更新

我们从实例中完全移除了 `$on`，`$off` 和 `$once` 方法。`$emit` 仍然包含于现有的 API 中，因为它用于触发由父组件声明附加的事件处理函数

## 迁移策略

可以使用实现事件触发接口的外部库来替换现有的 event hub，例如 [mitt](https://github.com/developit/mitt) 或 [tiny-emitter](https://github.com/scottcorgan/tiny-emitter)。

兼容性构建中也支持这些方法。
