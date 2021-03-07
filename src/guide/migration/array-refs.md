---
title: v-for 中的 Ref 数组
badges:
- breaking
---

# {{ $frontmatter.title }} <MigrationBadges :badges="$frontmatter.badges" />

在 Vue 2 中，在 `v-for` 里使用的 `ref` attribute 会用 ref 数组填充相应的 `$refs` property。当存在嵌套的 `v-for` 时，这种行为会变得不明确且效率低下。

在 Vue 3 中，这样的用法将不再在 `$ref` 中自动创建数组。要从单个绑定获取多个 ref，请将 `ref` 绑定到一个更灵活的函数上 (这是一个新特性)：

```html
<div v-for="item in list" :ref="setItemRef"></div>
```

结合选项式 API:

```js
export default {
  data() {
    return {
      itemRefs: []
    }
  },
  methods: {
    setItemRef(el) {
      if (el) {
        this.itemRefs.push(el)
      }
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

结合组合式 API:

```js
import { onBeforeUpdate, onUpdated } from 'vue'

export default {
  setup() {
    let itemRefs = []
    const setItemRef = el => {
      if (el) {
        itemRefs.push(el)
      }
    }
    onBeforeUpdate(() => {
      itemRefs = []
    })
    onUpdated(() => {
      console.log(itemRefs)
    })
    return {
      setItemRef
    }
  }
}
```

注意：

- `itemRefs` 不必是数组：它也可以是一个对象，其 ref 会通过迭代的 key 被设置。

- 如果需要，`itemRef` 也可以是响应式的且可以被监听。
