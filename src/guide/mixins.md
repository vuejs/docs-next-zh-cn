# 混入

## 基础

混入 (mixin) 提供了一种非常灵活的方式，来分发 Vue 组件中的可复用功能。一个混入对象可以包含任意组件选项。当组件使用混入对象时，所有混入对象的选项将被“混合”进入该组件本身的选项。

例子：

```js
// define a mixin object
const myMixin = {
  created() {
    this.hello()
  },
  methods: {
    hello() {
      console.log('hello from mixin!')
    }
  }
}

// define an app that uses this mixin
const app = Vue.createApp({
  mixins: [myMixin]
})

app.mount('#mixins-basic') // => "hello from mixin!"
```

## 选项合并

当组件和混入对象含有同名选项时，这些选项将以恰当的方式进行“合并”。

比如，数据对象在内部会进行递归合并，并在发生冲突时以组件数据优先。

```js
const myMixin = {
  data() {
    return {
      message: 'hello',
      foo: 'abc'
    }
  }
}

const app = Vue.createApp({
  mixins: [myMixin],
  data() {
    return {
      message: 'goodbye',
      bar: 'def'
    }
  },
  created() {
    console.log(this.$data) // => { message: "goodbye", foo: "abc", bar: "def" }
  }
})
```

同名钩子函数将合并为一个数组，因此都将被调用。另外，混入对象的钩子将在组件自身钩子**之前**调用。

```js
const myMixin = {
  created() {
    console.log('mixin hook called')
  }
}

const app = Vue.createApp({
  mixins: [myMixin],
  created() {
    console.log('component hook called')
  }
})

// => "混入对象的钩子被调用"
// => "组件钩子被调用"
```

值为对象的选项，例如 `methods`、`components` 和 `directives`，将被合并为同一个对象。两个对象键名冲突时，取组件对象的键值对。

```js
const myMixin = {
  methods: {
    foo() {
      console.log('foo')
    },
    conflicting() {
      console.log('from mixin')
    }
  }
}

const app = Vue.createApp({
  mixins: [myMixin],
  methods: {
    bar() {
      console.log('bar')
    },
    conflicting() {
      console.log('from self')
    }
  }
})

const vm = app.mount('#mixins-basic')

vm.foo() // => "foo"
vm.bar() // => "bar"
vm.conflicting() // => "from self"
```

## 全局混入

你还可以为 Vue 应用程序全局应用 mixin：

```js
const app = Vue.createApp({
  myOption: 'hello!'
})

// 为自定义的选项 'myOption' 注入一个处理器。
app.mixin({
  created() {
    const myOption = this.$options.myOption
    if (myOption) {
      console.log(myOption)
    }
  }
})

app.mount('#mixins-global') // => "hello!"
```

混入也可以进行全局注册。使用时格外小心！一旦使用全局混入，它将影响**每一个**之后创建的组件（例如，每个子组件）。

```js
const app = Vue.createApp({
  myOption: 'hello!'
})

// 为自定义的选项 'myOption' 注入一个处理器。
app.mixin({
  created() {
    const myOption = this.$options.myOption
    if (myOption) {
      console.log(myOption)
    }
  }
})

// 将myOption也添加到子组件
app.component('test-component', {
  myOption: 'hello from component!'
})

app.mount('#mixins-global')

// => "hello!"
// => "hello from component!"
```

大多数情况下，只应当应用于自定义选项，就像上面示例一样。推荐将其作为[插件](plugins.html)发布，以避免重复应用混入。

## 自定义选项合并策略

自定义选项将使用默认策略，即简单地覆盖已有值。如果想让自定义选项以自定义逻辑合并，可以向 `app.config.optionMergeStrategies` 添加一个函数：

```js
const app = Vue.createApp({})

app.config.optionMergeStrategies.customOption = (toVal, fromVal) => {
  // return mergedVal
}
```

合并策略接收在父实例和子实例上定义的该选项的值，分别作为第一个和第二个参数。让我们来检查一下使用 mixin 时，这些参数有哪些：

```js
const app = Vue.createApp({
  custom: 'hello!'
})

app.config.optionMergeStrategies.custom = (toVal, fromVal) => {
  console.log(fromVal, toVal)
  // => "goodbye!", undefined
  // => "hello", "goodbye!"
  return fromVal || toVal
}

app.mixin({
  custom: 'goodbye!',
  created() {
    console.log(this.$options.custom) // => "hello!"
  }
})
```

如你所见，在控制台中，我们先从 mixin 打印 `toVal` 和 `fromVal` ，然后从 `app` 打印。如果存在，我们总是返回`fromVal`，这就是为什么 `this.$options.custom` 设置为`你好！`最后。让我们尝试将策略更改为*始终*从子*实例*返回值：

```js
const app = Vue.createApp({
  custom: 'hello!'
})

app.config.optionMergeStrategies.custom = (toVal, fromVal) => toVal || fromVal

app.mixin({
  custom: 'goodbye!',
  created() {
    console.log(this.$options.custom) // => "goodbye!"
  }
})
```


在Vue 2中，mixin是将部分组件逻辑抽象成可重用块的主要工具。但是，他们有几个问题：

- mixin很容易发生冲突：因为每个特性的属性都被合并到同一个组件中，所以为了避免 property 名冲突和调试，你仍然需要了解其他每个特性。

- 可重用性是有限的：我们不能向mixin传递任何参数来改变它的逻辑，这降低了它们在抽象逻辑方面的灵活性

为了解决这些问题，我们添加了一种通过逻辑关注点组织代码的新方法：[Composition API](composition-api-introduction.html).