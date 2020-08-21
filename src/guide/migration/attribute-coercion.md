---
badges:
  - breaking
---

# attribute强制行为 <MigrationBadges :badges="$frontmatter.badges" />

::: info 信息
这是一个低级的内部API更改，不会影响大多数开发人员。
:::

## 概览

下面是对这些变化的高层次总结:

- 删除枚举attribute的内部概念，并将这些attribute视为普通的非布尔attribute
- **重大改变**: 如果值为布尔值，则不再删除attribute `false`. 相反，它被设置为attr="false"。移除attribute, 使用 `null` 或者 `undefined`.

For more information, read on!

## 2.x 语法

在 2.x, 我们有以下策略来强制`v-bind`的值:

- 对于某些attribute/元素对，Vue始终使用相应的IDL attribute（property）: [比如 `value` 的 `<input>`, `<select>`, `<progress>`, 等等](https://github.com/vuejs/vue/blob/bad3c326a3f8b8e0d3bcf07917dc0adf97c32351/src/platforms/web/util/attrs.js#L11-L18).

- 对于 “ [布尔attribute](https://github.com/vuejs/vue/blob/bad3c326a3f8b8e0d3bcf07917dc0adf97c32351/src/platforms/web/util/attrs.js#L33-L40)” 和 [xlinks](https://github.com/vuejs/vue/blob/bad3c326a3f8b8e0d3bcf07917dc0adf97c32351/src/platforms/web/util/attrs.js#L44-L46), 如果它们是 `falsy` 的，Vue会移除它们 ([`undefined`, `null` or `false`](https://github.com/vuejs/vue/blob/bad3c326a3f8b8e0d3bcf07917dc0adf97c32351/src/platforms/web/util/attrs.js#L52-L54))另外加上它们 (见 [这里](https://github.com/vuejs/vue/blob/bad3c326a3f8b8e0d3bcf07917dc0adf97c32351/src/platforms/web/runtime/modules/attrs.js#L66-L77) 和 [这里](https://github.com/vuejs/vue/blob/bad3c326a3f8b8e0d3bcf07917dc0adf97c32351/src/platforms/web/runtime/modules/attrs.js#L81-L85)).

- 对于 " [枚举attribute](https://github.com/vuejs/vue/blob/bad3c326a3f8b8e0d3bcf07917dc0adf97c32351/src/platforms/web/util/attrs.js#L20)" (目前 `contenteditable`, `draggable` 和 `spellcheck`), Vue会尝试 [强制](https://github.com/vuejs/vue/blob/bad3c326a3f8b8e0d3bcf07917dc0adf97c32351/src/platforms/web/util/attrs.js#L24-L31) 将它们串起来 （目前对`contenteditable` 做了特殊处理, 修复 [vuejs/vue#9397](https://github.com/vuejs/vue/issues/9397)).

-  对于其他attribute,我们移除了 `falsy` 值 (`undefined`, `null`, or `false`) 并按原样设置其他值 (见 [这里](https://github.com/vuejs/vue/blob/bad3c326a3f8b8e0d3bcf07917dc0adf97c32351/src/platforms/web/runtime/modules/attrs.js#L92-L113)).

下表描述了Vue如何使用普通非布尔attribute强制“枚举attribute”：

| 绑定表达式           | `foo` <sup>正常</sup>   | `draggable` <sup>枚举</sup>       |
| ------------------- | ----------------------- | --------------------------------- |
| `:attr="null"`      | /                       | `draggable="false"`               |
| `:attr="undefined"` | /                       | /                                 |
| `:attr="true"`      | `foo="true"`            | `draggable="true"`                |
| `:attr="false"`     | /                       | `draggable="false"`               |
| `:attr="0"`         | `foo="0"`               | `draggable="true"`                |
| `attr=""`           | `foo=""`                | `draggable="true"`                |
| `attr="foo"`        | `foo="foo"`             | `draggable="true"`                |
| `attr`              | `foo=""`                | `draggable="true"`                |

从上表可以看出, 当前实现 `true` 强制为 `'true'` 但如果 attribute 为`false`，则移除该attribute. 这也导致了不一致性，并要求用户在非常常见的用例中手动强制布尔值为字符串，例如
 `aria-*` attribute 像 `aria-selected`, `aria-hidden`, 等等.

## 3.x 语法

我们打算放弃 “枚举attribute” 的内部概念，并将它们视为普通的非布尔HTML attribute。

- 这解决了普通非布尔attribute和 “枚举attribute” 之间的不一致性
- 它还可以使用 `'true'` 和 `'false'` 以外的值，甚至可以使用 `contenteditable`等attribute的关键字`

对于非布尔attribute，如果attribute为 `false` ，Vue将停止删除它们，相反强制它们为 `'false'` 。

- 这解决了 `true` 和 `false` 之间的不一致性，并使输出 `aria-*` attributes更容易

下表描述了新行为:

| 绑定表达式       | `foo` <sup>正常</sup>    | `draggable` <sup>枚举</sup> |
| ------------------- | -------------------------- | --------------------------------- |
| `:attr="null"`      | /                          | / <sup>†</sup>                    |
| `:attr="undefined"` | /                          | /                                 |
| `:attr="true"`      | `foo="true"`               | `draggable="true"`                |
| `:attr="false"`     | `foo="false"` <sup>†</sup> | `draggable="false"`               |
| `:attr="0"`         | `foo="0"`                  | `draggable="0"` <sup>†</sup>      |
| `attr=""`           | `foo=""`                   | `draggable=""` <sup>†</sup>       |
| `attr="foo"`        | `foo="foo"`                | `draggable="foo"` <sup>†</sup>    |
| `attr`              | `foo=""`                   | `draggable=""` <sup>†</sup>       |

<small>†: 变更</small>

布尔attributes的强制保持不变。

## 迁移策略

### 枚举attribute

缺少枚举attribute和 `attr="false"` 可能会产生不同的IDL attribute值（将反映实际状态），描述如下：

| 缺少枚举attr | IDL attr & 值                     |
| ---------------------- | ------------------------------------ |
| `contenteditable`      | `contentEditable` &rarr; `'inherit'` |
| `draggable`            | `draggable` &rarr; `false`           |
| `spellcheck`           | `spellcheck` &rarr; `true`           |


为了保持原有的行为，并且我们将强制使用 `false` 为 `'false'`，在3.x Vue中，开发人员需要将 `v-bind` 表达式解析为 `false` 或 `'false'`，表示 `contenteditable` 和 `spellcheck` 。

在2.x中，枚举attribute的无效值被强制为 `'true'` 。这通常是无意的，不太可能大规模依赖。在3.x中，应显式指定 `true` 或 `'true'` 。

### 将`false` 强制为 `'false'` 而不是删除attribute

在 3.x, `null` 或 `undefined` 应用于显式删除attribute。

### 2.x和3.x行为的比较

<table>
  <thead>
    <tr>
      <th>Attributes</th>
      <th><code>v-bind</code> value <sup>2.x</sup></th>
      <th><code>v-bind</code> value <sup>3.x</sup></th>
      <th>HTML 输出</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td rowspan="3">2.x “枚举attribute”<br><small>i.e. <code>contenteditable</code>, <code>draggable</code> and <code>spellcheck</code>.</small></td>
      <td><code>undefined</code>, <code>false</code></td>
      <td><code>undefined</code>, <code>null</code></td>
      <td><i>removed</i></td>
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
      <td><code>null</code>, <code>'false'</code></td>
      <td><code>false</code>, <code>'false'</code></td>
      <td><code>"false"</code></td>
    </tr>
    <tr>
      <td rowspan="2">其他非布尔attribute<br><small>eg. <code>aria-checked</code>, <code>tabindex</code>, <code>alt</code>, etc.</small></td>
      <td><code>undefined</code>, <code>null</code>, <code>false</code></td>
      <td><code>undefined</code>, <code>null</code></td>
      <td><i>removed</i></td>
    </tr>
    <tr>
      <td><code>'false'</code></td>
      <td><code>false</code>, <code>'false'</code></td>
      <td><code>"false"</code></td>
    </tr>
  </tbody>
</table>
