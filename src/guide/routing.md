# 路由

## 官方 Router

对于大多数单页面应用，都推荐使用官方支持的 [vue-router 库](https://github.com/vuejs/vue-router-next)。更多细节可以移步 [vue-router 文档](https://next.router.vuejs.org/)。

## 从零开始简单的路由

如果你只需要非常简单的路由而不想引入一个功能完整的路由库，可以像这样动态渲染一个页面级的组件：

```js
const { createApp, h } = Vue

const NotFoundComponent = { template: '<p>Page not found</p>' }
const HomeComponent = { template: '<p>Home page</p>' }
const AboutComponent = { template: '<p>About page</p>' }

const routes = {
  '/': HomeComponent,
  '/about': AboutComponent
}

const SimpleRouter = {
  data: () => ({
    currentRoute: window.location.pathname
  }),

  computed: {
    CurrentComponent() {
      return routes[this.currentRoute] || NotFoundComponent
    }
  },

  render() {
    return h(this.CurrentComponent)
  }
}

createApp(SimpleRouter).mount('#app')
```

结合 [HTML5 History API](https://developer.mozilla.org/zh-CN/docs/Web/API/History_API/Working_with_the_History_API)，你可以建立一个麻雀虽小但是五脏俱全的客户端路由器。为了获得更多的实践，可以直接查看[实例应用](https://github.com/phanan/vue-3.0-simple-routing-example)。

## 整合第三方路由

如果你有更加偏爱的第三方路由，如 [Page.js](https://github.com/visionmedia/page.js) 或者 [Director](https://github.com/flatiron/director)，整合起来也[一样简单](https://github.com/phanan/vue-3.0-simple-routing-example/compare/master...pagejs)。这里有一个使用了 Page.js 的[完整示例](https://github.com/phanan/vue-3.0-simple-routing-example/tree/pagejs)。

