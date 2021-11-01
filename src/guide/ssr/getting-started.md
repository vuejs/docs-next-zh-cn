# 起步

> 这份指南仍处在活跃更新的状态

## 安装

要创建一个服务端渲染应用，我们需要安装 `@vue/server-renderer`：

```bash
npm install @vue/server-renderer
## 或
yarn add @vue/server-renderer
```

#### 注意

- 推荐使用的 Node.js 版本是 12+。
- `@vue/server-renderer` 和 `vue` 的版本号必须匹配。
- `@vue/server-renderer` 依赖一些 Node.js 的原生模块，因此只能在 Node.js 中使用。我们未来可能会提供一个更简单的、可运行在其它 JavaScript 运行时中的构建版本。

## 渲染一个 Vue 应用

和使用 `createApp` 创建的、只能在客户端运行的 Vue 应用不同，创建一个服务端渲染应用需要使用 `createSSRApp`：

```js
const { createSSRApp } = require('vue')

const app = createSSRApp({
  data() {
    return {
      user: 'John Doe'
    }
  },
  template: `<div>Current user is: {{ user }}</div>`
})
```

现在，我们可以使用 `renderToString` 函数将我们的应用实例渲染为一个字符串。此函数返回一个 Promise 来解析渲染出的 HTML。

```js{2,13}
const { createSSRApp } = require('vue')
const { renderToString } = require('@vue/server-renderer')

const app = createSSRApp({
  data() {
    return {
      user: 'John Doe'
    }
  },
  template: `<div>Current user is: {{ user }}</div>`
})

const appContent = await renderToString(app)
```

## 和服务器集成

在这个示例中，我们将使用 [Express](https://expressjs.com/) 来运行一个应用：

```bash
npm install express
## 或
yarn add express
```

```js
// sever.js

const { createSSRApp } = require('vue')
const { renderToString } = require('@vue/server-renderer')
const server = require('express')()

server.get('*', async (req, res) => {
  const app = createSSRApp({
    data() {
      return {
        user: 'John Doe'
      }
    },
    template: `<div>Current user is: {{ user }}</div>`
  })

  const appContent = await renderToString(app)
  const html = `
  <html>
    <body>
      <h1>My First Heading</h1>
      <div id="app">${appContent}</div>
    </body>
  </html>
  `

  res.end(html)
})

server.listen(8080)
```

现在，当运行这段 Node.js 脚本的时候，我们可以在 `localhost:8080` 看到一个静态的 HTML 页面。然而，这段代码是未*激活*的：Vue 还没有将这段发送自服务器的静态 HTML 转换为能够响应客户端数据变化的动态 DOM。这部分会在[客户端激活](hydration.html) 章节中涵盖。
