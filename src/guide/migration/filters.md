---
badges:
  - removed
---

# 过滤器 <MigrationBadges :badges="$frontmatter.badges" />

## 概览

Filters 已从 Vue 3.0 中删除，不再受支持。

## 2.x 语法

在 2.x，开发者可以使用过滤器来应用通用文本格式。

例如：

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

虽然这看起来很方便，但它需要一个自定义语法，打破大括号内表达式是“只是 JavaScript”的假设，这既有学习成本，也有实现成本。

## 3.x 更新

在 3.x 中，filters 已删除，不再受支持。相反，我们建议用方法调用或计算属性替换它们。

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


### Global Filters

If you are using filters that were globally registered and then used throughout your app, it's likely not convenient to replace them with computed properties or methods in each individual component.

Instead, you can make your global filters available to all components through [globalProperties](../../api/application-config.html#globalproperties):

```javascript
// main.js
const app = createApp(App)
app.config.globalProperties.$filters = {
  currencyUSD(value) {
    return '$' + value
  }
}
```

Then you can fix all templates using this `$filters` object like this:

```html
<template>
  <h1>Bank Account Balance</h1>
  <p>{{ $filters.currencyUSD(accountBalance) }}</p>
</template>
```

Note that with this approach, you can only use methods, not computed properties, as the latter only make sense when defined in the context of an individual component.