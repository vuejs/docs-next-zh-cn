# 可编辑的 SVG 图标系统

## 基础示例

创建一套 SVG 图标系统的方法有很多种，但有一种方法可以充分发挥 Vue 的能力，那就是把可编辑的内联图标创建为组件。这种方式有很多优点：

- 图标易于即时编辑
- 图标可以带动画
- 你可以使用标准的 prop 和默认值来使图标保持在一个典型的尺寸或者随时按需修改
- 图标是内联的，因此不需要发送额外的 HTTP 请求
- 图标可以被动态地访问

首先，我们将为所有的图标创建一个文件夹，并将这些图标组件以标准化的方式命名，以方便检索：

- `components/icons/IconBox.vue`
- `components/icons/IconCalendar.vue`
- `components/icons/IconEnvelope.vue`

这里有一个示例存储库，可以帮助你了解完整的配置：[https://github.com/sdras/vue-sample-svg-icons/](https://github.com/sdras/vue-sample-svg-icons/)

![文档网站](https://s3-us-west-2.amazonaws.com/s.cdpn.io/28963/screendocs.jpg '文档演示')

我们将创建一个使用插槽的基础图标组件 (`IconBase.vue`)。

```html
<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    :width="width"
    :height="height"
    viewBox="0 0 18 18"
    :aria-labelledby="iconName"
    role="presentation"
  >
    <title :id="iconName" lang="en">{{ iconName }} icon</title>
    <g :fill="iconColor">
      <slot />
    </g>
  </svg>
</template>
```

你可以原封不动地使用这个基础图标，唯一可能需要更新的东西是 `viewBox`，具体取决于你所使用图标的 `viewBox`。在基础图标里会有 `width`、`height`、`iconColor` 以及 `name` 等 prop，这样就可以通过 prop 对其进行动态更新。这个 `name` 将会同时用在 `<title>` 的内容及其用于提供可访问性的 `id` 上。

我们的脚本如下所示，我们设置了一些默认值，这样在没有特别设置的情况下图标渲染出来是一致的：

```js
export default {
  props: {
    iconName: {
      type: String,
      default: 'box'
    },
    width: {
      type: [Number, String],
      default: 18
    },
    height: {
      type: [Number, String],
      default: 18
    },
    iconColor: {
      type: String,
      default: 'currentColor'
    }
  }
}
```

`currentColor` 会成为 `fill` 的默认值，将使图标继承其周围文字的颜色。我们也可以根据自己所需通过 prop 传递一个不同的色值。

我们可以这样使用它，通过 `IconWrite.vue` 将图标的路径包含于其中，作为其唯一的内容：

```html
<icon-base icon-name="write"><icon-write /></icon-base>
```

现在，如果我们想创建多种尺寸的图标，我们可以非常容易地做到这一点：

```html
<p>
  <!-- 你可以通过 prop 传递一个更小的 `width` 和 `height` -->
  <icon-base width="12" height="12" icon-name="write"><icon-write /></icon-base>
  <!-- 或者你可以使用默认值 (18) -->
  <icon-base icon-name="write"><icon-write /></icon-base>
  <!-- 或者增大一些 :) -->
  <icon-base width="30" height="30" icon-name="write"><icon-write /></icon-base>
</p>
```

<img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/28963/Screen%20Shot%202018-01-01%20at%204.51.40%20PM.png" width="450" />

## 带动画的图标

当你想为图标添加动画，尤其是在一个交互动作的时候，在组件中控制图标是非常方便的。内联 `SVG` 对任意交互方法都提供最高的支持。这里有一个图标点击动画的基本示例：

```html
<template>
  <svg
    @click="startScissors"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 100"
    width="100"
    height="100"
    aria-labelledby="scissors"
    role="presentation"
  >
    <title id="scissors" lang="en">Scissors Animated Icon</title>
    <path id="bk" fill="#fff" d="M0 0h100v100H0z" />
    <g ref="leftscissor">
      <path d="M..." />
      ...
    </g>
    <g ref="rightscissor">
      <path d="M..." />
      ...
    </g>
  </svg>
</template>
```

```js
import { TweenMax, Sine } from 'gsap'

export default {
  methods: {
    startScissors() {
      this.scissorAnim(this.$refs.rightscissor, 30)
      this.scissorAnim(this.$refs.leftscissor, -30)
    },
    scissorAnim(el, rot) {
      TweenMax.to(el, 0.25, {
        rotation: rot,
        repeat: 3,
        yoyo: true,
        svgOrigin: '50 45',
        ease: Sine.easeInOut
      })
    }
  }
}
```

我们通过 `ref` 对需要移动的路径做了分组，因为剪刀的两侧需要同步移动，所以我们创建了一个可以复用的函数，在这个函数中将 `ref` 作为参数传递进去。同时使用 GreenSock 帮助解决跨浏览器的动画支持和 `transform-origin` 问题。

<common-codepen-snippet title="Editable SVG Icon System: Animated icon" slug="dJRpgY" :preview="false" :editable="false" version="2" theme="0" />

相当容易实现！并且易于即时更新。

你可以在这个储存库中看到更多动画示例：[vue-sample-svg-icons](https://github.com/sdras/vue-sample-svg-icons/)

## 注意事项

设计师可能会改变他们的想法。产品需求也可能会变更。将整个图标系统的逻辑保存在单个基础组件中，意味着你可以快速更新所有的图标，并将其应用到整个系统中。即使使用图标加载器，有些情况下也需要你重新创建或编辑每个 SVG 来进行全局更改。这种方法可以为你节省时间，并且可以减少你的痛苦。

## 何时避免使用这种模式

当你的站点中有大量以不同方式使用的图标时，这种类型的 SVG 图标系统非常有用。如果你在一个页面上多次重复使用同一个图标 (例如：每行带有删除图标的巨型表格) 更合理的做法是将所有的图标编译到一张雪碧图中，然后使用 `<use>` 标签来加载它们。

## 其它替代方案

其它帮助管理 SVG 图标的工具还包括：

- [svg-sprite-loader](https://github.com/kisenka/svg-sprite-loader)
- [svgo-loader](https://github.com/rpominov/svgo-loader)

这些工具会在编译时打包 SVG，但是在运行时很难对 SVG 进行编辑，因为 `<use>` 标签在执行复杂操作时可能会有奇怪的跨浏览器问题。同时它们还会给你留下两个嵌套的 `viewBox` 属性，因此会有两个坐标系。这使得实现更加复杂。
