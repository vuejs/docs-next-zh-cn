# 服务端渲染

## SSR 完全指南

我们创建了一份完整的构建 Vue 服务端渲染应用的指南。这份指南非常深入，适合已经熟悉 Vue、webpack 和 Node.js 开发的开发者阅读。请移步[这里](/guide/ssr/introduction.html)。

## Nuxt.js

从头搭建一个服务端渲染的应用是相当复杂的。幸运的是，我们有一个优秀的社区项目 [Nuxt.js](https://zh.nuxtjs.org/) 让这一切变得非常简单。Nuxt.js 是一个基于 Vue 生态的更高层次的框架，为开发服务端渲染的 Vue 应用提供了极其便利的开发体验。更酷的是，你甚至可以用它来做为静态站生成器。我们强烈建议尝试一下。

## Quasar Framework SSR + PWA

[Quasar Framework](https://quasar.dev) 可以通过其一流的构建系统、合理的配置和开发者扩展性生成 (可选地和 PWA 互通的) SSR 应用，让你的想法的设计和构建变得轻而易举。你可以在服务端挑选执行超过上百款遵循“Material Design 2.0”的组件，并且在浏览器端可用。你甚至可以管理网站的 `<meta>` 标签。Quasar 是一个基于 Node.js 和 webpack 的开发环境，它可以通过一套代码完成 SPA、PWA、SSR、Electron、Capacitor 和 Cordova 应用的快速开发。

## Vite SSR

[Vite](https://vitejs.dev/) 是一个新推出的前端构建工具，极大地改善了前端开发体验。它由两大部分组成：

- 一个开发服务器，基于原生的 ES modules 提供源代码，并带有丰富的内置功能和极快的模块热替换 (HMR)。

- 一个构建命令行，用来通过 [Rollup](https://rollupjs.org/) 打包你的代码，并预置为生产环节输出高度优化的静态资源。

Vite 也提供了内置的[服务端渲染支持](https://vitejs.dev/guide/ssr.html)。你可以在[这里](https://github.com/vitejs/vite/tree/main/packages/playground/ssr-vue)找到一个 Vue 的示例项目。
