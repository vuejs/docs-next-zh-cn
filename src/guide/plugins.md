# 插件

插件是自包含的代码，通常向 Vue 添加全局级功能。它可以是公开 `install()` 方法的 `object`，也可以是 `function`

插件的功能范围没有严格的限制——一般有下面几种：

1. 添加全局方法或者 property。如：[vue-custom-element](https://github.com/karol-f/vue-custom-element)

2. 添加全局资源：指令/过滤器/过渡等。如：[vue-touch](https://github.com/vuejs/vue-touch)）

3. 通过全局混入来添加一些组件选项。(如[vue-router](https://github.com/vuejs/vue-router))

4. 添加全局实例方法，通过把它们添加到 `config.globalProperties` 上实现。

5. 一个库，提供自己的 API，同时提供上面提到的一个或多个功能。如 [vue-router](https://github.com/vuejs/vue-router)

## 编写插件

为了更好地理解如何创建自己的 Vue.js 版插件，我们将创建一个非常简化的插件版本，它显示 `i18n` 准备好的字符串。

每当这个插件被添加到应用程序中时，如果它是一个对象，就会调用 `install` 方法。如果它是一个 `function`，则函数本身将被调用。在这两种情况下——它都会收到两个参数：由 Vue 的 `createApp` 生成的 `app` 对象和用户传入的选项。

让我们从设置插件对象开始。建议在单独的文件中创建它并将其导出，如下所示，以保持包含的逻辑和分离的逻辑。

```js
// plugins/i18n.js
export default {
  install: (app, options) => {
    // Plugin code goes here
  }
}
```

我们想要一个函数来翻译整个应用程序可用的键，因此我们将使用 `app.config.globalProperties` 暴露它。

该函数将接收一个 `key` 字符串，我们将使用它在用户提供的选项中查找转换后的字符串。

```js
// plugins/i18n.js
export default {
  install: (app, options) => {
    app.config.globalProperties.$translate = key => {
      return key.split('.').reduce((o, i) => {
        if (o) return o[i]
      }, i18n)
    }
  }
}
```

我们假设用户使用插件时，将在 `options` 参数中传递一个包含翻译后的键的对象。我们的 `$translate` 函数将使用诸如 `greetings.hello` 之类的字符串，查看用户提供的配置内部并返回转换后的值-在这种情况下为 `Bonjour!`。

例如： 

```js
greetings: {
  hello: 'Bonjour!'
}
```

插件还允许我们使用 `inject` 为插件的用户提供功能或 attribute。例如，我们可以允许应用程序访问 `options` 参数以能够使用翻译对象。

Plugins also allow us to use `inject` to provide a function or attribute to the plugin's users。For example，we can allow the application to have access to the `options` parameter to be able to use the translations object。

```js
// plugins/i18n.js
export default {
  install: (app, options) => {
    app.config.globalProperties.$translate = key => {
      return key.split('.').reduce((o, i) => {
        if (o) return o[i]
      }, i18n)
    }

    app.provide('i18n', options)
  }
}
```

插件用户现在可以将 `inject[in18] ` 到他们的组件并访问该对象。

另外，由于我们可以访问 `app` 对象，因此插件可以使用所有其他功能，例如使用 `mixin` 和 `directive`。要了解有关 `createApp` 和应用程序实例的更多信息，请查看 [Application API 文档](/api/application-api.html)。

```js
// plugins/i18n.js
export default {
  install: (app, options) => {
    app.config.globalProperties.$translate = (key) => {
      return key.split('.')
        .reduce((o, i) => { if (o) return o[i] }, i18n)
    }

    app.provide('i18n', options)

    app.directive('my-directive', {
      bind (el, binding, vnode, oldVnode) {
        // some logic ...
      }
      ...
    })

    app.mixin({
      created() {
        // some logic ...
      }
      ...
    })
  }
}
```

## 使用插件

在使用 `createApp()` 初始化 Vue 应用程序后，你可以通过调用 `use()` 方法将插件添加到你的应用程序中。

我们将使用在[编写插件](#编写插件)部分中创建的 `i18nPlugin` 进行演示。

 `use()` 方法有两个参数。第一个是要安装的插件，在这种情况下为 `i18nPlugin`。

它还会自动阻止你多次使用同一插件，因此在同一插件上多次调用只会安装一次该插件。

第二个参数是可选的，并且取决于每个特定的插件。在演示 `i18nPlugin` 的情况下，它是带有转换后的字符串的对象。

:::info
如果你使用的是第三方插件 (例如 `Vuex` 或 `Vue Router`)，请始终查看文档以了解特定插件期望作为第二个参数接收的内容。
:::

```js
import { createApp } from 'vue'
import Root from './App.vue'
import i18nPlugin from './plugins/i18n'

const app = createApp(Root)
const i18nStrings = {
  greetings: {
    hi: 'Hallo!'
  }
}

app.use(i18nPlugin, i18nStrings)
app.mount('#app')
```

[awesome-vue](https://github.com/vuejs/awesome-vue#components--libraries) 集合了大量由社区贡献的插件和库。
