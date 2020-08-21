# 过渡 & 动画概述

Vue 提供了一些抽象，可以帮助处理过渡和动画，特别是在对变化的响应中。其中一些摘要包括：

- 在 CSS 和 JS 中，使用内置的 `<transition>` 组件来钩住进入和离开 DOM 的组件。
- 过渡模式，以便你可以在过渡期间协调顺序。
- 钩子用于多个元素更新到位时，使用 `transition group>` 组件中，在 FLIP 技术下使用钩子以提高性能。
- 使用 `watchers` 过渡应用程序中的不同状态。

我们将在本指南接下来的三个部分中介绍所有这些以及更多内容。然而，除了这些有用的 API 之外，值得一提的是，对于更简单的用例，我们前面介绍的 class 和 style 声明也可以用于应用动画和 transtion。

在下一节中，我们将回顾一些 web 动画和过渡的基础知识，并链接到一些资源以进行进一步的研究。如果你已经熟悉 web 动画，以及这些原则如何与 Vue 的某些指令配合使用，请跳过下一节。如果其他人想在深入了解网络动画基础知识之前，继续阅读。

## 基于 class 的动画和过渡

尽管 `<transition>` 组件对于组件的进入和离开非常有用，但是你也可以通过添加一个条件 class 来激活动画，而无需挂载组件。

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

<p class="codepen" data-height="300" data-theme-id="39028" data-default-tab="css,result" data-user="Vue" data-slug-hash="ff45b91caf7a98c8c9077ad8ab539260" style="height: 300px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="Create animation with a class">
  <span>See the Pen <a href="https://codepen.io/team/Vue/pen/ff45b91caf7a98c8c9077ad8ab539260">
  Create animation with a class</a> by Vue (<a href="https://codepen.io/Vue">@Vue</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

## 过渡与 Style 绑定

一些过渡影响可以通过插值来应用，例如在交互发生时将样式绑定到元素。以这个例子为例：

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

<p class="codepen" data-height="300" data-theme-id="39028" data-default-tab="result" data-user="Vue" data-slug-hash="JjGezQY" data-preview="true" style="height: 300px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="Interpolation with style bindings">
  <span>See the Pen <a href="https://codepen.io/team/Vue/pen/JjGezQY">
  Interpolation with style bindings</a> by Vue (<a href="https://codepen.io/Vue">@Vue</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

在这个例子中，我们通过使用插值来创建动画，附加到鼠标的移动上。CSS 过渡也应用于元素，让元素知道在更新时要使用什么 easing。

## 性能

你可能注意到上面显示的动画使用了 `transforms` 之类的东西，并应用了诸如 `perspective` 之类的奇怪属性——为什么它们是这样构建的，而不是仅仅使用 `margin` 和 `TOP` 等？

通过对性能的了解，我们可以在网络上创建非常流畅的动画。我们希望尽可能用硬件加速元素，并使用不触发重绘的属性。让我们来回顾一下我们如何做到这一点。

### Transform 和 Opacity


我们可以检查资源，比如 [CSS Triggers](https://csstriggers.com/) 以查看如果我们设置了动画，哪些属性将触发重绘。在这里，如果你在 `transform` 下查看，你将看到：

> 更改 transform 不会触发任何几何体更改或绘制，这非常好。这意味着该操作可以由合成器线程在 GPU 的帮助下执行。

不透明度的行为类似。因此，他们是网络运动的理想人选。

### 硬件加速

诸如 `perspective`、`backface visibility` 和 `transform:translateZ(x)` 等 property 将允许浏览器知道你需要硬件加速。

如果要对元素进行硬件加速，可以应用以下任何 property (并不是都必需，仅一个)：

```css
perspective: 1000px;
backface-visibility: hidden;
transform: translateZ(0);
```

许多像 GreenSock 这样的 JS 库都会假设你需要硬件加速，并在默认情况下应用它们，所以你不需要手动设置它们。

## Timing

对于简单的 UI 转换，即从一个状态到另一个没有中间状态的状态，通常使用 0.1s 到 0.4s 之间的计时，大多数人发现 0.25s 是一个最佳选择。你能用这个时间做任何事情吗？不，不是。如果你有一些东西需要移动更大的距离，或者有更多的步骤或状态变化，0.25s 是不起作用的，你必须要有更多的目的性，而且时间需要更加独特。但这并不意味着你不能在应用程序中重复使用好的默认值。

你也可能会发现入口看起来比出口的时间稍微长一些。用户通常是在入口时被引导的，而在出口时耐心一点，因为他们想继续前进。

## Easing

Easing 是在动画中传达深度的重要方式。动画新手最常犯的一个错误是在入口使用 `ease-in`，在出口使用 `ease out`。你实际上需要的是反过来。

如果我们将这些状态应用于过渡，它会看起来像这样：

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

<p class="codepen" data-height="300" data-theme-id="39028" data-default-tab="css,result" data-user="Vue" data-slug-hash="996a9665131e7902327d350ca8a655ac" style="height: 300px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="Transition Ease Example">
  <span>See the Pen <a href="https://codepen.io/team/Vue/pen/996a9665131e7902327d350ca8a655ac">
  Transition Ease Example</a> by Vue (<a href="https://codepen.io/Vue">@Vue</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

Easing 也可以传达动画素材的质量。以下面的 Pen 为例，你认为哪个球硬而哪个软？

<p class="codepen" data-height="500" data-theme-id="39028" data-default-tab="result" data-user="sdras" data-slug-hash="zxJWBJ" data-preview="true" style="height: 300px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="Bouncing Ball Demo">
  <span>See the Pen <a href="https://codepen.io/sdras/pen/zxJWBJ">
  Bouncing Ball Demo</a> by Sarah Drasner (<a href="https://codepen.io/sdras">@sdras</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

你可以得到很多独特的效果，并使你的动画非常时尚，通过调整你的放松。CSS 允许你通过调整立方 bezier 属性来修改它，Lea Verou 的[这个 playground](https://cubic-bezier.com/#.17,.67,.83,.67) 对探索这一点非常有帮助。

虽然使用 cubic-bezier ease 提供的两个控制柄可以为简单的动画获得很好的效果，但是 JavaScript 允许多个控制柄，因此允许更多的变化。

![Ease 比较](/images/css-vs-js-ease.svg)

比如说弹跳。在 CSS 中，我们必须向上和向下声明每个关键帧。在 JavaScript 中，我们可以通过在 [greensock API(GSAP)](https://greensock.com/) 中声明 `bounce` 来在 ease 中表达所有这些移动 (其他 JS 库有其他类型的 easing 默认值)。

这里使用的是 CSS 中的 bounce (例如 animate.css)：

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

下面是 JS 中使用 GreenSock 的相同弹跳：

```js
gsap.from(element, { duration: 1, ease: 'bounce.out', y: -500 })
```

我们将在以下部分的一些示例中使用 GreenSock。他们有一个很棒的 [ease visualizer](https://greensock.com/ease-visualizer)，将帮助你建立精心制作的画架。

## 进一步阅读

- [动画设计接口：通过 Val Head 动画改善用户体验](https://www.amazon.com/dp/B01J4NKSZA/)
- [Rachel Nabors 动画作品](https://abookapart.com/products/animation-at-work)
