---
title: 过渡的 class 名更改
badges:
  - breaking
---

# {{ $frontmatter.title }} <MigrationBadges :badges="$frontmatter.badges" />

## 概览

过渡类名 `v-enter` 修改为 `v-enter-from`、过渡类名 `v-leave` 修改为 `v-leave-from`。

## 2.x 语法

在 v2.1.8 版本之前，每个过渡方向都有两个过渡类：初始状态与激活状态。

在 v2.1.8 版本中，引入了 `v-enter-to` 来定义 enter 或 leave 变换之间的过渡动画插帧。然而，为了向下兼容，并没有变动 `v-enter` 类名：

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

这样做会带来很多困惑，类似 *enter* 和 *leave* 含义过于宽泛，并且没有遵循类名钩子的命名约定。

## 3.x 语法

为了更加明确易读，我们现在将这些初始状态重命名为：

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

现在，这些状态之间的区别就清晰多了。

![Transition Diagram](/images/transitions.svg)

`<transition>` 组件的相关 prop 名称也发生了变化：

- `leave-class` 已经被重命名为 `leave-from-class` (在渲染函数或 JSX 中可以写为：`leaveFromClass`)
- `enter-class` 已经被重命名为 `enter-from-class` (在渲染函数或 JSX 中可以写为：`enterFromClass`)

## 迁移策略

1. 将 `.v-enter` 字符串实例替换为 `.v-enter-from`
2. 将 `.v-leave` 字符串实例替换为 `.v-leave-from`
3. 过渡组件相关的 prop 名称也需要进行字符串实例替换，规则如上所述。

## 参考

- [`<Transition>` 作为根元素不再能够从外界被切换](/guide/migration/transition-as-root.html)
- [`<TransitionGroup>` 现在默认不渲染包裹器元素](/guide/migration/transition-group.html)
