# 基础

Web 可访问性 (也称为 a11y) 是指创建可供任何人使用的网站的实践方式——无论是身患某种障碍、通过慢速的网络连接访问、使用老旧或损坏的硬件，还是仅仅是处于不利环境中的人。例如，在视频中添加字幕可以帮助失聪、有听力障碍或身处嘈杂环境而听不到手机的用户。同样，请确保文字对比度不要太低，这对低视力用户和那些试图在强光下使用手机的用户都有帮助。

你是否已经准备开始却又无从下手？

可以先看看由[万维网联盟 (W3C)](https://www.w3.org/) 提供的[规划和管理 web 可访问性](https://www.w3.org/WAI/planning-and-managing/)。

## 跳过链接

你应该在每个页面的顶部添加一个直接指向主内容区域的链接，这样用户就可以跳过在多个网页上重复的内容。

通常这个链接会放在 `App.vue` 的顶部，这样它就会是所有页面上的第一个可聚焦元素：

```html
<ul class="skip-links">
  <li>
    <a href="#main" ref="skipLink">跳到主内容</a>
  </li>
</ul>
```

若想在非聚焦状态下隐藏该链接，可以添加以下样式：

```css
.skipLink {
  white-space: nowrap;
  margin: 1em auto;
  top: 0;
  position: fixed;
  left: 50%;
  margin-left: -72px;
  opacity: 0;
}
.skipLink:focus {
  opacity: 1;
  background-color: white;
  padding: .5em;
  border: 1px solid black;
}
```

一旦用户改变路由，请将焦点放回到这个跳过链接。通过用如下方式聚焦 `ref` 即可实现：

```vue
<script>
export default {
  watch: {
    $route() {
      this.$refs.skipLink.focus();
    }
  }
};
</script>
```

<common-codepen-snippet title="Skip to Main" slug="GRrvQJa" :height="350" tab="js,result" theme="light" :preview="false" :editable="false" />

[阅读关于跳过链接到主要内容的文档](https://www.w3.org/WAI/WCAG21/Techniques/general/G1.html)

## 组织内容

可访问性最重要的部分之一是确保设计可以支持易于访问的实现。设计不仅要考虑颜色对比度、字体选择、文本大小和语言，还要考虑应用程序中的内容是如何组织的。

### 标题

用户可以通过标题在应用程序中进行导航。为应用程序的每个部分设置描述性标题，这可以让用户更容易地预测每个部分的内容。说到标题，有几个推荐的可访问性实践：

- 按级别顺序嵌套标题：`<h1>` - `<h6>`
- 不要在一个章节内跳跃标题的级别
- 使用实际的标题标记，而不是通过对文本设置样式以提供视觉上的标题

[阅读更多有关标题的信息](https://www.w3.org/TR/UNDERSTANDING-WCAG20/navigation-mechanisms-descriptive.html)

```html
<main role="main" aria-labelledby="main-title">
  <h1 id="main-title">Main title</h1>
  <section aria-labelledby="section-title">
    <h2 id="section-title"> Section Title </h2>
    <h3>Section Subtitle</h3>
    <!-- 内容 -->
  </section>
  <section aria-labelledby="section-title">
    <h2 id="section-title"> Section Title </h2>
    <h3>Section Subtitle</h3>
    <!-- 内容 -->
    <h3>Section Subtitle</h3>
    <!-- 内容 -->
  </section>
</main>
```

### 地标

地标 (landmark) 会为应用中的章节提供访问规划。依赖辅助技术的用户可以跳过内容直接导航到应用程序的每个部分。你可以使用 [ARIA role](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles) 帮助你实现这个目标。

| HTML            | ARIA Role            | 地标的目的 |
| --------------- | -------------------- | --------- |
| header          | role="banner"        | 主标题：页面的标题 |
| nav             | role="navigation"    | 适合用作文档或相关文档导航的链接集合 |
| main            | role="main"          | 文档的主体或中心内容 |
| footer          | role="contentinfo"   | 关于父级文档的信息：脚注/版权/隐私声明链接 |
| aside           | role="complementary" | 用来支持主内容，同时其自身的内容是相对独立且有意义的 |
| *无对应元素* | role="search"        | 该章节包含整个应用的搜索功能 |
| form            | role="form"          | 表单相关元素的集合 |
| section         | role="region"        | 相关的且用户可能会导航至此的内容。必须为该元素提供 label |

:::tip Tip：
在使用地标 HTML 元素时，建议加上冗余的地标 role attribute，以最大限度地与传统[不支持 HTML5 语义元素的浏览器](https://caniuse.com/#feat=html5semantic)兼容。
:::

[阅读更多有关地标的信息](https://www.w3.org/TR/wai-aria-1.2/#landmark_roles)
