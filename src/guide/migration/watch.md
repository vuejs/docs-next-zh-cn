---
title: Watch on Arrays
badges:
  - breaking
---

# {{ $frontmatter.title }} <MigrationBadges :badges="$frontmatter.badges" />

## Overview

- **BREAKING**: 当侦听一个数组时，只有当数组被替换时才会触发回调。如果您需要在数组改变时触发回调，必须指定' deep '选项。
## 3.x Syntax

当使用[ '该 watch ' 选项](/api/options-data.html#watch)侦听数组时，只有在数组被替换时才会触发回调。换句话说，在数组改变时 watch 回调将不再被触发 。要想在数组改变时触发 watch 回调，必须指定“deep”选项。
```js
watch: {
  bookList: {
    handler(val, oldVal) {
      console.log('book list changed')
    },
    deep: true
  },
}
```

## 迁移策略

如果你依赖侦听数组的改变,添加 `deep` property ,以确保正确地触发回调。 