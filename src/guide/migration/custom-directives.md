---
badges:
  - breaking
---

# 自定义指令 <MigrationBadges :badges="$frontmatter.badges" />

## 概览

下面是对变更的简要总结:

- API已重命名，以便更好地与组件生命周期保持一致
- 自定义指令将由子组件通过 `v-bind="$attrs"`

更多信息，请继续阅读！

## 2.x 语法

在 Vue 2, 自定义指令是通过使用下面列出的钩子来创建的，这些钩子都是可选的

- **bind** - 指令绑定到元素后发生。只发生一次。
- **inserted** - 元素插入父DOM后发生。
- **update** - 当元素更新，但子元素尚未更新时，将调用此钩子。
- **componentUpdated** - 一旦组件和子级被更新，就会调用这个钩子。
- **unbind** - 一旦指令被移除，就会调用这个钩子。也只调用一次。

下面是一个例子：

```html
<p v-highlight="yellow">高亮显示此文本亮黄色</p>
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

然而，在Vue 3 中，我们为自定义指令创建了一个更具凝聚力的API。正如你所看到的，它们与我们的组件生命周期方法有很大的不同，即使我们正与类似的事件钩子，我们现在把它们统一起来了：

- bind → **beforeMount**
- inserted → **mounted**
- **beforeUpdate**:<sup style="color:green">新的！</sup>这是在元素本身更新之前调用的，很像组件生命周期钩子
- update → <sup style="color:red">移除！</sup>有太多的相似之处要更新，所以这是多余的，请改用`updated`
- componentUpdated → **updated**
- **beforeUnmount** <sup style="color:green">新的！</sup> 与组件生命周期钩子类似，它将在卸载元素之前调用。
- unbind -> **unmounted**

最终API如下：

```js
const MyDirective = {
  beforeMount(el, binding, vnode, prevVnode) {},
  mounted() {},
  beforeUpdate() {},
  updated() {},
  beforeUnmount() {}, // 新
  unmounted() {}
}
```

生成的API可以这样使用，与前面的示例相同：

```html
<p v-highlight="yellow">高亮显示此文本亮黄色</p>
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

## 实施细节

在 Vue 3中，我们现在支持片段，这允许我们为每个组件返回多个DOM节点。你可以想象，对于具有多个lis的组件或一个表的子元素这样的组件有多方便：

```html
<template>
  <li>Hello</li>
  <li>Vue</li>
  <li>Devs!</li>
</template>
```

如此灵活，我们可能会遇到一个定制指令的问题，它可能有多个根节点。

因此，自定义指令现在作为虚拟DOM节点数据的一部分包含在内。当在组件上使用自定义指令时，钩子作为无关的prop传递到组件，并以 `this.$attrs`结束。

这也意味着可以像这样在模板中直接挂接到元素的生命周期中，这在涉及到自定义指令时非常方便：

```html
<div @vnodeMounted="myHook" />
```

这与属性fallthrough行为是一致的，因此，当子组件在内部元素上使用 `v-bind="$attrs"` 时，它也将应用对其使用的任何自定义指令。