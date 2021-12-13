# 状态过渡

Vue 的过渡系统提供了非常多简单的方法来设置进入、离开和列表的动效，那么对于数据元素本身的动效呢？比如：

- 数字和运算
- 颜色的显示
- SVG 节点的位置
- 元素的大小和其他的 property

这些数据要么本身就以数值形式存储，要么可以转换为数值。有了这些数值后，我们就可以结合 Vue 的响应性和组件系统，使用第三方库来实现切换元素的过渡状态。

## 状态动画与侦听器

通过侦听器我们能监听到任何数值 property 的更新。可能听起来很抽象，所以让我们先来看看一个使用 [GreenSock](https://greensock.com/) 的例子：

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.2.4/gsap.min.js"></script>

<div id="animated-number-demo">
  <input v-model.number="number" type="number" step="20" />
  <p>{{ animatedNumber }}</p>
</div>
```

```js
const Demo = {
  data() {
    return {
      number: 0,
      tweenedNumber: 0
    }
  },
  computed: {
    animatedNumber() {
      return this.tweenedNumber.toFixed(0)
    }
  },
  watch: {
    number(newValue) {
      gsap.to(this.$data, { duration: 0.5, tweenedNumber: newValue })
    }
  }
}

Vue.createApp(Demo).mount('#animated-number-demo')
```

<common-codepen-snippet title="Transitioning State 1" slug="22903bc3b53eb5b7817378ecb985ce96" tab="js,result" :editable="false" :preview="false" />

更新数字时，输入框下方会对更改设置动画效果。

## 动态状态过渡

就像 Vue 的过渡组件一样，用于支撑状态过渡的数据也可以实时更新，这对于原型设计十分有用！只需要对变量做一些修改，即使是一个简单的 SVG 多边形也可实现很多难以想象的效果。

<common-codepen-snippet title="Updating SVG" slug="a8e00648d4df6baa1b19fb6c31c8d17e" :height="500" tab="js,result" :editable="false" />

## 把过渡放到组件里

管理太多的状态过渡会迅速增加组件实例的复杂度，幸好很多的动画可以提取到专用的子组件中。我们把之前的整数动画示例改写一下：

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.2.4/gsap.min.js"></script>

<div id="app">
  <input v-model.number="firstNumber" type="number" step="20" /> +
  <input v-model.number="secondNumber" type="number" step="20" /> = {{ result }}
  <p>
    <animated-integer :value="firstNumber"></animated-integer> +
    <animated-integer :value="secondNumber"></animated-integer> =
    <animated-integer :value="result"></animated-integer>
  </p>
</div>
```

```js
const app = Vue.createApp({
  data() {
    return {
      firstNumber: 20,
      secondNumber: 40
    }
  },
  computed: {
    result() {
      return this.firstNumber + this.secondNumber
    }
  }
})

app.component('animated-integer', {
  template: '<span>{{ fullValue }}</span>',
  props: {
    value: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      tweeningValue: 0
    }
  },
  computed: {
    fullValue() {
      return Math.floor(this.tweeningValue)
    }
  },
  methods: {
    tween(newValue, oldValue) {
      gsap.to(this.$data, {
        duration: 0.5,
        tweeningValue: newValue,
        ease: 'sine'
      })
    }
  },
  watch: {
    value(newValue, oldValue) {
      this.tween(newValue, oldValue)
    }
  },
  mounted() {
    this.tween(this.value, 0)
  }
})

app.mount('#app')
```

<common-codepen-snippet title="State Transition Components" slug="e9ef8ac7e32e0d0337e03d20949b4d17" tab="js,result" :editable="false" />

现在我们可以使这些子组件与多个状态相组合。这让人感到兴奋——我们能在组件中结合使用这一节讲到各种过渡策略和 Vue [内建的过渡系统](transitions-enterleave.html)。总之，对于完成各种过渡动效几乎没有阻碍。

你可以看到我们如何使用它进行数据可视化、物理效果、角色动画和交互，一切都没有限制。

## 赋予设计以生命

动画效果可以栩栩如生。不幸的是，设计师创建图标、logo 和吉祥物的时候，他们交付的通常都是图片或静态的 SVG。所以，虽然 GitHub 的章鱼猫、Twitter 的小鸟以及其它许多 logo 类似于生灵，它们看上去实际上并不是活着的。

Vue 可以帮到你。因为 SVG 的本质是数据，我们只需要准备好这些生物兴奋、思考或警戒的样例。然后 Vue 就可以辅助完成这几种状态之间的过渡动画，来制作你的欢迎页面、加载指示和更加带有情感的通知提示。

Sarah Drasner 展示了下面这个根据时间和交互变化发生状态改变的 demo：

<common-codepen-snippet title="Vue-controlled Wall-E" slug="YZBGNp" :height="400" :team="false" user="sdras" name="Sarah Drasner" :editable="false" :preview="false" version="2" theme="light" />
