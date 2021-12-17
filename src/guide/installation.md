# 安装

Vue.js 设计的初衷就包括可以被渐进式地采用。这意味着它可以根据需求以多种方式集成到一个项目中。

将 Vue.js 添加到项目中主要有四种方式：

1. 在页面上以 [CDN 包](#cdn)的形式导入。
2. 下载 JavaScript 文件并[自行托管](#下载并自托管)。
3. 使用 [npm](#npm) 安装它。
4. 使用官方的 [CLI](#命令行工具-cli) 来构建一个项目，它为现代前端工作流程提供了功能齐备的构建设置 (例如，热重载、保存时的提示等等)。

## 发布版本说明

最新版本：![npm](https://img.shields.io/npm/v/vue/next.svg)

每个版本的详细发布说明都可以在 [GitHub](https://github.com/vuejs/vue-next/blob/master/CHANGELOG.md) 上找到。

## Vue Devtools

> 目前处于测试阶段 - Vuex 和 Router 的集成仍在进行中。

<VideoLesson href="https://vueschool.io/lessons/using-vue-dev-tools-with-vuejs-3?friend=vuejs" title="在 Vue School 学习如何安装">通过 Vue School 的免费课程学习如何安装和使用 Vue Devtools</VideoLesson>

在使用 Vue 时，我们推荐在你的浏览器上安装 [Vue Devtools](https://github.com/vuejs/vue-devtools#vue-devtools)，它允许你在一个更友好的界面中审查和调试 Vue 应用。

[获取 Chrome 扩展程序](https://chrome.google.com/webstore/detail/vuejs-devtools/ljjemllljcmogpfapbkkighbhhppjdbg)

[获取 Firefox 附加组件](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)

[获取独立的 Electron 应用程序](https://github.com/vuejs/vue-devtools/blob/dev/packages/shell-electron/README.md)

## CDN

对于制作原型或学习，你可以这样使用最新版本：

```html
<script src="https://unpkg.com/vue@next"></script>
```
对于生产环境，我们推荐链接到一个明确的版本号和构建文件，以避免新版本造成的不可预期的破坏。

## 下载并自托管

如果你想避免使用构建工具，但又无法在生产环境使用 CDN，那么你可以下载相关 `.js` 文件并自行托管在你的服务器上。然后你可以通过 `<script>` 标签引入，与使用 CDN 的方法类似。

这些文件可以在 [unpkg](https://unpkg.com/browse/vue@next/dist/) 或者 [jsDelivr](https://cdn.jsdelivr.net/npm/vue@next/dist/) 这些 CDN 上浏览和下载。各种不同文件将在[以后解释](#对不同构建版本的解释)，但你通常需要同时下载开发环境构建版本以及生产环境构建版本。

## npm

在用 Vue 构建大型应用时推荐使用 npm 安装<sup>[[1]](#footnote-1)</sup> 。npm 能很好地和诸如 [webpack](https://webpack.js.org/) 或 [Rollup](https://rollupjs.org/) 模块打包器配合使用。

```bash
# 最新稳定版
$ npm install vue@next
```

Vue 还提供了编写[单文件组件](../guide/single-file-component.html)的配套工具。如果你想使用单文件组件，那么你还需要安装 `@vue/compiler-sfc`：

```bash
$ npm install -D @vue/compiler-sfc
```

如果你是从 Vue 2 过渡而来的，请注意 `@vue/compiler-sfc` 替换掉了 `vue-template-compiler`

除了 `@vue/compiler-sfc` 之外，你还需要为已选择的打包工具选择一个配套的单文件组件 loader 或 plugin。更多信息请查阅[单文件组件文档](../guide/single-file-component.html)。

大多数情况下，我们更倾向于使用 Vue CLI 来创建一个配置最小化的 webpack 构建版本。

## 命令行工具 (CLI)

Vue 提供了一个[官方的 CLI](https://cli.vuejs.org/zh/)，为单页面应用 (SPA) 快速搭建繁杂的脚手架。它为现代前端工作流提供了功能齐备的构建设置。只需要几分钟的时间就可以运行起来并带有热重载、保存时 lint 校验，以及生产环境可用的构建版本。更多详情可查阅 [Vue CLI 的文档](https://cli.vuejs.org/zh/)。

:::tip
CLI 工具假定用户对 Node.js 和相关构建工具有一定程度的了解。如果你是新手，我们强烈建议先在不用构建工具的情况下通读[指南](./introduction.html)，在熟悉 Vue 本身之后再使用 CLI。
:::

对于 Vue 3，你应该使用 `npm` 上可用的 Vue CLI v4.5 作为 `@vue/cli`。要升级，你应该需要全局重新安装最新版本的 `@vue/cli`：

```bash
yarn global add @vue/cli
# 或
npm install -g @vue/cli
```

然后在 Vue 项目中运行：

```bash
vue upgrade --next
```

## Vite

[Vite](https://cn.vitejs.dev/) 是一个 web 开发构建工具，由于其原生 ES 模块导入方式，可以实现闪电般的冷服务器启动。

通过在终端中运行以下命令，可以使用 Vite 快速构建 Vue 项目。

使用 npm：

```bash
# npm 6.x
$ npm init vite@latest <project-name> --template vue

# npm 7+，需要加上额外的双短横线
$ npm init vite@latest <project-name> -- --template vue

$ cd <project-name>
$ npm install
$ npm run dev
```

或者 yarn：

```bash
$ yarn create vite <project-name> --template vue
$ cd <project-name>
$ yarn
$ yarn dev
```

或者 pnpm:

```bash
$ pnpm create vite <project-name> -- --template vue
$ cd <project-name>
$ pnpm install
$ pnpm dev
```

## 对不同构建版本的解释

在 [npm 包的 dist/ 目录](https://cdn.jsdelivr.net/npm/vue@3.0.2/dist/)你将会找到很多不同的 Vue.js 构建版本。下面是一个概述，根据不同的使用情况，应该使用哪个 `dist` 文件：

### 使用 CDN 或没有构建工具

#### `vue(.runtime).global(.prod).js`：

- 若要通过浏览器中的 `<script src="...">` 直接使用，则暴露 Vue 全局。
- 浏览器内模板编译：
  - `vue.global.js` 是包含编译器和运行时的“完整”构建版本，因此它支持动态编译模板。
  - `vue.runtime.global.js` 只包含运行时，并且需要在构建步骤期间预编译模板。
- 内联所有 Vue 核心内部包——即：它是一个单独的文件，不依赖于其他文件。这意味着你必须导入此文件和此文件中的所有内容，以确保获得相同的代码实例。
- 包含硬编码的 prod/dev 分支，并且 prod 构建版本是预先压缩过的。将 `*.prod.js` 文件用于生产环境。

:::tip 提示
全局打包不是 [UMD](https://github.com/umdjs/umd) 构建的，它们被打包成 [IIFEs](https://developer.mozilla.org/en-US/docs/Glossary/IIFE)，并且仅用于通过 `<script src="...">` 直接使用。
:::

#### `vue(.runtime).esm-browser(.prod).js`：

- 用于通过原生 ES 模块导入使用 (在浏览器中通过 `<script type="module">` 来使用)。
- 与全局构建版本共享相同的运行时编译、依赖内联和硬编码的 prod/dev 行为。

### 使用构建工具

#### `vue(.runtime).esm-bundler.js`：

- 用于 `webpack`，`rollup` 和 `parcel` 等构建工具。
- 留下 prod/dev 分支的 `process.env.NODE_ENV` 守卫语句 (必须由构建工具替换)。
- 不提供压缩版本 (打包后与其余代码一起压缩)。
- import 依赖 (例如：`@vue/runtime-core`，`@vue/runtime-compiler`)
  - 导入的依赖项也是 esm bundler 构建版本，并将依次导入其依赖项 (例如：@vue/runtime-core imports @vue/reactivity)。
  - 这意味着你**可以**单独安装/导入这些依赖，而不会导致这些依赖项的不同实例，但你必须确保它们都为同一版本。
- 浏览器内模板编译：
  - `vue.runtime.esm-bundler.js` **(默认)** 仅运行时，并要求所有模板都要预先编译。这是构建工具的默认入口 (通过 `package.json` 中的 module 字段)，因为在使用构建工具时，模板通常是预先编译的 (例如：在 `*.vue` 文件中)。
  - `vue.esm-bundler.js` 包含运行时编译器。如果你使用了一个构建工具，但仍然想要运行时的模板编译 (例如，DOM 内 模板或通过内联 JavaScript 字符串的模板)，请使用这个文件。你需要配置你的构建工具，将 vue 设置为这个文件。

### 对于服务端渲染

#### `vue.cjs(.prod).js`：

- 通过 `require()` 在 Node.js 服务器端渲染使用。
- 如果你将应用程序与带有 `target: 'node'` 的 webpack 打包在一起，并正确地将 `vue` 外部化，则将加载此文件。
- dev/prod 文件是预构建的，但是会根据 `process.env.NODE_ENV` 自动加载相应的文件。

## 运行时 + 编译器 vs. 仅运行时

如果需要在客户端上编译模板 (即：将字符串传递给 template 选项，或者使用元素的 DOM 内 HTML 作为模板挂载到元素)，你将需要编译器，因此需要完整的构建版本：

```js
// 需要编译器
Vue.createApp({
  template: '<div>{{ hi }}</div>'
})

// 不需要
Vue.createApp({
  render() {
    return Vue.h('div', {}, this.hi)
  }
})
```

当使用 `vue-loader` 时，`*.vue` 文件中的模板会在构建时预编译为 JavaScript，在最终的捆绑包中并不需要编译器，因此可以只使用运行时构建版本。

<small>**译者注**  
<a id="footnote-1"></a>[1] 对于中国大陆用户，建议将 NPM 源设置为[国内的镜像](https://npmmirror.com/)，可以大幅提升安装速度。</small>
