---
title: Transition Group 根元素
badges:
  - breaking
---

# {{ $frontmatter.title }} <MigrationBadges :badges="$frontmatter.badges" />

## 概览

`<transition-group>` 不再默认渲染根元素，但仍然可以用 `tag` attribute 创建根元素。

## 2.x 语法

在 Vue 2 中，`<transition-group>` 像其它自定义组件一样，需要一个根元素。默认的根元素是一个 `<span>`，但可以通过 `tag` attribute 定制。

```html
<transition-group tag="ul">
  <li v-for="item in items" :key="item">
    {{ item }}
  </li>
</transition-group>
```

## 3.x 语法

在 Vue 3 中，我们有了[片段的支持](/guide/migration/fragments.html)，因此组件不再*需要*根节点。所以，`<transition-group>` 不再默认渲染根节点。

- 如果像上面的示例一样，已经在 Vue 2 代码中定义了 `tag` attribute，那么一切都会和之前一样
- 如果没有定义 `tag` attribute，*而且*样式或其它行为依赖于 `<span>` 根元素的存在才能正常工作，那么只需将 `tag="span"` 添加到 `<transition-group>`：

```html
<transition-group tag="span">
  <!-- -->
</transition-group>
```

## 迁移策略

[迁移构建开关：`TRANSITION_GROUP_ROOT`](migration-build.html#兼容性配置)

## 参考

- [过渡的 class 名更改](/guide/migration/transition.html)
- [`<Transition>` 作为根元素不再从外界被切换](/guide/migration/transition-as-root.html)
