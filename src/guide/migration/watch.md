---
title: 侦听数组
badges:
  - breaking
---

# {{ $frontmatter.title }} <MigrationBadges :badges="$frontmatter.badges" />

## 概览

- **非兼容**: 当侦听一个数组时，只有当数组被替换时才会触发回调。如果你需要在数组被改变时触发回调，必须指定 `deep` 选项。

## 3.x 语法

当使用 [`watch` 选项](/api/options-data.html#watch)侦听数组时，只有在数组被替换时才会触发回调。换句话说，在数组被改变时侦听回调将不再被触发。要想在数组被改变时触发侦听回调，必须指定 `deep` 选项。

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

如果你依赖于侦听数组的改变，添加 `deep` 选项以确保回调能被正确地触发。

[迁移构建开关：`WATCH_ARRAY`](migration-build.html#兼容性配置)
