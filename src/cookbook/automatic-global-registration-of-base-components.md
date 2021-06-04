# 基础组件的自动化全局注册

## 基础示例

许多组件都是相对一般化的，可能只是包裹了一个输入框或按钮之类的元素。我们有时将其称为[基础组件](../style-guide/#基础组件名称强烈推荐)并且它们通常会在不同的组件中频繁被使用。

结果就是很多组件都引入了一个基础组件的长列表：

```js
import BaseButton from './BaseButton.vue'
import BaseIcon from './BaseIcon.vue'
import BaseInput from './BaseInput.vue'
export default {
  components: {
    BaseButton,
    BaseIcon,
    BaseInput
  }
}
```

只是为了支持模板中的几个标记：

```html
<BaseInput v-model="searchText" @keydown.enter="search" />
<BaseButton @click="search">
  <BaseIcon name="search" />
</BaseButton>
```

庆幸的是，如果你使用 webpack (或内部使用了 webpack 的 [Vue CLI](https://github.com/vuejs/vue-cli))，你可以使用 `require.context` 来全局注册这些非常常用的基础组件。这里有一段可以用在应用的入口文件 (如 `src/main.js`) 以全局导入基础组件代码示例：

```js
import { createApp } from 'vue'
import upperFirst from 'lodash/upperFirst'
import camelCase from 'lodash/camelCase'
import App from './App.vue'

const app = createApp(App)

const requireComponent = require.context(
  // 组件文件夹的相对路径
  './components',
  // 是否查找子目录
  false,
  // 匹配基础组件文件名的正则表达式
  /Base[A-Z]\w+\.(vue|js)$/
)

requireComponent.keys().forEach(fileName => {
  // 获取组件配置
  const componentConfig = requireComponent(fileName)

  // 获取组件的 PascalCase 名
  const componentName = upperFirst(
    camelCase(
      // 获取目录深度无关的文件名
      fileName
        .split('/')
        .pop()
        .replace(/\.\w+$/, '')
    )
  )

  app.component(
    componentName,
    // 在 `.default` 上查找组件选项。
    // 如果组件导出了 `export default` 的话，该选项会存在。
    // 否则回退到模块的根。
    componentConfig.default || componentConfig
  )
})

app.mount('#app')
```
