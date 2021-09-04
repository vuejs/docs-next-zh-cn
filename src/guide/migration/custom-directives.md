---
badges:
  - breaking
---

# 自定义指令 <MigrationBadges :badges="$frontmatter.badges" />

## 概览

指令的钩子函数已经被重命名，以更好地与组件的生命周期保持一致。

额外地，`expression` 字符串不再作为 `binding` 对象的一部分被传入。

## 2.x 语法

在 Vue 2 中，自定义指令通过使用下列钩子来创建，以对齐元素的生命周期，它们都是可选的：

- **bind** - 指令绑定到元素后调用。只调用一次。
- **inserted** - 元素插入父 DOM 后调用。
- **update** - 当元素更新，但子元素尚未更新时，将调用此钩子。
- **componentUpdated** - 一旦组件和子级被更新，就会调用这个钩子。
- **unbind** - 一旦指令被移除，就会调用这个钩子。也只调用一次。

下面是一个例子：

```html
<p v-highlight="'yellow'">以亮黄色高亮显示此文本</p>
```

```js
Vue.directive('highlight', {
  bind(el, binding, vnode) {
    el.style.background = binding.value
  }
})
```

此处，在这个元素的初始设置中，通过给指令传递一个值来绑定样式，该值可以在应用中任意更改。

## 3.x 语法

然而，在 Vue 3 中，我们为自定义指令创建了一个更具凝聚力的 API。正如你所看到的，它们与我们的组件生命周期方法有很大的不同，即使钩子的目标事件十分相似。我们现在把它们统一起来了：

- **created** - 新增！在元素的 attribute 或事件监听器被应用之前调用。
- bind → **beforeMount**
- inserted → **mounted**
- **beforeUpdate**：新增！在元素本身被更新之前调用，与组件的生命周期钩子十分相似。
- update → 移除！该钩子与 `updated` 有太多相似之处，因此它是多余的。请改用 `updated`。
- componentUpdated → **updated**
- **beforeUnmount**：新增！与组件的生命周期钩子类似，它将在元素被卸载之前调用。
- unbind -> **unmounted**

最终的 API 如下：

```js
const MyDirective = {
  created(el, binding, vnode, prevVnode) {}, // 新增
  beforeMount() {},
  mounted() {},
  beforeUpdate() {}, // 新增
  updated() {},
  beforeUnmount() {}, // 新增
  unmounted() {}
}
```

因此，API 可以这样使用，与前面的示例相同：

```html
<p v-highlight="'yellow'">以亮黄色高亮显示此文本</p>
```

```js
const app = Vue.createApp({})

app.directive('highlight', {
  beforeMount(el, binding, vnode) {
    el.style.background = binding.value
  }
})
```

既然现在自定义指令的生命周期钩子与组件本身保持一致，那么它们就更容易被推理和记住了！

### 边界情况：访问组件实例

通常来说，建议在组件实例中保持所使用的指令的独立性。从自定义指令中访问组件实例，通常意味着该指令本身应该是一个组件。然而，在某些情况下这种用法是有意义的。

在 Vue 2 中，必须通过 `vnode` 参数访问组件实例：

```js
bind(el, binding, vnode) {
  const vm = vnode.context
}
```

在 Vue 3 中，实例现在是 `binding` 参数的一部分：

```js
mounted(el, binding, vnode) {
  const vm = binding.instance
}
```

:::warning
有了[片段](/guide/migration/fragments.html#概览)的支持，组件可能会有多个根节点。当被应用于多根组件时，自定义指令将被忽略，并将抛出警告。
:::

## 迁移策略

[迁移构建开关：`CUSTOM_DIR`](migration-build.html#兼容性配置)
