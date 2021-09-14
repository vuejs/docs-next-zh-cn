---
title: '挂载 API 变化'
badges:
  - breaking
---

# 被挂载的应用不会替换元素 <MigrationBadges :badges="$frontmatter.badges" />

## 概述

在 Vue 2.x 中，当挂载一个具有 `template` 的应用时，被渲染的内容会替换我们要挂载的目标元素。在 Vue 3.x 中，被渲染的应用会作为子元素插入，从而替换目标元素的 `innerHTML`。

## 2.x 语法

在 Vue 2.x 中，我们为 `new Vue()` 或 `$mount` 传入一个 HTML 元素选择器：

```js
new Vue({
  el: '#app',
  data() {
    return {
      message: 'Hello Vue!'
    }
  },
  template: `
    <div id="rendered">{{ message }}</div>
  `
})

// 或
const app = new Vue({
  data() {
    return {
      message: 'Hello Vue!'
    }
  },
  template: `
    <div id="rendered">{{ message }}</div>
  `
})

app.$mount('#app')
```

当我们把应用挂载到拥有匹配被传入选择器 (在这个例子中是 `id="app"`) 的 `div` 的页面时：

```html
<body>
  <div id="app">
    Some app content
  </div>
</body>
```

在渲染结果中，上面提及的 `div` 将会被应用所渲染的内容替换：

```html
<body>
  <div id="rendered">Hello Vue!</div>
</body>
```

## 3.x 语法

在 Vue 3.x 中，当我们挂载一个应用时，其渲染内容会替换我们传递给 `mount` 的元素的 `innerHTML`：

```js
const app = Vue.createApp({
  data() {
    return {
      message: 'Hello Vue!'
    }
  },
  template: `
    <div id="rendered">{{ message }}</div>
  `
})

app.mount('#app')
```

当这个应用挂载到拥有匹配 `id="app"` 的 `div` 的页面时，结果会是：

```html
<body>
  <div id="app" data-v-app="">
    <div id="rendered">Hello Vue!</div>
  </div>
</body>
```

## 迁移策略

[迁移构建开关：`GLOBAL_MOUNT_CONTAINER`](migration-build.html#兼容性配置)

## 参考

- [`mount` API](/api/application-api.html#mount)
