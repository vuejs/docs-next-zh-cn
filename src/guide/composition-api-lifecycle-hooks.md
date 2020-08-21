# 生命周期钩子

> 本指南假定你已经阅读了 [Composition API简介](composition-api-introduction.html) 和 [响应式基础](reactivity-fundamentals.html) 。如果你不熟悉组合API，请先阅读这篇文章。

你可以通过在生命周期钩子前面加上“on”来访问组件的生命周期钩子。

下表包含如何在 [setup()](composition-api-setup.html) 内部调用生命周期钩子:

|    选项 API       | Hook inside inside `setup` |
| ----------------- | -------------------------- |
| `beforeCreate`    | Not needed\*               |
| `created`         | Not needed\*               |
| `beforeMount`     | `onBeforeMount`            |
| `mounted`         | `onMounted`                |
| `beforeUpdate`    | `onBeforeUpdate`           |
| `updated`         | `onUpdated`                |
| `beforeUnmount`   | `onBeforeUnmount`          |
| `unmounted`       | `onUnmounted`              |
| `errorCaptured`   | `onErrorCaptured`          |
| `renderTracked`   | `onRenderTracked`          |
| `renderTriggered` | `onRenderTriggered`        |

:::tip
因为 `setup` 是围绕 `beforeCreate` 和 `created` 生命周期钩子运行的，所以不需要显式地定义它们。换句话说，在这些钩子中编写的任何代码都应该直接在 `setup` 函数中编写。
:::

这些函数接受在组件调用钩子时将执行的回调：

```js
// MyBook.vue

export default {
  setup() {
    // mounted
    onMounted(() => {
      console.log('Component is mounted!')
    })
  }
}
```
