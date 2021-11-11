# 路由和代码分离

## 基于 `vue-router` 的路由

你可能已经注意到我们的服务端代码使用了一个 `*` 处理函数来接收任意 URL。这允许我们将被访问的 URL 传递给 Vue 应用，并在客户端和服务端之间复用相同的路由配置！

这里推荐使用官方的 [vue-router](https://github.com/vuejs/vue-router-next)。让我们先创建一个路由文件。注意和应用实例类似，每个请求都需要有一个干净的路由实例，因此该文件应该导出一个 `createRouter` 函数：

```js
// router.js
import { createRouter } from 'vue-router'
import MyUser from './components/MyUser.vue'

const routes = [{ path: '/user', component: MyUser }]

export default function (history) {
  return createRouter({
    history,
    routes
  })
}
```

然后更新客户端入口和服务端入口：

```js
// entry-client.js
import { createSSRApp } from 'vue'
import { createWebHistory } from 'vue-router'
import createRouter from './router.js'
import App from './App.vue'

// ...

const app = createSSRApp(App)

const router = createRouter(createWebHistory())

app.use(router)

// ...
```

```js
// entry-server.js
import { createSSRApp } from 'vue'
// 服务器端路由与客户端使用不同的历史记录
import { createMemoryHistory } from 'vue-router'
import createRouter from './router.js'
import App from './App.vue'

export default function () {
  const app = createSSRApp(App)
  const router = createRouter(createMemoryHistory())
  
  app.use(router)
  
  return {
    app,
    router
  }
}
```

## 代码分离

代码分离、或懒加载部分应用，可以帮助缩减浏览器初始化渲染所需下载的资源的尺寸，并大幅优化大型应用的 TTI (time-to-interactive，可交互时间)。其关键是在初始化首屏的时候“按需加载”。

Vue Router 提供了[懒加载支持](https://next.router.vuejs.org/zh/guide/advanced/lazy-loading.html)，允许 [webpack 在此进行代码分离](https://webpack.js.org/guides/code-splitting-async/)。你仅需要：

```js
// 将此处修改……
import MyUser from './components/MyUser.vue'
const routes = [{ path: '/user', component: MyUser }]

// 成为：
const routes = [
  { path: '/user', component: () => import('./components/MyUser.vue') }
]
```

在客户端和服务端我们都需要等待路由器先解析异步路由组件以合理地调用组件内的钩子。为此我们会使用 [router.isReady](https://next.router.vuejs.org/zh/api/#isready) 方法。让我们来更新客户端入口：

```js
// entry-client.js
import { createSSRApp } from 'vue'
import { createWebHistory } from 'vue-router'
import createRouter from './router.js'
import App from './App.vue'

const app = createSSRApp(App)

const router = createRouter(createWebHistory())

app.use(router)

router.isReady().then(() => {
  app.mount('#app')
})
```

我们还需要更新 `server.js` 脚本：

```js
// server.js
const path = require('path')

const appPath = path.join(__dirname, './dist', 'server', manifest['app.js'])
const createApp = require(appPath).default

server.get('*', async (req, res) => {
  const { app, router } = createApp()

  await router.push(req.url)
  await router.isReady()

  const appContent = await renderToString(app)

  fs.readFile(path.join(__dirname, '/dist/client/index.html'), (err, html) => {
    if (err) {
      throw err
    }

    html = html
      .toString()
      .replace('<div id="app">', `<div id="app">${appContent}`)
    res.setHeader('Content-Type', 'text/html')
    res.send(html)
  })
})
```
