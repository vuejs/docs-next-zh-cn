# 安装

Vue.js 在设计上是可以逐步采纳的。这意味着它可以根据需求以多种方式集成到一个项目中。

将 Vue.js 添加到项目中有三种主要方式。

1. 在页面上以 [CDN package](#cdn) 的形式导入。
2. 使用 [npm](#npm) 安装它。
3. 使用官方的 [CLI](#cli) 来构建一个项目，它为现代前端工作流程提供了功能完备的构建设置 (例如，热重载、保存时的提示等等)。

## 发布版本说明

最新版本：![npm](https://img.shields.io/npm/v/vue/next.svg)

每个版本的详细发行说明可在 [GitHub](https://github.com/vuejs/vue-next/blob/master/CHANGELOG.md) 上找到。

## Vue Devtools

> 当前是 Beta 版——Vuex 和 Router 的集成仍然是 WIP 

在使用 Vue 时，我们推荐在你的浏览器上安装 [Vue Devtools](https://github.com/vuejs/vue-devtools#vue-devtools)，它允许你在一个更友好的界面中审查和调试 Vue 应用。

[获取 Chrome Extension](https://chrome.google.com/webstore/detail/vuejs-devtools/ljjemllljcmogpfapbkkighbhhppjdbg)

[获取 Firefox 插件](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)

[获取标准的 Electron app](https://github.com/vuejs/vue-devtools/blob/dev/packages/shell-electron/README.md)

## CDN

对于制作原型或学习，你可以这样使用最新版本

```html
<script src="https://unpkg.com/vue@next"></script>
```
对于生产环境，我们推荐链接到指定的版本号进行构建，以避免新版本造成的不可预期的破坏：

## npm
在用 Vue 构建大型应用时推荐使用 npm 安装<sup>[[1]](#footnote-1)</sup> 。npm 能很好地和诸如 [Webpack](https://webpack.js.org/) 或 [Rollup](https://rollupjs.org/) 模块打包器配合使用。同时 Vue 也提供配套工具来开发[单文件组件](../guide/single-file-component.html)。

```bash
# 最新稳定版
$ npm install vue@next
```

## 命令行工具 (CLI)

Vue 提供了一个[官方的 CLI](https://github.com/vuejs/vue-cli)，为单页面应用 (SPA) 快速搭建繁杂的脚手架。它为现代前端工作流提供了完备的构建设置。仅需几分钟就可以建立并且运行起一个带有热重载、保存时 lint 校验，以及生产环境可用的构建版本。更多详情可查阅 [Vue CLI 的文档](https://cli.vuejs.org)。

:::tip
CLI 工具假定用户对 Node.js 和相关构建工具有一定程度的了解。如果你是新手，我们强烈建议先在不用构建工具的情况下通读[指南](./introduction.html)，在熟悉 Vue 本身之后再使用 CLI。
:::

对于 Vue 3，你应该使用 `npm` 上可用的 Vue CLI v4.5 作为 `@vue/cli@next`。要升级，你应该需要全局重新安装最新版本的 `@vue/cli`：

```bash
yarn global add @vue/cli@next
# OR
npm install -g @vue/cli@next
```

然后在 Vue 项目运行：

```bash
vue upgrade --next
```

## Vite

[Vite](https://github.com/vitejs/vite) 是一个 web 开发构建工具，由于其原生 ES 模块导入方法，它允许快速提供代码。

通过在终端中运行以下命令，可以使用 Vite 快速构建 Vue 项目。

使用 npm：

```bash
$ npm init vite-app <project-name>
$ cd <project-name>
$ npm install
$ npm run dev
```

或者 yarn：

```bash
$ yarn create vite-app <project-name>
$ cd <project-name>
$ yarn
$ yarn dev
```

## 对不同构建版本的解释

在 [npm 包的 dist/ 目录](https://cdn.jsdelivr.net/npm/vue@3.0.0-rc.1/dist/)你将会找到很多不同的 Vue.js 构建版本。这里列出了它们之间的差别：

### 使用 CDN 或没有构建工具

#### `vue(.runtime).global(.prod).js`：

- 若要通过浏览器中的 `<script src="...">` 直接使用，则暴露 Vue 全局；
- 浏览器内模板编译：
  - `vue.global.js` 是包含编译器和运行时的“完整”构建，因此它支持动态编译模板。
  - `vue.runtime.global.js` 只包含运行时，并且需要在构建步骤期间预编译模板。
- 内联所有 Vue 核心内部包——即：它是一个单独的文件，不依赖于其他文件，这意味着你必须导入此文件和此文件中的所有内容，以确保获得相同的代码实例。
- 包含硬编码的 prod/dev 分支，并且 prod 构建是预先缩小的。使用 `*.prod.js` 用于生产的文件。

:::tip 提示
全局打包不是 [UMD](https://github.com/umdjs/umd) 构建的，它们被打包成 [IIFEs](https://developer.mozilla.org/en-US/docs/Glossary/IIFE)，并且仅用于通过 `<script src="...">` 直接使用。
:::

#### `vue(.runtime).esm-browser(.prod).js`：

- 用于通过原生 ES 模块导入使用 (在浏览器中通过 `<script type="module">`；
- 与全局构建共享相同的运行时编译、依赖内联和硬编码的 prod/dev 行为。

### 使用构建工具

#### `vue(.runtime).esm-bundler.js`：

- 使用构建工具像 `webpack`，`rollup` 和 `parcel`。
- <a id="argue-1"></a>TODO：将 prod/dev 分支留给 `process.env.NODE_ENV guards` (需要更换构建工具)
- 不提供最小化版本 (捆绑后与其余代码一起完成)
- import 依赖 (例如：`@vue/runtime-core`，`@vue/runtime-compiler`)
  - 导入的依赖项也是 esm bundler 构建，并将依次导入其依赖项 (例如：@vue/runtime-core imports @vue/reactivity)
  - 这意味着你**可以**单独安装/导入这些依赖，而不会导致这些依赖项的不同实例，但你必须确保它们都为同一版本。
-  浏览器内模板编译：
  - `vue.runtime.esm-bundler.js` **(默认)** 仅运行时，并要求所有模板都要预先编译。这是打包工具的默认入口 (通过 `package.json` 中的 module 字段)，因为在使用 bundler 时，模板通常是预先编译的 (例如：在 `*.vue` 文件中)，你需要将打包工具配置 vue 别名到这个文件

### 对于服务端渲染

- `vue.cjs(.prod).js`：
  - 或用于 Node.js 通过 `require()` 进行服务器端渲染。
  - 如果你将应用程序与带有 `target: 'node'` 的 webpack 打包在一起，并正确地将 `vue` 外部化，则将加载此构建。
  - dev/prod 文件是预构建的，但是根据 `process.env.NODE_env` 会自动需要相应的文件。

## 运行时 + 编译器 vs. 仅运行时

如果需要在客户端上编译模板 (即：将字符串传递给 template 选项，或使用其在 DOM 中 HTML 作为模板挂载到元素)，你需要编译器，因此需要完整的版本：

```js
//  需要编译器
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

当使用 `vue-loader` 时，`*.vue` 文件中的模板在生成时预编译为 JavaScript，在最终的打包器中并不需要编译器，因此可以只使用运行时构建。

<small>**译者注**<a id="footnote-1"></a>[1] 对于中国大陆用户，建议将 NPM 源设置为[国内的镜像](https://npm.taobao.org/)，可以大幅提升安装速度。</small>
