---
title: Data 选项
badges:
  - breaking
---

# {{ $frontmatter.title }} <MigrationBadges :badges="$frontmatter.badges" />

## 概览

- **BREAKING**: `data` 组件选项声明不再接收纯 JavaScript `object`，而需要 `function` 声明

## 2.x Syntax

在 2.x 中, 开发者可以定义 `data` 选项是 `object` 或者是 `function`

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

## 3.x Update

在 3.x, `data` 选项已标准化为只接受返回`object`的`function`。

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

## 迁移策略

对于依赖对象声明的用户，我们建议：

- 将共享数据提取到外部对象并将其用作`data`中的property
- 重写对共享数据的引用以指向新的共享对象