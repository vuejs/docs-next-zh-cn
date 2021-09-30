---
badges:
  - breaking
---

# `v-model` <MigrationBadges :badges="$frontmatter.badges" />

## 概览

以下是对变化的总体概述：

- **非兼容**：用于自定义组件时，`v-model` prop 和事件默认名称已更改：
  - prop：`value` -> `modelValue`；
  - 事件：`input` -> `update:modelValue`；
- **非兼容**：`v-bind` 的 `.sync` 修饰符和组件的 `model` 选项已移除，可在 `v-model` 上加一个参数代替；
- **新增**：现在可以在同一个组件上使用多个 `v-model` 绑定；
- **新增**：现在可以自定义 `v-model` 修饰符。

更多信息，请见下文。

## 介绍

在 Vue 2.0 发布后，开发者使用 `v-model` 指令时必须使用名为 `value` 的 prop。如果开发者出于不同的目的需要使用其他的 prop，他们就不得不使用 `v-bind.sync`。此外，由于`v-model` 和 `value` 之间的这种硬编码关系的原因，产生了如何处理原生元素和自定义元素的问题。

在 Vue 2.2 中，我们引入了 `model` 组件选项，允许组件自定义用于 `v-model` 的 prop 和事件。但是，这仍然只允许在组件上使用一个 `v-model`。

在 Vue 3 中，双向数据绑定的 API 已经标准化，以减少开发者在使用 `v-model` 指令时的混淆，并且更加灵活。

## 2.x 语法

在 2.x 中，在组件上使用 `v-model` 相当于绑定 `value` prop 并触发 `input` 事件：

```html
<ChildComponent v-model="pageTitle" />

<!-- 是以下的简写: -->

<ChildComponent :value="pageTitle" @input="pageTitle = $event" />
```

如果想要更改 prop 或事件名称，则需要在 `ChildComponent` 组件中添加 `model` 选项：

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
    // 这将允许 `value` 属性用于其他用途
    value: String,
    // 使用 `title` 代替 `value` 作为 model 的 prop
    title: {
      type: String,
      default: 'Default title'
    }
  }
}
```

所以，在这个例子中 `v-model` 是以下的简写：

```html
<ChildComponent :title="pageTitle" @change="pageTitle = $event" />
```

### 使用 `v-bind.sync`

在某些情况下，我们可能需要对某一个 prop 进行“双向绑定”(除了前面用 `v-model` 绑定 prop 的情况)。为此，我们建议使用 `update:myPropName` 抛出事件。例如，对于在上一个示例中带有 `title` prop 的 `ChildComponent`，我们可以通过下面的方式将分配新 value 的意图传达给父级：

```js
this.$emit('update:title', newValue)
```

然后父组件可以在需要时监听该事件，并更新本地的 data property。例如：

```html
<ChildComponent :title="pageTitle" @update:title="pageTitle = $event" />
```

为了方便起见，我们可以使用 `.sync` 修饰符来缩写，如下所示：

```html
<ChildComponent :title.sync="pageTitle" />
```

## 3.x 语法

在 3.x 中，自定义组件上的 `v-model` 相当于传递了 `modelValue` prop 并接收抛出的 `update:modelValue` 事件：

```html
<ChildComponent v-model="pageTitle" />

<!-- 是以下的简写: -->

<ChildComponent
  :modelValue="pageTitle"
  @update:modelValue="pageTitle = $event"
/>
```

### `v-model` 参数

若需要更改 `model` 的名称，现在我们可以为 `v-model` 传递一个*参数*，以作为组件内 `model` 选项的替代：

```html
<ChildComponent v-model:title="pageTitle" />

<!-- 是以下的简写: -->

<ChildComponent :title="pageTitle" @update:title="pageTitle = $event" />
```

![v-bind anatomy](/images/v-bind-instead-of-sync.png)

这也可以作为 `.sync` 修饰符的替代，而且允许我们在自定义组件上使用多个 `v-model`。

```html
<ChildComponent v-model:title="pageTitle" v-model:content="pageContent" />

<!-- 是以下的简写： -->

<ChildComponent
  :title="pageTitle"
  @update:title="pageTitle = $event"
  :content="pageContent"
  @update:content="pageContent = $event"
/>
```

### `v-model` 修饰符

除了像 `.trim` 这样的 2.x 硬编码的 `v-model` 修饰符外，现在 3.x 还支持自定义修饰符：

```html
<ChildComponent v-model.capitalize="pageTitle" />
```

我们可以在 [Custom Events](../component-custom-events.html#处理-v-model-修饰符) 部分中了解有关自定义 `v-model` 修饰符的更多信息。

## 迁移策略

我们推荐：

- 检查你的代码库中所有使用 `.sync` 的部分并将其替换为 `v-model`：

  ```html
  <ChildComponent :title.sync="pageTitle" />

  <!-- 替换为 -->

  <ChildComponent v-model:title="pageTitle" />
  ```

- 对于所有不带参数的 `v-model`，请确保分别将 prop 和 event 命名更改为 `modelValue` 和 `update:modelValue` 

  ```html
  <ChildComponent v-model="pageTitle" />
  ```

  ```js
  // ChildComponent.vue

  export default {
    props: {
      modelValue: String // 以前是`value：String`
    },
    emits: ['update:modelValue'],
    methods: {
      changePageTitle(title) {
        this.$emit('update:modelValue', title) // 以前是 `this.$emit('input', title)`
      }
    }
  }
  ```

[迁移构建开关：](migration-build.html#兼容性配置)

- `COMPONENT_V_MODEL`
- `COMPILER_V_BIND_SYNC`

## 下一步

更多新的 `v-model` 语法相关信息，请参考：

- [在组件中使用 `v-model`](../component-basics.html#在组件上使用-v-model) 
- [`v-model` 参数](../component-custom-events.html#v-model-参数)
- [处理 `v-model` 修饰符](../component-custom-events.html#处理-v-model-修饰符)
