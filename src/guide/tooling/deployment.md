# 生产环境部署

::: info
如果你使用 [Vue CLI](https://cli.vuejs.org)，下面的大多数提示都是默认启用的。此部分仅当你使用自定义构建设置时才相关。
:::

## 开启生产环境模式

在开发期间，Vue 提供了许多警告，以帮助你处理常见的错误和隐患。但是，这些警告字符串在生产环境中会变得无意义，并且会增大应用程序的负担。此外，有一些警告检查还会产生些许的运行时开销，在[生产模式](https://cli.vuejs.org/zh/guide/mode-and-env.html#%E6%A8%A1%E5%BC%8F)下可以避免这些开销。

### 不使用构建工具

如果你正在使用完整的构建版本，即直接通过脚本标签引入 Vue，而不使用构建工具，那么请确保在生产环境中使用压缩版。这可以在[安装指南](/guide/installation.html#cdn)中找到。

### 使用构建工具

当使用 Webpack 或 Browserify 这样的构建工具时，生产环境模式将由 Vue 的源代码中的 `process.env.NODE_ENV` 决定，默认为开发模式。这两种构建工具都提供了重写这个变量以启用 Vue 的生产模式的方法，并且在构建过程中警告将被压缩工具删除。Vue CLI 已经为你预先配置了这个，不过了解它的工作原理会更好：

#### Webpack

在 Webpack 4+，你可以使用 `mode` 选项：

```js
module.exports = {
  mode: 'production'
}
```

#### Browserify

- 将当前的环境变量 `NODE_ENV` 设置为 `"production"` 作为运行的打包命令。它告诉 `vueify` 避免引入热重载和开发相关的代码。

- 将一个全局的 [envify](https://github.com/hughsk/envify) 转换应用到你的包中。这使得压缩工具可以删除包裹在环境变量条件块中的Vue源代码中的所有警告。例如:

  ```bash
  NODE_ENV=production browserify -g envify -e main.js | uglifyjs -c -m > build.js
  ```

- 或者，利用 Gulp 使用 [envify](https://github.com/hughsk/envify)：

  ```js
  // Use the envify custom module to specify environment variables
  const envify = require('envify/custom')

  browserify(browserifyOptions)
    .transform(vueify)
    .transform(
      // Required in order to process node_modules files
      { global: true },
      envify({ NODE_ENV: 'production' })
    )
    .bundle()
  ```

- 或者，利用 Grunt 和 [grunt-browserify](https://github.com/jmreidy/grunt-browserify) 使用 [envify](https://github.com/hughsk/envify)：

  ```js
  // Use the envify custom module to specify environment variables
  const envify = require('envify/custom')

  browserify: {
    dist: {
      options: {
        // Function to deviate from grunt-browserify's default order
        configure: (b) =>
          b
            .transform('vueify')
            .transform(
              // Required in order to process node_modules files
              { global: true },
              envify({ NODE_ENV: 'production' })
            )
            .bundle()
      }
    }
  }
  ```

#### Rollup

使用 [@rollup/plugin-replace](https://github.com/rollup/plugins/tree/master/packages/replace):

```js
const replace = require('@rollup/plugin-replace')

rollup({
  // ...
  plugins: [
    replace({
      'process.env.NODE_ENV': JSON.stringify( 'production' )
    })
  ]
}).then(...)
```

## 预编译模板

当使用 DOM 内模板或 JavaScript 内模板字符串时，将动态地执行从模板到渲染函数的编译。在大多数情况下，这已经足够快了，但是如果应用程序对性能敏感，最好避免这样做。

预编译模板最简单的方法是使用[单文件组件](/guide/single-file-component.html)——相关的构建设置自动为你执行预编译，所以构建代码包含已经编译的渲染函数，而不是原始的模板字符串。

如果你正在使用 Webpack，并且更喜欢将 JavaScript 和模板文件分开，你可以使用 [vue-template-loader](https://github.com/ktsn/vue-template-loader)，它还可以在构建步骤中将模板文件转换为 JavaScript 渲染函数。

## 提取组件CSS

当使用单文件组件时，组件内部的 CSS 会通过 JavaScript 以 `<style>` 标签的形式被动态注入。这有一个小的运行时成本，如果你使用服务器端渲染，它将导致“无样式内容的闪现” 。将所有组件的 CSS 提取到同一个文件中可以避免这些问题，还可以更好地压缩和缓存 CSS。


参考各自的构建工具文档，看看它是如何做的:

- [Webpack + vue-loader](https://vue-loader.vuejs.org/en/configurations/extract-css.html) (`vue-cli` webpack 模板已经预先配置了这个)
- [Browserify + vueify](https://github.com/vuejs/vueify#css-extraction)
- [Rollup + rollup-plugin-vue](https://rollup-plugin-vue.vuejs.org/)

## 跟踪运行时错误

如果在组件渲染期间发生运行时错误，它将被传递到全局的 `app.config.errorHandler` 配置函数，如果它已经被设置。将这个钩子与错误跟踪服务如 [Sentry](https://sentry.io) 一起使用可能是一个好主意，它为 Vue 提供了[一个官方集成](https://sentry.io/for/vue/)。
