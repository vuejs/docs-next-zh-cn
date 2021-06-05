# 特殊指令

## key

- **预期：**`number | string`

  `key` 特殊 attribute 主要用做 Vue 的虚拟 DOM 算法的提示，以在比对新旧节点组时辨识 VNodes。如果不使用 key，Vue 会使用一种算法来最小化元素的移动并且尽可能尝试就地修改/复用相同类型元素。而使用 key 时，它会基于 key 的顺序变化重新排列元素，并且 key 不再存在的元素将始终被移除/销毁。

  有相同父元素的子元素必须有**唯一的 key**。重复的 key 会造成渲染错误。

  最常见的用例是和 `v-for` 一起使用：

  ```html
  <ul>
    <li v-for="item in items" :key="item.id">...</li>
  </ul>
  ```

  它也可以用于强制替换元素/组件而不是重复使用它。当你遇到如下场景时它可能会很有用：

  - 完整地触发组件的生命周期钩子
  - 触发过渡

  例如：

  ```html
  <transition>
    <span :key="text">{{ text }}</span>
  </transition>
  ```

  当 `text` 发生改变时，`<span>` 总是会被替换而不是被修改，因此会触发过渡。

## ref

- **预期：**`string | Function`

  `ref` 被用来给元素或子组件注册引用信息。引用信息将会被注册在父组件的 `$refs` 对象上。如果在普通的 DOM 元素上使用，引用指向的就是那个 DOM 元素；如果用在子组件上，引用就指向组件实例：

  ```html
  <!-- vm.$refs.p 会是 DOM 节点 -->
  <p ref="p">hello</p>

  <!-- vm.$refs.child 会是子组件实例 -->
  <child-component ref="child"></child-component>

  <!-- 当动态绑定时，我们可以将 ref 定义为回调函数，显式地传递元素或组件实例 -->
  <child-component :ref="(el) => child = el"></child-component>
  ```

  关于 ref 注册时机的重要说明：因为 ref 本身是作为渲染函数的结果而创建的，在初始渲染时你不能访问它们——它们还不存在！`$refs` 也是非响应式的，因此你不应该试图用它在模板中做数据绑定。

-  **参考**[子组件 Refs](../guide/component-template-refs.html)

## is

- **预期：**`string | Object (component’s options object)`

使用[动态组件](../guide/component-dynamic-async.html)。

例如：

```html
<!-- 当 currentView 改变时组件就改变 -->
<component :is="currentView"></component>
```

-  **参考**
  - [动态组件](../guide/component-dynamic-async.html)
  - [DOM 模板解析说明](../guide/component-basics.html#解析-dom-模板时的注意事项)
