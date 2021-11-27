# 构建配置

一个服务端渲染项目的 webpack 配置和一个仅针对客户端的项目类似。如果你不熟悉 webpack 配置，你可以在 [Vue CLI](https://cli.vuejs.org/zh/guide/webpack.html#webpack-相关) 或[手动配置 Vue Loader](https://vue-loader.vuejs.org/zh/guide/#手动设置) 的文档中找到更多信息。

## 和客户端构建版本的关键不同

1. 我们需要为服务端代码创建一个 [webpack manifest](https://webpack.js.org/concepts/manifest/)。这是一个让 webpack 追踪所有的模块如何对应到生成的包中的 JSON 文件。

2. 我们应该[将应用依赖变为外部扩展](https://webpack.js.org/configuration/externals/)。这使得服务端构建版本更加快速并生成更小的包文件。做这件事的时候，我们需要把交给 webpack 处理的依赖 (如 `.css` 或 `.vue` 文件) 排除在外。

3. 我们需要将 webpack 的[目标](https://webpack.js.org/concepts/targets/)改为 Node.js。这会允许 webpack 以适合于 Node 的方式处理动态导入，同时也告诉 `vue-loader` 在编译 Vue 组件的时候抛出面向服务端的代码。

4. 当构建一个服务端入口时，我们需要定义一个环境变量来指明当前的工作是服务端渲染。在工程的 `package.json` 中加入一些 `scripts` 会很有帮助：

```json
"scripts": {
  "build:client": "vue-cli-service build --dest dist/client",
  "build:server": "SSR=1 vue-cli-service build --dest dist/server",
  "build": "npm run build:client && npm run build:server",
}
```

## 配置示例

以下是一个 `vue.config.js` 的例子，这个例子向一个 Vue CLI 工程加入了服务端渲染，但这也可以适配于任何 webpack 构建版本。

```js
const { WebpackManifestPlugin } = require('webpack-manifest-plugin')
const nodeExternals = require('webpack-node-externals')
const webpack = require('webpack')

module.exports = {
  chainWebpack: webpackConfig => {
    // 我们需要禁用 cache loader，否则客户端构建版本会从服务端构建版本使用缓存过的组件
    webpackConfig.module.rule('vue').uses.delete('cache-loader')
    webpackConfig.module.rule('js').uses.delete('cache-loader')
    webpackConfig.module.rule('ts').uses.delete('cache-loader')
    webpackConfig.module.rule('tsx').uses.delete('cache-loader')

    if (!process.env.SSR) {
      // 将入口指向应用的客户端入口文件
      webpackConfig
        .entry('app')
        .clear()
        .add('./src/entry-client.js')
      return
    }

    // 将入口指向应用的服务端入口文件
    webpackConfig
      .entry('app')
      .clear()
      .add('./src/entry-server.js')

    // 这允许 webpack 以适合于 Node 的方式处理动态导入，
    // 同时也告诉 `vue-loader` 在编译 Vue 组件的时候抛出面向服务端的代码。
    webpackConfig.target('node')
    // 这会告诉服务端的包使用 Node 风格的导出
    webpackConfig.output.libraryTarget('commonjs2')

    webpackConfig
      .plugin('manifest')
      .use(new WebpackManifestPlugin({ fileName: 'ssr-manifest.json' }))

    // https://webpack.js.org/configuration/externals/#function
    // https://github.com/liady/webpack-node-externals
    // 将应用依赖变为外部扩展。
    // 这使得服务端构建更加快速并生成更小的包文件。

    // 不要将需要被 webpack 处理的依赖变为外部扩展
    // 也应该把修改 `global` 的依赖 (例如各种 polyfill) 整理成一个白名单
    webpackConfig.externals(nodeExternals({ allowlist: /\.(css|vue)$/ }))

    webpackConfig.optimization.splitChunks(false).minimize(false)

    webpackConfig.plugins.delete('preload')
    webpackConfig.plugins.delete('prefetch')
    webpackConfig.plugins.delete('progress')
    webpackConfig.plugins.delete('friendly-errors')

    webpackConfig.plugin('limit').use(
      new webpack.optimize.LimitChunkCountPlugin({
        maxChunks: 1
      })
    )
  }
}
```

## 关于外部依赖的注意事项

注意在 `externals` 选项中我们将 CSS 文件列入了白名单。这是因为从依赖导入的 CSS 应该被 webpack 处理。如果你导入其它同样需要 webpack 的类型文件 (如 `*.vue`、`*.sass`)，你应该把它们也加入到白名单中。

如果你使用了 `runInNewContext: 'once'` 或 `runInNewContext: true`，那么你也需要把修改 `global` 的 polyfill (如 `babel-polyfill`) 也加入这个白名单。这是因为在使用新上下文模式时，**服务端构建内的代码有其自己的 `global` 对象。**但由于服务端并不真的需要它，所以它从客户端入口被引入更加容易。

## 生成 `clientManifest`

对于服务端的包，我们还额外生成一个客户端构建单 (manifest)。有了这个客户端构建单和服务端的包，渲染器现在就同时有了服务端*和*客户端构建版本的信息。这样它就可以自动推断并向渲染出来的 HTML 中注入 [preload / prefetch 指令](https://css-tricks.com/prefetching-preloading-prebrowsing/)、`<link>` 和 `<script>` 标签。

带来的好处是双向的：

1. 当生成的文件名有 hash 的时候，它可以替换 `html-webpack-plugin` 以注入正确的资源 URL。

2. 当渲染一个基于 webpack 的按需代码分隔特性的包时，我们可以确保优化过的代码块是被 preload / prefetch 的，同时会智能地注入 `<script>` 标签以避免异步代码块在客户端被瀑布式请求，从而改善可交互时间 (TTI：time-to-interactive)。
