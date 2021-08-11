---
sidebar: auto
---

# 风格指南

本文是官方的 Vue 特有代码风格指南。如果你在工程中使用了 Vue，本文可以帮助你回避错误和反模式，减少对细枝末节的过度纠结。不过，我们也不确信，对于所有的团队或工程来说，风格指南的所有内容都是理想的。因此，根据过去的经验、周边的技术栈或个人价值观来做出谨慎的偏差是可取的。

对于其中的绝大部分，我们也总体上避免就 JavaScript 或 HTML 本身提出建议。我们不介意你是否使用分号或尾逗号，也不介意你在 HTML attribute 中使用单引号还是双引号。不过，当我们发现某个特定模式在 Vue 语境中很有用时，也会存在例外。

最终，我们把规则归为了四个大类：

## 规则类别

### 优先级 A：必要的

这些规则会帮你规避错误，所以无论如何，学习并遵守它们吧。这里面可能存在例外，但应该非常少，且只有在你同时精通 JavaScript 和 Vue 时才可以这样做。

### 优先级 B：强烈推荐

这些规则能够在绝大多数工程中改善可读性和开发体验。即使你违反了它们，代码还是能照常运行，但此类例外应该尽可能地少，且合理。

### 优先级 C：推荐

当存在有多个不分伯仲的选项时，选择其中任意一项可以确保一致性。在这些规则里，我们描述每个可取的选项，并建议使用一个默认的。也就是说只要保持一致且理由充分，你可以随意在代码库中做出不同的选择。请务必给出一个好的理由！通过接受社区的标准，你将会：

1. 训练你的大脑，以便更容易的处理你在社区遇到的代码；
2. 不做修改就可以直接复制粘贴社区的代码示例；
3. 能够经常招聘到和你编码习惯相同的新人，至少在 Vue 领域。

### 优先级 D：谨慎使用

某些 Vue 特性的存在是为了照顾极端情况，或帮助老代码的平稳迁移。当被过度使用时，这些特性会让你的代码难以维护，甚至变成问题的来源。这些规则的存在是为了给有潜在风险的特性敲响警钟，说明它们在哪些时候应该被避免使用，以及为什么。

## 优先级 A 的规则：必要的 <span class="hide-from-sidebar">(规避错误)</span>

### 组件名为多个单词<sup data-p="a">必要</sup>

**组件名应该始终由多个单词组成，除了根组件 `App`，以及 `<transition>`、`<component>` 之类的 Vue 内置组件。**

