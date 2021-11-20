# 源代码结构

## 避免有状态的单例模式

当编写仅针对客户端的代码时，我们可以假设代码每次都会运行在一个干净的上下文中。然而，Node.js 服务器是长期运行的进程。当代码第一次被导入进程时，它会被执行一次然后保留在内存里。也就是说如果你创建了一个单例对象，它将共享于每次发来的请求之间，并带有跨请求的状态污染风险。

```js
// 反面例子
import app from './app.js'

server.get('*', async (req, res) => {
  // 应用现在是在所有用户之间共享的
  const result = await renderToString(app)
  // ...
})
```

```js
// 正面例子
function createApp() {
  return createSSRApp(/* ... */)
}

server.get('*', async (req, res) => {
  // 每个用户拥有自己的应用
  const app = createApp()
  const result = await renderToString(app)
  // ...
})
```

因此，我们需要**为每个请求创建一个新的 Vue 根实例**。为了做到这一点，我们需要编写一个工厂函数来重复地执行，并为每个请求创建干净的应用实例：

```js
// server.js
const { createSSRApp } = require('vue')
const { renderToString } = require('@vue/server-renderer')
const express = require('express')

const server = express()

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

同理其它实例 (诸如路由器或 store) 也是一样的。不要从一个模块直接导出路由器或 store 并将它们导入应用，取而代之的是，每次有新的请求发起时都在 `createApp` 中创建一个干净的实例并从这个 Vue 根实例注入它。

## 介绍构建步骤

截至目前，我们尚未讨论如何向客户端传递相同的 Vue 应用。为了做到这一点，我们需要使用 webpack 来打包 Vue 应用。

- 我们需要用 webpack 处理服务端代码。例如 `.vue` 文件需要被 `vue-loader` 处理，并且很多 webpack 特有的功能，诸如通过 `file-loader` 导入文件或通过 `css-loader` 导入 CSS 在 Node.js 中都无法直接工作。

- 类似地，我们需要一个独立的客户端构建版本，因为尽管最新版本的 Node.js 完全支持 ES2015 特性，但旧的浏览器仍然需要对代码进行转译。

因此，基本的想法是，使用 webpack 同时打包客户端和服务端应用。服务端的包会被引入到服务端用来渲染 HTML，同时客户端的包会被送到浏览器用于激活静态标记。

![架构](https://cloud.githubusercontent.com/assets/499550/17607895/786a415a-5fee-11e6-9c11-45a2cfdf085c.png)

我们会在稍后的章节讨论设置的细节——现在，让我们先假设我们已经完成了构建的设置，且我们可以基于 webpack 编写 Vue 应用。

## 使用 webpack 的目录结构

现在既然我们已经使用 webpack 同时处理了服务端和客户端应用，那么源代码的主体就可以以通用的方式编写，以支持所有的 webpack 特性。同时，当[编写通用的代码](./universal.html)时有一些注意事项。

一个简单的项目形如：

```bash
src
├── components
│   ├── MyUser.vue
│   └── MyTable.vue
├── App.vue # 应用的根节点
├── entry-client.js # 只在浏览器中运行
└── entry-server.js # 只在服务器运行
```

### `App.vue`

你可能注意到了，我们的 `src` 文件夹的顶层现在有一个名为 `App.vue` 的文件。这就是存放应用根组件的地方。我们现在可以安全地将应用代码从 `server.js` 转移到 `App.vue` 文件中：

```vue
<template>
  <div>Current user is: {{ user }}</div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      user: 'John Doe'
    }
  }
}
</script>
```

### `entry-client.js`

此客户端入口会使用 `App.vue` 创建应用并挂载到 DOM：

```js
import { createSSRApp } from 'vue'
import App from './App.vue'

// 针对客户端的启动逻辑......

const app = createSSRApp(App)

// 这里假设 App.vue 模板的根元素有 `id="app"`
app.mount('#app')
```

### `entry-server.js`

服务端入口使用了一个默认导出，它是一个可以在每次渲染的过程中重复调用的函数。目前，除了返回应用实例，它并不会做其它事情——但稍后我们会在这里处理服务端路由匹配和数据预获取逻辑。

```js
import { createSSRApp } from 'vue'
import App from './App.vue'

export default function () {
  const app = createSSRApp(App)

  return {
    app
  }
}
```
