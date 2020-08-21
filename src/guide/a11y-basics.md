# 基础

Web可访问性（也称为a11y）是指创建可供任何人使用的网站的做法，无论是残疾人、连接缓慢、过时或损坏的硬件，还是仅仅是处于不利环境中的人。例如，在视频中添加字幕可以帮助聋哑人和重听人的用户以及在嘈杂的环境中听不到手机的用户。同样，确保你的文字对比度不是太低，这对你的低视力用户和那些试图在阳光下使用手机的用户都有帮助。


准备好出发了，但不确定在哪里？

看看 由 [World Wide Web Consortium (W3C)](https://www.w3.org/) 提供的 [规划和管理web辅助功能指南](https://www.w3.org/WAI/planning-and-managing/)

## 跳过链接

你应该在每个页面的顶部添加一个直接指向主内容区域的链接，这样用户就可以跳过在多个网页上重复的内容。

通常在`App.vue`因为它将是所有页面上的第一个可聚焦元素：

``` html
<ul class="skip-links">
  <li>
    <a href="#main" ref="skipLink">Skip to main content</a>
  </li>
</ul>
```

若要隐藏链接，除非它是焦点，可以添加以下样式：

``` css
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

一旦用户改变路由，将焦点放回跳过链接。这可以通过调用上述 `ref` 来实现：

``` vue
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

<p class="codepen" data-height="350" data-theme-id="light" data-default-tab="js,result" data-user="mlama007" data-slug-hash="VwepxJa" style="height: 350px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="Skip to Main">
  <span>See the Pen <a href="https://codepen.io/mlama007/pen/VwepxJa">
  Skip to Main</a> by Maria (<a href="https://codepen.io/mlama007">@mlama007</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

[Read documentation on skip link to main content](https://www.w3.org/WAI/WCAG21/Techniques/general/G1.html)

## 组织你的内容

可访问性最重要的部分之一是确保设计可以支持可访问的实现。设计不仅要考虑颜色对比、字体选择、文本大小和语言，还要考虑应用程序中内容的结构。

### 标题

用户可以通过标题导航应用程序。为应用程序的每个部分设置描述性标题可以让用户更容易地预测每个部分的内容。说到标题，有两个推荐的可访问性实践：

- 按排名顺序嵌套标题: `<h1>` - `<h6>`
- 不要跳过section中的标题
- 使用实际的标题标记，而不是样式文本，以提供标题的视觉外观

[阅读更多关于标题](https://www.w3.org/TR/UNDERSTANDING-WCAG20/navigation-mechanisms-descriptive.html)

```html
<main role="main" aria-labelledby="main-title">
  <h1 id="main-title">Main title</h1>
  <section aria-labelledby="section-title">
    <h2 id="section-title"> Section Title </h2>
    <h3>Section Subtitle</h3>
    <!-- Content -->
  </section>
  <section aria-labelledby="section-title">
    <h2 id="section-title"> Section Title </h2>
    <h3>Section Subtitle</h3>
    <!-- Content -->
    <h3>Section Subtitle</h3>
    <!-- Content -->
  </section>
</main>
```

### 地标

地标提供对应用程序中的部分的编程访问。依赖辅助技术的用户可以导航到应用程序的每个部分并跳过内容。你可以使用[ARIA roles](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles)帮助你实现这个目标。

| HTML            | ARIA Role                                                         | Landmark Purpose                                                                       |
| --------------- | ----------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| header          | role="banner"                                                     | Prime heading: title of the page                                                       |
| nav             | role="navigation"                                                 | Collection of links suitable for use when navigating the document or related documents |
| main            | role="main"                                                       | The main or central content of the document.                                           |
| footer          | role="contentinfo"                                                | Information about the parent document: footnotes/copyrights/links to privacy statement |
| aside           | role="complementary"                                              | Supports the main content, yet is separate and meaningful on its own content           |
| _Not available_ | role="search"                                                     | This section contains the search functionality for the application                     |
| form            | role="form"                                                       | Collection of form-associated elements                                                 |
| section         | role="region"  | Content that is relevant and that users will likely want to navigate to. Label must be provided for this element                          |

:::tip Tip:
建议使用带有冗余地标 role属性的地标 HTML元素，以便最大限度地与传统[不支持HTML5语义元素的浏览器](https://caniuse.com/#feat=html5semantic)兼容。
:::

[阅读更多关于地标](https://www.w3.org/TR/wai-aria-1.2/#landmark_roles)
