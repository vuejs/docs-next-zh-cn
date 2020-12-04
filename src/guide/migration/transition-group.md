---
title: Transition Group Root Element
badges:
  - breaking
---

<!-- TODO: translation -->

# {{ $frontmatter.title }} <MigrationBadges :badges="$frontmatter.badges" />


## 概述

`<transition-group>` 默认不再渲染根元素，但仍然可以使用 `tag` prop 创建一个根元素。

## 2.x 语法

在 Vue 2中，`<transition-group>`与其他自定义组件一样，需要一个根元素，默认情况下是一个 `<span>` ，但可以通过 `tag` prop 自定义。

```html
<transition-group tag="ul">
  <li v-for="item in items" :key="item">
    {{ item }}
  </li>
</transition-group>
```

## 3.x 语法

在 Vue 3 中，我们有 [fragment 支持](/guide/migration/fragments.html) ,所以组件不再需要根节点，因此， `<transition-group>` 在默认情况下不再渲染一个根节点。

- 如果您已经在 Vue 2 代码中定义了 `tag` prop，就像上面的例子一样，那么一切都会像以前一样工作

- 如果您没有一个已定义的样式或其他行为依赖于存在的 `<span>` 根元素来正常运行，只需添加 `tag="span"` 到 `<transition-group>`:

```html
<transition-group tag="span">
  <!-- -->
</transition-group>
```

## 另请参阅
- [一些被重命名的 transition 类](/guide/migration/transition.html)