---
badges:
  - breaking
---

# Transition 作为根节点 <MigrationBadges :badges="$frontmatter.badges" />

## 概览

当使用 `<transition>` 作为根结点的组件从外部被切换时将不再触发过渡效果。

## 2.x 行为

在 Vue 2 中，通过使用 `<transition>` 作为一个组件的根节点，过渡效果存在从组件外部触发的可能性：

```html
<!-- 模态组件 -->
<template>
  <transition>
    <div class="modal"><slot/></div>
  </transition>
</template>
```

```html
<!-- 用法 -->
<modal v-if="showModal">hello</modal>
```

切换 `showModal` 的值将会在模态组件内部触发一个过渡效果。

这是无意为之的，并不是设计效果。一个 `<transition>` 原本是希望被其子元素触发的，而不是 `<transition>` 自身。

这个怪异的现象现在被移除了。

## 迁移策略

换做向组件传递一个 prop 就可以达到类似的效果：

```vue
<template>
  <transition>
    <div v-if="show" class="modal"><slot/></div>
  </transition>
</template>
<script>
export default {
  props: ['show']
}
</script>
```

```html
<!-- 用法 -->
<modal :show="showModal">hello</modal>
```

## 参考

- [一些过渡的 class 被重命名](/guide/migration/transition.html)
- [`<TransitionGroup>` 不再默认渲染根元素](/guide/migration/transition-group.html)