这样做可以跟现有的，以及未来的 HTML 元素[避免冲突](https://html.spec.whatwg.org/multipage/custom-elements.html#valid-custom-element-name)，因为所有的 HTML 元素名称都是单个单词的。

<div class="style-example style-example-bad">
<h4>反面例子</h4>

```js
app.component('todo', {
  // ...
})
```

```js
export default {
  name: 'Todo',
  // ...
}
```
</div>

<div class="style-example style-example-good">
<h4>正面例子</h4>

```js
app.component('todo-item', {
  // ...
})
```

```js
export default {
  name: 'TodoItem',
  // ...
}
```
</div>

### Prop 定义<sup data-p="a">必要</sup>

**Prop 定义应该尽量详细**

在已提交的代码中，prop 的定义应该尽量详细，至少指定其类型。

::: details 详解
细致的 [prop 定义](/guide/component-props.html#prop-验证)有两个优势：

- 它们写明了组件的 API，所以组件的设计用法可以通俗易懂；
- 在开发环境下，如果为一个组件提供了格式不正确的 prop，Vue 将会告警，以帮助你捕获潜在的错误来源。
:::

<div class="style-example style-example-bad">
<h4>反面例子</h4>

```js
// 只有在原型开发时，这么做才能被接受
props: ['status']
```
</div>

<div class="style-example style-example-good">
<h4>正面例子</h4>

```js
props: {
  status: String
}
```

```js
// 更好的例子
props: {
  status: {
    type: String,
    required: true,

    validator: value => {
      return [
        'syncing',
        'synced',
        'version-conflict',
        'error'
      ].includes(value)
    }
  }
}
```
</div>

### 为 `v-for` 设置 key 值<sup data-p="a">必要</sup>

**始终以 `key` 配合 `v-for`。**

在组件上必须始终以 `key` 配合 `v-for`，以便维护内部组件及其子树的状态。即使是在元素上，比如动画中的[对象固化 (object constancy)](https://bost.ocks.org/mike/constancy/) ，维持可预测的行为也是一种好的实践。

::: details 详解
假设你有一个待办事项列表：

```js
data() {
  return {
    todos: [
      {
        id: 1,
        text: 'Learn to use v-for'
      },
      {
        id: 2,
        text: 'Learn to use key'
      }
    ]
  }
}
```

然后你把它们按照字母顺序排序。在更新 DOM 的时候，Vue 将会优化渲染，尽可能地将 DOM 操作的代价降到最低。言下之意，可能是删掉第一个待办事项元素，然后把它重新加回到列表的最末尾。

问题在于，可能会存在某种情况，不删除将要保留在 DOM 中的元素会成为重要的一环。比如说，你想要使用 `<transition-group>` 给列表排序增加动画，或想在被渲染元素是 `<input>` 时保持聚焦。在这些情况下，为每一个项目添加一个唯一的键值 (比如 `:key="todo.id"`) 将会让 Vue 知道如何使行为更容易预测。

根据我们的经验，最好*始终*添加一个唯一的键值，这样你和你的团队永远不必担心这些极端情况。在极少数对性能有严格要求的情况下，为了避免对象固化，你可以刻意做一些非常规的处理。
:::

<div class="style-example style-example-bad">
<h4>反面例子</h4>

```html
<ul>
  <li v-for="todo in todos">
    {{ todo.text }}
  </li>
</ul>
```
</div>

<div class="style-example style-example-good">
<h4>正面例子</h4>

```html
<ul>
  <li
    v-for="todo in todos"
    :key="todo.id"
  >
    {{ todo.text }}
  </li>
</ul>
```
</div>

### 避免 `v-if` 和 `v-for` 一起使用<sup data-p="a">必要</sup>

**永远不要在一个元素上同时使用 `v-if` 和 `v-for`。**

一般我们在两种常见的情况下会倾向于这样做：

- 为了对列表中的项目进行过滤 (比如 `v-for="user in users" v-if="user.isActive"`)。在这种情形下，请将 `users` 替换为一个计算属性 (比如 `activeUsers`)，返回过滤后的列表。

- 为了避免渲染本应该被隐藏的列表 (比如 `v-for="user in users" v-if="shouldShowUsers"`)。这种情形下，请将 `v-if` 移动至容器元素上 (比如 `ul`、`ol`)。

::: details 详解
当 Vue 处理指令时，`v-if` 比 `v-for` 具有更高的优先级，所以这个模板：

```html
<ul>
  <li
    v-for="user in users"
    v-if="user.isActive"
    :key="user.id"
  >
    {{ user.name }}
  </li>
</ul>
```

将抛出一个错误，因为 `v-if` 指令将首先被执行，而迭代的变量 `user` 此时不存在。

这可以通过遍历一个计算属性来解决，像这样：

```js
computed: {
  activeUsers() {
    return this.users.filter(user => user.isActive)
  }
}
```

```html
<ul>
  <li
    v-for="user in activeUsers"
    :key="user.id"
  >
    {{ user.name }}
  </li>
</ul>
```

另外，我们也可以使用 `<template>` 标签和 `v-for` 来包裹 `<li>` 元素。

```html
<ul>
  <template v-for="user in users" :key="user.id">
    <li v-if="user.isActive">
      {{ user.name }}
    </li>
  </template>
</ul>
```

:::

<div class="style-example style-example-bad">
<h4>反面例子</h4>

```html
<ul>
  <li
    v-for="user in users"
    v-if="user.isActive"
    :key="user.id"
  >
    {{ user.name }}
  </li>
</ul>
```

</div>

<div class="style-example style-example-good">
<h4>正面例子</h4>

```html
<ul>
  <li
    v-for="user in activeUsers"
    :key="user.id"
  >
    {{ user.name }}
  </li>
</ul>
```

```html
<ul>
  <template v-for="user in users" :key="user.id">
    <li v-if="user.isActive">
      {{ user.name }}
    </li>
  </template>
</ul>
```
</div>

### 为组件样式设置作用域<sup data-p="a">必要</sup>

**对于应用来说，样式在顶层 `App` 组件和布局组件中可以是全局的，但是在其它所有组件中都应该是有作用域的。**

这条规则只适用于[单文件组件](../guide/single-file-component.html)。你*不一定*要使用 [`scoped` attribute](https://vue-loader.vuejs.org/en/features/scoped-css.html)。作用域也可以通过 [CSS Modules](https://vue-loader.vuejs.org/en/features/css-modules.html) (一个基于 class 的，类似 [BEM](http://getbem.com/) 的策略) ，或者其它的库/约定来实现。

**不管怎样，对于组件库来说，我们应该更倾向于选用基于 class 的策略，而不是 `scoped` attribute。**

这会让覆写内部样式变得更容易：使用人类可理解的 class 名称，没有太高的选择器优先级，而且不太会导致冲突。

::: details 详解
如果你正在和其他开发者一起开发一个大型工程，或有时候要引入三方 HTML/CSS (比如来自 Auth0)，设置一致的作用域能确保你的样式只会运用在它们想要作用的组件上。

除了 `scoped` attribute 以外，使用唯一的 class 名可以帮你确保那些第三方库的 CSS 不会运用在你自己的 HTML 上。比如说，许多工程都使用了 `button`、`btn` 或 `icon` class 名，所以即便你不使用类似 BEM 的策略，添加一个 app 或组件专属的前缀 (比如 `ButtonClose-icon`) 也可以提供一些保护。
:::

<div class="style-example style-example-bad">
<h4>反面例子</h4>

```html
<template>
  <button class="btn btn-close">×</button>
</template>

<style>
.btn-close {
  background-color: red;
}
</style>
```
</div>

<div class="style-example style-example-good">
<h4>正面例子</h4>

```html
<template>
  <button class="button button-close">×</button>
</template>

<!-- 使用 `scoped` attribute -->
<style scoped>
.button {
  border: none;
  border-radius: 2px;
}

.button-close {
  background-color: red;
}
</style>
```

```html
<template>
  <button :class="[$style.button, $style.buttonClose]">×</button>
</template>

<!-- 使用 CSS modules -->
<style module>
.button {
  border: none;
  border-radius: 2px;
}

.buttonClose {
  background-color: red;
}
</style>
```

```html
<template>
  <button class="c-Button c-Button--close">×</button>
</template>

<!-- 使用 BEM 约定 -->
<style>
.c-Button {
  border: none;
  border-radius: 2px;
}

.c-Button--close {
  background-color: red;
}
</style>
```
</div>

### 私有 property 名称<sup data-p="a">必要</sup>

**使用模块作用域来确保外部无法访问到私有函数。如果无法做到这一点，就始终应该为插件、mixin 等不考虑对外公开 API 的自定义私有 property 使用 `$_` 前缀。并附带一个命名空间，以回避和其它作者的冲突 (比如 `$_yourPluginName_`)。**

::: details 详解
Vue 使用 `_` 前缀来定义其自身的私有 property，所以使用相同的前缀 (比如 `_update`) 有覆写实例 property 的风险。即便你检查确认了 Vue 当前版本没有用到这个 property 名，也不能保证和将来的版本没有冲突。

对于 `$` 前缀来说，其在 Vue 生态系统中的目的是暴露给用户的一个特殊的实例 property，所以把它用于*私有* property 并不合适。

不过，我们推荐把这两个前缀结合为 `$_`，作为一个用户定义的私有 property 的约定，以确保不会和 Vue 自身相冲突。
:::

<div class="style-example style-example-bad">
<h4>反面例子</h4>

```js
const myGreatMixin = {
  // ...
  methods: {
    update() {
      // ...
    }
  }
}
```

```js
const myGreatMixin = {
  // ...
  methods: {
    _update() {
      // ...
    }
  }
}
```

```js
const myGreatMixin = {
  // ...
  methods: {
    $update() {
      // ...
    }
  }
}
```

```js
const myGreatMixin = {
  // ...
  methods: {
    $_update() {
      // ...
    }
  }
}
```

</div>

<div class="style-example style-example-good">
<h4>正面例子</h4>

```js
const myGreatMixin = {
  // ...
  methods: {
    $_myGreatMixin_update() {
      // ...
    }
  }
}
```

```js
// Even better!
const myGreatMixin = {
  // ...
  methods: {
    publicMethod() {
      // ...
      myPrivateFunction()
    }
  }
}

function myPrivateFunction() {
  // ...
}

export default myGreatMixin
```
</div>

## 优先级 B 的规则：强烈推荐 <span class="hide-from-sidebar">(增强代码可读性)</span>

### 组件文件<sup data-p="b">强烈推荐</sup>

**只要有能够拼接文件的构建系统，就把每个组件单独分成文件。**

当你需要编辑一个组件，或查阅一个组件的用法时，这种做法可以帮助你更快速地找到它。

<div class="style-example style-example-bad">
<h4>反面例子</h4>

```js
app.component('TodoList', {
  // ...
})

app.component('TodoItem', {
  // ...
})
```
</div>

<div class="style-example style-example-good">
<h4>正面例子</h4>

```
components/
|- TodoList.js
|- TodoItem.js
```

```
components/
|- TodoList.vue
|- TodoItem.vue
```
</div>

### 单文件组件文件的大小写<sup data-p="b">强烈推荐</sup>

**[单文件组件](../guide/single-file-component.html)的文件名应该要么始终是单词大写开头 (PascalCase)，要么始终是横线连接 (kebab-case)。**

单词大写开头对于代码编辑器的自动补全最为友好，因为这使得我们在 JS(X) 和模板中引用组件的方式尽可能地一致。然而，混用大小写的文件命名方式，有时候会导致其在大小写不敏感的文件系统中出现问题，这也是横线连接命名同样完全可取的原因。

<div class="style-example style-example-bad">
<h4>反面例子</h4>

```
components/
|- mycomponent.vue
```

```
components/
|- myComponent.vue
```
</div>

<div class="style-example style-example-good">
<h4>正面例子</h4>

```
components/
|- MyComponent.vue
```

```
components/
|- my-component.vue
```
</div>

### 基础组件名称<sup data-p="b">强烈推荐</sup>

**应用特定样式和约定的基础组件 (也就是展示类的、无逻辑的或无状态的组件) 应该全部以一个特定的前缀开头，比如 `Base`、`App` 或 `V`。**

::: details 详解
这些组件为你的应用奠定了一致的基础样式和行为。它们可能**只**包括：

- HTML 元素
- 其它基础组件
- 第三方 UI 组件

但是它们**绝不会**包括全局状态 (比如来自 Vuex store)。

它们的名字通常包含所包裹元素的名字 (比如 `BaseButton`、`BaseTable`)，除非没有现成的对应功能的元素 (比如 `BaseIcon`)。如果你为特定的上下文构建类似的组件，那它们几乎总会消费这些组件 (比如 `BaseButton` 可能会用在 `ButtonSubmit` 上)。

这样做的几个好处：

- 当你在编辑器中以字母顺序排序时，你的应用的基础组件会全部列在一起，这样更容易识别。

- 因为组件名应该始终是多个单词，所以这样做可以避免你在包裹简单组件时随意选择前缀 (比如 `MyButton`、`VueButton`)。

- 因为这些组件会被频繁使用，所以你可能想要把它们注册到全局，而不是在各处分别导入它们。结合一个前缀即可使用 Webpack 达到目的：

  ```js
  const requireComponent = require.context("./src", true, /Base[A-Z]\w+\.(vue|js)$/)
  requireComponent.keys().forEach(function (fileName) {
    let baseComponentConfig = requireComponent(fileName)
    baseComponentConfig = baseComponentConfig.default || baseComponentConfig
    const baseComponentName = baseComponentConfig.name || (
      fileName
        .replace(/^.+\//, '')
        .replace(/\.\w+$/, '')
    )
    app.component(baseComponentName, baseComponentConfig)
  })
  ```
:::

<div class="style-example style-example-bad">
<h4>反面例子</h4>

```
components/
|- MyButton.vue
|- VueTable.vue
|- Icon.vue
```
</div>

<div class="style-example style-example-good">
<h4>正面例子</h4>

```
components/
|- BaseButton.vue
|- BaseTable.vue
|- BaseIcon.vue
```

```
components/
|- AppButton.vue
|- AppTable.vue
|- AppIcon.vue
```

```
components/
|- VButton.vue
|- VTable.vue
|- VIcon.vue
```
</div>

### 单例组件名称<sup data-p="b">强烈推荐</sup>

**只应该拥有单个活跃实例的组件应该以 `The` 前缀命名，以示其唯一性。**

这并不意味着组件只可被用于一个页面，而是*每个页面*只能使用一次。这些组件永远不接受任何 prop，因为它们是为你的应用所定制的，而不是它们所在的上下文。如果你发现有必要添加 prop，那就表明这实际上是一个可复用的组件，只不过*目前*在每个页面里只使用一次。

<div class="style-example style-example-bad">
<h4>反面例子</h4>

```
components/
|- Heading.vue
|- MySidebar.vue
```
</div>

<div class="style-example style-example-good">
<h4>正面例子</h4>

```
components/
|- TheHeading.vue
|- TheSidebar.vue
```
</div>

### 紧密耦合的组件名称<sup data-p="b">强烈推荐</sup>

**与父组件紧密耦合的子组件应该以父组件名作为前缀命名。**

如果一个组件只在某个特定父组件的上下文中有意义，那么这层关系应该体现在其命名上。因为编辑器通常会按字母顺序组织文件，这么做也可以把相关联的文件排放在一起。

::: details 详解
你也许会尝试通过在其父组件命名的目录中嵌套子组件以解决这个问题。比如：

```
components/
|- TodoList/
   |- Item/
      |- index.vue
      |- Button.vue
   |- index.vue
```

或:

```
components/
|- TodoList/
   |- Item/
      |- Button.vue
   |- Item.vue
|- TodoList.vue
```

但是这种方式并不推荐，因为这会导致：

- 许多文件的名字相同，使得在编辑器中快速切换文件变得困难。
- 过多嵌套的子目录增加了在编辑器侧边栏中浏览组件所花费的时间。

:::

<div class="style-example style-example-bad">
<h4>反面例子</h4>

```
components/
|- TodoList.vue
|- TodoItem.vue
|- TodoButton.vue
```

```
components/
|- SearchSidebar.vue
|- NavigationForSearchSidebar.vue
```
</div>

<div class="style-example style-example-good">
<h4>正面例子</h4>

```
components/
|- TodoList.vue
|- TodoListItem.vue
|- TodoListItemButton.vue
```

```
components/
|- SearchSidebar.vue
|- SearchSidebarNavigation.vue
```
</div>

### 组件名称中的单词顺序<sup data-p="b">强烈推荐</sup>

**组件名称应该以高阶的 (通常是一般化描述的) 单词开头，并以描述性的修饰词结尾。**

::: details 详解
你可能会疑惑：

> “为什么我们在给组件命名时不多遵从自然语言呢？”

在自然的英文里，形容词和其它描述语通常都出现在名词之前，否则就需要用到连接词。比如：

- Coffee _with_ milk
- Soup _of the_ day
- Visitor _to the_ museum

如果你愿意，你完全可以在组件名里包含这些连接词，但是单词的顺序仍然很重要。

同样要注意**在你的应用中所谓的“高阶”是跟语境有关的**。比如对于一个带搜索表单的应用来说，它可能包含这样的组件：

```
components/
|- ClearSearchButton.vue
|- ExcludeFromSearchInput.vue
|- LaunchOnStartupCheckbox.vue
|- RunSearchButton.vue
|- SearchInput.vue
|- TermsCheckbox.vue
```

你可能已经注意到了，我们很难看出来哪些组件是针对搜索的。现在我们来根据规则给组件重新命名：

```
components/
|- SearchButtonClear.vue
|- SearchButtonRun.vue
|- SearchInputExcludeGlob.vue
|- SearchInputQuery.vue
|- SettingsCheckboxLaunchOnStartup.vue
|- SettingsCheckboxTerms.vue
```

因为编辑器通常会按字母顺序组织文件，所以现在组件之间的重要关系一目了然。

你也许会想要换种方式解决这个问题，把所有的搜索组件放到“search”目录，把所有的设置组件放到“settings”目录。我们只推荐在非常大型的应用 (如有 100+ 个组件) 下才考虑这么做，因为：

- 在多级目录间找来找去，通常来说要比在单个 `components` 目录下滚动查找要花费更多的精力。
- 存在组件重名 (比如存在多个 `ButtonDelete.vue` 组件) 的时候在编辑器里更难快速定位。
- 重构将变得更困难，因为为一个移动了的组件更新相关引用时，查找/替换通常并不高效。

:::

<div class="style-example style-example-bad">
<h4>反面例子</h4>

```
components/
|- ClearSearchButton.vue
|- ExcludeFromSearchInput.vue
|- LaunchOnStartupCheckbox.vue
|- RunSearchButton.vue
|- SearchInput.vue
|- TermsCheckbox.vue
```
</div>

<div class="style-example style-example-good">
<h4>正面例子</h4>

```
components/
|- SearchButtonClear.vue
|- SearchButtonRun.vue
|- SearchInputQuery.vue
|- SearchInputExcludeGlob.vue
|- SettingsCheckboxTerms.vue
|- SettingsCheckboxLaunchOnStartup.vue
```
</div>

### 自闭合组件<sup data-p="b">强烈推荐</sup>

**在[单文件组件](../guide/single-file-component.html)、字符串模板和 [JSX](../guide/render-function.html#jsx) 中，有内容的组件应该是自闭合的——但在 DOM 模板里永远不要这样做。**

自闭合组件表示它们不仅没有内容，而且是**刻意**没有内容。其不同之处就好比书中的一页白纸，与贴有“本页有意留白”标签的白纸。而且没有了额外的闭合标签，你的代码也将更简洁。

不幸的是，HTML 并不支持自闭合的自定义元素——[官方的“空”元素](https://www.w3.org/TR/html/syntax.html#void-elements)除外。所以上述策略仅适用于在进入 DOM 之前，Vue 的模板编译器能够触达的地方，然后再产出符合 DOM 规范的 HTML。

<div class="style-example style-example-bad">
<h4>反面例子</h4>

```html
<!-- 在单文件组件、字符串模板和 JSX 中 -->
<MyComponent></MyComponent>
```

```html
<!-- 在 DOM 模板中                   -->
<my-component/>
```
</div>

<div class="style-example style-example-good">
<h4>正面例子</h4>

```html
<!-- 在单文件组件、字符串模板和 JSX 中 -->
<MyComponent/>
```

```html
<!-- 在 DOM 模板中                   -->
<my-component></my-component>
```
</div>

### 模板中的组件名称大小写<sup data-p="b">强烈推荐</sup>

**对于绝大多数项目来说，在[单文件组件](../guide/single-file-component.html)和字符串模板中，组件名称应该始终是 PascalCase 的——但是在 DOM 模板中是 kebab-case 的。**

PascalCase 相比 kebab-case 有一些优势：

- 编辑器可以在模板里自动补全组件名称，因为 PascalCase 同样适用于 JavaScript。
- `<MyComponent>` 视觉上比 `<my-component>` 更能够和单个单词的 HTML 元素区别开来，因为前者的不同之处有两个大写字母，后者只有一个横线。
- 如果你在模板中使用任何非 Vue 的自定义元素，比如一个 Web Component，PascalCase 确保了你的 Vue 组件在视觉上仍然是易识别的。

不幸的是，由于 HTML 是大小写不敏感的，在 DOM 模板中必须仍使用 kebab-case。

还请注意，如果你已经是 kebab-case 的重度用户，那么与 HTML 保持一致的命名约定，且在多个项目中保持相同的大小写规则，就可能比上述优势更为重要了。在这些情况下，**在所有的地方都使用 kebab-case 同样是可以接受的**。

<div class="style-example style-example-bad">
<h4>反面例子</h4>

```html
<!-- 在单文件组件和字符串模板中 -->
<mycomponent/>
```

```html
<!-- 在单文件组件和字符串模板中 -->
<myComponent/>
```

```html
<!-- 在 DOM 模板中            -->
<MyComponent></MyComponent>
```
</div>

<div class="style-example style-example-good">
<h4>正面例子</h4>

```html
<!-- 在单文件组件和字符串模板中 -->
<MyComponent/>
```

```html
<!-- 在 DOM 模板中            -->
<my-component></my-component>
```

或者

```html
<!-- 在所有地方 -->
<my-component></my-component>
```
</div>

### JS/JSX 中使用的组件名称<sup data-p="b">强烈推荐</sup>

**JS/[JSX](../guide/render-function.html#jsx) 中的组件名应该始终是 PascalCase 的，尽管在较为简单的应用中，只使用 `app.component` 进行全局组件注册时，可以使用 kebab-case 字符串。**

::: details 详解

在 JavaScript 中，PascalCase 是类和构造函数 (本质上来说，任何可以产生多份不同实例的东西) 的命名约定。Vue 组件也有实例，因此同样适用 PascalCase。由此带来的额外好处是，在 JSX (和模板) 里使用 PascalCase 使得代码的读者更容易分辨组件与 HTML 元素。

然而，对于**只**通过 `app.component` 定义全局组件的应用来说，我们推荐 kebab-case 作为替代。原因是：

- 全局组件很少被 JavaScript 引用，所以遵守 JavaScript 的命名约定意义不大。
- 这些应用往往包含许多 DOM 内的模板，这种情况下是[**必须**使用 kebab-case](#模板中的组件名称大小写强烈推荐) 的。

:::

<div class="style-example style-example-bad">
<h4>反面例子</h4>

```js
app.component('myComponent', {
  // ...
})
```

```js
import myComponent from './MyComponent.vue'
```

```js
export default {
  name: 'myComponent',
  // ...
}
```

```js
export default {
  name: 'my-component',
  // ...
}
```
</div>

<div class="style-example style-example-good">
<h4>正面例子</h4>

```js
app.component('MyComponent', {
  // ...
})
```

```js
app.component('my-component', {
  // ...
})
```

```js
import MyComponent from './MyComponent.vue'
```

```js
export default {
  name: 'MyComponent',
  // ...
}
```
</div>

### 完整单词的组件名称<sup data-p="b">强烈推荐</sup>

**组件名称应该倾向于完整的单词，而不是缩写。**

编辑器中的自动补全已经让书写长命名的代价非常之低了，而其带来的明确性却是非常宝贵的。不常用的缩写尤其应该避免。

<div class="style-example style-example-bad">
<h4>反面例子</h4>

```
components/
|- SdSettings.vue
|- UProfOpts.vue
```
</div>

<div class="style-example style-example-good">
<h4>正面例子</h4>

```
components/
|- StudentDashboardSettings.vue
|- UserProfileOptions.vue
```
</div>

### Prop 命名<sup data-p="b">强烈推荐</sup>

**在声明 prop 的时候，其命名应该始终使用 camelCase，而在模板和 [JSX](../guide/render-function.html#jsx) 中应该始终使用 kebab-case。**

我们只是单纯地遵循了每种语言的约定。在 JavaScript 中 camelCase 更为自然 。而在 HTML 中则是 kebab-case。

<div class="style-example style-example-bad">
<h4>反面例子</h4>

```js
props: {
  'greeting-text': String
}
```

```html
<WelcomeMessage greetingText="hi"/>
```
</div>

<div class="style-example style-example-good">
<h4>正面例子</h4>

```js
props: {
  greetingText: String
}
```

```html
<WelcomeMessage greeting-text="hi"/>
```
</div>

### 多个 attribute 的元素<sup data-p="b">强烈推荐</sup>

**多个 attribute 的元素应该分多行撰写，每个 attribute 一行。**

在 JavaScript 中，用多行分隔对象的多个 property 是很常见的最佳实践，因为这样更易读。模板和 [JSX](../guide/render-function.html#jsx) 同样值得考虑。

<div class="style-example style-example-bad">
<h4>反面例子</h4>

```html
<img src="https://vuejs.org/images/logo.png" alt="Vue Logo">
```

```html
<MyComponent foo="a" bar="b" baz="c"/>
```
</div>

<div class="style-example style-example-good">
<h4>正面例子</h4>

```html
<img
  src="https://vuejs.org/images/logo.png"
  alt="Vue Logo"
>
```

```html
<MyComponent
  foo="a"
  bar="b"
  baz="c"
/>
```
</div>

### 模板中的简单表达式<sup data-p="b">强烈推荐</sup>

**组件模板应该只包含简单的表达式，复杂的表达式则应该重构为计算属性或方法。**

复杂表达式会让你的模板变得不那么声明式。我们应该尽量描述应该显示*什么*，而非*如何*计算那个值。而且计算属性和方法使得代码可以复用。

<div class="style-example style-example-bad">
<h4>反面例子</h4>

```html
{{
  fullName.split(' ').map((word) => {
    return word[0].toUpperCase() + word.slice(1)
  }).join(' ')
}}
```
</div>

<div class="style-example style-example-good">
<h4>正面例子</h4>

```html
<!-- 在模板中 -->
{{ normalizedFullName }}
```

```js
// 复杂表达式已经转为了一个计算属性
computed: {
  normalizedFullName() {
    return this.fullName.split(' ')
      .map(word => word[0].toUpperCase() + word.slice(1))
      .join(' ')
  }
}
```
</div>

### 简单的计算属性<sup data-p="b">强烈推荐</sup>

**应该把复杂计算属性尽可能多地分割为更简单的计算属性。**

::: details 详解
更简单的、命名得当的计算属性：

- __更易于测试__

  当每个计算属性都仅包含一个非常简单，且依赖很少的表达式时，撰写测试以确保其能够正确地工作就会变得容易许多。

- __更易于阅读__

  简化计算属性要求你为每一个值都起一个描述性的名称，即便它并没有被复用。这使得其他开发者 (以及未来的你) 更容易专注在他们所关心的代码上，并了解现状。

- __更好地“拥抱变化”__

  任何能够被命名的值，都有可能被用在视图上。举个例子，我们可能打算展示一个信息，告诉用户他们节省了多少钱。也可能打算计算税费，但是也许会分开展现，而不是作为总价的一部分。

  小的，且更专注的计算属性减少了对信息将如何被使用的猜测，因此当需求变更时，重构的工作量也将更小。
:::

<div class="style-example style-example-bad">
<h4>反面例子</h4>

```js
computed: {
  price() {
    const basePrice = this.manufactureCost / (1 - this.profitMargin)
    return (
      basePrice -
      basePrice * (this.discountPercent || 0)
    )
  }
}
```
</div>

<div class="style-example style-example-good">
<h4>正面例子</h4>

```js
computed: {
  basePrice() {
    return this.manufactureCost / (1 - this.profitMargin)
  },

  discount() {
    return this.basePrice * (this.discountPercent || 0)
  },

  finalPrice() {
    return this.basePrice - this.discount
  }
}
```
</div>

### 带引号的 attribute 值<sup data-p="b">强烈推荐</sup>

**非空 HTML attribute 的值应该始终带有引号 (单引号或双引号，选择你在 JS 里面未使用的那个)。**

在 HTML 中不带空格的 attribute 的值是可以没有引号的，这种实践通常导致*避免*空格，从而使得 attribute 的可读性变差。

<div class="style-example style-example-bad">
<h4>反面例子</h4>

```html
<input type=text>
```

```html
<AppSidebar :style={width:sidebarWidth+'px'}>
```
</div>

<div class="style-example style-example-good">
<h4>正面例子</h4>

```html
<input type="text">
```

```html
<AppSidebar :style="{ width: sidebarWidth + 'px' }">
```
</div>

### 指令缩写<sup data-p="b">强烈推荐</sup>

**指令缩写 (用 `:` 表示 `v-bind:`，`@` 表示 `v-on:` 和用 `#` 表示 `v-slot`) 应该要么始终使用，要么始终不使用。**

<div class="style-example style-example-bad">
<h4>反面例子</h4>

```html
<input
  v-bind:value="newTodoText"
  :placeholder="newTodoInstructions"
>
```

```html
<input
  v-on:input="onInput"
  @focus="onFocus"
>
```

```html
<template v-slot:header>
  <h1>Here might be a page title</h1>
</template>

<template #footer>
  <p>Here's some contact info</p>
</template>
```
</div>

<div class="style-example style-example-good">
<h4>正面例子</h4>

```html
<input
  :value="newTodoText"
  :placeholder="newTodoInstructions"
>
```

```html
<input
  v-bind:value="newTodoText"
  v-bind:placeholder="newTodoInstructions"
>
```

```html
<input
  @input="onInput"
  @focus="onFocus"
>
```

```html
<input
  v-on:input="onInput"
  v-on:focus="onFocus"
>
```

```html
<template v-slot:header>
  <h1>Here might be a page title</h1>
</template>

<template v-slot:footer>
  <p>Here's some contact info</p>
</template>
```

```html
<template #header>
  <h1>Here might be a page title</h1>
</template>

<template #footer>
  <p>Here's some contact info</p>
</template>
```
</div>

## 优先级 C 的规则：推荐 <span class="hide-from-sidebar">(将选择和认知成本最小化)</span>

### 组件/实例选项的顺序<sup data-p="c">推荐</sup>

**组件/实例的选项应该有统一的顺序。**

这是我们为组件选项推荐的默认顺序。它们被划分为几大类，你能够由此知道新的 property 应该被放到哪里。

1. **全局感知** (要求在组件以外被感知)
    - `name`

2. **模板编译选项** (改变模板编译的方式)
    - `compilerOptions`

3. **模板依赖** (模板内使用的资源)
    - `components`
    - `directives`

4. **组合** (合并 property 至选项内)
    - `extends`
    - `mixins`
    - `provide`/`inject`

5. **接口** (组件的接口)
    - `inheritAttrs`
    - `props`
    - `emits`

6. **组合式 API** (使用组合式 API 的入口点)
    - `setup`

7. **本地状态** (本地的响应式 property)
    - `data`
    - `computed`

8. **事件** (通过响应式事件触发的回调)
    - `watch`
    - 生命周期事件 (按照它们被调用的顺序)
        - `beforeCreate`
        - `created`
        - `beforeMount`
        - `mounted`
        - `beforeUpdate`
        - `updated`
        - `activated`
        - `deactivated`
        - `beforeUnmount`
        - `unmounted`
        - `errorCaptured`
        - `renderTracked`
        - `renderTriggered`

9.  **非响应式的 property** (不依赖响应性系统的实例 property)
    - `methods`

10. **渲染** (组件输出的声明式描述)
    - `template`/`render`

### 元素 attribute 的顺序<sup data-p="c">推荐</sup>

**元素 (包括组件) 的 attribute 应该有统一的顺序。**

这是我们为组件选项推荐的默认顺序。它们被划分为几大类，你能够由此知道新添加的自定义 attribute 和指令应该被放到哪里。

1. **定义** (提供组件的选项)
    - `is`

2. **列表渲染** (创建相同元素的多个变化)
    - `v-for`

3. **条件** (元素是否渲染/显示)
    - `v-if`
    - `v-else-if`
    - `v-else`
    - `v-show`
    - `v-cloak`

4. **渲染修饰符** (改变元素的渲染方式)
    - `v-pre`
    - `v-once`

5. **全局感知** (要求在组件以外被感知)
    - `id`

6. **唯一的 Attribute** (需要唯一值的 attribute)
    - `ref`
    - `key`

7. **双向绑定** (结合了绑定与事件)
    - `v-model`

8. **其他 Attribute** (所有普通的，绑定或未绑定的 attribute)

9. **事件** (组件事件监听器)
    - `v-on`

10. **内容** (覆写元素的内容)
    - `v-html`
    - `v-text`

### 组件/实例选项中的空行<sup data-p="c">推荐</sup>

**你可能想在多个 property 之间增加一个空行，特别是在这些选项多到一屏放不下，需要滚动才能看完的时候。**

当你开始觉得组件密集或难以阅读时，在多个 property 之间添加空行可以使其重新变得易于阅读。在一些诸如 Vim 的编辑器里，被这样格式化后的选项还能通过键盘快速导航。

<div class="style-example style-example-good">
<h4>正面例子</h4>

```js
props: {
  value: {
    type: String,
    required: true
  },

  focused: {
    type: Boolean,
    default: false
  },

  label: String,
  icon: String
},

computed: {
  formattedValue() {
    // ...
  },

  inputClasses() {
    // ...
  }
}
```

```js
// 在组件仍然能够被轻松阅读与定位时，
// 没有空行也挺好
props: {
  value: {
    type: String,
      required: true
  },
  focused: {
    type: Boolean,
  default: false
  },
  label: String,
    icon: String
},
computed: {
  formattedValue() {
    // ...
  },
  inputClasses() {
    // ...
  }
}
```
</div>

### 单文件组件的顶级元素的顺序<sup data-p="c">推荐</sup>

**[单文件组件](../guide/single-file-component.html)应始终保持 `<script>`、`<template>` 和 `<style>` 标签的顺序一致。且 `<style>` 要放在最后，因为另外两个标签至少会有一个。**

<div class="style-example style-example-bad">
<h4>反面例子</h4>

```html
<style>/* ... */</style>
<script>/* ... */</script>
<template>...</template>
```

```html
<!-- ComponentA.vue -->
<script>/* ... */</script>
<template>...</template>
<style>/* ... */</style>

<!-- ComponentB.vue -->
<template>...</template>
<script>/* ... */</script>
<style>/* ... */</style>
```
</div>

<div class="style-example style-example-good">
<h4>正面例子</h4>

```html
<!-- ComponentA.vue -->
<script>/* ... */</script>
<template>...</template>
<style>/* ... */</style>

<!-- ComponentB.vue -->
<script>/* ... */</script>
<template>...</template>
<style>/* ... */</style>
```

```html
<!-- ComponentA.vue -->
<template>...</template>
<script>/* ... */</script>
<style>/* ... */</style>

<!-- ComponentB.vue -->
<template>...</template>
<script>/* ... */</script>
<style>/* ... */</style>
```
</div>

## 优先级 D 的规则：谨慎使用 <span class="hide-from-sidebar">(潜在风险)</span>

### `scoped` 中的元素选择器<sup data-p="d">谨慎使用</sup>

**元素选择器应该避免在 `scoped` 中出现。**

在 `scoped` 样式中，类选择器要比元素选择器更好，因为大量地使用元素选择器是很慢的。

::: details 详解

为了给样式设置作用域，Vue 会为元素添加一个独一无二的 attribute，例如 `data-v-f3f3eg9`。然后选择器将被修改，使得在匹配到的元素中，只有带这个 attribute 的才会真正生效 (比如 `button[data-v-f3f3eg9]`)。

问题在于，大量的[元素与 attribute 组合的选择器](http://stevesouders.com/efws/css-selectors/csscreate.php?n=1000&sel=a%5Bhref%5D&body=background%3A+%23CFD&ne=1000) (比如 `button[data-v-f3f3eg9]`) 会比[类与 attribute 组合的选择器](http://stevesouders.com/efws/css-selectors/csscreate.php?n=1000&sel=.class%5Bhref%5D&body=background%3A+%23CFD&ne=1000)更慢，因此应该尽可能地选用类选择器。

:::

<div class="style-example style-example-bad">
<h4>反面例子</h4>

```html
<template>
  <button>×</button>
</template>

<style scoped>
button {
  background-color: red;
}
</style>
```
</div>

<div class="style-example style-example-good">
<h4>正面例子</h4>

```html
<template>
  <button class="btn btn-close">×</button>
</template>

<style scoped>
.btn-close {
  background-color: red;
}
</style>
```
</div>

### 隐性的父子组件通信<sup data-p="d">谨慎使用</sup>

**应该优先通过 prop 和事件进行父子组件之间的通信，而不是通过 `this.$parent` 或对 prop 做出变更。**

一个理想的 Vue 应用是 prop 向下传递，事件向上传递的。遵循这一约定会让你的组件更易于理解。然而，在一些边界情况下，对 prop 的变更或 `this.$parent` 能够简化两个深度耦合的组件。

问题在于，这种做法在很多*简单*的场景下也可能会更方便。但请当心：不要为了一时方便 (少写代码) 而牺牲简明性 (易于理解的状态流)。

<div class="style-example style-example-bad">
<h4>反面例子</h4>

```js
app.component('TodoItem', {
  props: {
    todo: {
      type: Object,
      required: true
    }
  },

  template: '<input v-model="todo.text">'
})
```

```js
app.component('TodoItem', {
  props: {
    todo: {
      type: Object,
      required: true
    }
  },

  methods: {
    removeTodo() {
      this.$parent.todos = this.$parent.todos.filter(todo => todo.id !== vm.todo.id)
    }
  },

  template: `
    <span>
      {{ todo.text }}
      <button @click="removeTodo">
        ×
      </button>
    </span>
  `
})
```
</div>

<div class="style-example style-example-good">
<h4>正面例子</h4>

```js
app.component('TodoItem', {
  props: {
    todo: {
      type: Object,
      required: true
    }
  },

  emits: ['input'],

  template: `
    <input
      :value="todo.text"
      @input="$emit('input', $event.target.value)"
    >
  `
})
```

```js
app.component('TodoItem', {
  props: {
    todo: {
      type: Object,
      required: true
    }
  },

  emits: ['delete'],

  template: `
    <span>
      {{ todo.text }}
      <button @click="$emit('delete')">
        ×
      </button>
    </span>
  `
})
```
</div>

### 非 Flux 的全局状态管理<sup data-p="d">谨慎使用</sup>

**应该优先通过 [Vuex](https://next.vuex.vuejs.org/) 管理全局状态，而不是通过 `this.$root` 或一个全局事件总线。**

通过 `this.$root` 和/或全局事件总线管理状态在很多简单的场景下都是很方便的，但是并不适用于绝大多数的应用。

Vuex 是 Vue 的[官方类 flux 实现](/guide/state-management.html#类-flux-状态管理的官方实现)，其提供的不仅是一个管理状态的中心，还包括组织、追踪和调试状态变更的工具。它很好地集成在了 Vue 生态系统之中 (包括完整的 [Vue DevTools](/guide/installation.html#vue-devtools) 支持)。

<div class="style-example style-example-bad">
<h4>反面例子</h4>

```js
// main.js
import { createApp } from 'vue'
import mitt from 'mitt'
const app = createApp({
  data() {
    return {
      todos: [],
      emitter: mitt()
    }
  },

  created() {
    this.emitter.on('remove-todo', this.removeTodo)
  },

  methods: {
    removeTodo(todo) {
      const todoIdToRemove = todo.id
      this.todos = this.todos.filter(todo => todo.id !== todoIdToRemove)
    }
  }
})
```
</div>

<div class="style-example style-example-good">
<h4>正面例子</h4>

```js
// store/modules/todos.js
export default {
  state: {
    list: []
  },

  mutations: {
    REMOVE_TODO (state, todoId) {
      state.list = state.list.filter(todo => todo.id !== todoId)
    }
  },

  actions: {
    removeTodo ({ commit, state }, todo) {
      commit('REMOVE_TODO', todo.id)
    }
  }
}
```

```html
<!-- TodoItem.vue -->
<template>
  <span>
    {{ todo.text }}
    <button @click="removeTodo(todo)">
      X
    </button>
  </span>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  props: {
    todo: {
      type: Object,
      required: true
    }
  },

  methods: mapActions(['removeTodo'])
}
</script>
```
</div>

<style lang="scss" scoped>
$color-bgr-good: #d7efd7;
$color-bgr-bad: #f7e8e8;
$color-priority-a: #6b2a2a;
$color-priority-b: #8c480a;
$color-priority-c: #2b5a99;
$color-priority-d: #3f536d;

.style-example {
  border-radius: 7px;
  margin: 1.6em 0;
  padding: 1.6em 1.6em 1em;
  position: relative;
  border: 1px solid transparent;
  border-top-width: 5px;

  h4 {
    margin-top: 0;

    &::before {
      font-family: 'FontAwesome';
      margin-right: .4em;
    }
  }

  &-bad {
    background: $color-bgr-bad;
    border-color: darken($color-bgr-bad, 20%);
    
    h4 {
      color: darken($color-bgr-bad, 50%);
    }

    h4::before {
      content: '\f057';
    }
  }

  &-good {
    background: $color-bgr-good;
    border-color: darken($color-bgr-good, 20%);
    
    h4 {
      color: darken($color-bgr-good, 50%);
    }

    h4::before {
      content: '\f058';
    }
  }
}

.details summary {
  font-weight: bold !important;
}

h3 {
  a.header-anchor {
    // as we have too many h3 elements on this page, set the anchor to be always visible
    // to make them stand out more from paragraph texts.
    opacity: 1; 
  }

  sup {
    text-transform: uppercase;
    font-size: 0.5em;
    padding: 2px 4px;
    border-radius: 3px;
    margin-left: 0.5em;

    &[data-p=a] {
      color: $color-priority-a;
      border: 1px solid $color-priority-a;
    }

    &[data-p=b] {
      color: $color-priority-b;
      border: 1px solid $color-priority-b;
    }

    &[data-p=c] {
      color: $color-priority-c;
      border: 1px solid $color-priority-c;
    }

    &[data-p=d] {
      color: $color-priority-d;
      border: 1px solid $color-priority-d;
    }
  }
}
</style>
