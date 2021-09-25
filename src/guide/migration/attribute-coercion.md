---
badges:
  - breaking
---

# attribute 强制行为 <MigrationBadges :badges="$frontmatter.badges" />

:::info 信息
这是一个底层的内部 API 更改，绝大多数开发人员不会受到影响。
:::

## 概览

以下是对变化的总体概述：

- 移除枚举 attribute 的内部概念，并将这些 attribute 视为普通的非布尔 attribute
- **非兼容**：如果值为布尔值 `false`，则不再移除 attribute。取而代之的是，它将被设置为 attr="false"。若要移除 attribute，应该使用 `null` 或者 `undefined`。

如需更深入的解释，请继续阅读！

## 2.x 语法

在 2.x，我们有以下策略来强制 `v-bind` 的值：

- 对于某些 attribute/元素对，Vue 始终使用相应的 IDL attribute (property)：[比如 `<input>`，`<select>`，`<progress>` 中的 `value`，等等](https://github.com/vuejs/vue/blob/bad3c326a3f8b8e0d3bcf07917dc0adf97c32351/src/platforms/web/util/attrs.js#L11-L18)。

- 对于“[布尔 attribute](https://github.com/vuejs/vue/blob/bad3c326a3f8b8e0d3bcf07917dc0adf97c32351/src/platforms/web/util/attrs.js#L33-L40)”和 [xlinks](https://github.com/vuejs/vue/blob/bad3c326a3f8b8e0d3bcf07917dc0adf97c32351/src/platforms/web/util/attrs.js#L44-L46)，如果它们是 `falsy` ([`undefined`，`null` 或 `false`](https://github.com/vuejs/vue/blob/bad3c326a3f8b8e0d3bcf07917dc0adf97c32351/src/platforms/web/util/attrs.js#L52-L54)) 的，Vue 会移除它们，否则会加上。(见[这里](https://github.com/vuejs/vue/blob/bad3c326a3f8b8e0d3bcf07917dc0adf97c32351/src/platforms/web/runtime/modules/attrs.js#L66-L77)和[这里](https://github.com/vuejs/vue/blob/bad3c326a3f8b8e0d3bcf07917dc0adf97c32351/src/platforms/web/runtime/modules/attrs.js#L81-L85))。

- 对于“[枚举 attribute](https://github.com/vuejs/vue/blob/bad3c326a3f8b8e0d3bcf07917dc0adf97c32351/src/platforms/web/util/attrs.js#L20)” (目前来说包括 `contenteditable`、`draggable` 和 `spellcheck`)，Vue 会尝试将它们[强制](https://github.com/vuejs/vue/blob/bad3c326a3f8b8e0d3bcf07917dc0adf97c32351/src/platforms/web/util/attrs.js#L24-L31)转换为字符串 (目前对 `contenteditable` 做了特殊处理，以修复 [vuejs/vue#9397](https://github.com/vuejs/vue/issues/9397))。

-  对于其他 attribute，我们将移除 `falsy` 的值 (`undefined`，`null`，或 `false`)，其他值按原样设置 (见[这里](https://github.com/vuejs/vue/blob/bad3c326a3f8b8e0d3bcf07917dc0adf97c32351/src/platforms/web/runtime/modules/attrs.js#L92-L113))。

下表描述了 Vue 如何强制转换“枚举 attribute”，以及与普通非布尔 attribute 的不同之处：

| 绑定表达式           | `foo` <sup>正常</sup>   | `draggable` <sup>枚举</sup>       |
| ------------------- | ----------------------- | --------------------------------- |
| `:attr="null"`      | -                       | `draggable="false"`               |
| `:attr="undefined"` | -                       | -                                 |
| `:attr="true"`      | `foo="true"`            | `draggable="true"`                |
| `:attr="false"`     | -                       | `draggable="false"`               |
| `:attr="0"`         | `foo="0"`               | `draggable="true"`                |
| `attr=""`           | `foo=""`                | `draggable="true"`                |
| `attr="foo"`        | `foo="foo"`             | `draggable="true"`                |
| `attr`              | `foo=""`                | `draggable="true"`                |


从上表可以看出，当前实现将 `true` 强制转换为了 `'true'`，但如果 attribute 为 `false`，则将其移除。这也导致了不一致性，并要求用户在非常常见的用例中手动将布尔值强制转换为字符串，例如
 `aria-*` attribute，例如 `aria-selected`、`aria-hidden` 等等。

## 3.x 语法

我们打算放弃“枚举型 attribute”的内部概念，并将它们视为普通的非布尔型 HTML attribute。

- 这就解决了普通非布尔型 attribute 和“枚举型 attribute”之间的不一致性问题
- 这个改动还使得对于诸如 `contenteditable` 这样的 attribute，我们可以使用 `'true'` 和 `'false'` 以外的值，甚至是未来新增的关键字。

对于非布尔型 attribute，如果其值为 `false`，Vue 将不再移除它们，而是将其强制转换为 `'false'`。

- 这就解决了 `true` 和 `false` 之间的不一致性，并更易于输出 `aria-*` attribute

下表描述了新的行为：

| 绑定表达式       | `foo` <sup>正常</sup>    | `draggable` <sup>枚举</sup> |
| ------------------- | -------------------------- | --------------------------------- |
| `:attr="null"`      | -                          | - <sup>*</sup>                    |
| `:attr="undefined"` | -                          | -                                 |
| `:attr="true"`      | `foo="true"`               | `draggable="true"`                |
| `:attr="false"`     | `foo="false"` <sup>*</sup> | `draggable="false"`               |
| `:attr="0"`         | `foo="0"`                  | `draggable="0"` <sup>*</sup>      |
| `attr=""`           | `foo=""`                   | `draggable=""` <sup>*</sup>       |
| `attr="foo"`        | `foo="foo"`                | `draggable="foo"` <sup>*</sup>    |
| `attr`              | `foo=""`                   | `draggable=""` <sup>*</sup>       |

<small>*：已改变</small>

布尔型 attribute 的强制转换保持不变。

## 迁移策略

### 枚举 attribute

枚举 attribute 如果不存在，可能会和 `attr="false"` 会产生不同的 IDL attribute 值 (将反映实际状态)，描述如下：

| 不存在的枚举 attr           | IDL attr & 值                     |
| ---------------------- | ------------------------------------ |
| `contenteditable`      | `contentEditable` &rarr; `'inherit'` |
| `draggable`            | `draggable` &rarr; `false`           |
| `spellcheck`           | `spellcheck` &rarr; `true`           |

对于“枚举 attribute”，由于我们不再把 `null` 转换为 `'false'`，在 3.x 中，对于 `contenteditable` 和 `spellcheck`，开发者需要将原来解析为 `null` 的 `v-bind` 表达式变更为 `false` 或 `'false'` 才能保持和 2.x 中的行为一致。

在 2.x 中，枚举 attribute 的无效值将被强制转换为 `'true'`。这通常是不符合预期的，所以该行为不太可能被大规模依赖。在 3.x 中，应显式指定 `true` 或 `'true'`。

### 将 `false` 强制转换为 `'false'` 而不是移除 attribute

在 3.x 中，应该使用 `null` 或 `undefined` 以显式移除 attribute。

### 2.x 和 3.x 行为的比较

<table>
  <thead>
    <tr>
      <th>Attributes</th>
      <th><code>v-bind</code> 的值 <sup>2.x</sup></th>
      <th><code>v-bind</code> 的值 <sup>3.x</sup></th>
      <th>HTML 输出</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td rowspan="3">2.x “枚举 attribute”<br><small>即 <code>contenteditable</code>、<code>draggable</code> 与 <code>spellcheck</code>。</small></td>
      <td><code>undefined</code></td>
      <td><code>undefined</code>, <code>null</code></td>
      <td><i>被移除</i></td>
    </tr>
    <tr>
      <td>
        <code>true</code>, <code>'true'</code>, <code>''</code>, <code>1</code>,
        <code>'foo'</code>
      </td>
      <td><code>true</code>, <code>'true'</code></td>
      <td><code>"true"</code></td>
    </tr>
    <tr>
      <td><code>null</code>, <code>false</code>, <code>'false'</code></td>
      <td><code>false</code>, <code>'false'</code></td>
      <td><code>"false"</code></td>
    </tr>
    <tr>
      <td rowspan="2">其他非布尔 attribute<br><small>如 <code>aria-checked</code>、<code>tabindex</code>、<code>alt</code> 等等。</small></td>
      <td><code>undefined</code>, <code>null</code>, <code>false</code></td>
      <td><code>undefined</code>, <code>null</code></td>
      <td><i>被移除</i></td>
    </tr>
    <tr>
      <td><code>'false'</code></td>
      <td><code>false</code>, <code>'false'</code></td>
      <td><code>"false"</code></td>
    </tr>
  </tbody>
</table>

[迁移构建开关：](migration-build.html#兼容性配置)

- `ATTR_FALSE_VALUE`
- `ATTR_ENUMERATED_COERCION`
