---
badges:
  - breaking
---

# 与自定义元素的互操作性 <MigrationBadges :badges="$frontmatter.badges" />

## 概览

- **非兼容**：检测并确定哪些标签应该被视为自定义元素的过程，现在会在模板编译期间执行，且应该通过编译器选项而不是运行时配置来配置。
- **非兼容**：特殊的 `is` attribute 的使用被严格限制在保留的 `<component>` 标签中。
- **新增**：为了支持 2.x 在原生元素上使用 `is` 的用例来处理原生 HTML 解析限制，我们用 `vue:` 前缀来解析一个 Vue 组件。

## 自主定制元素

如果我们想要在 Vue 外部定义添加自定义元素 (例如使用 Web Components API)，则需要“指示”Vue 将其视为自定义元素。让我们以下面的模板为例。

```html
<plastic-button></plastic-button>
```

### 2.x 语法

在 Vue 2.x 中，通过 `Vue.config.ignoredElements` 将标签配置为自定义元素：

```js
// 这将使 Vue 忽略在其外部定义的自定义元素
// (例如：使用 Web Components API)

Vue.config.ignoredElements = ['plastic-button']
```

### 3.x 语法

**在 Vue 3.0 中，此检查在模板编译期间执行**。要指示编译器将 `<plastic-button>` 视为自定义元素：

- 如果使用构建步骤：给 Vue 模板编译器传入 `isCustomElement` 选项。如果使用了 `vue-loader`，则应通过 `vue-loader` 的 `compilerOptions` 选项传递：

  ```js
  // webpack 中的配置
  rules: [
    {
      test: /\.vue$/,
      use: 'vue-loader',
      options: {
        compilerOptions: {
          isCustomElement: tag => tag === 'plastic-button'
        }
      }
    }
    // ...
  ]
  ```

- 如果使用动态模板编译，请通过 `app.config.compilerOptions.isCustomElement` 传递：

  ```js
  const app = Vue.createApp({})
  app.config.compilerOptions.isCustomElement = tag => tag === 'plastic-button'
  ```

  需要注意的是，运行时配置只会影响运行时的模板编译——它不会影响预编译的模板。

## 定制内置元素

自定义元素规范提供了一种将自定义元素作为[自定义内置元素](https://html.spec.whatwg.org/multipage/custom-elements.html#custom-elements-customized-builtin-example)的方法，方法是向内置元素添加 `is` attribute：

```html
<button is="plastic-button">点击我!</button>
```

在原生 attribute 于浏览器中普遍可用之前，Vue 对 `is` 这个特殊 attribute 的使用就已经在模拟其行为。但是，在 2.x 中，它将被解释为渲染一个名为 `plastic-button` 的 Vue 组件，这将阻碍上面所提到的自定义内置元素的原生用法。

在 3.0 中，我们将 Vue 对 `is` attribute 的特殊处理限制在了 `<component>` 标签中。

- 在保留的 `<component>` 标签上使用时，它的行为将与 2.x 中完全相同；
- 在普通组件上使用时，它的行为将类似于普通 attribute：

  ```html
  <foo is="bar" />
  ```

  - 2.x 的行为：渲染 `bar` 组件。
  - 3.x 的行为：渲染 `foo` 组件，并将 `is` attribute 传递给它。

- 在普通元素上使用时，它将作为 `is` attribute 传递给 `createElement` 调用，并作为原生 attribute 渲染。这支持了自定义内置元素的用法。

  ```html
  <button is="plastic-button">点击我！</button>
  ```

  - 2.x 的行为：渲染 `plastic-button` 组件。
  - 3.x 的行为：通过调用以下函数渲染原生的 button

    ```js
    document.createElement('button', { is: 'plastic-button' })
    ```

[迁移构建开关：`COMPILER_IS_ON_ELEMENT`](migration-build.html#兼容性配置)

## 使用 `vue:` 前缀来解决 DOM 内模板解析问题

> 提示：本节仅影响直接在页面的 HTML 中写入 Vue 模板的情况。
> 在 DOM 模板中使用时，模板受原生 HTML 解析规则的约束。一些 HTML 元素，例如 `<ul>`、`<ol>`、`<table>` 和 `<select>` 对它们内部可以出现的元素有限制，以及一些像 `<li>`、`<tr>`、和 `<option>` 只能出现在特定的其他元素中。

### 2.x 语法

在 Vue 2 中，我们建议在原生标签上使用 `is` attribute 来绕过这些限制：

```html
<table>
  <tr is="blog-post-row"></tr>
</table>
```

### 3.x 语法

随着 `is` 的行为发生变化，现在将元素解析为 Vue 组件需要添加一个 `vue:` 前缀：

```html
<table>
  <tr is="vue:blog-post-row"></tr>
</table>
```

## 迁移策略

- 将 `config.ignoredElements` 替换为 `vue-loader` 的 `compilerOptions` (使用构建步骤) 或 `app.config.compilerOptions.isCustomElement` (使用动态模板编译)

- 将所有非针对 `<component>` 标签的 `is` 用法更改为 `<component is="...">` (对于 SFC 模板) 或为其添加 `vue:` 前缀 (对于 DOM 内模板)。
