# Effect 作用域 API <Badge text="3.2+" />

:::info
Effect 作用域是一个高阶的 API，主要服务于库作者。关于其使用细节请咨询相应的 [RFC](https://github.com/vuejs/rfcs/blob/master/active-rfcs/0041-reactivity-effect-scope.md)。
:::

## `effectScope`

创建一个 effect 作用域对象，以捕获在其内部创建的响应式 effect (例如计算属性或侦听器)，使得这些 effect 可以一起被处理。

**类型**：

```ts
function effectScope(detached?: boolean): EffectScope

interface EffectScope {
  run<T>(fn: () => T): T | undefined // 如果这个域不活跃则为 undefined
  stop(): void
}
```

**示例**：

```js
const scope = effectScope()

scope.run(() => {
  const doubled = computed(() => counter.value * 2)

  watch(doubled, () => console.log(doubled.value))

  watchEffect(() => console.log('Count: ', doubled.value))
})

// 处理该作用域内的所有 effect
scope.stop()
```

## `getCurrentScope`

如果有，则返回当前活跃的 [effect 作用域](#effectscope)。

**类型**：

```ts
function getCurrentScope(): EffectScope | undefined
```

## `onScopeDispose`

在当前活跃的 [effect 作用域](#effectscope)上注册一个处理回调。该回调会在相关的 effect 作用域结束之后被调用。

该方法在复用组合式函数时可用作 `onUnmounted` 的非组件耦合替代品，因为每个 Vue 组件的 `setup()` 函数也同样在 effect 作用域内被调用。

**类型**：

```ts
function onScopeDispose(fn: () => void): void
```
