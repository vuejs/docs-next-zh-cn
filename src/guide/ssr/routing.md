# 路由和代码分离

## 基于 `vue-router` 的路由

你可能已经注意到我们的服务端代码使用了一个 `*` 处理函数来接收任意 URL。这允许我们传递被访问的 URL 到 Vue 应用，并同时为客户端和服务端复用相同的路由配置！

这里推荐使用官方的 [vue-router](https://github.com/vuejs/vue-router-next)。让我们先创建一个路由文件。注意和应用实例类似，每个请求都需要一个干净的路由实例，因此文件应该导出一个 `createRouter` 函数：

```js
// router.js
import { createRouter, createMemoryHistory, createWebHistory } from 'vue-router'
import MyUser from './components/MyUser.vue'

const isServer = typeof window === 'undefined'

const history = isServer ? createMemoryHistory() : createWebHistory()

const routes = [{ path: '/user', component: MyUser }]

export default function() {
  return createRouter({ routes, history })
}
```

然后更新 `app.js`、客户端入口和服务端入口：

```js
// app.js
import { createSSRApp } from 'vue'
import App from './App.vue'
import createRouter from './router'

export default function(args) {
  const app = createSSRApp(App)
  const router = createRouter()

  app.use(router)

  return {
    app,
    router
  }
}
```

```js
// entry-client.js
const { app, router } = createApp({
  /*...*/
})
```

```js
// entry-server.js
const { app, router } = createApp({
  /*...*/
})
```

## 代码分离

代码分离、或懒加载部分应用，可以帮助缩减浏览器初始化渲染所需下载的资源的尺寸，并大幅优化大型应用的 TTI (time-to-interactive，可交互时间)。其关键是在初始化首屏的时候“按需加载”。

Vue Router 提供了[懒加载支持](https://next.router.vuejs.org/zh/guide/advanced/lazy-loading.html)，允许 [webpack 在此进行代码分离](https://webpack.js.org/guides/code-splitting-async/)。全部你所需要的是：

```js
// 修改这里……
import MyUser from './components/MyUser.vue'
const routes = [{ path: '/user', component: MyUser }]

// 变成这里：
const routes = [
  { path: '/user', component: () => import('./components/MyUser.vue') }
]
```

在客户端和服务端我们都需要等待路由器先解析异步路由组件以合理地调用组件内的钩子。为此我们会使用 [router.isReady](https://next.router.vuejs.org/zh/api/#isready) 方法。让我们来更新客户端入口：

```js
// entry-client.js
import createApp from './app'

const { app, router } = createApp({
  /* ... */
})

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

  router.push(req.url)
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
