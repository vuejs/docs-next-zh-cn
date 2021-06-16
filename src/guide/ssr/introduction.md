# 服务端渲染指南

> 这份指南仍处在活跃更新的状态

## 什么是服务端渲染 (SSR)？

Vue.js 是一个构建客户端应用的框架。默认情况下作为其输出，Vue 组件会在浏览器中生产并封装 DOM。然而，我们也有可能在服务器把相同的组件渲染成 HTML 字符串，然后直接发送给浏览器，最终将静态标记“hydrate”成为完整的可交互的客户端应用。

一个服务端渲染的 Vue.js 应用也可以被认为是“同构的”或”通用的“。这意味着应用代码的主体可以同时运行在“服务端”*和*“客户端”。

## 为什么选择 SSR？

较之于一个传统的 SPA (单页面应用)，SSR 主要的好处是：

- 更好的搜索引擎优化 (SEO)。因为搜索引擎爬虫会直接读取完整的渲染出来的页面。

  注意，目前 Google 和 Bing 已经可以很好地为同步加载的 JavaScript 应用建立索引。在这里同步加载是关键。如果应用起始状态只是一个加载中的效果，而通过 API 调用获取内容，则爬虫不会等待页面加载完成。这意味着如果你有异步加载的页面内容且 SEO 也很重要，那么你需要 SSR。

- 更快的内容呈现，尤其是网络连接缓慢或设备运行速度缓慢的时候。服务端标记不需要等待所有的 JavaScript 都被下载并执行之后才显示，所以用户可以很快看到完整渲染好的内容。这通常会带来更好的用户体验，同时对于内容呈现时间和转化率呈正相关的应用来说尤为关键。

这里有一些是否选用 SSR 的取舍因素：

- 开发一致性。浏览器特有的代码可以只用在特性的生命周期钩子里；一些外部的库在服务端渲染的应用里可能需要特殊的对待。

- 需要更多的构建设定和部署要求。不同于一个完全静态的 SPA 可以部署在任意静态服务器，一个服务端渲染的应用需要一个 Node.js 的环境。

- 更多的服务端负载。在 Node.js 中渲染一个完整的应用会比服务静态文件产生更密集的 CPU 运算。所以如果流量很高，请务必备好与其负载相对应的服务器并采取明智的缓存策略。

Before using SSR for your application, the first question you should ask is whether you actually need it. It mostly depends on how important time-to-content is for your application. For example, if you are building an internal dashboard where an extra few hundred milliseconds on the initial load doesn't matter that much, SSR would be overkill. However, in cases where time-to-content is absolutely critical, SSR can help you achieve the best possible initial load performance.
在应用中使用 SSR 之前，你需要问自己的第一个问题是是否真的需要它。

## SSR vs 预渲染

如果你希望通过 SSR 来改善一些推广页面 SEO (例如 `/`、`/about`、`/contact` 等)，你也许需要的是**预渲染**。和使用线上编译 HTML 的 web 服务器相比，预渲染可以在构建时为静态路由生成静态 HTML 文件。它的优势在于预渲染的设置更加简单，且前端仍然是一个完全静态的站点。

如果你使用 [webpack](https://webpack.js.org/)，你可以通过 [prerender-spa-plugin](https://github.com/chrisvfritz/prerender-spa-plugin) 支持预渲染。该插件已经被大量 Vue 应用检验过。

## 关于该指南

[//]: # 'TODO: This guide is focused on server-rendered Single-Page Applications using Node.js as the server. Mixing Vue SSR with other backend setups is a topic of its own and briefly discussed in a [dedicated section].'

该指南会非常深入且假设你已经熟悉 Vue.js 本身，且具有一定的 Node.js 和 webpack 知识和经验。

[//]: # 'If you prefer a higher-level solution that provides a smooth out-of-the-box experience, you should probably give [Nuxt.js](https://nuxtjs.org/) a try. It's built upon the same Vue stack but abstracts away a lot of the boilerplate, and provides some extra features such as static site generation. However, it may not suit your use case if you need more direct control of your app's structure. Regardless, it would still be beneficial to read through this guide to understand better how things work together.'

[//]: # 'TODO: As you read along, it would be helpful to refer to the official [HackerNews Demo](https://github.com/vuejs/vue-hackernews-2.0/), which makes use of most of the techniques covered in this guide'

最后，注意该指南的方案并不是最终方案——我们觉得它已经适合我们，但不意味着没有改进空间。它们将来也可能被修订——欢迎大家通过 pull request 来参与贡献！
