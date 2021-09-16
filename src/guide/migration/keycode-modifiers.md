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

在 Vue 2 中，`keyCodes` 可以作为修改 `v-on` 方法的一种方式。

```html
<!-- 键码版本 -->
<input v-on:keyup.13="submit" />

<!-- 别名版本 -->
<input v-on:keyup.enter="submit" />
```

此外，也可以通过全局的 `config.keyCodes` 选项定义自己的别名。

```js
Vue.config.keyCodes = {
  f1: 112
}
```

```html
<!-- 键码版本 -->
<input v-on:keyup.112="showHelpText" />

<!-- 自定义别名版本 -->
<input v-on:keyup.f1="showHelpText" />
```

## 3.x 语法

从 [`KeyboardEvent.keyCode` 已被废弃](https://developer.mozilla.org/zh-CN/docs/Web/API/KeyboardEvent/keyCode)开始，Vue 3 继续支持这一点就不再有意义了。因此，现在建议对任何要用作修饰符的键使用 kebab-cased (短横线) 名称。

```html
<!-- Vue 3 在 v-on 上使用按键修饰符 -->
<input v-on:keyup.page-down="nextPage">

<!-- 同时匹配 q 和 Q -->
<input v-on:keypress.q="quit">
```

因此，这意味着 `config.keyCodes` 现在也已弃用，不再受支持。

## 迁移策略

对于那些在代码库中使用 `keyCode` 的用户，我们建议将它们转换为对应的 kebab-cased (短横线) 命名。

对于某些标点符号键，可以直接把它们包含进去，以 `,` 键为例：

```html
<input v-on:keypress.,="commaPress">
```

语法的限制导致某些特定字符无法被匹配，比如 `"`、`'`、`/`、`=`、`>` 和 `.`。对于这些字符，你应该在监听器内使用 `event.key` 代替。

[迁移构建开关：](migration-build.html#兼容性配置)

- `CONFIG_KEY_CODES`
- `V_ON_KEYCODE_MODIFIER`
