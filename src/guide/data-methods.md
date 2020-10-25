# 资料属性与方法

## 资料属性


组件的`数据`选项是一个函数。 Vue在创建新组件实例的过程中调用此函数。它应该返回一个对象，然后Vue将其包装在其响应式系统中并以`$data`的形式存储在组件实例上。为了方便起见，该对象的所有顶级属性也直接通过组件实例公开：

```js
const app = Vue.createApp({
  data() {
    return { count: 4 }
  }
})

const vm = app.mount('#app')

console.log(vm.$data.count) // => 4
console.log(vm.count)       // => 4

// Assigning a value to vm.count will also update $data.count
vm.count = 5
console.log(vm.$data.count) // => 5

// ... and vice-versa
vm.$data.count = 6
console.log(vm.count) // => 6
```

这些实例属性仅在首次创建实例时添加，因此您需要确保它们全部存在于由`data`函数返回的对象中。必要时，对尚未使用值的属性使用`null`，`undefined`或其他占位符值。


可以将新属性直接添加到组件实例中，而无需将其包含在`data`中。但是，由于此属性不受反应性`$data`对象的支持，因此[Vue的响应系统](reactivity.html)不会自动对其进行跟踪。


Vue使用`$`前缀，当通过组件实例公开自己的内​​​​置API。同时它还为内部属性保留前缀`_`。您应该避免变量开头命名为这些字符于`data`属性中。

## Methods

将方法添加到组件实例，我们使用`methods`选项。应该包含所需方法的对象：

```js
const app = Vue.createApp({
  data() {
    return { count: 4 }
  },
  methods: {
    increment() {
      // `this` will refer to the component instance
      this.count++
    }
  }
})

const vm = app.mount('#app')

console.log(vm.count) // => 4

vm.increment()

console.log(vm.count) // => 5
```

Vue自动将`methods`的`this`值绑定在一起，始终引用组件实例中。如果将方法用作事件侦听器或回调，则可以确保该方法保留正确的` this`。您应该在定义`methods`时避免使用箭头函数，因为这会阻擋Vue绑定适当的`this`值。


就像组件实例的所有其他属性一样，`methods`可从组件模板中访问。在模板内部，它们最常用作事件侦听器：

```html
<button @click="increment">Up vote</button>
```
在上面的示例中，单击`<button>`时将调用方法`increment`。


也可以直接从模板中调用方法。稍后我们将看到，通常最好使用[computed property](computed.html)。然而，在计算属性不可使用的情况下，使用方法可能会很有用。您可以在模板支持JavaScript表达式的任何地方调用方法：

```html
<span :title="toTitleDate(date)">
  {{ formatDate(date) }}
</span>
```
响应

如果方法`toTitleDate`或`formatDate`访问任何响应性数据，将其作为呈现依赖项进行跟踪，就如同直接在模板中使用了它一样。

从模板调用的方法不应有任何副作用，例如您很想更改数据或触发异步过程，则应该改用[lifecycle hook](instance.html＃lifecycle-hooks)。


### 防抖和节流

Vue無内置抖动或节流，但可以使用[Lodash]（https://lodash.com/）之类的库来实现。

如果某个组件仅使用一次，则可以在`methods`中直接应用`debouncing`：

```html
<script src="https://unpkg.com/lodash@4.17.20/lodash.min.js"></script>
<script>
  Vue.createApp({
    methods: {
      // Debouncing with Lodash
      click: _.debounce(function() {
        // ... respond to click ...
      }, 500)
    }
  }).mount('#app')
</script>
```

However, this approach is potentially problematic for components that are reused because they'll all share the same debounced function. To keep the component instances independent from each other, we can add the debounced function in the `created` lifecycle hook:

但是，这种方法对于重用的组件可能会出现问题，因为它们都将共享相同的去抖动功能。为了使组件实例彼此独立，我们可以在`created`生命周期hook中添加去抖动功能：

```js
app.component('save-button', {
  created() {
    // Debouncing with Lodash
    this.debouncedClick = _.debounce(this.click, 500)
  },
  unmounted() {
    // Cancel the timer when the component is removed
    this.debouncedClick.cancel()
  },
  methods: {
    click() {
      // ... respond to click ...
    }
  },
  template: `
    <button @click="debouncedClick">
      Save
    </button>
  `
})
```
