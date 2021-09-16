---
badges:
  - removed
---

# `propsData` <MigrationBadges :badges="$frontmatter.badges" />

## 概述

`propsData` 选项之前用于在创建 Vue 实例的过程中传入 prop，现在它被移除了。如果想为 Vue 3 应用的根组件传入 prop，请使用 [createApp](/api/global-api.html#createapp) 的第二个参数。

## 2.x 语法

在 2.x 中，我们可以在创建 Vue 实例的时候传入 prop：

```js
const Comp = Vue.extend({
  props: ['username'],
  template: '<div>{{ username }}</div>'
})

new Comp({
  propsData: {
    username: 'Evan'
  }
})
```

## 3.x 更新

`propsData` 选项已经被移除。如果你需要在实例创建时向根组件传入 prop，你应该使用 `createApp` 的第二个参数：

```js
const app = createApp(
  {
    props: ['username'],
    template: '<div>{{ username }}</div>'
  },
  { username: 'Evan' }
)
```
