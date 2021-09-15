---
title: 在 prop 的默认函数中访问 this
badges:
  - breaking
---

# 在 prop 的默认函数中访问 `this` <MigrationBadges :badges="$frontmatter.badges" />

生成 prop 默认值的工厂函数不再能访问 `this`。

取而代之的是：

- 组件接收到的原始 prop 将作为参数传递给默认函数；

- [inject](../composition-api-provide-inject.md) API 可以在默认函数中使用。

```js
import { inject } from 'vue'

export default {
  props: {
    theme: {
      default (props) {
        // `props` 是传递给组件的、
        // 在任何类型/默认强制转换之前的原始值，
        // 也可以使用 `inject` 来访问注入的 property
        return inject('theme', 'default-theme')
      }
    }
  }
}
```

## 迁移策略

[迁移构建开关：`PROPS_DEFAULT_THIS`](migration-build.html#兼容性配置)
