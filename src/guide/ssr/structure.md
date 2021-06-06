# 源代码结构

## 避免有状态的单例模式

在编写只有客户端的代码的时候，我们会假设代码每次都会允许在一个干净的上下文中。然而 Node.js 服务器是长期运行的进程。当代码第一次被导入进程时，它会被执行一次然后保留在内存里。也就是说你创建了一个蛋例对象，它共享于每次发来的请求之间，并带有跨请求的状态污染风险。

因此，我们需要**为每个请求创建一个新的 Vue 根实例**。为了做到这一点，我们需要编写一个工厂函数来重复地执行，并为每个请求创建干净的应用实例：

```js
// app.js
const { createSSRApp } = require('vue')

function createApp() {
  return createSSRApp({
    data() {
      return {
        user: 'John Doe'
      }
    },
    template: `<div>Current user is: {{ user }}</div>`
  })
}
```

同时我们的服务端代码现在变成了：

```js
// server.js
const { renderToString } = require('@vue/server-renderer')
const server = require('express')()
const { createApp } = require('src/app.js')

server.get('*', async (req, res) => {
  const app = createApp()

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

同理其它实例 (诸如路由器或 store) 也是一样的。取代从一个模块直接导出路由器或 store 并将它们导入应用的，是在 `createApp` 创建一个干净的实例并从这个 Vue 根实例注入它们。

## 介绍构建步骤

截至目前，我们还没有讨论过如何想客户端传递相同的 Vue 应用。为了做到这一点，我们需要使用 webpack 打包 Vue 应用。

- 我们需要用 webpack 处理服务端代码。例如 `.vue` 文件需要被 `vue-loader` 处理，很多 webpack 特有的功能，诸如通过 `vue-loader` 导入文件或通过 `css-loader` 导入 CSS 在 Node.js 中都不会直接工作。

- 类似地，我们需要分隔客户端构建，因为尽管最新版本的 Node.js 完全支持来 ES2015 特性，旧浏览器仍然需要对代码进行编译。

因此基础的想法是使用 webpack 同时打包客户端和服务端应用。服务端的包会被引入到服务端用来渲染 HTML，同时客户端的包会被发送到浏览器来 hydrate 静态标记。

![架构](https://cloud.githubusercontent.com/assets/499550/17607895/786a415a-5fee-11e6-9c11-45a2cfdf085c.png)

我们会在稍后的章节讨论设置的细节——现在，让我们先假设我们已经完成了构建的设置，且我们可以基于 webpack 编写 Vue 应用。

## 使用 webpack 的目录结构

现在我们使用 webpack 同时处理服务端和客户端应用，源代码的主体可以以通用的方式编写，支持所有的 webpack 特性。同时，当[撰写通用的代码](./universal.html)时你需要注意一些事情。

一个简单的项目形如：

```bash
src
├── components
│   ├── MyUser.vue
│   └── MyTable.vue
├── App.vue
├── app.js # 通用入口
├── entry-client.js # 只在浏览器中运行
└── entry-server.js # 只在服务器运行
```

### `app.js`

`app.js` 是应用的通用入口。在只有客户端的应用里，我们会在此创建 Vue 应用实例并直接挂载到 DOM。然而，对于 SSR 来说该指责被移动到了只在客户端里运行的入口文件。`app.js` 的指责换为了创建一个应用实例并导出它：

```js
import { createSSRApp } from 'vue'
import App from './App.vue'

// 导出一个创建根组件的工厂函数
export default function(args) {
  const app = createSSRApp(App)

  return {
    app
  }
}
```

### `entry-client.js`

这个客户端入口会使用根组件创建应用并挂载到 DOM：

```js
import createApp from './app'

// client-specific bootstrapping logic...

const { app } = createApp({
  // here we can pass additional arguments to app factory
})

// this assumes App.vue template root element has `id="app"`
app.mount('#app')
```

### `entry-server.js`

服务端入口使用了一个默认导出，它是一个可以为每次渲染重复调用的函数。目前它除了返回应用实例并不会做其它事情——但稍后我们会在这里处理服务端路由匹配和数据预获取逻辑。

```js
import createApp from './app'

export default function() {
  const { app } = createApp({
    /*...*/
  })

  return {
    app
  }
}
```
