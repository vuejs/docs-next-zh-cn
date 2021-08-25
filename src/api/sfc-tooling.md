# SFC 工具

## 在线演练场

你不需要在你的机器上安装任何东西来尝试 Vue 单文件：这里有很多在线演练场允许你在浏览器中运行：

- [Vue SFC Playground](https://sfc.vuejs.org) (官方，基于最新的提交)
- [VueUse Playground](https://play.vueuse.org)
- [Vue on CodeSandbox](https://codesandbox.io/s/vue-3)
- [Vue on Repl.it](https://replit.com/@templates/VueJS-with-Vite)
- [Vue on Codepen](https://codepen.io/pen/editor/vue)
- [Vue on StackBlitz](https://stackblitz.com/fork/vue)

在报告问题时也建议通过这些在线演练场来提供复现。

## 项目脚手架

### Vite

[Vite](https://vitejs.dev/) 是一个轻量级的快速构建工具，它对 Vue 单文件提供最优支持。 它由尤雨溪创建，尤雨溪同时也是 Vue 本身的作者。如果要运行 Vite + Vue:

```sh
npm init vite@latest
```

然后选择 Vue 模板并按照说明操作。

- 如果要了解更多 Vite 信息，请参阅 [Vite 文档](https://vitejs.dev/guide/)
- 如果要在 Vite 项目中配置 Vue 的具体行为，比如向 Vue 的编译器传递选项，请查看文档[@vitejs/plugin-vue](https://github.com/vitejs/vite/tree/main/packages/plugin-vue#readme).

[单文件演练场](https://sfc.vuejs.org/) 也支持下载 Vite 项目的文件。

### Vue CLI

[Vue CLI](https://cli.vuejs.org/) 是 Vue 官方基于 `webpack` 的构建工具。可以通过 Vue CLI 进行使用：

```sh
npm install -g @vue/cli
vue create hello-vue
```

- 如果要了解更多 `Vue CLI`，请查看文档[Vue CLI docs](https://cli.vuejs.org/guide/installation.html).

### Vite 还是 Vue CLI？

我们建议用 Vite 启动新项目，因为他在开发服务器启动和HMR更新的性能方面提供了更好的开发体验。([详情](https://vitejs.dev/guide/why.html))。如果你依赖特定的 webpack 功能（比如模块联邦）建议师使用 Vue CLI。

如果你是[Rollup](https://rollupjs.org/) 用户，你可以安全地使用 Vite，因为它使用 Rollup 进行生产构建，支持与 Rollup 兼容的插件系统。[甚至 Rollup 的维护者也推荐 Vite 作为 Rollup 作为 Web 开发工具](https://twitter.com/lukastaegert/status/1412119729431584774).

## IDE 支持

推荐的 IDE 配置是[VSCode](https://code.visualstudio.com/) + [Volar](https://github.com/johnsoncodehk/volar) 拓展。Volar 为模板表达式、组件props，甚至是插槽验证提供了语法高亮和智能提示。我们强烈推荐这种设置，特别是如果你也在使用 TypeScript。

[WebStorm](https://www.jetbrains.com/webstorm/) 也对 Vue 单文件提供了不错的支持。请注意，到目前为止它对 `<script setup>` 的支持仍然是[进行中](https://youtrack.jetbrains.com/issue/WEB-49000)。

大多数其他编辑器都有社区创建的 Vue 语法高亮功能，但缺乏同样水平的代码智能提示。从长远来看，我们确实希望通过 [Language Service Protocol](https://microsoft.github.io/language-server-protocol/) 来托大编辑器的支持范围，因为 Volar 的核心逻辑是作为标准语言服务器实现的。

## 测试支持

- 如果使用 Vite，我们推荐使用 [Cypress](https://www.cypress.io/) 进行单元测试和 e2e 测试。Vue 单文件的单元测试可以使用[Cypress Component Test Runner](https://www.cypress.io/blog/2021/04/06/introducing-the-cypress-component-test-runner/)来完成。
- Vue CLI 提供 [Jest](https://jestjs.io/) 和 [Mocha](https://mochajs.org/) 集成。
- 如果你要手动配置 Jest 来和 Vue 单文件一起使用，请查看 [vue-jest](https://github.com/vuejs/vue-jest)，这是官方为 Vue 单文件提供的 Jest 转换工具。

## 自定义块 Custome blocks 集成

自定义块(Custom blocks) 会被编译进同一个 Vue 文件，产生不同请求查询。这取决于底层构建工具如何处理这些请求。

- 如果使用 Vite，应该使用一个自定义的 Vite 插件来把匹配的自定义块转为可执行的 JavaScript。[[例子](https://github.com/vitejs/vite/tree/main/packages/plugin-vue#example-for-transforming-custom-blocks)]

- 如果使用 Vue CLI 或者普通的 webpack 配置，应该配置一个 webpack loader 来转换匹配到的自定义块。[[例子](https://vue-loader.vuejs.org/guide/custom-blocks.html#custom-blocks)]

## 底层工具

### `@vue/compiler-sfc`

- [文档](https://github.com/vuejs/vue-next/tree/master/packages/compiler-sfc)

这个包是 Vue 核心仓库的一部分，始终和当前 `vue` 包保持相同的版本。通常情况下，它将被列为项目中 `vue` 的同级依赖。为了确保不出问题，应该始终和 `vue` 的版本保持同步：也就是说当你升级 `vue` 版本时候，应该同时升级 `@vue/compiler-sfc` 来保持一致。

这个包本身提供了处理 Vue 单文件的底层工具，只对库作者需要对单文件进行支持时候有意义。

### `@vitejs/plugin-vue`

- [文档](https://github.com/vitejs/vite/tree/main/packages/plugin-vue)

官方插件可以在 Vite 中提供对 Vue 单文件提供支持。

### `vue-loader`

- [文档](https://vue-loader.vuejs.org/)

在 webpack 中提供官方 loader 来支持 Vue 单文件。如果你正在使用 Vue CLI 可以参阅 [在 Vue CLI 中修改 `vue-loader` 选项](https://cli.vuejs.org/guide/webpack.html#modifying-options-of-a-loader)。
