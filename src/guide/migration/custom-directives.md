---
badges:

- breaking

---

# 自定义指令 <MigrationBadges :badges="$frontmatter.badges" />

## 概览

为了更好的与组件的生命周期保持一致，在 Vue 3.x 中将自定义指令的钩子函数进行了重新命名。
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

然而，在 Vue 3 中，我们为自定义指令创建了一些更具凝聚力的 API。正如你所看到的，虽然我们有类似的事件钩子，但是它们与我们的组件生命周期方法有很大的不同。现在，我们已经像下面这样将它们统一起来：

- created - 新的！在元素的 attribute 或事件侦听器应用之前调用。
- bind → **beforeMount**
- inserted → **mounted**
- **beforeUpdate**：新的！这是在元素本身更新之前调用的，很像组件生命周期钩子。
- update → 移除！有太多的相似之处要更新，所以这是多余的，请改用 `updated`。
- componentUpdated → **updated**
- **beforeUnmount**：新的！与组件生命周期钩子类似，它将在元素卸载之前调用。
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

现在自定义指令的钩子函数与组件生命周期钩子函数相映射，那么它们就更容易推理和记住了！

### 边界情况：访问组件实例

通常建议保持指令独立于使用它们的组件实例。从自定义指令中访问该实例的现象通常表明该指令相当于组件本身。然而在某些情况下这是合理的。

在 Vue 2 中，必须通过 `vnode` 访问组件实例：

```javascript
bind(el, binding, vnode) {
  const vm = vnode.context
}
```

在 Vue 3 中，实例是 `binding` 的一部分：

```javascript
mounted(el, binding, vnode) {
  const vm = binding.instance
}
```

:::warning 注意
有了 [fragments](/guide/migration/fragments.html#概览) 支持, 组件可能会有多个根节点。当自定义指令应用于多根组件时，其将被忽略并记录警告。 
:::
