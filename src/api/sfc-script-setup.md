---
sidebarDepth: 1
---

# 单文件组件 `<script setup>`

`<script setup>` 是在单文件组件 (SFCs) 中使用 [Composition API](/api/composition-api.html) 的编译时语法糖。与普通的 `<script>` 语法相比，它有更多优势：

- 更少的模板内容，更简洁的代码。
- 用纯 Typescript 声明 props 和发出事件的能力。
- 更好的运行时性能 (其模板会被编译成一个与其同一作用域的渲染函数，没有任何的中间代理)。
- 更好的 IDE 类型推断性能 (减少语言服务器从代码中抽离类型的工作)。

## 基本语法

为了加入这个语法特性，需要将 `setup` 特性添加到 `<script>` 代码块上：

```vue
<script setup>
console.log('hello script setup')
</script>
```

里面的代码会被编译成组件的 `setup()` 函数的内容。意味着不像普通的 `<script>` 那样只在组件被第一次引入的时候执行一次，`<script setup>` 中的代码会在**每次组件实例被创建的时候执行**。

### 顶层的绑定会被暴露给模板

当使用 `<script setup>` 的时候，任何在 `<script setup>` 声明的顶层的绑定 (包括变量，函数声明，以及 import 引入的内容) 都能在模板中直接使用：

```vue
<script setup>
// 变量
const msg = 'Hello!'

// 函数
function log() {
  console.log(msg)
}
</script>

<template>
  <div @click="log">{{ msg }}</div>
</template>
```

import 导入的内容也会以同样的方式暴露。意味着你可以在模板表达式中直接使用导入的 helper 函数，并不需要通过 `methods` 选项来暴露它：

```vue
<script setup>
import { capitalize } from './helpers'
</script>

<template>
  <div>{{ capitalize('hello') }}</div>
</template>
```

## 响应式

响应式状态需要明确使用[响应式 APIs](/api/basic-reactivity.html) 来创建。和从 `setup()` 函数中返回值一样，ref 值在模板中使用的时候会自动拆箱：

```vue
<script setup>
import { ref } from 'vue'

const count = ref(0)
</script>

<template>
  <button @click="count++">{{ count }}</button>
</template>
```

## 使用组件

`<script setup>` 范围里的值也能被直接作为自定义组件的标签名称使用：

```vue
<script setup>
import MyComponent from './MyComponent.vue'
</script>

<template>
  <MyComponent />
</template>
```

将 `MyComponent` 视为被引用为一个变量。如果你已经使用了 JSX，在这里的使用它的心智模型是一样的。其 kebab-case 格式的 `<my-component>` 同样也能在模板中使用，不过为了更好的一致性，我们强烈建议使用 PascalCase 格式作为组件的标签名称。这也有助于区分原生的自定义元素。

### 动态组件

由于组件被引用为变量而不是用字符串建来注册的，我们在 `<script setup>` 要使用动态组件的时候，就应该使用动态的 `:is` 来绑定：

```vue
<script setup>
import Foo from './Foo.vue'
import Bar from './Bar.vue'
</script>

<template>
  <component :is="Foo" />
  <component :is="someCondition ? Foo : Bar" />
</template>
```

请注意组件是如何在三元表达式中被当做变量使用的。

### 递归组件

一个单文件组件可以通过它的文件名被其自己所引用。例如：一个名为 `FooBar.vue` 的组件可以在其模板中用 `<FooBar/>` 引用它自己。

请注意这种方式相比于 import 导入的组件优先级更低。如果你有一个命名的 import 导入和组件的推断名冲突了，你可以使用 import 别名导入：

```js
import { FooBar as FooBarChild } from './components'
```

### 命名空间组件

你可以使用带点的组件标记，例如 `<Foo.Bar>` 来引用嵌套在对象属性中的组件。这在你要从单个文件中导入多个组件的时候非常有用：

```vue
<script setup>
import * as Form from './form-components'
</script>

<template>
  <Form.Input>
    <Form.Label>label</Form.Label>
  </Form.Input>
</template>
```

## `defineProps` 和 `defineEmits`

为了声明 `props` 和 `emits` 选项且具备完整的类型推断，我们可以使用 `defineProps` 和 `defineEmits` API，它们在 `<script setup>` 中都是自动可用的：

```vue
<script setup>
const props = defineProps({
  foo: String
})

const emit = defineEmits(['change', 'delete'])
// setup code
</script>
```

- `defineProps` 和 `defineEmits` 都是只在 `<script setup>` 中才能使用的**编译器宏**。他们不需要导入，且会在处理 `<script setup>` 的时候被编译处理掉。

- `defineProps` 接收与 `props` 属性相同的值，同时 `defineEmits` 也接收 `emits` 属性相同的值。

- `defineProps` 和 `defineEmits` 在选项传入后，会提供恰当的类型推断。

- 传入到 `defineProps` 和 `defineEmits` 的选项会从 setup 中提升到模块的范围。因而，传入的选项不能引用在 setup 范围中声明的局部变量。这样做会引起编译错误。但是，它*可以*引用导入的绑定，因为它们也在模块范围内。

