---
badges:
  - removed
---

# 过滤器 <MigrationBadges :badges="$frontmatter.badges" />

## 概览

从 Vue 3.0 开始，Filters 已删除，不再支持。

## 2.x 语法

在 2.x，开发者可以使用过滤器来处理通用文本格式。

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

虽然这看起来很方便，但它需要一个自定义语法，打破大括号内表达式是“只是 JavaScript”的假设，这不仅有学习成本，而且有实现成本。

## 3.x 更新

在 3.x 中，filters 已删除，不再支持。相反，我们建议用方法调用或计算属性替换它们。

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

### 全局过滤器

在你的应用中，如果全局注册了过滤器，那么在每个组件中使用计算属性或方法就不是那么方便。

相反地，你可以通过 [全局属性](../../api/application-config.html#globalproperties) 在所有组中使用全局过滤器:

```javascript
// main.js
const app = createApp(App)

app.config.globalProperties.$filters = {
  currencyUSD(value) {
    return '$' + value
  }
}
```

然后，你可以通过 `$filters` 对象修改所有的模板，像下面这样：

```html
<template>
  <h1>Bank Account Balance</h1>
  <p>{{ $filters.currencyUSD(accountBalance) }}</p>
</template>
```

注意，该方法只能用于方法中，不可以在计算属性中使用，因为后者只有在单个组件的上下文中定义时才有意义。