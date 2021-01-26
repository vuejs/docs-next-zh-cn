---
badges:
  - breaking
---

# 自定义指令 <MigrationBadges :badges="$frontmatter.badges" />

## 概览

<!-- TODO: translation -->

The hook functions for directives have been renamed to better align with the component lifecycle.

## 2.x 语法

在 Vue 2，自定义指令是通过使用下面列出的钩子来创建的，这些钩子都是可选的

- **bind** - 指令绑定到元素后发生。只发生一次。
- **inserted** - 元素插入父 DOM 后发生。
- **update** - 当元素更新，但子元素尚未更新时，将调用此钩子。
- **componentUpdated** - 一旦组件和子级被更新，就会调用这个钩子。
- **unbind** - 一旦指令被移除，就会调用这个钩子。也只调用一次。

下面是一个例子：

```html
<p v-highlight="'yellow'">高亮显示此文本亮黄色</p>
```

```js
Vue.directive('highlight', {
  bind(el, binding, vnode) {
    el.style.background = binding.value
  }
})
```

在这里，在这个元素的初始设置中，指令通过传递一个值来绑定样式，该值可以通过应用程序更新为不同的值。

## 3.x 语法

然而，在 Vue 3 中，我们为自定义指令创建了一个更具凝聚力的 API。正如你所看到的，它们与我们的组件生命周期方法有很大的不同，即使我们正与类似的事件钩子，我们现在把它们统一起来了：

- **created** - 新的! 在应用元素的 attribute 或事件监听器之前，会被调用。
- bind → **beforeMount**
- inserted → **mounted**
- **beforeUpdate**：新的！这是在元素本身更新之前调用的，很像组件生命周期钩子。
- update → 移除！有太多的相似之处要更新，所以这是多余的，请改用 `updated`。
- componentUpdated → **updated**
- **beforeUnmount**：新的！与组件生命周期钩子类似，它将在卸载元素之前调用。
- unbind -> **unmounted**

最终 API 如下：

```js
const MyDirective = {
  beforeMount(el, binding, vnode, prevVnode) {},
  mounted() {},
  beforeUpdate() {}, // 新
  updated() {},
  beforeUnmount() {}, // 新
  unmounted() {}
}
```

生成的 API 可以这样使用，与前面的示例相同：

```html
<p v-highlight="'yellow'">高亮显示此文本亮黄色</p>
```

```js
const app = Vue.createApp({})

app.directive('highlight', {
  beforeMount(el, binding, vnode) {
    el.style.background = binding.value
  }
})
```

既然定制指令生命周期钩子映射了组件本身的那些，那么它们就更容易推理和记住了！

<!-- TODO: translation -->

### Edge Case: Accessing the component instance

It's generally recommended to keep directives independent of the component instance they are used in. Accessing the instance from within a custom directive is often a sign that the directive should rather be a component itself. However, there are situations where this actually makes sense.

In Vue 2, the component instance had to be accessed through the `vnode` argument:

```javascript
bind(el, binding, vnode) {
  const vm = vnode.context
}
```

In Vue 3, the instance is now part of the `binding`:

```javascript
mounted(el, binding, vnode) {
  const vm = binding.instance
}
```

:::warning
With [fragments](/guide/migration/fragments.html#overview) support, components can potentially have more than one root node. When applied to a multi-root component, a directive will be ignored and a warning will be logged.
:::