---
badges:
  - breaking
---

# `key` Attribute <MigrationBadges :badges="$frontmatter.badges" />

## 概览

- **新增**：对于 `v-if`/`v-else`/`v-else-if` 的各分支项 `key` 将不再是必须的，因为现在 Vue 会自动生成唯一的 `key`。
  - **非兼容**：如果你手动提供 `key`，那么每个分支必须使用唯一的 `key`。你将不再能通过故意使用相同的 `key` 来强制重用分支。
- **非兼容**：`<template v-for>` 的 `key` 应该设置在 `<template>` 标签上 (而不是设置在它的子节点上)。

## 背景

特殊的 `key` attribute 被作为 Vue 的虚拟 DOM 算法的提示，以保持对节点身份的持续跟踪。这样 Vue 就可以知道何时能够重用和修补现有节点，以及何时需要对它们重新排序或重新创建。关于其它更多信息，可以查看以下章节：

- [列表渲染：维护状态](/guide/list.html#%E7%BB%B4%E6%8A%A4%E7%8A%B6%E6%80%81)
- [API 参考：特殊的 `key` attribute](/api/special-attributes.html#key)

## 在条件分支中

在 Vue 2.x 中，建议在 `v-if`/`v-else`/`v-else-if` 的分支中使用 `key`。

```html
<!-- Vue 2.x -->
<div v-if="condition" key="yes">Yes</div>
<div v-else key="no">No</div>
```

这个示例在 Vue 3.x 中仍能正常工作。但是我们不再建议在 `v-if`/`v-else`/`v-else-if` 的分支中继续使用 `key` attribute，因为没有为条件分支提供 `key` 时，也会自动生成唯一的 `key`。

```html
<!-- Vue 3.x -->
<div v-if="condition">Yes</div>
<div v-else>No</div>
```

非兼容变更体现在如果你手动提供了 `key`，那么每个分支都必须使用一个唯一的 `key`。因此大多数情况下都不需要设置这些 `key`。

```html
<!-- Vue 2.x -->
<div v-if="condition" key="a">Yes</div>
<div v-else key="a">No</div>

<!-- Vue 3.x (推荐方案：移除 key) -->
<div v-if="condition">Yes</div>
<div v-else>No</div>

<!-- Vue 3.x (替代方案：确保 key 始终是唯一的) -->
<div v-if="condition" key="a">Yes</div>
<div v-else key="b">No</div>
```

## 结合 `<template v-for>`

在 Vue 2.x 中，`<template>` 标签不能拥有 `key`。不过，你可以为其每个子节点分别设置 `key`。

```html
<!-- Vue 2.x -->
<template v-for="item in list">
  <div :key="'heading-' + item.id">...</div>
  <span :key="'content-' + item.id">...</span>
</template>
```

在 Vue 3.x 中，`key` 则应该被设置在 `<template>` 标签上。

```html
<!-- Vue 3.x -->
<template v-for="item in list" :key="item.id">
  <div>...</div>
  <span>...</span>
</template>
```

类似地，当使用 `<template v-for>` 时如果存在使用 `v-if` 的子节点，则 `key` 应改为设置在 `<template>` 标签上。

```html
<!-- Vue 2.x -->
<template v-for="item in list">
  <div v-if="item.isVisible" :key="item.id">...</div>
  <span v-else :key="item.id">...</span>
</template>

<!-- Vue 3.x -->
<template v-for="item in list" :key="item.id">
  <div v-if="item.isVisible">...</div>
  <span v-else>...</span>
</template>
```
