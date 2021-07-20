# 模板引用

> 本节代码示例使用[单文件组件](single-file-component.html)的语法

> 本指南假定你已经阅读了[组合式 API 简介](composition-api-introduction.html)和[响应性基础](reactivity-fundamentals.html)。如果你不熟悉组合式 API，请先阅读此文章。

在使用组合式 API 时，[响应式引用](reactivity-fundamentals.html#创建独立的响应式值作为-refs)和[模板引用](component-template-refs.html)的概念是统一的。为了获得对模板内元素或组件实例的引用，我们可以像往常一样声明 ref 并从 [setup()](composition-api-setup.html) 返回：

```html
<template> 
  <div ref="root">This is a root element</div>
</template>

<script>
  import { ref, onMounted } from 'vue'

  export default {
    setup() {
      const root = ref(null)

      onMounted(() => {
        // DOM 元素将在初始渲染后分配给 ref
        console.log(root.value) // <div>This is a root element</div>
      })

      return {
        root
      }
    }
  }
</script>
```

这里我们在渲染上下文中暴露 `root`，并通过 `ref="root"`，将其绑定到 div 作为其 ref。在虚拟 DOM 补丁算法中，如果 VNode 的 `ref` 键对应于渲染上下文中的 ref，则 VNode 的相应元素或组件实例将被分配给该 ref 的值。这是在虚拟 DOM 挂载/打补丁过程中执行的，因此模板引用只会在初始渲染之后获得赋值。

作为模板使用的 ref 的行为与任何其他 ref 一样：它们是响应式的，可以传递到 (或从中返回) 复合函数中。

## JSX 中的用法

```js
export default {
  setup() {
    const root = ref(null)

    return () =>
      h('div', {
        ref: root
      })

    // with JSX
    return () => <div ref={root} />
  }
}
```

## `v-for` 中的用法

组合式 API 模板引用在 `v-for` 内部使用时没有特殊处理。相反，请使用函数引用执行自定义处理：

```html
<template>
  <div v-for="(item, i) in list" :ref="el => { if (el) divs[i] = el }">
    {{ item }}
  </div>
</template>

<script>
  import { ref, reactive, onBeforeUpdate } from 'vue'

  export default {
    setup() {
      const list = reactive([1, 2, 3])
      const divs = ref([])

      // 确保在每次更新之前重置ref
      onBeforeUpdate(() => {
        divs.value = []
      })

      return {
        list,
        divs
      }
    }
  }
</script>
```
## 侦听模板引用

侦听模板引用的变更可以替代前面例子中演示使用的生命周期钩子。

但与生命周期钩子的一个关键区别是，`watch()` 和 `watchEffect()` 在 DOM 挂载或更新*之前*运行副作用，所以当侦听器运行时，模板引用还未被更新。

```vue
<template>
  <div ref="root">This is a root element</div>
</template>

<script>
  import { ref, watchEffect } from 'vue'

  export default {
    setup() {
      const root = ref(null)

      watchEffect(() => {
        // 这个副作用在 DOM 更新之前运行，因此，模板引用还没有持有对元素的引用。
        console.log(root.value) // => null
      })

      return {
        root
      }
    }
  }
</script>
```

因此，使用模板引用的侦听器应该用 `flush: 'post'` 选项来定义，这将在 DOM 更新*后*运行副作用，确保模板引用与 DOM 保持同步，并引用正确的元素。

```vue
<template>
  <div ref="root">This is a root element</div>
</template>

<script>
  import { ref, watchEffect } from 'vue'

  export default {
    setup() {
      const root = ref(null)

      watchEffect(() => {
        console.log(root.value) // => <div>This is a root element</div>
      }, 
      {
        flush: 'post'
      })

      return {
        root
      }
    }
  }
</script>
```

* 参考: [计算属性和侦听器](./reactivity-computed-watchers.html#副作用刷新时机)
