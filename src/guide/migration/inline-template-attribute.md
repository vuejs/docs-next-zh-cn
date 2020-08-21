---
badges:
  - breaking
---

# 内链模板 Attribute <MigrationBadges :badges="$frontmatter.badges" />

## 概览

对 [内链特性](https://vuejs.org/v2/guide/components-edge-cases.html#Inline-Templates) 的支持已被移除。

## 2.x 语法

在 2.x 中, Vue为子组件提供了 `inline-template` attribute，以便将其内部内容用作模板，而不是将其作为分发内容。

```html
<my-component inline-template>
  <div>
    <p>它们被编译为组件自己的模板</p>
    <p>不是父级所包含的内容。</p>
  </div>
</my-component>
```

## 3.x 语法

将不再支持此功能。

## 迁移策略

`inline-template` 的大多数用例都假设没有构建工具设置，所有模板都直接写在HTML页面中

### 选项 #1: 使用 `<script>` 标签

在这种情况下，最简单的解决方法是将 `<script>` 与其他类型一起使用：

```js
<script type="text/html" id="my-comp-template">
  <div>{{ hello }}</div>
</script>
```

在组件中，使用选择器将模板作为目标：

```js
const MyComp = {
  template: '#my-comp-template'
  // ...
}
```

这不需要任何构建设置，可以在所有浏览器中工作，不受任何DOM HTML 解析警告的约束（例如，你可以使用camelCase prop名称），并且在大多数ide中提供了正确的语法高亮显示。在传统的服务器端框架中，可以将这些模板拆分为服务器模板部分（包括在主HTML模板中），以获得更好的可维护性。

### 选项 #2: 默认 Slot

以前使用 `inline-template` 的组件也可以使用默认slot —— 进行重构，这使得数据范围更加明确，同时保留了内联编写子内容的便利性：

```html
<!-- 2.x 语法 -->
<my-comp inline-template :msg="parentMsg">
  {{ msg }} {{ childState }}
</my-comp>

<!-- 默认 Slot 版本 -->
<my-comp v-slot="{ childState }">
  {{ parentMsg }} {{ childState }}
</my-comp>
```

子级现在应该渲染默认slot\*，而不是不提供模板：

```html
<!--
  在子模板中，在传递时渲染默认slot
  在必要的private状态下。
-->
<template>
  <slot :childState="childState" />
</template>
```

> - 提示: 在 3.x, slot 可以渲染为具有原生 [fragments](/guide/migration/fragments) 支持的根目录！
