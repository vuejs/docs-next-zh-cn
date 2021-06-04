# 单文件组件

## 介绍

在很多 Vue 项目中，我们使用 `app.component` 来定义全局组件，紧接着用 `app.mount('#app')` 在每个页面内指定一个容器元素。

这对于中小型项目非常有效，在这些项目里 JavaScript 只被用来增强特定的视图。但当在更复杂的项目中，或者你的前端完全由 JavaScript 驱动的时候，下面这些缺点将变得非常明显：

- **全局定义 (Global definitions)** 强制要求每个 component 中的命名不得重复；
- **字符串模板 (String templates)** 缺乏语法高亮，在 HTML 有多行的时候，需要用到丑陋的 `\`；
- **不支持 CSS (No CSS support)** 意味着当 HTML 和 JavaScript 组件化时，CSS 明显被遗漏；
- **没有构建步骤 (No build step)** 限制只能使用 HTML 和 ES5 JavaScript，而不能使用预处理器，如 Pug (曾经的 Jade) 和 Babel。

所有这些都可以通过扩展名为 `.vue` 的 **single-file components (单文件组件)** 来解决，并且还可以使用 webpack 或 Browserify 等构建工具。

这是一个文件名为 `Hello.vue` 的简单实例：

<a href="https://codepen.io/team/Vue/pen/3de13b5cd0133df4ecf307b6cf2c5f94" target="_blank" rel="noopener noreferrer"><img src="/images/sfc.png" width="403" alt="Single-file component example (click for code as text)" style="display: block; margin: 15px auto; max-width: 100%"></a>

现在我们获得：

- [完整语法高亮](https://github.com/vuejs/awesome-vue#source-code-editing)
- [CommonJS 模块](https://webpack.js.org/concepts/modules/#what-is-a-webpack-module)
- [组件作用域的 CSS](https://vue-loader.vuejs.org/en/features/scoped-css.html)

正如我们说过的，我们可以使用预处理器来构建简洁和功能更丰富的组件，比如 Pug，Babel (with ES2015 modules)，和 Stylus。

<a href="https://codesandbox.io/s/vue-single-file-component-with-pre-processors-mr3ik?file=/src/App.vue" target="_blank" rel="noopener noreferrer"><img src="/images/sfc-with-preprocessors.png" width="563" alt="Single-file component with pre-processors example (click for code as text)" style="display: block; margin: 15px auto; max-width: 100%"></a>

这些特定的语言只是例子，你可以只是简单地使用 Babel，TypeScript，SCSS，PostCSS 或者其他任何能够帮助你提高生产力的预处理器。如果搭配 `vue-loader` 使用 webpack，它也能为 CSS Modules 提供头等支持。

### 怎么看待关注点分离？

值得注意的是，**关注点分离不等于文件类型分离**。在现代 UI 开发中，我们已经发现相比于把代码库分离成三个大的层次并将其相互交织起来，把它们划分为松散耦合的组件再将其组合起来更合理一些。在一个组件里，其模板、逻辑和样式是内部耦合的，并且把他们搭配在一起实际上使得组件更加内聚且更可维护。

即便你不喜欢单文件组件，你仍然可以把 JavaScript、CSS 分离成独立的文件然后做到热重载和预编译。

```html
<!-- my-component.vue -->
<template>
  <div>This will be pre-compiled</div>
