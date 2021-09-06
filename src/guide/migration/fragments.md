---
badges:
  - new
---

# 片段 <MigrationBadges :badges="$frontmatter.badges" />

## 概览

Vue 3 现在正式支持了多根节点的组件，也就是片段！

## 2.x 语法

在 2.x 中，由于不支持多根节点组件，当其被开发者意外地创建时会发出警告。结果是，为了修复这个问题，许多组件被包裹在了一个 `<div>` 中。

```html
<!-- Layout.vue -->
<template>
  <div>
    <header>...</header>
    <main>...</main>
    <footer>...</footer>
  </div>
</template>
```

## 3.x 语法

在 3.x 中，组件可以包含多个根节点！但是，这要求开发者显式定义 attribute 应该分布在哪里。

```html
<!-- Layout.vue -->
<template>
  <header>...</header>
  <main v-bind="$attrs">...</main>
  <footer>...</footer>
</template>
```

有关 attribute 继承如何工作的详细信息，见[非 Prop 的 Attribute](/guide/component-attrs.html)。
