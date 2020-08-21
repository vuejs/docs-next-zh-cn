## 模板引用

> 本节使用[单文件组件](single-file-component.html)代码示例的语法

> 本指南假定你已经阅读了[Composition API简介](composition-api-introduction.html) 和[响应式基础](reactivity-fundamentals.html)。如果你不熟悉组合API，请先阅读这篇文章。

在使用组合API时，[响应式引用](reactivity-fundamentals.html#creating-standalone-reactive-values-as-refs) 和 [模板引用](component-template-refs.html) 的概念是统一的。为了获得对模板内元素或组件实例的引用，我们可以像往常一样声明ref并从 [setup()](composition-api-setup.html)返回：

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
        // DOM元素将在初始渲染后分配给ref
        console.log(root.value) // <div>这是跟元素</div>
      })

      return {
        root
      }
    }
  }
</script>
```

这里我们在渲染上下文中暴露 `root` ，并通过 `ref="root"` ，将其绑定到div作为其ref。在虚拟DOM修补算法中，如果VNode的 `ref` 键对应于渲染上下文中的ref，则VNode的相应元素或组件实例将被分配给该ref的值。这是在虚拟DOM挂载/打补丁过程中执行的，因此模板引用只会在初始渲染之后获得赋值。

作为模板使用的ref的行为与任何其他ref一样：它们是响应式的，可以传递到（或从）复合函数中返回。

### Usage with JSX

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

### 内部使用 `v-for`

Composition API模板引用在 `-for` 内部使用时没有特殊处理。相反，请使用函数引用执行自定义处理：

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
