# 服务器配置

除了介绍过的[代码结构](./structure.html)和 [webpack 配置](./build-config.html)，我们的 Express 服务端代码同样需要改动。

- 我们需要通过一个构建好的包里的 `entry-server.js` 创建一个应用。在 webpack manifest 里可以找到其路径：

  ```js
  // server.js
  const path = require('path')
  const manifest = require('./dist/server/ssr-manifest.json')

  // 'app.js' 是以入口的名字加上 `.js` 后缀命名的
  const appPath = path.join(__dirname, './dist', 'server', manifest['app.js'])
  const createApp = require(appPath).default
  ```

- 我们需要为所有资源定义正确的路径：

  ```js
  // server.js
  server.use(
    '/img',
    express.static(path.join(__dirname, './dist/client', 'img'))
  )
  server.use('/js', express.static(path.join(__dirname, './dist/client', 'js')))
  server.use(
    '/css',
    express.static(path.join(__dirname, './dist/client', 'css'))
  )
  server.use(
    '/favicon.ico',
    express.static(path.join(__dirname, './dist/client', 'favicon.ico'))
  )
  ```

- 我们需要把 `index.html` 的内容替换为服务端渲染出来的应用内容：

  ```js
  // server.js
  const indexTemplate = fs.readFileSync(
    path.join(__dirname, '/dist/client/index.html'),
    'utf-8'
  )

  server.get('*', async (req, res) => {
    const { app } = createApp()

    const appContent = await renderToString(app)

    const html = indexTemplate
      .toString()
      .replace('<div id="app">', `<div id="app">${appContent}`)

    res.setHeader('Content-Type', 'text/html')
    res.send(html)
  })
  ```

以下是 Express 服务器的完整代码：

```js
const path = require('path')
const express = require('express')
const fs = require('fs')
const { renderToString } = require('@vue/server-renderer')
const manifest = require('./dist/server/ssr-manifest.json')

const server = express()

const appPath = path.join(__dirname, './dist', 'server', manifest['app.js'])
const createApp = require(appPath).default

server.use('/img', express.static(path.join(__dirname, './dist/client', 'img')))
server.use('/js', express.static(path.join(__dirname, './dist/client', 'js')))
server.use('/css', express.static(path.join(__dirname, './dist/client', 'css')))
server.use(
  '/favicon.ico',
  express.static(path.join(__dirname, './dist/client', 'favicon.ico'))
)

server.get('*', async (req, res) => {
  const { app } = createApp()

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

console.log('You can navigate to http://localhost:8080')

server.listen(8080)
```
