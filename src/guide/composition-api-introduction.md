# 介绍

## 什么是 Composition API？

:::tip 提示
在阅读文档之前，你应该已经熟悉了这两个 [Vue 基础] ((introduction.md) 和[创建组件](component-basics.md)。
:::

通过创建 Vue 组件，我们可以将接口的可重复部分及其功能提取到可重用的代码段中。仅此一项就可以使我们的应用程序在可维护性和灵活性方面走得更远。然而，我们的经验已经证明，光靠这一点可能是不够的，尤其是当你的应用程序变得非常大的时候——想想几百个组件。在处理如此大的应用程序时，共享和重用代码变得尤为重要。

假设在我们的应用程序中，我们有一个视图来显示某个用户的仓库列表。除此之外，我们还希望应用搜索和筛选功能。处理此视图的组件可能如下所示：

```js
// src/components/UserRepositories.vue

export default {
  components: { RepositoriesFilters, RepositoriesSortBy, RepositoriesList },
  props: {
    user: { type: String }
  },
  data () {
    return {
      repositories: [], // 1
      filters: { ... }, // 3
      searchQuery: '' // 2
    }
  },
  computed: {
    filteredRepositories () { ... }, // 3
    repositoriesMatchingSearchQuery () { ... }, // 2
  },
  watch: {
    user: 'getUserRepositories' // 1
  },
  methods: {
    getUserRepositories () {
      // 使用 `this.user` 获取用户仓库
    }, // 1
    updateFilters () { ... }, // 3
  },
  mounted () {
    this.getUserRepositories() // 1
  }
}
```


该组件有以下几个职责：

1. 从假定的外部 API 获取该用户名的仓库，并在用户更改时刷新它
2. 使用 `searchQuery` 字符串搜索存储库
3. 使用 `filters` 对象筛选仓库

用组件的选项 (`data`、`computed`、`methods`、`watch`) 组织逻辑在大多数情况下都有效。然而，当我们的组件变得更大时，**逻辑关注点**的列表也会增长。这可能会导致组件难以阅读和理解，尤其是对于那些一开始就没有编写这些组件的人来说。

![Vue 选项 API: 按选项类型分组的代码](https://user-images.githubusercontent.com/499550/62783021-7ce24400-ba89-11e9-9dd3-36f4f6b1fae2.png)

一个大型组件的示例，其中**逻辑关注点**是按颜色分组。

这种碎片化使得理解和维护复杂组件变得困难。选项的分离掩盖了潜在的逻辑问题。此外，在处理单个逻辑关注点时，我们必须不断地“跳转”相关代码的选项块。

如果我们能够将与同一个逻辑关注点相关的代码配置在一起会更好。而这正是 Composition API 使我们能够做到的。

## Composition API 基础

既然我们知道了**为什么**，我们就可以开始**如何**。为了开始使用 Composition api，我们首先需要一个可以实际使用它的地方。在 Vue 组件中，我们将此位置称为 `setup`。

### `setup` 组件选项

新的 `setup` 组件选项在**创建组件之前**执行，一旦 `props` 被解析，并充当合成 API 的入口点。

:::warning
由于在执行 `setup` 时尚未创建组件实例，因此在 `setup` 选项中没有 `this`。这意味着，除了 `props` 之外，你将无法访问组件中声明的任何属性——**本地状态**、**计算属性**或**方法**。
:::

`setup` 选项应该是一个接受 `props` 和 `context` 的函数，我们将在[稍后](composition-api-setup.html#arguments)讨论。此外，我们从 `setup` 返回的所有内容都将暴露给组件的其余部分 (计算属性、方法、生命周期钩子等等) 以及组件的模板。

让我们添加 `setup` 到我们的组件中：

```js
// src/components/UserRepositories.vue

export default {
  components: { RepositoriesFilters, RepositoriesSortBy, RepositoriesList },
  props: {
    user: { type: String }
  },
  setup(props) {
    console.log(props) // { user: '' }

    return {} // 这里返回的任何内容都可以用于组件的其余部分
  }
  // 组件的“其余部分”
}
```

现在让我们从提取第一个逻辑关注点开始 (在原始代码段中标记为“1”)。

> 1. 从假定的外部 API 获取该用户名的仓库，并在用户更改时刷新它

我们将从最明显的部分开始：

- 仓库列表
- 更新仓库列表的函数
- 返回列表和函数，以便其他组件选项可以访问它们

```js
// src/components/UserRepositories.vue `setup` function
import { fetchUserRepositories } from '@/api/repositories'

// 在我们的组件内
setup (props) {
  let repositories = []
  const getUserRepositories = async () => {
    repositories = await fetchUserRepositories(props.user)
  }

  return {
    repositories,
    getUserRepositories // 返回的函数与方法的行为相同
  }
}
```

这是我们的出发点，但它还不能工作，因为我们的 `repositories` 变量不是被动的。这意味着从用户的角度来看，仓库列表将保持为空。我们来解决这个问题！

### 带 `ref` 的响应式变量

在 Vue 3.0 中，我们可以通过一个新的 `ref` 函数使任何响应式变量在任何地方起作用，如下所示：

```js
import { ref } from 'vue'

const counter = ref(0)
```

`ref` 接受参数并返回它包装在具有 `value` property 的对象中，然后可以使用该 property 访问或更改响应式变量的值：

```js
import { ref } from 'vue'

const counter = ref(0)

console.log(counter) // { value: 0 }
console.log(counter.value) // 0

counter.value++
console.log(counter.value) // 1
```

在对象中包装值似乎不必要，但在 JavaScript 中保持不同数据类型的行为统一是必需的。这是因为在 JavaScript 中，`Number` 或 `String` 等基本类型是通过值传递的，而不是通过引用传递的：

![按引用传递与按值传递](https://blog.penjee.com/wp-content/uploads/2015/02/pass-by-reference-vs-pass-by-value-animation.gif)

在任何值周围都有一个包装器对象，这样我们就可以在整个应用程序中安全地传递它，而不必担心在某个地方失去它的响应式。

:::tip 提示
换句话说，`ref` 对我们的值创建了一个**响应式引用**。使用**引用**的概念将在整个 Composition API 中经常使用。
:::

回到我们的例子，让我们创建一个响应式的 `repositories` 变量：
```js
// src/components/UserRepositories.vue `setup` function
import { fetchUserRepositories } from '@/api/repositories'
import { ref } from 'vue'

// in our component
setup (props) {
  const repositories = ref([])
  const getUserRepositories = async () => {
    repositories.value = await fetchUserRepositories(props.user)
  }

  return {
    repositories,
    getUserRepositories
  }
}
```

完成！现在，每当我们调用 `getUserRepositories`、`repositories` 时都将发生变化，视图将更新以反映更改。我们的组件现在应该如下所示：

```js
// src/components/UserRepositories.vue
import { fetchUserRepositories } from '@/api/repositories'
import { ref } from 'vue'

export default {
  components: { RepositoriesFilters, RepositoriesSortBy, RepositoriesList },
  props: {
    user: { type: String }
  },
  setup (props) {
    const repositories = ref([])
    const getUserRepositories = async () => {
      repositories.value = await fetchUserRepositories(props.user)
    }

    return {
      repositories,
      getUserRepositories
    }
  },
  data () {
    return {
      filters: { ... }, // 3
      searchQuery: '' // 2
    }
  },
  computed: {
    filteredRepositories () { ... }, // 3
    repositoriesMatchingSearchQuery () { ... }, // 2
  },
  watch: {
    user: 'getUserRepositories' // 1
  },
  methods: {
    updateFilters () { ... }, // 3
  },
  mounted () {
    this.getUserRepositories() // 1
  }
}
```

我们已经将第一个逻辑关注点中的几个部分移到了 `setup` 方法中，它们彼此非常接近。剩下的就是在 `mounted` 钩子中调用 `getUserRepositories`，并设置一个监听器，以便在 `user` prop 发生变化时执行此操作。

我们将从生命周期钩子开始。

### 生命周期钩子注册内部 `setup`

为了使 Composition API 的特性与选项 API 相比更加完整，我们还需要一种在 `setup` 中注册生命周期钩子的方法。这要归功于从 Vue 导出的几个新函数。Composition API 上的生命周期钩子与选项 API 的名称相同，但前缀为 `on`：即 `mounted` 看起来像 `onMounted`。

这些函数接受在组件调用钩子时将执行的回调。

让我们将其添加到 `setup` 函数中：

```js
// src/components/UserRepositories.vue `setup` function
import { fetchUserRepositories } from '@/api/repositories'
import { ref, onMounted } from 'vue'

// in our component
setup (props) {
  const repositories = ref([])
  const getUserRepositories = async () => {
    repositories.value = await fetchUserRepositories(props.user)
  }

  onMounted(getUserRepositories) // on `mounted` call `getUserRepositories`

  return {
    repositories,
    getUserRepositories
  }
}
```

现在我们需要对 `user` prop 所做的更改做出反应。为此，我们将使用独立的 `watch` 函数。

### `watch` 响应式更改

就像我们如何使用 `watch` 选项在组件内的 `user` property 上设置侦听器一样，我们也可以使用从 Vue 导入的 `watch` 函数执行相同的操作。它接受 3 个参数：

- 一个**响应式引用**或我们想要侦听的 getter 函数
- 一个回调
- 可选的配置选项

**下面让我们快速了解一下它是如何工作的**

```js
import { ref, watch } from 'vue'

const counter = ref(0)
watch(counter, (newValue, oldValue) => {
  console.log('The new counter value is: ' + counter.value)
})
```

例如，每当 `counter` 被修改时 `counter.value=5`，watch 将触发并执行回调 (第二个参数)，在本例中，它将把 `The new counter value is:5` 记录到我们的控制台中。

**以下是选项 API 等效：**

```js
export default {
  data() {
    return {
      counter: 0
    }
  },
  watch: {
    counter(newValue, oldValue) {
      console.log('The new counter value is: ' + this.counter)
    }
  }
}
```

有关 `watch` 的详细信息，请参阅我们的[深入指南] ()。

**现在我们将其应用到我们的示例中：**

```js
// src/components/UserRepositories.vue `setup` function
import { fetchUserRepositories } from '@/api/repositories'
import { ref, onMounted, watch, toRefs } from 'vue'

// 在我们组件中
setup (props) {
  // 使用 `toRefs` 创建对prop的 `user` property 的响应式引用
  const { user } = toRefs(props)

  const repositories = ref([])
  const getUserRepositories = async () => {
    // 更新`prop.user ` 到 `user.value`访问引用值
    repositories.value = await fetchUserRepositories(user.value)
  }

  onMounted(getUserRepositories)

  // 在用户prop的响应式引用上设置一个侦听器
  watch(user, getUserRepositories)

  return {
    repositories,
    getUserRepositories
  }
}
```

你可能已经注意到在我们的 `setup` 的顶部使用了 `toRefs`。这是为了确保我们的侦听器能够对 `user` prop 所做的更改做出反应。

有了这些变化，我们就把第一个逻辑关注点移到了一个地方。我们现在可以对第二个关注点执行相同的操作—基于 `searchQuery` 进行过滤，这次是使用计算属性。

### 独立的 `computed` 属性

与 `ref` 和 `watch` 类似，也可以使用从 Vue 导入的 `computed` 函数在 Vue 组件外部创建计算属性。让我们回到我们的 counter 例子：

```js
import { ref, computed } from 'vue'

const counter = ref(0)
const twiceTheCounter = computed(() => counter.value * 2)

counter.value++
console.log(counter.value) // 1
console.log(twiceTheCounter.value) // 2
```

在这里，`computed` 函数返回一个作为 `computed` 的第一个参数传递的 getter 类回调的输出的一个*只读*的“响应式引用”。为了访问新创建的计算变量的 **value**，我们需要像使用 `ref` 一样使用 `.value` property。

让我们将搜索功能移到 `setup` 中：

```js
// src/components/UserRepositories.vue `setup` function
import { fetchUserRepositories } from '@/api/repositories'
import { ref, onMounted, watch, toRefs, computed } from 'vue'

// in our component
setup (props) {
  // 使用 `toRefs` 创建对props的 `user` property 的响应式引用
  const { user } = toRefs(props)

  const repositories = ref([])
  const getUserRepositories = async () => {
    // 更新`props.user ` 到 `user.value`访问引用值
    repositories.value = await fetchUserRepositories(user.value)
  }

  onMounted(getUserRepositories)

  // 在用户prop的响应式引用上设置一个侦听器
  watch(user, getUserRepositories)

  const searchQuery = ref('')
  const repositoriesMatchingSearchQuery = computed(() => {
    return repositories.value.filter(
      repository => repository.name.includes(searchQuery.value)
    )
  })

  return {
    repositories,
    getUserRepositories,
    searchQuery,
    repositoriesMatchingSearchQuery
  }
}
```

对于其他的**逻辑关注点**我们也可以这样做，但是你可能已经在问这个问题了——*这不就是把代码移到“setup”选项并使它变得非常大吗？*嗯，那是真的。这就是为什么在继续其他任务之前，我们将首先将上述代码提取到一个独立的**组合函数**。让我们从创建 `useUserRepositories` 开始：

```js
// src/composables/useUserRepositories.js

import { fetchUserRepositories } from '@/api/repositories'
import { ref, onMounted, watch, toRefs } from 'vue'

export default function useUserRepositories(user) {
  const repositories = ref([])
  const getUserRepositories = async () => {
    repositories.value = await fetchUserRepositories(user.value)
  }

  onMounted(getUserRepositories)
  watch(user, getUserRepositories)

  return {
    repositories,
    getUserRepositories
  }
}
```

然后是搜索功能：

```js
// src/composables/useRepositoryNameSearch.js

import { ref, onMounted, watch, toRefs } from 'vue'

export default function useRepositoryNameSearch(repositories) {
  const searchQuery = ref('')
  const repositoriesMatchingSearchQuery = computed(() => {
    return repositories.value.filter(repository => {
      return repository.name.includes(searchQuery.value)
    })
  })

  return {
    searchQuery,
    repositoriesMatchingSearchQuery
  }
}
```

**现在在单独的文件中有了这两个功能，我们就可以开始在组件中使用它们了。以下是如何做到这一点：**

```js
// src/components/UserRepositories.vue
import useUserRepositories from '@/composables/useUserRepositories'
import useRepositoryNameSearch from '@/composables/useRepositoryNameSearch'
import { toRefs } from 'vue'

export default {
  components: { RepositoriesFilters, RepositoriesSortBy, RepositoriesList },
  props: {
    user: { type: String }
  },
  setup (props) {
    const { user } = toRefs(props)

    const { repositories, getUserRepositories } = useUserRepositories(user)

    const {
      searchQuery,
      repositoriesMatchingSearchQuery
    } = useRepositoryNameSearch(repositories)

    return {
      // 因为我们并不关心未经过滤的仓库
      // 我们可以在 `repositories` 名称下暴露过滤后的结果
      repositories: repositoriesMatchingSearchQuery,
      getUserRepositories,
      searchQuery,
    }
  },
  data () {
    return {
      filters: { ... }, // 3
    }
  },
  computed: {
    filteredRepositories () { ... }, // 3
  },
  methods: {
    updateFilters () { ... }, // 3
  }
}
```

此时，你可能已经知道了这个练习，所以让我们跳到最后，迁移剩余的过滤功能。我们不需要深入了解实现细节，因为这不是本指南的重点。

```js
// src/components/UserRepositories.vue
import { toRefs } from 'vue'
import useUserRepositories from '@/composables/useUserRepositories'
import useRepositoryNameSearch from '@/composables/useRepositoryNameSearch'
import useRepositoryFilters from '@/composables/useRepositoryFilters'

export default {
  components: { RepositoriesFilters, RepositoriesSortBy, RepositoriesList },
  props: {
    user: { type: String }
  },
  setup(props) {
    const { user } = toRefs(props)

    const { repositories, getUserRepositories } = useUserRepositories(user)

    const {
      searchQuery,
      repositoriesMatchingSearchQuery
    } = useRepositoryNameSearch(repositories)

    const {
      filters,
      updateFilters,
      filteredRepositories
    } = useRepositoryFilters(repositoriesMatchingSearchQuery)

    return {
      // 因为我们并不关心未经过滤的仓库
      // 我们可以在 `repositories` 名称下暴露过滤后的结果
      repositories: filteredRepositories,
      getUserRepositories,
      searchQuery,
      filters,
      updateFilters
    }
  }
}
```

我们完成了！

请记住，我们只触及了 Composition API 的表面以及它允许我们做什么。要了解更多信息，请参阅深入指南。
