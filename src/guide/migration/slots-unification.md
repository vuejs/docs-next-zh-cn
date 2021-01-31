---
badges:
  - breaking
---
# 插槽统一 <MigrationBadges :badges="$frontmatter.badges" />

## 概览

此更改统一了 3.x 中的普通插槽和作用域插槽。

以下是变化的变更总结：

- `this.$slots` 现在将插槽作为函数公开
- **非兼容**：移除 `this.$scopedSlots`

请继续阅读来获取更多信息！

## 2.x 语法

当使用渲染函数时，即 `h`，2.x 用于在内容节点上定义 `slot` 数据 property。

```js
// 2.x 语法
h(LayoutComponent, [
  h('div', { slot: 'header' }, this.header),
  h('div', { slot: 'content' }, this.content)
])
```

此外，在引用作用域插槽时，可以使用以下方法引用它们：

```js
// 2.x 语法
this.$scopedSlots.header
```

## 3.x 语法

在 3.x 中，将插槽定义为当前节点的子对象：

```js
// 3.x Syntax
h(LayoutComponent, {}, {
  header: () => h('div', this.header),
  content: () => h('div', this.content)
})
```

当你需要编程式地引用作用域插槽时，它们现在被统一到 `$slots` 选项中。

```js
// 2.x 语法
this.$scopedSlots.header

// 3.x 语法
this.$slots.header()
```

## 迁移策略

大部分更改已经在 2.6 中发布。因此，迁移可以一步到位：

1. 在 3.x 中，将所有 `this.$scopedSlots` 替换为 `this.$slots`。
2. 将所有 `this.$slots.mySlot` 替换为 `this.$slots.mySlot()`。
