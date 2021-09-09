---
badges:
  - breaking
---

# 内联模板 Attribute <MigrationBadges :badges="$frontmatter.badges" />

## 概览

对[内联模板特性](https://cn.vuejs.org/v2/guide/components-edge-cases.html#内联模板)的支持已被移除。

## 2.x 语法

在 2.x 中，Vue 为子组件提供了 `inline-template` attribute，以便将其内部内容作为模板使用，而不是作为分发内容。

```html
<my-component inline-template>
  <div>
    <p>它们将被编译为组件自己的模板，</p>
    <p>而不是父级所包含的内容。</p>
  </div>
</my-component>
```

## 3.x 语法

将不再支持此功能。

## 迁移策略

`inline-template` 的大多数用例都假设是在没有构建工具的环境中，也就是所有模板都直接写在 HTML 页面中。

[迁移构建开关：`COMPILER_INLINE_TEMPLATE`](migration-build.html#兼容性配置)

### 选项 #1：使用 `<script>` 标签

在这种情况下，最直接的解决方法是将 `<script>` 与一种替代类型一起使用：

```html
<script type="text/html" id="my-comp-template">
  <div>{{ hello }}</div>
</script>
```

然后在组件中，使用选择器指向目标模板：

```js
const MyComp = {
  template: '#my-comp-template'
  // ...
}
```

这不需要任何构建设置，就可以在所有浏览器中工作，且不受任何内部 DOM HTML 解析限制的约束 (例如，你可以使用驼峰式的 prop 名称)，并且大多数 IDE 能为其提供正确的语法高亮显示。在传统的服务器端框架中，可以将这些模板拆分为服务器模板的部分 (包含在主 HTML 模板中)，以获得更好的可维护性。

### 选项 #2：默认插槽

以前使用了 `inline-template` 的组件也可以使用默认插槽进行重构——这使得数据范围更加明确，同时保留了编写内联子内容的便利性：

```html
<!-- 2.x 语法 -->
<my-comp inline-template :msg="parentMsg">
  {{ msg }} {{ childState }}
</my-comp>

<!-- 默认插槽版本 -->
<my-comp v-slot="{ childState }">
  {{ parentMsg }} {{ childState }}
</my-comp>
```

子组件现在应该渲染默认插槽\*，而不是不为其提供模板：

```html
<!--
  在子组件模板中，渲染默认插槽，
  并为其传递必要的私有状态。
-->
<template>
  <slot :childState="childState" />
</template>
```

> - 提示：在 3.x 中，由于原生[片段](/guide/migration/fragments)的支持，插槽也可以渲染为根节点！