</template>
<script src="./my-component.js"></script>
<style src="./my-component.css"></style>
```

## 起步

### 在线演示

如果你希望深入了解并开始使用单文件组件，请来 CodeSandbox [看看这个简单的 todo 应用](https://codesandbox.io/s/vue-todo-list-app-with-single-file-component-vzkl3?file=/src/App.vue)。

### 针对刚接触 JavaScript 模块开发系统的用户

有了 `.vue` 组件，我们就进入了高阶 JavaScript 应用领域。如果你没有准备好的话，意味着还需要学会使用一些附加的工具：

- **Node 包管理器 (npm)**： 阅读 [Getting Started guide](https://docs.npmjs.com/packages-and-modules/getting-packages-from-the-registry) 中关于如何从注册地 (registry) 获取包的章节。

- **现代 JavaScript 与 ES2015/16**：阅读 Babel 的 [Learn ES2015 guide](https://babeljs.io/docs/en/learn)。你不需要立刻记住每一个方法，但是你可以保留这个页面以便后期参考。

在你花一天时间了解这些资源之后，我们建议你参考 [Vue CLI](https://cli.vuejs.org/)。只要遵循指示，你就能很快地运行一个带有 `.vue` 组件、ES2015、webpack 和热重载 (hot-reloading) 的 Vue 项目！

### 针对高阶用户

CLI 会为你搞定大多数工具的配置问题，同时也支持细粒度自定义[配置项](https://cli.vuejs.org/config/)。

有时你会想从零搭建你自己的构建工具，这时你需要通过 [Vue Loader](https://vue-loader.vuejs.org) 手动配置 webpack。关于学习更多 webpack 的内容，请查阅[其官方文档](https://webpack.js.org/configuration/)和 [Webpack Academy](https://webpack.academy/p/the-core-concepts)。

### 使用 rollup 构建

在开发第三方库的时候，大多数时候我们都希望以一种允许类库用户 [tree shake](https://webpack.js.org/guides/tree-shaking/) 的方式来构建它。为了实现 tree-shaking，我们需要构建 `esm` 模块。由于 webpack 以及 vue-cli 都不支持构建 `esm` 模块，我们需要依靠 [rollup](https://rollupjs.org/)。

#### 安装 Rollup

我们需要安装 Rollup 和一些依赖：

```bash
npm install --save-dev rollup @rollup/plugin-commonjs rollup-plugin-vue
```

这些都是我们需要用来编译 `esm` 模块中的代码的最小化的 rollup 插件。我们可能还需要添加 [rollup-plugin-babel](https://github.com/rollup/plugins/tree/master/packages/babel) 来移植它们的代码，如果我们需要与库捆绑一起的依赖关系，还需要添加 [node-resolve](https://github.com/rollup/plugins/tree/master/packages/node-resolve)。

#### 配置 Rollup

要配置 Rollup 进行构建，我们需要在项目的根目录创建一个 `rollup.config.js` 文件。

```bash
touch rollup.config.js
```

创建文件后，选择需要的编辑器打开并添加以下代码：

```js
// 导入我们的第三方插件
import commonjs from 'rollup-plugin-commonjs'
import VuePlugin from 'rollup-plugin-vue'
import pkg from './package.json' // 导入我们的 package.json 文件，重新使用命名。

export default {
  // 这是一个包含所有导出的组件/函数的文件。
  input: 'src/index.js',
  // 这是一个输出格式的数组
  output: [
    {
      file: pkg.module, // 我们的 ESM 库的名词
      format: 'esm', // 选择的格式
      sourcemap: true // 要求 rollup 包含 sourcemap
    }
  ],
  // 这是我们所包含插件的数组
  plugins: [commonjs(), VuePlugin()],
  // 要求 rollup 不要将 Vue 捆绑在库中。
  external: ['vue']
}
```

#### 配置 package.json

为了利用我们新创建的 `esm` 模块，我们需要在 `package.json` 文件中添加一些字段。

```json
 "scripts": {
   ...
   "build": "rollup -c rollup.config.js",
   ...
 },
 "module": "dist/my-library-name.esm.js",
 "files": [
   "dist/",
 ],
```

在这里，我们要说明的是：

- 如何打包
- 我们要在依赖中捆绑哪些文件
- 什么文件代表我们的 `esm` 模块

#### 打包 `umd` 和 `cjs` 模块

要构建 `umd` 和 `cjs` 模块，我们可以简单地在 `rollup.config.js` 和 `package.json` 中添加几行配置。

##### rollup.config.js

```js
output: [
  ...{
    file: pkg.main,
    format: 'cjs',
    sourcemap: true
  },
  {
    file: pkg.unpkg,
    format: 'umd',
    name: 'MyLibraryName',
    sourcemap: true,
    globals: {
      vue: 'Vue'
    }
  }
]
```

##### package.json

```json
"module": "dist/my-library-name.esm.js",
"main": "dist/my-library-name.cjs.js",
"unpkg": "dist/my-library-name.global.js",
```
