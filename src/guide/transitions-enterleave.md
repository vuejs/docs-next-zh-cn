# 进入过渡 & 离开过渡

在插入、更新或从 DOM 中移除项时，Vue 提供了多种应用转换效果的方法。这包括以下工具：

- 自动为 CSS 转换和动画应用 class；
- 集成第三方 CSS 动画库，例如 [animate.css](https://animate.style/) ；
- 在过渡钩子期间使用 JavaScript 直接操作 DOM；
- 集成第三方 JavaScript 动画库。

在这里，我们只介绍进入、离开和列表的过渡，你也可以看下一节[列表过渡](transitions-list.html)和[管理过渡状态](transitions-state.html) 。

## 单元素/组件的过渡

Vue 提供了 `transition` 的封装组件，在下列情形中，可以给任何元素和组件添加进入/离开过渡

- 条件渲染 (使用 `v-if`)
- 条件展示 (使用 `v-show`)
- 动态组件
- 组件根节点

这里是一个典型的例子：

```html
<div id="demo">
  <button @click="show = !show">
    Toggle
  </button>

  <transition name="fade">
    <p v-if="show">hello</p>
  </transition>
</div>
```

```js
const Demo = {
  data() {
    return {
      show: true
    }
  }
}

Vue.createApp(Demo).mount('#demo')
```

```css
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
```

<common-codepen-snippet title="Simple Transition Component" slug="3466d06fb252a53c5bc0a0edb0f1588a" tab="html,result" :editable="false" />

当插入或删除包含在 `transition` 组件中的元素时，Vue 将会做以下处理：

1. 自动嗅探目标元素是否应用了 CSS 过渡或动画，如果是，在恰当的时机添加/删除 CSS 类名。

2. 如果过渡组件提供了 [JavaScript 钩子函数](#javascript-钩子) ，这些钩子函数将在恰当的时机被调用。

3. 如果没有找到 JavaScript 钩子并且也没有检测到 CSS 过渡/动画，DOM 操作 (插入/删除) 在下一帧中立即执行。(注意：此指浏览器逐帧动画机制，和 Vue 的 `nextTick` 概念不同)

### 过渡class

在进入/离开的过渡中，会有 6 个 class 切换。

1. `v-enter-from`：定义进入过渡的开始状态。在元素被插入之前生效，在元素被插入之后的下一帧移除。

2. `v-enter-active`：定义进入过渡生效时的状态。在整个进入过渡的阶段中应用，在元素被插入之前生效，在过渡/动画完成之后移除。这个类可以被用来定义进入过渡的过程时间，延迟和曲线函数。

3. `v-enter-to`：定义进入过渡的结束状态。在元素被插入之后下一帧生效 (与此同时 `v-enter-from` 被移除)，在过渡/动画完成之后移除。

4. `v-leave-from`：定义离开过渡的开始状态。在离开过渡被触发时立刻生效，下一帧被移除。

5. `v-leave-active`：定义离开过渡生效时的状态。在整个离开过渡的阶段中应用，在离开过渡被触发时立刻生效，在过渡/动画完成之后移除。这个类可以被用来定义离开过渡的过程时间，延迟和曲线函数。

6. `v-leave-to`：离开过渡的结束状态。在离开过渡被触发之后下一帧生效 (与此同时 `v-leave-from` 被删除)，在过渡/动画完成之后移除。

![Transition Diagram](/images/transition.png)

对于这些在过渡中切换的类名来说，如果你使用一个没有名字的 `<transition>`，则 `v-` 是这些class名的默认前缀。如果你使用了 `<transition name="my-transition">`，那么 `v-enter-from`会替换为 `my-transition-enter-from`。

`v-enter-active` 和 `v-leave-active` 可以控制进入/离开过渡的不同的缓和曲线，在下面章节会有个示例说明。

### CSS 过渡

常用的过渡都是使用 CSS 过渡。

```html
<div id="demo">
  <button @click="show = !show">
    Toggle render
  </button>

  <transition name="slide-fade">
    <p v-if="show">hello</p>
  </transition>
</div>
```

```js
const Demo = {
  data() {
    return {
      show: true
    }
  }
}

Vue.createApp(Demo).mount('#demo')
```

```css
/* 可以设置不同的进入和离开动画   */
/* 设置持续时间和动画函数        */
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}
```

<common-codepen-snippet title="Different Enter and Leave Transitions" slug="0dfa7869450ef43d6f7bd99022bc53e2" tab="css,result" :editable="false" />

### CSS 动画

CSS 动画用法同 CSS 过渡，区别是在动画中 `v-enter-from` 类名在节点插入 DOM 后不会立即删除，而是在 `animationend` 事件触发时删除。

下面是一个例子，为了简洁起见，省略了带前缀的 CSS 规则：

```html
<div id="demo">
  <button @click="show = !show">Toggle show</button>
  <transition name="bounce">
    <p v-if="show">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris facilisis
      enim libero, at lacinia diam fermentum id. Pellentesque habitant morbi
      tristique senectus et netus.
    </p>
  </transition>
</div>
```

```js
const Demo = {
  data() {
    return {
      show: true
    }
  }
}

Vue.createApp(Demo).mount('#demo')
```

```css
.bounce-enter-active {
  animation: bounce-in 0.5s;
}
.bounce-leave-active {
  animation: bounce-in 0.5s reverse;
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.25);
  }
  100% {
    transform: scale(1);
  }
}
```

<common-codepen-snippet title="CSS Animation Transition Example" slug="8627c50c5514752acd73d19f5e33a781" tab="html,result" :editable="false" />

### 自定义过渡 class 类名

我们可以通过以下 attribute 来自定义过渡类名：

- `enter-from-class`
- `enter-active-class`
- `enter-to-class`
- `leave-from-class`
- `leave-active-class`
- `leave-to-class`

他们的优先级高于普通的类名，这对于 Vue 的过渡系统和其他第三方 CSS 动画库，如 [Animate.css](https://daneden.github.io/animate.css/). 结合使用十分有用。

示例:

```html
<link
  href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.0/animate.min.css"
  rel="stylesheet"
  type="text/css"
/>

<div id="demo">
  <button @click="show = !show">
    Toggle render
  </button>

  <transition
    name="custom-classes-transition"
    enter-active-class="animate__animated animate__tada"
    leave-active-class="animate__animated animate__bounceOutRight"
  >
    <p v-if="show">hello</p>
  </transition>
</div>
```

```js
const Demo = {
  data() {
    return {
      show: true
    }
  }
}

Vue.createApp(Demo).mount('#demo')
```

### 同时使用过渡和动画

Vue 为了知道过渡的完成，必须设置相应的事件监听器。它可以是 `transitionend` 或 `animationend`，这取决于给元素应用的 CSS 规则。如果你使用其中任何一种，Vue 能自动识别类型并设置监听。

但是，在一些场景中，你需要给同一个元素同时设置两种过渡动效，比如 animation 很快的被触发并完成了，而 transition 效果还没结束。在这种情况中，你就需要使用 `type` attribute 并设置 `animation` 或 `transition` 来明确声明你需要 Vue 监听的类型。

### 显性的过渡持续时间

<!-- TODO: 验证并提供示例 -->

在很多情况下，Vue 可以自动得出过渡效果的完成时机。默认情况下，Vue 会等待其在过渡效果的根元素的第一个 `transitionend` 或 `animationend` 事件。然而也可以不这样设定——比如，我们可以拥有一个精心编排的一系列过渡效果，其中一些嵌套的内部元素相比于过渡效果的根元素有延迟的或更长的过渡效果。

在这种情况下你可以用 `<transition>` 组件上的 `duration` prop 定制一个显性的过渡持续时间 (以毫秒计)：

```html
<transition :duration="1000">...</transition>
```

你也可以定制进入和移出的持续时间：

```html
<transition :duration="{ enter: 500, leave: 800 }">...</transition>
```

### JavaScript 钩子

可以在 attribute 中声明 JavaScript 钩子

```html
<transition
  @before-enter="beforeEnter"
  @enter="enter"
  @after-enter="afterEnter"
  @enter-cancelled="enterCancelled"
  @before-leave="beforeLeave"
  @leave="leave"
  @after-leave="afterLeave"
  @leave-cancelled="leaveCancelled"
  :css="false"
>
  <!-- ... -->
</transition>
```

```js
// ...
methods: {
  // --------
  // ENTERING
  // --------

  beforeEnter(el) {
    // ...
  },
  // 当与 CSS 结合使用时
  // 回调函数 done 是可选的
  enter(el, done) {
    // ...
    done()
  },
  afterEnter(el) {
    // ...
  },
  enterCancelled(el) {
    // ...
  },

  // --------
  // 离开时
  // --------

  beforeLeave(el) {
    // ...
  },
  // 当与 CSS 结合使用时
  // 回调函数 done 是可选的
  leave(el, done) {
    // ...
    done()
  },
  afterLeave(el) {
    // ...
  },
  // leaveCancelled 只用于 v-show 中
  leaveCancelled(el) {
    // ...
  }
}
```

这些钩子函数可以结合 CSS transitions/animations 使用，也可以单独使用。

当只用 JavaScript 过渡的时候，在 **`enter` 和 `leave` 钩中必须使用 `done` 进行回调**。否则，它们将被同步调用，过渡会立即完成。添加 `:css="false"`，也会让 Vue 会跳过 CSS 的检测，除了性能略高之外，这可以避免过渡过程中 CSS 规则的影响。

现在让我们来看一个例子。下面是一个使用 [GreenSock](https://greensock.com/) 的 JavaScript 过渡:

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.3.4/gsap.min.js"></script>

<div id="demo">
  <button @click="show = !show">
    Toggle
  </button>

  <transition
    @before-enter="beforeEnter"
    @enter="enter"
    @leave="leave"
    :css="false"
  >
    <p v-if="show">
      Demo
    </p>
  </transition>
</div>
```

```js
const Demo = {
  data() {
    return {
      show: false
    }
  },
  methods: {
    beforeEnter(el) {
      gsap.set(el, {
        scaleX: 0.8,
        scaleY: 1.2
      })
    },
    enter(el, done) {
      gsap.to(el, {
        duration: 1,
        scaleX: 1.5,
        scaleY: 0.7,
        opacity: 1,
        x: 150,
        ease: 'elastic.inOut(2.5, 1)',
        onComplete: done
      })
    },
    leave(el, done) {
      gsap.to(el, {
        duration: 0.7,
        scaleX: 1,
        scaleY: 1,
        x: 300,
        ease: 'elastic.inOut(2.5, 1)'
      })
      gsap.to(el, {
        duration: 0.2,
        delay: 0.5,
        opacity: 0,
        onComplete: done
      })
    }
  }
}

Vue.createApp(Demo).mount('#demo')
```

<common-codepen-snippet title="JavaScript Hooks Transition" slug="68ce1b8c41d0a6e71ff58df80fd85ae5" tab="js,result" :editable="false" />

## 初始渲染的过渡

可以通过 `appear` attribute 设置节点在初始渲染的过渡

```html
<transition appear>
  <!-- ... -->
</transition>
```

## 多个元素的过渡

我们之后讨论[多个组件之间过渡](#多个组件之间过渡)，对于原生标签可以使用 `v-if`/`v-else-if`/`v-else`。最常见的多标签过渡是一个列表和描述这个列表为空消息的元素：

```html
<transition>
  <table v-if="items.length > 0">
    <!-- ... -->
  </table>
  <p v-else>Sorry, no items found.</p>
</transition>
```

实际上，通过使用 `v-if`/`v-else-if`/`v-else` 或将单个元素绑定到一个动态 property，可以在任意数量的元素之间进行过渡。例如：

<!-- TODO: 重写示例并放入 codepen 示例 -->

```html
<transition>
  <button v-if="docState === 'saved'" key="saved">
    Edit
  </button>
  <button v-else-if="docState === 'edited'" key="edited">
    Save
  </button>
  <button v-else-if="docState === 'editing'" key="editing">
    Cancel
  </button>
</transition>
```

也可以写为：

```html
<transition>
  <button :key="docState">
    {{ buttonMessage }}
  </button>
</transition>
```

```js
// ...
computed: {
  buttonMessage() {
    switch (this.docState) {
      case 'saved': return 'Edit'
      case 'edited': return 'Save'
      case 'editing': return 'Cancel'
    }
  }
}
```

### 过渡模式

这里还有一个问题，试着点击下面的按钮：

<common-codepen-snippet title="Transition Modes Button Problem" slug="Rwrqzpr" :editable="false" />

在“on”按钮和“off”按钮的过渡中，两个按钮都被重绘了，一个离开过渡的时候另一个开始进入过渡。这是 `<transition>` 的默认行为 —— 进入和离开同时发生。

有时这很有效，例如当过渡项绝对位于彼此的 top 时：

<common-codepen-snippet title="Transition Modes Button Problem- positioning" slug="abdQgLr" :editable="false" />

同时生效的进入和离开的过渡不能满足所有要求，所以 Vue 提供了**过渡模式**

- `in-out`: 新元素先进行过渡，完成之后当前元素过渡离开。
- `out-in`: 当前元素先进行过渡，完成之后新元素过渡进入。

::: tip
很快就会发现 `out-in` 是你大多数时候想要的状态 :)
:::

现在让我们用 `out-in` 更新 on/off 按钮的转换：

```html
<transition name="fade" mode="out-in">
  <!-- ... the buttons ... -->
</transition>
```

<common-codepen-snippet title="Transition Modes Button Problem- solved" slug="ZEQmdvq" :editable="false" />

通过添加一个 attribute，我们修复了原来的过渡，而不必添加任何特殊 style。

我们可以用它来协调更具表现力的动作，例如折叠卡片，如下所示。实际上是两个元素在彼此之间转换，但是由于开始状态和结束状态的比例是相同的：水平为0，它看起来就像一个流体运动。这种轻描淡写对于真实的 UI 微交互非常有用：

<common-codepen-snippet title="Transition Modes Flip Cards" slug="76e344bf057bd58b5936bba260b787a8" :editable="false" />

## 多个组件之间过渡

组件之间的过渡更简单 —— 我们甚至不需要 `key` 属性。相反，我们包裹了一个[动态组件](component-basics.html#动态组件) ：

```html
<div id="demo">
  <input v-model="view" type="radio" value="v-a" id="a"><label for="a">A</label>
  <input v-model="view" type="radio" value="v-b" id="b"><label for="b">B</label>
  <transition name="component-fade" mode="out-in">
    <component :is="view"></component>
  </transition>
</div>
```

```js
const Demo = {
  data() {
    return {
      view: 'v-a'
    }
  },
  components: {
    'v-a': {
      template: '<div>Component A</div>'
    },
    'v-b': {
      template: '<div>Component B</div>'
    }
  }
}

Vue.createApp(Demo).mount('#demo')
```

```css
.component-fade-enter-active,
.component-fade-leave-active {
  transition: opacity 0.3s ease;
}

.component-fade-enter-from,
.component-fade-leave-to {
  opacity: 0;
}
```

<common-codepen-snippet title="Transitioning between components" slug="WNwVxZw" tab="html,result" theme="39028" />
