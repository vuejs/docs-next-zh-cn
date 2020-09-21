---
title: Prop 默认函数 this 的访问
badges:
  - breaking
---

# Props Default Function `this` Access <MigrationBadges :badges="$frontmatter.badges" />

Prop 默认值工厂函数不再能访问 `this`。

替换：

- 组件接收到的原始 prop 作为参数传递给默认函数；

- [注入](../composition-api-provide-inject.md) API 可以在默认函数中使用。

```js
import { inject } from 'vue'

export default {
  props: {
    theme: {
      default (props) {
        // `props` 是传递给组件的原始值。
        // 在任何类型之前/默认强制转换
        // 也可以使用 `inject` 来访问注入的 property
        return inject('theme', 'default-theme')
      }
    }
  }
}
```
