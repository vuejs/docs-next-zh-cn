---
badges:
  - breaking
---

# 过渡类名的更改 <MigrationBadges :badges="$frontmatter.badges" />

## 概览

类名 `v-enter` 重命名为 `v-enter-from`，类名 `v-leave` 重命名为 `v-leave-from`。

## 2.x 语法

在 v2.1.8 之前，每个过渡方向有2个过渡类名：初始状态和生效时的状态。

在 v2.1.8，我们引入了 `v-enter-to` 来解决 enter/leave 过渡的时间间隔。但是为了向后兼容，`v-enter` 并没有做更改：

```css
.v-enter,
.v-leave-to {
  opacity: 0;
}

.v-leave,
.v-enter-to {
  opacity: 1;
}
```

这就变得混乱了，因为 *enter* 和 *leave* 是宽泛的，并没有使用与类名钩子相同的命名约定。

## 3.x 更新

为了更加清晰易懂，我们重命名了初始状态的类名。

```css
.v-enter-from,
.v-leave-to {
  opacity: 0;
}

.v-leave-from,
.v-enter-to {
  opacity: 1;
}
```

现在这些状态之间的区别更加清晰了

`<transition>` 组件相关的 prop 也做了更改：

- `leave-class` 重命名为 `leave-from-class` (在渲染函数或者 JSX 中可以写成 `leaveFromClass`)
- `enter-class` 重命名为 `enter-from-class` (在渲染函数或者 JSX 中可以写成 `enterFromClass`)

## 迁移策略

1. 把 `.v-enter` 改为 `.v-enter-from`
2. 把 `.v-leave` 改为 `.v-leave-from`
3. 根据上面的介绍更改相关 prop。
