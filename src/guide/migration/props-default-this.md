---
title: 在 prop 的默认函数中访问 this
badges:
  - breaking
---

# 在 prop 的默认函数中访问 `this` <MigrationBadges :badges="$frontmatter.badges" />

生成 prop 默认值的工厂函数不再能访问 `this`。

替代方案：

- 把组件接收到的原始 prop 作为参数传递给默认函数；

- [inject](../composition-api-provide-inject.md) API 可以在默认函数中使用。

```js
import { inject } from 'vue'

export default {
  props: {
    theme: {
      default (props) {
        // `props` 是传递给组件的原始值。
        // 在任何类型/默认强制转换之前
        // 也可以使用 `inject` 来访问注入的 property
        return inject('theme', 'default-theme')
      }
    }
  }
}
```

## 迁移策略

[迁移构建标记：`PROPS_DEFAULT_THIS`](migration-build.html#兼容性配置)
