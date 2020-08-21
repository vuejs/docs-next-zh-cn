---
badges:
  - breaking
---

# `v-model` <MigrationBadges :badges="$frontmatter.badges" />

## 概览

就变化而言，属于高阶内容：

- **BREAKING:** 用于自定义组件时, `v-model` prop和事件默认名称已更改：
  - prop: `value` -> `modelValue`;
  - event: `input` -> `update:modelValue`;
- **BREAKING:** `v-bind`的 `.sync` 修饰符和组件 `model` 选项被删除并替换为 `v-model` 参数;
- **NEW:** 现在可以在同一个组件上进行多个 `v-model` 绑定；
- **NEW:** 添加了创建自定义 `v-model` 修饰符的功能。

更多的信息，请继续阅读。

## 介绍

Vue 2.0发布时，`v-model` 指令要求开发人员始终使用 `value` prop，如果开发者为了不同的目的需要不同的prop，他们就不得不使用 `v-bind.sync`。此外，`v-model` 和`value` 之间的这种硬编码关系导致了如何处理原生元素和自定义元素的问题。

在2.2中，我们引入了 `model` 组件选项，允许组件自定义用于 `model` 的prop和事件。但是，这仍然只允许在组件上使用一个 `model` 。

在 Vue 3中，双向数据绑定的API正在标准化，以减少混淆，并允许开发者使用 `v-model` 指令更灵活。

## 2.x 语法

在2.x中，在组件上使用 `v-model` 相当于传递 `value` prop 属性并触发 `input` 事件：


```html
<ChildComponent v-model="pageTitle" />

<!-- 简写: -->

<ChildComponent :value="pageTitle" @input="pageTitle = $event" />
```

如果要将属性或事件名称更改为其他名称，则需要在 `ChildComponent` 组件中添加 `model` 选项：

```html
<!-- ParentComponent.vue -->

<ChildComponent v-model="pageTitle" />
```

```js
// ChildComponent.vue

export default {
  model: {
    prop: 'title',
    event: 'change'
  },
  props: {
    //这允许将 `value` 属性用于其他用途
    value: String,
    // 用 `title` 作为代替 `value` 的prop
    title: {
      type: String,
      default: 'Default title'
    }
  }
}
```

所以，这里的`v-model` 简写

```html
<ChildComponent :title="pageTitle" @change="pageTitle = $event" />
```

### 使用 `v-bind.sync`

在某些情况下，我们可能需要prop的“双向绑定”（有时是对不同prop的现有 `v-model` 的补充）。为此，我们建议使用 `update:myPropName`。例如，对于上一个示例中带有 `title` prop 的 `ChildComponent` ，我们可以将分配新value的意图传达给：

```js
this.$emit('update:title', newValue)
```

然后父级可以监听该事件并更新本地data property（如果愿意），例如：

```html
<ChildComponent :title="pageTitle" @update:title="pageTitle = $event" />
```

为了方便起见，我们使用.sync修饰符对此模式进行了速记：

```html
<ChildComponent :title.sync="pageTitle" />
```

## 3.x 语法

在3.x中，自定义组件上的 `v-model` 相当于传递 `modelValue` prop 并发出`update：modelValue`活动：

```html
<ChildComponent v-model="pageTitle" />

<!-- 简写: -->

<ChildComponent
  :modelValue="pageTitle"
  @update:modelValue="pageTitle = $event"
/>
```

### `v-model` 参数

要更改model名，而不是 `model` 组件选项，现在我们可以将一个_argument_ 传递给 `model` ：

```html
<ChildComponent v-model:title="pageTitle" />

<!-- 简写: -->

<ChildComponent :title="pageTitle" @update:title="pageTitle = $event" />
```

![v-bind anatomy](/images/v-bind-instead-of-sync.png)

这也可以作为 `.sync` 修饰符的替代，并允许我们在自定义组件上有多个 `v-model`。

```html
<ChildComponent v-model:title="pageTitle" v-model:content="pageContent" />

<!-- 简写： -->

<ChildComponent
  :title="pageTitle"
  @update:title="pageTitle = $event"
  :content="pageContent"
  @update:content="pageContent = $event"
/>
```

### `v-model` 修饰符

除了像 `.trim` 这样的2.x硬编码的 `v-model` 修饰符外，现在3.x还支持自定义修饰符：

```html
<ChildComponent v-model.capitalize="pageTitle" />
```

在[Custom Events](../component-custom-events.html#handling-v-model-modifiers)部分中了解有关自定义 `v-model` 修饰符的更多信息。

## 迁移策略

我们推荐:

- 检查你的代码库是否使用`.sync`并将其替换为 `v-model`：

  ```html
  <ChildComponent :title.sync="pageTitle" />

  <!-- 替换为 -->

  <ChildComponent v-model:title="pageTitle" />
  ```

- 对于所有不带参数的 `v-model`，请确保分别将props和events名称更改为 `modelValue` 和 `update:modelValue` 

  ```html
  <ChildComponent v-model="pageTitle" />
  ```

  ```js
  // ChildComponent.vue

  export default {
    props: {
      modelValue: String // 以前是`value：String`
    },
    methods: {
      changePageTitle(title) {
        this.$emit('update:modelValue', title) // 以前是 `this.$emit('input', title)`
      }
    }
  }
  ```

## 下一步

更多新的 `v-model` 语法信息，见：
- [在组件中使用 `v-model` ](../component-basics.html#using-v-model-on-components)
- [`v-model` 参数](../component-custom-events.html#v-model-arguments)
- [处理 `v-model` 修饰符](../component-custom-events.html#v-model-arguments)
