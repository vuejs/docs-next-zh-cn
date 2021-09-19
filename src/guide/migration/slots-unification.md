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

当使用渲染函数，即 `h` 时，2.x 曾经在内容节点上定义 `slot` 数据 property。

```js
// 2.x 语法
h(LayoutComponent, [
  h('div', { slot: 'header' }, this.header),
  h('div', { slot: 'content' }, this.content)
])
```

此外，可以使用以下语法引用作用域插槽：

```js
// 2.x 语法
this.$scopedSlots.header
```

## 3.x 语法

在 3.x 中，插槽以对象的形式定义为当前节点的子节点：

```js
// 3.x Syntax
h(LayoutComponent, {}, {
  header: () => h('div', this.header),
  content: () => h('div', this.content)
})
```

当你需要以编程方式引用作用域插槽时，它们现在被统一到 `$slots` 选项中了。

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

[迁移构建开关：`INSTANCE_SCOPED_SLOTS`](migration-build.html#兼容性配置)