如果你在使用 Typescript，[使用纯类型声明来声明 prop 和 emits](#typescript-only-features) 也是可以的。

## `defineExpose`

使用 `<script setup>` 的组件是**默认关闭**的，也即通过模板 ref 或者 `$parent` 链获取到的组件的公开实例，不会暴露任何在 `<script setup>` 中声明的绑定。

为了在 `<script setup>` 组件中明确要暴露出去的属性，使用 `defineExpose` 这个编译器宏：

```vue
<script setup>
import { ref } from 'vue'

const a = 1
const b = ref(2)

defineExpose({
  a,
  b
})
</script>
```

当一个父组件通过模板 ref 的方式获取到当前组件的实例，获取到的实例会像这样 `{ a: number, b: number }` (refs 会和在普通实例中一样被自动拆箱)

## `useSlots` 和 `useAttrs`

在 `<script setup>` 使用 `slots` 和 `attrs` 的情况应该是很稀有的，因为你可以在模板中通过 `$slots` 和 `$attrs` 来访问它们。在那些稀有的需要使用它们的场景中，可以分别使用 `useSlots` 和 `useAttrs` 两个辅助函数来使用它们：

```vue
<script setup>
import { useSlots, useAttrs } from 'vue'

const slots = useSlots()
const attrs = useAttrs()
</script>
```

`useSlots` 和 `useAttrs` 是真实的运行时函数，它会返回与 `setupContext.slots` 和 `setupContext.attrs` 同等的值。它们同样也能在普通的 composition API 中使用。

## 与普通的 `<script>` 一起使用

`<script setup>` 可以和普通的 `<script>` 一起使用。普通的 `<script>` 或许会在我们需要的这些情况下被使用到：

- 无法在 `<script setup>` 声明的选项，例如 `inheritAttrs` 或通过插件启用的自定义的选项。
- 声明命名导出。
- 运行副作用或者创建只需要执行一次的对象。

```vue
<script>
// 普通 <script>, 在模块范围下执行(只执行一次)
runSideEffectOnce()

// 声明额外的选项
export default {
  inheritAttrs: false,
  customOptions: {}
}
</script>

<script setup>
// 在 setup() 作用域中执行 (对每个实例皆如此)
</script>
```

## 顶层 `await`

`<script setup>` 中可以使用顶层 `await`。结果代码会被编译成 `async setup()`：

```vue
<script setup>
const post = await fetch(`/api/post/1`).then(r => r.json())
</script>
```

另外，await 的表达式会自动编译成在 `await` 之后保留当前组件实例上下文的格式

:::warning 注意
`async setup()` 必须与 `Suspense` 组合使用，`Suspense` 目前还是处于实验阶段的特性。我们打算在将来的某个发布版本中开发完成并提供文档 - 如果你现在感兴趣，可以参照 [tests](https://github.com/vuejs/vue-next/blob/master/packages/runtime-core/__tests__/components/Suspense.spec.ts) 看它是如何工作的。
:::

## 仅限 TypeScript 的功能

### 仅限类型的 props/emit 声明

props 和 emits 都可以使用传递字面量类型参数给 `defineProps` or `defineEmits` 的纯类型语法来声明：

```ts
const props = defineProps<{
  foo: string
  bar?: number
}>()

const emit = defineEmits<{
  (e: 'change', id: number): void
  (e: 'update', value: string): void
}>()
```

- `defineProps` 或 `defineEmits` 只能是要么使用运行时声明，要么使用类型声明。同时使用两种声明方式会导致编译报错。

- 使用类型声明的时候，静态分析会自动生成等效的运行时声明，以消除双重声明的需要并仍然确保正确的运行时行为。

  - 在开发环境下，编译器会试着从类型来推断对应的运行时验证。例如这里从 `foo: string` 类型中推断出 `foo: String`。如果类型是对导入类型的引用，这里的推断结果会是 `foo: null` (与 `any` 类型相等)，因为编译器没有外部文件的信息。

  - 在生产模式下，编译器会生成数组格式的声明来减少打包体积 (这里的 props 会被编译成 `['foo', 'bar']`)。

  - 生成的代码仍然是有着类型的 Typescript 代码，它会在后续的流程中被其它工具处理。

- 截至目前，类型声明参数必须是以下内容之一，以确保正确的静态分析：

  - 类型字面量
  - 在同一文件中的接口或类型字面量的引用

  现在还不支持复杂的类型和从其它文件进行类型导入。理论上来说，将来是可能实现类型导入的。

### 使用类型声明时的默认 props 值

仅限类型的 `defineProps` 声明的一个不足在于，它没有可以给 props 提供默认值的方式。为了解决这个问题，提供了一个 `withDefaults` 的编译器宏：

```ts
interface Props {
  msg?: string
  labels?: string[]
}

const props = withDefaults(defineProps<Props>(), {
  msg: 'hello',
  labels: () => ['one', 'two']
})
```

上面代码会被编译为等价的运行时 props 的 `default` 选项。另外，`withDefaults` 辅助函数提供了对默认值的类型检查，并且确保返回的 `props` 的类型删除了已声明默认值的属性的可选标志。

## 限制：没有 Src 导入

由于模块执行语义的差异，`<script setup>` 中的代码依赖单文件组件的上下文。当移动到外部的 `.js` 或者 `.ts` 文件中的时候，对于开发者和工具来说都会感到混乱。因而 **`<script setup>`** 不能和 `src` 特性一起使用。
