---
title: Data 选项
badges:
  - breaking
---

# {{ $frontmatter.title}} <MigrationBadges :badges="$frontmatter.badges" />

## 概览

- **非兼容**：`data` 组件选项声明不再接收纯 JavaScript `object`，而需要 `function` 声明。

当合并来自 mixin 或 extend 的多个 `data` 返回值时，现在是浅层次合并的而不是深层次合并的(只合并根级属性)。

## 2.x 语法

在 2.x 中，开发者可以定义 `data` 选项是 `object` 或者是 `function`。

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

虽然这对于具有共享状态的根实例提供了一些便利，但是由于只有在根实例上才有可能，这导致了混乱。

## 3.x 更新

在 3.x，`data` 选项已标准化为只接受返回 `object` 的 `function`。

使用上面的示例，代码只有一个可能的实现：

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

此外，当来自组件的 `data()` 及其 mixin 或 extends 基类被合并时，现在将*浅层次*执行合并：

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

## 迁移策略

对于依赖对象声明的用户，我们建议：

- 将共享数据提取到外部对象并将其用作 `data` 中的 property
- 重写对共享数据的引用以指向新的共享对象

对于依赖 mixin 的深度合并行为的用户，我们建议重构代码以完全避免这种依赖，因为 mixin 的深度合并非常隐式，这让代码逻辑更难理解和调试。
