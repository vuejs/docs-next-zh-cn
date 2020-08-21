---
badges:
  - new
---

# 片段 <MigrationBadges :badges="$frontmatter.badges" />

## 概览

在 Vue 3 中, 组件现在正式支持多根节点组件，即片段！

## 2.x 语法

在 2.x 中, 不支持多根组件，当用户意外创建多根组件时会发出警告，因此，为了修复此错误，许多组件被包装在一个 `<div>` 中。


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

## 3.x Synta语法x

在 3.x 中, 组件现在可以有多个根节点！但是，这确实要求开发者明确定义属性应该分布在哪里。

```html
<!-- Layout.vue -->
<template>
  <header>...</header>
  <main v-bind="$attrs">...</main>
  <footer>...</footer>
</template>
```

有关attribute继承如何工作的详细信息，见 [非 Prop Attributes](/guide/component-attrs.html).
