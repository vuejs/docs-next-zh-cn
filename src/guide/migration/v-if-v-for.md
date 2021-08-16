---
title: v-if 与 v-for 的优先级对比
badges:
  - breaking
---

# {{ $frontmatter.title }} <MigrationBadges :badges="$frontmatter.badges" />

## 概览

- **非兼容**：两者作用于同一个元素上时，`v-if` 会拥有比 `v-for` 更高的优先级。

## 介绍

Vue.js 中使用最多的两个指令就是 `v-if` 和 `v-for`，因此开发者们可能会想要同时使用它们。虽然不建议这样做，但有时确实是必须的，于是我们想提供有关其工作方式的指南。

## 2.x 语法

2.x 版本中在一个元素上同时使用 `v-if` 和 `v-for` 时，`v-for` 会优先作用。

## 3.x 语法

3.x 版本中 `v-if` 总是优先于 `v-for` 生效。

## 迁移策略

由于语法上存在歧义，建议避免在同一元素上同时使用两者。

比起在模板层面管理相关逻辑，更好的办法是通过创建计算属性筛选出列表，并以此创建可见元素。

[迁移构建开关：`COMPILER_V_IF_V_FOR_PRECEDENCE`](migration-build.html#兼容性配置)

## 参考

- [列表渲染 - #显示过滤-排序后的结果](/guide/list.html#显示过滤-排序后的结果)
- [列表渲染 - `v-for` 与 `v-if` 一同使用](/guide/list.html#v-for-与-v-if-一同使用)
