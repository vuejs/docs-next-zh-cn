---
sidebarDepth: 1
---

# 单文件组件样式特性

## `<style scoped>`

当 `<style>` 标签带有 `scoped` attribute 的时候，它的 CSS 只会应用到当前组件的元素上。这类似于 Shadow DOM 中的样式封装。它带有一些注意事项，不过好处是不需要任何的 polyfill。它是通过 PostCSS 转换以下内容来实现的：

```vue
<style scoped>
.example {
  color: red;
}
</style>

<template>
  <div class="example">hi</div>
</template>
```

转换为：

```vue
<style>
.example[data-v-f3f3eg9] {
  color: red;
}
</style>

<template>
  <div class="example" data-v-f3f3eg9>hi</div>
</template>
```

### 子组件的根元素

在带有 `scoped` 的时候，父组件的样式将不会泄露到子组件当中。不过，子组件的根节点会同时被父组件的作用域样式和子组件的作用域样式影响。这是有意为之的，这样父组件就可以设置子组件根节点的样式，以达到调整布局的目的。

### 深度选择器

处于 `scoped` 样式中的选择器如果想要做更“深度”的选择，也即：影响到子组件，可以使用 `:deep()` 这个伪类：

```vue
<style scoped>
.a :deep(.b) {
  /* ... */
}
</style>
```

上面的代码会被编译成：

```css
.a[data-v-f3f3eg9] .b {
  /* ... */
}
```

:::tip
通过 `v-html` 创建的 DOM 内容不会被作用域样式影响，但你仍然可以使用深度选择器来设置其样式。
:::

### 插槽选择器

默认情况下，作用域样式不会影响到 `<slot/>` 渲染出来的内容，因为它们被认为是父组件所持有并传递进来的。使用 `:slotted` 伪类以确切地将插槽内容作为选择器的目标：

```vue
<style scoped>
:slotted(div) {
  color: red;
}
</style>
```

### 全局选择器

如果想让其中一个样式规则应用到全局，比起另外创建一个 `<style>`，可以使用 `:global` 伪类来实现 (看下面的代码)：

```vue
<style scoped>
:global(.red) {
  color: red;
}
</style>
```

### 混合使用局部与全局样式

你也可以在同一个组件中同时包含作用域样式和非作用域样式：

```vue
<style>
/* global styles */
</style>

<style scoped>
/* local styles */
</style>
```

### 作用域样式提示

- **作用域样式并没有消除对 CSS 类的需求**。由于浏览器渲染渲染各种各样 CSS 选择器的方式，`p { color: red }` 结合作用域样式使用时会慢很多倍 (也即当与 attribute 选择器组合使用的时候)。如果使用 class 或者 id 来替代，例如 `.example { color: red }`，那你事实上可以避免这个性能损失。

- **小心递归组件中的后代选择器**。对于一个使用了 `.a .b` 选择器的样式规则来说，如果匹配到 `.a` 的元素包含了一个递归的子组件，那么所有的在那个子组件中的 `.b` 都会匹配到这条样式规则。

## `<style module>`

`<style module>` 标签会被编译为 [CSS Modules](https://github.com/css-modules/css-modules) 并且将生成的 CSS 类作为 `$style` 对象的键暴露给组件。

```vue
<template>
  <p :class="$style.red">
    This should be red
  </p>
</template>

<style module>
.red {
  color: red;
}
</style>
```

对生成的类进行散列以避免冲突，实现了将 CSS 仅作用于当前组件的相同效果。

参考 [CSS Modules 规范](https://github.com/css-modules/css-modules)以查看更多详情，例如 [global exceptions](https://github.com/css-modules/css-modules#exceptions) 和 [composition](https://github.com/css-modules/css-modules#composition)。

### 自定义注入名称

您可以通过给 `module` attribute 一个值来自定义注入的 class 对象的 property 键：

```vue
<template>
  <p :class="classes.red">red</p>
</template>

<style module="classes">
.red {
  color: red;
}
</style>
```

### 与组合式 API 一同使用

注入的类可以通过 [`useCssModule`](/api/global-api.html#usecssmodule) API 在 `setup()` 和 `<script setup>` 中使用。对于使用了自定义注入名称的 `<style module>` 模块，`useCssModule` 接收一个对应的 `module` attribute 值作为第一个参数。

```js
// 默认, 返回 <style module> 中的类
useCssModule()

// 命名, 返回 <style module="classes"> 中的类
useCssModule('classes')
```

## 状态驱动的动态 CSS

单文件组件的 `<style>` 标签可以通过 `v-bind` 这一 CSS 函数将 CSS 的值关联到动态的组件状态上：

```vue
<template>
  <div class="text">hello</div>
</template>

<script>
export default {
  data() {
    return {
      color: 'red'
    }
  }
}
</script>

<style>
.text {
  color: v-bind(color);
}
</style>
```

这个语法同样也适用于 [`<script setup>`](./sfc-script-setup)，且支持 Javascript 表达式 (需要用引号包裹起来)

```vue
<script setup>
const theme = {
  color: 'red'
}
</script>

<template>
  <p>hello</p>
</template>

<style scoped>
p {
  color: v-bind('theme.color');
}
</style>
```

实际的值会被编译成散列的 CSS 自定义 property，CSS 本身仍然是静态的。自定义 property 会通过内联样式的方式应用到组件的根元素上，并且在源值变更的时候响应式更新。
