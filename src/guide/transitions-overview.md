# 过渡 & 动画概述

Vue 提供了一些抽象概念，可以帮助处理过渡和动画，特别是在响应某些变化时。这些抽象的概念包括：

- 在 CSS 和 JS 中，使用内置的 `<transition>` 组件来钩住组件中进入和离开 DOM。
- 过渡模式，以便你在过渡期间编排顺序。
- 在处理多个元素位置更新时，使用 `<transition-group>` 组件，通过 FLIP 技术来提高性能。
- 使用 `watchers` 来处理应用中不同状态的过渡。

我们将在本指南接下来的三个部分中介绍所有这些以及更多内容。然而，除了提供这些有用的 API 之外，值得一提的是，我们前面介绍的 class 和 style 声明也可以应用于动画和过渡，用于更简单的用例。

在下一节中，我们将回顾一些 web 动画和过渡的基础知识，并提供一些资源链接以进行进一步的研究。如果你已经熟悉 web 动画，并且了解这些原理如何与 Vue 的某些指令配合使用，可以跳过这一节。对于希望在开始学习之前进一步了解网络动画基础知识的其他人，请继续阅读。

## 基于 class 的动画和过渡

尽管 `<transition>` 组件对于组件的进入和离开非常有用，但你也可以通过添加一个条件 class 来激活动画，而无需挂载组件。

```html
<div id="demo">
  Push this button to do something you shouldn't be doing:<br />

  <div :class="{ shake: noActivated }">
    <button @click="noActivated = true">Click me</button>
    <span v-if="noActivated">Oh no!</span>
  </div>
</div>
```

```css
.shake {
  animation: shake 0.82s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
  transform: translate3d(0, 0, 0);
  backface-visibility: hidden;
  perspective: 1000px;
}

@keyframes shake {
  10%,
  90% {
    transform: translate3d(-1px, 0, 0);
  }

  20%,
  80% {
    transform: translate3d(2px, 0, 0);
  }

  30%,
  50%,
  70% {
    transform: translate3d(-4px, 0, 0);
  }

  40%,
  60% {
    transform: translate3d(4px, 0, 0);
  }
}
```

```js
const Demo = {
  data() {
    return {
      noActivated: false
    }
  }
}

Vue.createApp(Demo).mount('#demo')
```

<common-codepen-snippet title="Create animation with a class" slug="ff45b91caf7a98c8c9077ad8ab539260" tab="css,result" :editable="false" :preview="false" />

## 过渡与 Style 绑定

一些过渡效果可以通过插值的方式来实现，例如在发生交互时将样式绑定到元素上。以这个例子为例：

```html
<div id="demo">
  <div
    @mousemove="xCoordinate"
    :style="{ backgroundColor: `hsl(${x}, 80%, 50%)` }"
    class="movearea"
  >
    <h3>Move your mouse across the screen...</h3>
    <p>x: {{x}}</p>
  </div>
</div>
```

```css
.movearea {
  transition: 0.2s background-color ease;
}
```

```js
const Demo = {
  data() {
    return {
      x: 0
    }
  },
  methods: {
    xCoordinate(e) {
      this.x = e.clientX
    }
  }
}

Vue.createApp(Demo).mount('#demo')
```

<common-codepen-snippet title="Interpolation with style bindings" slug="JjGezQY" :editable="false" />

在这个例子中，我们是通过使用插值来创建动画，将触发条件添加到鼠标的移动过程上。同时将 CSS 过渡属性应用在元素上，让元素知道在更新时要使用什么过渡效果。

## 性能

你可能注意到上面显示的动画使用了 `transforms` 之类的东西，并应用了诸如 `perspective` 之类的奇怪的 property——为什么它们是这样实现的，而不是仅仅使用 `margin` 和 `top` 等？

我们可以通过对性能的了解，在 web 上创建极其流畅的动画。我们希望尽可能对元素动画进行硬件加速，并使用不触发重绘的 property。我们来介绍一下如何实现这个目标。

### Transform 和 Opacity

