# TypeScript 支持

> [Vue CLI](https://cli.vuejs.org) 提供内置的 TypeScript 工具支持。

## NPM 包中的官方声明

随着应用的增长，静态类型系统可以帮助防止许多潜在的运行时错误，这就是为什么 Vue 3 是用 TypeScript 编写的。这意味着在 Vue 中使用 TypeScript 不需要任何其他工具——它具有一等公民支持。

## 推荐配置

```js
// tsconfig.json
{
  "compilerOptions": {
    "target": "esnext",
    "module": "esnext",
    // 这样就可以对 `this` 上的数据属性进行更严格的推断
    "strict": true,
    "jsx": "preserve",
    "moduleResolution": "node"
  }
}
```

请注意，必须包含 `strict: true` (或至少包含 `noImplicitThis: true`，它是 `strict` 标志的一部分) 才能在组件方法中利用 `this` 的类型检查，否则它总是被视为 `any` 类型。

参见 [TypeScript 编译选项文档](https://www.typescriptlang.org/docs/handbook/compiler-options.html)查看更多细节。

## Webpack 配置

如果你使用自定义 Webpack 配置，需要配置 `ts-loader` 来解析 vue 文件里的 `<script lang="ts">` 代码块：

```js{10}
// webpack.config.js
module.exports = {
  ...
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        options: {
          appendTsSuffixTo: [/\.vue$/],
        },
        exclude: /node_modules/,
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      }
      ...
```

## 开发工具

### 项目创建

[Vue CLI](https://github.com/vuejs/vue-cli) 可以生成使用 TypeScript 的新项目，开始：

```bash
# 1. Install Vue CLI, 如果尚未安装
npm install --global @vue/cli@next

# 2. 创建一个新项目, 选择 "Manually select features" 选项
vue create my-project-name

# 3. 如果已经有一个不存在TypeScript的 Vue CLI项目，请添加适当的 Vue CLI插件：
vue add typescript
```

请确保组件的 `script` 部分已将语言设置为 TypeScript：

```html
<script lang="ts">
  ...
</script>
```

或者，如果你想将 TypeScript 与 [JSX `render` 函数](/guide/render-function.html#jsx)结合起来：

```html
<script lang="tsx">
  ...
</script>
```

### 编辑器支持

对于使用 TypeScript 开发 Vue 应用程序，我们强烈建议使用 [Visual Studio Code](https://code.visualstudio.com/)，它为 TypeScript 提供了很好的开箱即用支持。如果你使用的是[单文件组件](./single-file-component.html) (SFCs)，那么可以使用很棒的 [Volar extension](https://github.com/johnsoncodehk/volar)，它在 SFCs 中提供了 TypeScript 推理和许多其他优秀的特性。

[WebStorm](https://www.jetbrains.com/webstorm/) 同时为 TypeScript 和 Vue 提供内置的支持。其它的 JetBrains IDE 对它们也通过内置或[免费插件](https://plugins.jetbrains.com/plugin/9442-vue-js)的方式进行支持。

## 定义 Vue 组件

要让 TypeScript 正确推断 Vue 组件选项中的类型，需要使用 `defineComponent` 全局方法定义组件：

```ts
import { defineComponent } from 'vue'

const Component = defineComponent({
  // 已启用类型推断
})
```

如果你使用的是[单文件组件](/guide/single-file-component.html)，则通常会被写成：

```vue
<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  // 已启用类型推断
})
</script>
```

## 与 Options API 一起使用

TypeScript 应该能够在不显式定义类型的情况下推断大多数类型。例如，对于拥有一个数字类型的 `count` property 的组件来说，如果你试图对其调用字符串独有的方法，会出现错误：

```ts
const Component = defineComponent({
  data() {
    return {
      count: 0
    }
  },
  mounted() {
    const result = this.count.split('') // => Property 'split' does not exist on type 'number'
  }
})
```

如果你有一个复杂的类型或接口，你可以使用 [type assertion](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#type-assertions) 对其进行指明：

```ts
interface Book {
  title: string
  author: string
  year: number
}

const Component = defineComponent({
  data() {
    return {
      book: {
        title: 'Vue 3 Guide',
        author: 'Vue Team',
        year: 2020
      } as Book
    }
  }
})
```

### 为 `globalProperties` 扩充类型

Vue 3 提供了一个 [`globalProperties` 对象](../api/application-config.html#globalproperties)，用来添加可以被任意组件实例访问的全局 property。例如一个[插件](./plugins.html#编写插件)想要注入一个共享全局对象或函数。

```ts
// 用户定义
import axios from 'axios'
const app = Vue.createApp({})
app.config.globalProperties.$http = axios
// 验证数据的插件
export default {
  install(app, options) {
    app.config.globalProperties.$validate = (data: object, rule: object) => {
      // 检查对象是否合规
    }
  }
}
```

为了告诉 TypeScript 这些新 property，我们可以使用[模块扩充 (module augmentation)](https://www.typescriptlang.org/docs/handbook/declaration-merging.html#module-augmentation)。

在上述示例中，我们可以添加以下类型声明：

```ts
import axios from 'axios'
declare module '@vue/runtime-core' {
  export interface ComponentCustomProperties {
    $http: typeof axios
    $validate: (data: object, rule: object) => boolean
  }
}
```

我们可以把这些类型声明放在同一个文件里，或一个项目级别的 `*.d.ts` 文件 (例如在 TypeScript 会自动加载的 `src/typings` 文件夹中)。对于库/插件作者来说，这个文件应该被定义在 `package.json` 的 `types` property 里。

::: warning 确认声明文件是一个 TypeScript 模块
为了利用好模块扩充，你需要确认你的文件中至少有一个顶级的 `import` 或 `export`，哪怕只是一个 `export {}`。

[在 TypeScript 中](https://www.typescriptlang.org/docs/handbook/modules.html)，任何包含一个顶级 `import` 或 `export` 的文件都被视为一个“模块”。如果类型声明在模块之外，该声明会覆盖而不是扩充原本的类型。
:::

关于 `ComponentCustomProperties` 类型的更多信息，请参阅其[在 `@vue/runtime-core` 中的定义](https://github.com/vuejs/vue-next/blob/2587f36fe311359e2e34f40e8e47d2eebfab7f42/packages/runtime-core/src/componentOptions.ts#L64-L80)及[其 TypeScript 测试用例](https://github.com/vuejs/vue-next/blob/master/test-dts/componentTypeExtensions.test-d.tsx)学习更多。

### 注解返回类型

由于 Vue 声明文件的循环特性，TypeScript 可能难以推断 computed 的类型。因此，你可能需要注解计算属性的返回类型。

```ts
import { defineComponent } from 'vue'

const Component = defineComponent({
  data() {
    return {
      message: 'Hello!'
    }
  },
  computed: {
    // 需要注解
    greeting(): string {
      return this.message + '!'
    },

    // 在使用 setter 进行计算时，需要对 getter 进行注解
    greetingUppercased: {
      get(): string {
        return this.greeting.toUpperCase()
      },
      set(newValue: string) {
        this.message = newValue.toUpperCase()
      }
    }
  }
})
```

### 注解 Props

Vue 对定义了 `type` 的 prop 执行运行时验证。要将这些类型提供给 TypeScript，我们需要使用 `PropType` 指明构造函数：

```ts
import { defineComponent, PropType } from 'vue'

interface Book {
  title: string
  author: string
  year: number
}

const Component = defineComponent({
  props: {
    name: String,
    id: [Number, String],
    success: { type: String },
    callback: {
      type: Function as PropType<() => void>
    },
    book: {
      type: Object as PropType<Book>,
      required: true
    },
    metadata: {
      type: null // metadata 的类型是 any
    }
  }
})
```

::: warning
由于 TypeScript 中的[设计限制](https://github.com/microsoft/TypeScript/issues/38845)，当它涉及到为了对函数表达式进行类型推理，你必须注意对象和数组的 `validator` 和 `default` 值：
:::

```ts
import { defineComponent, PropType } from 'vue'

interface Book {
  title: string
  year?: number
}

const Component = defineComponent({
  props: {
    bookA: {
      type: Object as PropType<Book>,
      // 请务必使用箭头函数
      default: () => ({
        title: 'Arrow Function Expression'
      }),
      validator: (book: Book) => !!book.title
    },
    bookB: {
      type: Object as PropType<Book>,
      // 或者提供一个明确的 this 参数
      default(this: void) {
        return {
          title: 'Function Expression'
        }
      },
      validator(this: void, book: Book) {
        return !!book.title
      }
    }
  }
})
```

### 注解 emit

我们可以为触发的事件注解一个有效载荷。另外，所有未声明的触发事件在调用时都会抛出一个类型错误。

```ts
const Component = defineComponent({
  emits: {
    addBook(payload: { bookName: string }) {
      // perform runtime 验证
      return payload.bookName.length > 0
    }
  },
  methods: {
    onSubmit() {
      this.$emit('addBook', {
        bookName: 123 // 类型错误！
      })
      this.$emit('non-declared-event') // 类型错误！
    }
  }
})
```

## 与组合式 API 一起使用

在 `setup()` 函数中，不需要将类型传递给 `props` 参数，因为它将从 `props` 组件选项推断类型。

```ts
import { defineComponent } from 'vue'

const Component = defineComponent({
  props: {
    message: {
      type: String,
      required: true
    }
  },

  setup(props) {
    const result = props.message.split('') // 正确, 'message' 被声明为字符串
    const filtered = props.message.filter(p => p.value) // 将引发错误: Property 'filter' does not exist on type 'string'
  }
})
```

### 类型声明 `refs`

Refs 根据初始值推断类型：

```ts
import { defineComponent, ref } from 'vue'

const Component = defineComponent({
  setup() {
    const year = ref(2020)

    const result = year.value.split('') // => Property 'split' does not exist on type 'number'
  }
})
```

有时我们可能需要为 ref 的内部值指定复杂类型。我们可以在调用 ref 重写默认推理时简单地传递一个泛型参数：

```ts
const year = ref<string | number>('2020') // year's type: Ref<string | number>

year.value = 2020 // ok!
```

:::tip
如果泛型的类型未知，建议将 `ref` 转换为 `Ref<T>`。
:::

### 为模板引用定义类型

有时你可能需要为一个子组件标注一个模板引用，以调用其公共方法。例如我们有一个 `MyModal` 子组件，它有一个打开模态的方法：

```ts
import { defineComponent, ref } from 'vue'
const MyModal = defineComponent({
  setup() {
    const isContentShown = ref(false)
    const open = () => (isContentShown.value = true)
    return {
      isContentShown,
      open
    }
  }
})
```

我们希望从其父组件的一个模板引用调用这个方法：

```ts
import { defineComponent, ref } from 'vue'
const MyModal = defineComponent({
  setup() {
    const isContentShown = ref(false)
    const open = () => (isContentShown.value = true)
    return {
      isContentShown,
      open
    }
  }
})
const app = defineComponent({
  components: {
    MyModal
  },
  template: `
    <button @click="openModal">Open from parent</button>
    <my-modal ref="modal" />
  `,
  setup() {
    const modal = ref()
    const openModal = () => {
      modal.value.open()
    }
    return { modal, openModal }
  }
})
```

它可以工作，但是没有关于 `MyModal` 及其可用方法的类型信息。为了解决这个问题，你应该在创建引用时使用 `InstanceType`：

```ts
setup() {
  const modal = ref<InstanceType<typeof MyModal>>()
  const openModal = () => {
    modal.value?.open()
  }
  return { modal, openModal }
}
```

请注意你还需要使用[可选链操作符](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Optional_chaining)或其它方式来确认 `modal.value` 不是 undefined。

### 类型声明 `reactive`

当声明类型 `reactive` property，我们可以使用接口：

```ts
import { defineComponent, reactive } from 'vue'

interface Book {
  title: string
  year?: number
}

export default defineComponent({
  name: 'HelloWorld',
  setup() {
    const book = reactive<Book>({ title: 'Vue 3 Guide' })
    // or
    const book: Book = reactive({ title: 'Vue 3 Guide' })
    // or
    const book = reactive({ title: 'Vue 3 Guide' }) as Book
  }
})
```

### 类型声明 `computed`

计算值将根据返回值自动推断类型

```ts
import { defineComponent, ref, computed } from 'vue'

export default defineComponent({
  name: 'CounterButton',
  setup() {
    let count = ref(0)

    // 只读
    const doubleCount = computed(() => count.value * 2)

    const result = doubleCount.value.split('') // => Property 'split' does not exist on type 'number'
  }
})
```

### 为事件处理器添加类型

在处理原生 DOM 事件的时候，正确地为处理函数的参数添加类型或许会是有用的。让我们看这个例子：

```vue
<template>
  <input type="text" @change="handleChange" />
</template>
<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  setup() {
    // `evt` 将会是 `any` 类型
    const handleChange = evt => {
      console.log(evt.target.value) // 此处 TS 将抛出异常
    }
    return { handleChange }
  }
})
</script>
```

如你所见，在没有为 `evt` 参数正确地声明类型的情况下，当我们尝试获取 `<input>` 元素的值时，TypeScript 将抛出异常。解决方案是将事件的目标转换为正确的类型：

```ts
const handleChange = (evt: Event) => {
  console.log((evt.target as HTMLInputElement).value)
}
```
