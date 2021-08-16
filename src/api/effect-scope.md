# Effect Scope API <Badge text="3.2+" />

:::info
Effect scope 主要面向于库作者的高级 API。关于如何利用此 API 的详细信息，请参阅相应的 [RFC](https://github.com/vuejs/rfcs/blob/master/active-rfcs/0041-reactivity-effect-scope.md)。
:::

## `effectScope`

创建一个副作用范围对象，它可以捕获在其中创建的响应式副作用 (例如：computed 和 watcher)，便于把这些副作用一起处理。

**类型：**

```ts
function effectScope(detached?: boolean): EffectScope

interface EffectScope {
  run<T>(fn: () => T): T | undefined // undefined if scope is inactive
  stop(): void
}
```

**案例：**

```js
const scope = effectScope()

scope.run(() => {
  const doubled = computed(() => counter.value * 2)

  watch(doubled, () => console.log(doubled.value))

  watchEffect(() => console.log('Count: ', doubled.value))
})

// 处理 scope 中的所有副作用
scope.stop()
```

## `getCurrentScope`

如果有当前活动的 [effect scope](#effectscope)，就返回它。

**类型：**

```ts
function getCurrentScope(): EffectScope | undefined
```

## `onScopeDispose`

在当前活动的 [effect scope](#effectscope) 上注册一个处理回调。该回调会在其关联的副作用范围停止的时候被调用。

这个方法可以在可复用的组合函数中 `onUnmounted` 的一个非组件耦合替代品，因为每个

**类型：**

```ts
function onScopeDispose(fn: () => void): void
```