我们可以通过工具，例如 [CSS Triggers](https://csstriggers.com/) 来查看哪些属性会在动画时触发重绘。在工具中，查看 `transform` 的相关内容，你将看到：

> 非常好的是，更改 transform 不会触发任何几何形状变化或绘制。这意味着该操作可能是由合成器线程在 GPU 的帮助下执行。

`opacity` 属性的行为也类似。因此，他们是在 web 上做元素移动的理想选择。

### 硬件加速

诸如 `perspective`、`backface-visibility` 和 `transform:translateZ(x)` 等 property 将让浏览器知道你需要硬件加速。

如果要对一个元素进行硬件加速，可以应用以下任何一个 property (并不是需要全部，任意一个就可以)：

```css
perspective: 1000px;
backface-visibility: hidden;
transform: translateZ(0);
```

许多像 GreenSock 这样的 JS 库都会默认你需要硬件加速，并在默认情况下应用，所以你不需要手动设置它们。

## Timing

对于简单 UI 过渡，即从一个状态到另一个没有中间状态的状态，通常使用 0.1s 到 0.4s 之间的计时，大多数人发现 *0.25s* 是一个最佳选择。你能用这个定时做任何事情吗？并不是。如果你有一些元素需要移动更大的距离，或者有更多的步骤或状态变化，0.25s 并不会有很好的效果，你将不得不有更多的目的性，而且定时也需要更加独特。但这并不意味着你不能在应用中重复使用效果好的默认值。

你也可能会发现，起始动画比结束动画的时间稍长一些，看起来会更好一些。用户通常是在动画开始时被引导的，而在动画结束时没有那么多耐心，因为他们想继续他们的动作。

## Easing

Easing 是在动画中表达深度的一个重要方式。动画新手最常犯的一个错误是在起始动画节点使用 `ease-in`，在结束动画节点使用 `ease-out`。实际上你需要的是反过来的。

如果我们将这些状态应用于过渡，它应该像这样：

```css
.button {
  background: #1b8f5a;
  /* 应用于初始状态，因此此转换将应用于返回状态 */
  transition: background 0.25s ease-in;
}

.button:hover {
  background: #3eaf7c;
  /* 应用于悬停状态，因此在触发悬停时将应用此过渡 */
  transition: background 0.35s ease-out;
}
```

<common-codepen-snippet title="Transition Ease Example" slug="996a9665131e7902327d350ca8a655ac" tab="css,result" :editable="false" :preview="false" />

Easing 也可以表达动画元素的质量。以下面的 Pen 为例，你认为哪个球是硬的，哪个球是软的？

<common-codepen-snippet title="Bouncing Ball Demo" slug="wvgqyyW" :height="500" :editable="false" />

你可以通过调整你的 Easing 来获得很多独特的效果，使你的动画非常时尚。CSS 允许你通过调整 cubic bezier 属性来修改 Easing，Lea Verou 开发的[这个 playground](https://cubic-bezier.com/#.17,.67,.83,.67) 对探索这个问题非常有帮助。

虽然使用 cubic-bezier ease 提供的两个控制柄可以为简单的动画获得很好的效果，但是 JavaScript 允许多个控制柄，以此支持更多的变化。

![Ease 比较](/images/css-vs-js-ease.svg)

以弹跳为例。在 CSS 中，我们必须声明向上和向下的每个关键帧。在 JavaScript 中，我们可以通过在 [greensock API(GSAP)](https://greensock.com/) 中声明 `bounce` 来描述 ease 中所有这些移动 (其他 JS 库有其他类型的 easing 默认值)。

这里是 CSS 中用来实现 bounce 的代码 (来自 animate.css 的例子)：

```css
@keyframes bounceInDown {
  from,
  60%,
  75%,
  90%,
  to {
    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
  }

  0% {
    opacity: 0;
    transform: translate3d(0, -3000px, 0) scaleY(3);
  }

  60% {
    opacity: 1;
    transform: translate3d(0, 25px, 0) scaleY(0.9);
  }

  75% {
    transform: translate3d(0, -10px, 0) scaleY(0.95);
  }

  90% {
    transform: translate3d(0, 5px, 0) scaleY(0.985);
  }

  to {
    transform: translate3d(0, 0, 0);
  }
}

.bounceInDown {
  animation-name: bounceInDown;
}
```

下面是 JS 中使用 GreenSock 实现相同的 bounce：

```js
gsap.from(element, { duration: 1, ease: 'bounce.out', y: -500 })
```

我们将在之后章节的部分示例中使用 GreenSock。他们有一个很棒的 [ease visualizer](https://greensock.com/ease-visualizer)，帮助你建立精心制作的画架。

## 进一步阅读

- [界面动画设计：通过 Val Head 动画改善用户体验](https://www.amazon.com/dp/B01J4NKSZA/)
- [Animation at Work 作者：Rachel Nabors](https://abookapart.com/products/animation-at-work)
