# SFC 语法规范

## 介绍

`*.vue` 文件是使用类 HTML 语法来描述 Vue 组件的一种自定义文件格式。每一个 `*.vue` 文件都由三种类型的顶层语法块所组成：`<template>`、`<script>`、`<style>` 以及可选的附加自定义块：

```vue
<template>
  <div class="example">{{ msg }}</div>
</template>

<script>
export default {
  data() {
    return {
      msg: 'Hello world!'
    }
  }
}
</script>

<style>
.example {
  color: red;
}
</style>

<custom1>
  这里可以是，例如：组件的文档
</custom1>
```

## 语言块

### `<template>`

- 每个 `*.vue` 文件最多可同时包含一个顶层 `<template>` 块。

- 其中的内容会被提取出来并传递给 `@vue/compiler-dom`，预编译为 JavaScript 的渲染函数，并附属到导出的组件上作为其 `render` 选项。

### `<script>`

- 每一个 `*.vue` 文件最多可同时包含一个 `<script>` 块 (不包括[`<script setup>`](/api/sfc-script-setup.html))。

- 该脚本将作为 ES Module 来执行。

- 其**默认导出**的内容应该是 Vue 组件选项对象，它要么是一个普通的对象，要么是 [defineComponent](/api/global-api.html#definecomponent) 的返回值。

### `<script setup>`

- 每个 `*.vue` 文件最多可同时包含一个 `<script setup>` 块 (不包括常规的 `<script>`)

- 该脚本会被预处理并作为组件的 `setup()` 函数使用，也就是说它会在**每个组件实例**中执行。`<script setup>` 的顶层绑定会自动暴露给模板。更多详情请查看 [`<script setup>` 文档](/api/sfc-script-setup)。

### `<style>`

- 一个 `*.vue` 文件可以包含多个 `<style>` 标签。

- `<style>` 标签可以通过 `scoped` 或 `module` attribute (更多详情请查看 [SFC 样式特性](/api/sfc-style)) 将样式封装在当前组件内。多个不同封装模式的 `<style>` 标签可以在同一个组件中混用。

### 自定义块

为了满足任何项目特定的需求，`*.vue` 文件中还可以包含额外的自定义块，例如 `<docs>` 块。自定义块的一些真实场景的案例包括：

- [Gridsome: `<page-query>`](https://gridsome.org/docs/querying-data/)
- [vite-plugin-vue-gql: `<gql>`](https://github.com/wheatjs/vite-plugin-vue-gql)
- [vue-i18n: `<i18n>`](https://github.com/intlify/bundle-tools/tree/main/packages/vite-plugin-vue-i18n#i18n-custom-block)

对 Custom Block 的处理依赖于工具——如果你想要构建自己的自定义块集成，更多详情请查看 [SFC 工具](/api/sfc-tooling.html#custom-blocks-integration)。

## 自动 `name` 推断

SFC 在下列情况会依据它的**文件名**来自动推断组件名称：

- 开发环境警告格式化
- DevTools 检查
- 递归的自引用。例如：名为 `FooBar` 的文件可以在模板中用 `<FooBar/>` 引用它自己。这种方式比明确注册或引入的组件的优先级要低。

## 预处理

块可以使用 `lang` attribute 声明预处理语言。最常见的场景就是在 `<script>` 块中使用 TypeScript：

```html
<script lang="ts">
  // 使用 TypeScript
</script>
```

`lang` 可以用于任何块——例如可以在 `<style>` 中使用 [Sass](https://sass-lang.com/) 以及在 `<template>` 中使用 [Pug](https://pugjs.org/api/getting-started.html)：

```html
<template lang="pug">
p {{ msg }}
</template>

<style lang="scss">
  $primary-color: #333;
  body {
    color: $primary-color;
  }
</style>
```

注意，基于不同的工具链，预处理器的集成方式有所不同。查看相关文档以获取示例：

- [Vite](https://vitejs.dev/guide/features.html#css-pre-processors)
- [Vue CLI](https://cli.vuejs.org/guide/css.html#pre-processors)
- [webpack + vue-loader](https://vue-loader.vuejs.org/guide/pre-processors.html#using-pre-processors)

## Src 引入

如果你倾向于将 `*.vue` 组件拆分为多个文件，可以使用 `src` attribute 来引入外部的文件作为语言块：

```vue
<template src="./template.html"></template>
<style src="./style.css"></style>
<script src="./script.js"></script>
```

注意 `src` 引入所需遵循的路径解析规则与 webpack 模块请求一致，即：

- 相对路径需要以 `./` 开头。
- 你可以从 npm 依赖中引入资源：

```vue
<!-- 从已安装的 "todomvc-app-css" npm 包中引入文件 -->
<style src="todomvc-app-css/index.css">
```

`src` 引入也能用于自定义块，例如：

```vue
<unit-test src="./unit-test.js">
</unit-test>
```

## 注释

在每个块中，注释应该使用相应语言 (HTML, CSS, JavaScript, Pug, 等等) 的语法。对于顶层的注释而言，使用 HTML 注释语法：`<!-- 这里是注释内容 -->`。
