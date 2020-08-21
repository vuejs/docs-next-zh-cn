---
badges:
  - breaking
---

# Slot 统一 <MigrationBadges :badges="$frontmatter.badges" />

## 概览

此更改统一了3.x中的普通slot和作用域slot。

以下是变化的变更总结：

- `this.$slots` 现在将slots作为函数公开
- **BREAKING**: 移除 `this.$scopedSlots`

更多信息，请继续阅读！

## 2.x 语法

当使用render函数时，即 `h`，2.x用于在内容节点上定义  `slot` data property。

```js
// 2.x 语法
h(LayoutComponent, [
  h('div', { slot: 'header' }, this.header),
  h('div', { slot: 'content' }, this.content)
])
```

此外，在引用作用域slot时，可以使用以下方法引用它们：

```js
// 2.x 语法
this.$scopedSlots.header
```

## 3.x 语法

在3.x中，插槽被定义为当前节点的子对象：

```js
// 3.x Syntax
h(LayoutComponent, {}, {
  header: () => h('div', this.header),
  content: () => h('div', this.content)
})
```

当你需要以编程方式引用作用域slot时，它们现在被统一到 `$slots` 选项中。

```js
// 2.x 语法
this.$scopedSlots.header

// 3.x 语法
this.$slots.header
```

## 迁移策略

大部分更改已经在2.6中发布。因此，迁移可以一步到位：

1. 在3.x中，将所有 `this.$scopedSlots` 替换为 `this.$slots` 。
