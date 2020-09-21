---
title: v-bind 合并行为
badges:
  - breaking
---

# {{ $frontmatter.title }} <MigrationBadges :badges="$frontmatter.badges" />

## 概览

- **不兼容**：v-bind 的绑定顺序会影响渲染结果。

## 介绍

在元素上动态绑定 attribute 时，常见的场景是在一个元素中同时使用 `v-bind="object"` 语法和单独的 property。然而，这就引出了关于合并的优先级的问题。

## 2.x 语法

在 2.x，如果一个元素同时定义了 `v-bind="object"` 和一个相同的单独的 property，那么这个单独的 property 总是会覆盖 `object` 中的绑定。

```html
<!-- template -->
<div id="red" v-bind="{ id: 'blue' }"></div>
<!-- result -->
<div id="red"></div>
```

## 3.x 语法

在 3.x，如果一个元素同时定义了 `v-bind="object"` 和一个相同的单独的 property，那么声明绑定的顺序决定了它们如何合并。换句话说，相对于假设开发者总是希望单独的 property 覆盖 `object` 中定义的内容，现在开发者对自己所希望的合并行为有了更好的控制。

```html
<!-- template -->
<div id="red" v-bind="{ id: 'blue' }"></div>
<!-- result -->
<div id="blue"></div>

<!-- template -->
<div v-bind="{ id: 'blue' }" id="red"></div>
<!-- result -->
<div id="red"></div>
```

## 迁移策略

如果你依赖 `v-bind` 的覆盖功能，目前的建议是确保在单独的 property 之前定义 `v-bind` attribute。
