---
badges:
  - breaking
---

# 按键修饰符 <MigrationBadges :badges="$frontmatter.badges" />

## 概览

以下是变更的简要总结：

- **非兼容**：不再支持使用数字 (即键码) 作为 `v-on` 修饰符
- **非兼容**：不再支持 `config.keyCodes`

## 2.x 语法

在 Vue 2 中，支持 `keyCodes` 作为修改 `v-on` 方法的方法。

```html
<!-- 键码版本 -->
<input v-on:keyup.13="submit" />

<!-- 别名版本 -->
<input v-on:keyup.enter="submit" />
```

此外，你也可以通过全局 `config.keyCodes` 选项。

```js
Vue.config.keyCodes = {
  f1: 112
}
```

```html
<!-- 键码版本 -->
<input v-on:keyup.112="showHelpText" />

<!-- 自定别名版本 -->
<input v-on:keyup.f1="showHelpText" />
```

## 3.x 语法

从[`KeyboardEvent.keyCode` has been deprecated](https://developer.mozilla.org/zh-CN/docs/Web/API/KeyboardEvent/keyCode) 开始，Vue 3 继续支持这一点就不再有意义了。因此，现在建议对任何要用作修饰符的键使用 kebab-cased (短横线) 大小写名称。

```html
<!-- Vue 3 在 v-on 上使用 按键修饰符 -->
<input v-on:keyup.page-down="nextPage">

<!-- 同时匹配 q 和 Q -->
<input v-on:keypress.q="quit">
```

因此，这意味着 `config.keyCodes` 现在也已弃用，不再受支持。

## 迁移策略

对于那些在代码库中使用 `keyCode` 的用户，我们建议将它们转换为对应的 kebab-cased (短横线) 命名。

对于那些包含字面量标点符号的按键，比如 `,` 键：

```html
<input v-on:keypress.,="commaPress">
```

语法的限制导致某些字符无法被匹配，比如 `"`，`'`，`/`，`=`，`>` 和 `.`。对于这些字符，你应该在监听器内使用 `event.key` 代替。

[迁移构建标记:](migration-build.html#兼容性配置)

- `CONFIG_KEY_CODES`
- `V_ON_KEYCODE_MODIFIER`
