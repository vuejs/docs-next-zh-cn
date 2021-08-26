---
title: $attrs 包含 class & style
badges:
  - breaking
---

# `$attrs` 包含 `class` & `style` <MigrationBadges :badges="$frontmatter.badges" />

## 概览

`$attrs` 现在包含了*所有*传递给组件的 attribute，包括 `class` 和 `style`。

## 2.x 行为

Vue 2 的虚拟 DOM 实现对 `class` 和 `style` attribute 有一些特殊处理。因此，与其它所有 attribute 不一样，它们*没有*被包含在 `$attrs` 中。

上述行为在使用 `inheritAttrs: false` 时会产生副作用：

- `$attrs` 中的 attribute 将不再被自动添加到根元素中，而是由开发者决定在哪添加。
- 但是 `class` 和 `style` 不属于 `$attrs`，它们仍然会被应用到组件的根元素中：

```vue
<template>
  <label>
    <input type="text" v-bind="$attrs" />
  </label>
</template>
<script>
export default {
  inheritAttrs: false
}
</script>
```

像这样使用时：

```html
<my-component id="my-id" class="my-class"></my-component>
```

……将生成以下 HTML：

```html
<label class="my-class">
  <input type="text" id="my-id" />
</label>
```

## 3.x 行为

`$attrs` 包含了*所有的* attribute，这使得把它们全部应用到另一个元素上变得更加容易了。现在上面的示例将生成以下 HTML：

```html
<label>
  <input type="text" id="my-id" class="my-class" />
</label>
```

## 迁移策略

在使用了 `inheritAttrs: false` 的组件中，请确保样式仍然符合预期。如果你之前依赖了 `class` 和 `style` 的特殊行为，那么一些视觉效果可能会遭到破坏，因为这些 attribute 现在可能被应用到了另一个元素中。

[迁移构建开关：`INSTANCE_ATTRS_CLASS_STYLE`](migration-build.html#兼容性配置)

## 参考

- [相关的 RFC](https://github.com/vuejs/rfcs/blob/master/active-rfcs/0031-attr-fallthrough.md)
- [迁移指南 - 移除 `$listeners`](./listeners-removed.md)
- [迁移指南 - 新增 Emits 选项](./emits-option.md)
- [迁移指南 - 移除 `.native` 修饰符](./v-on-native-modifier-removed.md)
- [迁移指南 - 渲染函数 API 的更改](./render-function-api.md)
