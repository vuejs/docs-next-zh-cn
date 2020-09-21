---
title: v-for Array Refs
badges:
- breaking
---

# {{ $frontmatter.title }} <MigrationBadges :badges="$frontmatter.badges" />

在 Vue 2 中，在 `v-for` 里使用的 `ref` 属性会用 ref 数组填充相应的 `$refs` 属性。当存在嵌套的 `v-for` 时，这种行为会变得不明确且效率低下。

在 Vue 3 中，这样的用法将不再在 `$ref` 中自动创建数组。要从单个绑定检索多个 refs，请将 `ref` 绑定到一个提供更灵活的函数上(这是一个新特性)：

```html
<div v-for="item in list" :ref="setItemRef"></div>
```

用 Options API:

```js
export default {
  data() {
    return {
      itemRefs: []
    }
  },
  methods: {
    setItemRef(el) {
      this.itemRefs.push(el)
    }
  },
  beforeUpdate() {
    this.itemRefs = []
  },
  updated() {
    console.log(this.itemRefs)
  }
}
```

用 Composition API:

```js
import { ref, onBeforeUpdate, onUpdated } from 'vue'

export default {
  setup() {
    let itemRefs = []
    const setItemRef = el => {
      itemRefs.push(el)
    }
    onBeforeUpdate(() => {
      itemRefs = []
    })
    onUpdated(() => {
      console.log(itemRefs)
    })
    return {
      itemRefs,
      setItemRef
    }
  }
}
```

注意：

- `itemRefs` 不必是数组：它也可以是一个对象，其中的 refs 通过迭代的 key 设置。

- 如果需要，也允许 `itemref` 是响应式和被监听的。
