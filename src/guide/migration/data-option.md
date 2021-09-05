---
title: Data 选项
badges:
  - breaking
---

# {{ $frontmatter.title}} <MigrationBadges :badges="$frontmatter.badges" />

## 概览

- **非兼容**：组件选项 `data` 的声明不再接收纯 JavaScript `object`，而是接收一个 `function`。

- **非兼容**：当合并来自 mixin 或 extend 的多个 `data` 返回值时，合并操作现在是浅层次的而非深层次的 (只合并根级属性)。

## 2.x 语法

在 2.x 中，开发者可以通过 `object` 或者是 `function` 定义 `data` 选项。

例如：

```html
<!-- Object 声明 -->
<script>
  const app = new Vue({
    data: {
      apiKey: 'a1b2c3'
    }
  })
</script>

<!-- Function 声明 -->
<script>
  const app = new Vue({
    data() {
      return {
        apiKey: 'a1b2c3'
      }
    }
  })
</script>
```

虽然这种做法对于具有共享状态的根实例提供了一些便利，但是由于其只可能存在于根实例上，因此变得混乱。

## 3.x 更新

在 3.x 中，`data` 选项已标准化为只接受返回 `object` 的 `function`。

使用上面的示例，代码只可能有一种实现：

```html
<script>
  import { createApp } from 'vue'

  createApp({
    data() {
      return {
        apiKey: 'a1b2c3'
      }
    }
  }).mount('#app')
</script>
```

## Mixin 合并行为变更

此外，当来自组件的 `data()` 及其 mixin 或 extends 基类被合并时，合并操作现在将被*浅层次*地执行：

```js
const Mixin = {
  data() {
    return {
      user: {
        name: 'Jack',
        id: 1
      }
    }
  }
}

const CompA = {
  mixins: [Mixin],
  data() {
    return {
      user: {
        id: 2
      }
    }
  }
}
```

在 Vue 2.x 中，生成的 `$data` 是：

```json
{
  "user": {
    "id": 2,
    "name": "Jack"
  }
}
```

在 3.0 中，其结果将会是：

```json
{
  "user": {
    "id": 2
  }
}
```

[迁移构建开关：`OPTIONS_DATA_FN`](migration-build.html#兼容性配置)

## 迁移策略

对于依赖对象式声明的用户，我们建议：

- 将共享数据提取到外部对象并将其用作 `data` 中的一个 property
- 重写对共享数据的引用以指向新的共享对象

对于依赖 mixin 的深度合并行为的用户，我们建议重构代码以完全避免这种依赖，因为 mixin 的深度合并非常隐式，这让代码逻辑更难理解和调试。

[迁移构建开关：](migration-build.html#兼容性配置)

- `OPTIONS_DATA_FN`
- `OPTIONS_DATA_MERGE`
