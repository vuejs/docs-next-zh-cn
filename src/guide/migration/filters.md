---
badges:
  - removed
---

# 过滤器 <MigrationBadges :badges="$frontmatter.badges" />

## 概览

从 Vue 3.0 开始，过滤器已移除，且不再支持。

## 2.x 语法

在 2.x 中，开发者可以使用过滤器来处理通用文本格式。

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

虽然这看起来很方便，但它需要一个自定义语法，打破了大括号内的表达式“只是 JavaScript”的假设，这不仅有学习成本，而且有实现成本。

## 3.x 更新

在 3.x 中，过滤器已移除，且不再支持。取而代之的是，我们建议用方法调用或计算属性来替换它们。

以上面的案例为例，以下是一种实现方式。

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

[迁移构建开关：](migration-build.html#兼容性配置)

- `FILTERS`
- `COMPILER_FILTERS`

### 全局过滤器

如果在应用中全局注册了过滤器，那么在每个组件中用计算属性或方法调用来替换它可能就没那么方便了。

取而代之的是，你可以通过[全局属性](../../api/application-config.html#globalproperties)以让它能够被所有组件使用到：

```js
// main.js
const app = createApp(App)

app.config.globalProperties.$filters = {
  currencyUSD(value) {
    return '$' + value
  }
}
```

然后，可以通过这个 `$filters` 对象修正所有的模板，就像这样：

```html
<template>
  <h1>Bank Account Balance</h1>
  <p>{{ $filters.currencyUSD(accountBalance) }}</p>
</template>
```

注意，这种方式只适用于方法，而不适用于计算属性，因为后者只有在单个组件的上下文中定义时才有意义。
