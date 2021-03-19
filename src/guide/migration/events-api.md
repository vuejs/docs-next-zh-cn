---
badges:
  - breaking
---

# 事件 API <MigrationBadges :badges="$frontmatter.badges" />

## 概览

`$on`，`$off` 和 `$once` 实例方法已被移除，应用实例不再实现事件触发接口。

## 2.x 语法

在 2.x 中，Vue 实例可用于触发由事件触发 API 通过指令式方式添加的处理函数 (`$on`，`$off` 和 `$once`)。这可以创建 event hub，用来创建在整个应用程序中可用的全局事件监听器：

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

我们从实例中完全移除了 `$on`、`$off` 和 `$once` 方法。`$emit` 仍然包含于现有的 API 中，因为它用于触发由父组件声明式添加的事件处理函数。

## 迁移策略

在 Vue 3 中，已经不可能使用这些 API 从组件内部监听组件自己发出的事件了，该用例暂没有迁移的方法。

但是可以使用实现事件 emitter 接口的外部库来替换的 eventHub 模式，例如 [mitt](https://github.com/developit/mitt) 或 [tiny-emitter](https://github.com/scottcorgan/tiny-emitter)。

示例:

```js
//eventHub.js
import emitter from 'tiny-emitter/instance'

export default {
  $on: (...args) => emitter.on(...args),
  $once: (...args) => emitter.once(...args),
  $off: (...args) => emitter.off(...args),
  $emit: (...args) => emitter.emit(...args)
}
```

它提供了与 Vue 2 相同的事件 emitter API。

这些方法也可能在 Vue 3 的未来兼容性构建中得到支持。
