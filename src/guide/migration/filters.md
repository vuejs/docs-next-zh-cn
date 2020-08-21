---
badges:
  - removed
---

# 过滤器 <MigrationBadges :badges="$frontmatter.badges" />

## 概览

Filters 已从Vue 3.0中删除，不再受支持。

## 2.x 语法

在 2.x, 开发者可以使用过滤器来应用通用文本格式。

例如:

```html
<template>
  <h1>Bank Account Balance</h1>
  <p>{{ accountBalance | currencyUSD }}</p>
</template>

<script>
  export default {
    props: {
      accountBalance: {
        type: Number,
        required: true
      }
    },
    filters: {
      currencyUSD(value) {
        return '$' + value
      }
    }
  }
</script>
```

虽然这看起来很方便，但它需要一个自定义语法，打破大括号内表达式是“只是JavaScript”的假设，这既有学习成本，也有实现成本。

## 3.x 更新

在 3.x 中, filters 已删除，不再受支持。相反，我们建议用方法调用或计算属性替换它们。

使用上面的例子，这里是一个如何实现它的例子。

```html
<template>
  <h1>Bank Account Balance</h1>
  <p>{{ accountInUSD }}</p>
</template>

<script>
  export default {
    props: {
      accountBalance: {
        type: Number,
        required: true
      }
    },
    computed: {
      accountInUSD() {
        return '$' + this.accountBalance
      }
    }
  }
</script>
```

## 迁移策略

我们建议用计算属性或方法代替过滤器，而不是使用过滤器。