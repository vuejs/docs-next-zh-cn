# 安全

## 报告漏洞

如果有漏洞被报告，那么它将立刻成为我们最关心的问题，全职贡献者会放下一切来处理它。如需报告漏洞，请发送电子邮件至 [security@vuejs.org](mailto:security@vuejs.org)。

虽然很少发现有新的漏洞，但我们也建议始终使用最新版本的 Vue 及其官方配套库，以确保你的应用尽可能地安全。

## 首要规则：永远不要使用不受信任的模板

使用 Vue 时最基本的安全规则是**永远不要使用不受信任的内容作为组件模板**。这样做相当于允许在你的应用程序中执行任意 JavaScript。更糟糕的是，如果在服务器端渲染时执行了这些代码，可能会导致服务器漏洞被恶意利用。例如：

```js
Vue.createApp({
  template: `<div>` + userProvidedString + `</div>` // 永远不要这么做
}).mount('#app')
```

Vue 模板会被编译成 JavaScript，模板内的表达式将作为渲染过程的一部分执行。尽管表达式会针对特定的渲染场景进行评估，但由于潜在全局执行环境的复杂性，要求 Vue 这样的框架完全屏蔽潜在的恶意代码执行而不产生不切实际的性能开销非常不切实际。完全避免此类问题的最直接方法是确保 Vue 模板的内容始终受你信任并完全由你控制。

## Vue 如何保护你

### HTML 内容

无论是使用模板还是渲染函数，内容都会自动转义。因此在这个模板中：

```html
<h1>{{ userProvidedString }}</h1>
```

如果 `userProvidedString` 包含：

```js
'<script>alert("hi")</script>'
```

那么它将被转义为以下 HTML：

```html
&lt;script&gt;alert(&quot;hi&quot;)&lt;/script&gt;
```

从而防止脚本注入。这种转义是使用原生浏览器 API (例如 `textContent`) 完成的，因此只有当浏览器本身易受攻击时才会存在漏洞。

### attribute 绑定

同样，动态 attribute 绑定也会自动转义。因此在这个模板中：

```html
<h1 :title="userProvidedString">
  hello
</h1>
```

如果 `userProvidedString` 包含：

```js
'" onclick="alert(\'hi\')'
```

那么它将被转义为以下 HTML：

```html
&quot; onclick=&quot;alert('hi')
```

从而防止 `title` attribute 被提前关闭以注入新的、任意的 HTML。这种转义是使用原生浏览器 API (例如 `setAttribute`) 完成的，因此只有当浏览器本身易受攻击时才会存在漏洞。

## 潜在的安全隐患

在任何 Web 应用程序中，允许以 HTML、CSS 或 JavaScript 形式执行未经处理的、用户提供的内容都有潜在的安全隐患，因此应尽可能避免。不过有些时候部分风险或许是可以接受的。

例如，CodePen 和 JSFiddle 之类的服务允许执行用户提供的内容，但这是在预期的上下文中，并且使用了 iframe 包裹来进行一定程度的沙盒处理。如果某个重要功能本质上需要某种程度的漏洞，则由你的团队根据漏洞导致的最坏情况来权衡该功能的重要性。

### 注入 HTML

正如你之前所看到的，Vue 会自动转义 HTML 内容，防止你意外地将可执行的 HTML 注入到你的应用程序中。但是，如果你确信某个 HTML 是安全的，你可以显式呈现 HTML 内容：

- 使用模板：

  ```html
  <div v-html="userProvidedHtml"></div>
  ```

- 使用渲染函数：

  ```js
  h('div', {
    innerHTML: this.userProvidedHtml
  })
  ```

- 在 JSX 中使用渲染函数：

  ```jsx
  <div innerHTML={this.userProvidedHtml}></div>
  ```

:::tip
请注意，永远不要 100% 信任用户提供的 HTML，除非它位于 iframe 沙盒中，或位于仅有编写该 HTML 的用户才能接触到它的部分中。此外，允许用户编写自己的 Vue 模板也会带来类似的危险。
:::

### 注入 URL

在这样的 URL 中：

```html
<a :href="userProvidedUrl">
  click me
</a>
```

如果 URL 未经过“净化”处理来防止其通过 `javascript:` 执行 JavaScript，则会有潜在的安全隐患。有一些库例如 [sanitize-url](https://www.npmjs.com/package/@braintree/sanitize-url) 可以帮助解决这个问题，但请注意：

:::tip
如果你只在前端进行 URL 净化，那么你已经遇到了安全问题。在保存用户提供的 URL 到数据库之前，你的后端必须对其进行净化。只有这么做，才能避免 *每个* 连接到你 API 的客户端 (包括原生移动应用程序) 出现此类问题。另请注意，即便使用了经过净化的 URL，Vue 也无法保证它们指向安全的目标。
:::

### 注入样式

考虑下列示例：

```html
<a
  :href="sanitizedUrl"
  :style="userProvidedStyles"
>
  click me
</a>
```

我们假设它已经被 `sanitizedUrl` 净化过了，因此它确实是一个真实的 URL 而非 JavaScript。然而，恶意用户仍然可以利用 `userProvidedStyles`，通过提供 CSS 来实现“点击劫持 (click jack)”，例如将链接样式设置为“登录”按钮上方的透明框。假设 `https://user-controlled-website.com/` 是用来为你的应用程序提供类似于登录界面功能的，那么他们可能刚刚捕获了用户的真实登录信息。

你或许能想象到了允许用户为某个 `<style>` 元素提供内容会产生多大的安全漏洞，因为这意味着用户拥有了整个页面样式的完整控制权。这也是为什么 Vue 会阻止在模板中渲染样式标签，比如：

```html
<style>{{ userProvidedStyles }}</style>
```

为了让你的用户完全免受点击劫持，我们建议只允许用户完全控制 iframe 沙盒内的 CSS。或者，如果需要通过样式绑定来允许用户控制样式，我们建议使用它的[对象语法](class-and-style.html#对象语法-2)，并且只允许用户为可以被安全控制的特定 property 提供值，如下所示：

```html
<a
  :href="sanitizedUrl"
  :style="{
    color: userProvidedColor,
    background: userProvidedBackground
  }"
>
  click me
</a>
```

### 注入 JavaScript

我们强烈建议不要使用 Vue 渲染 `<script>` 元素，因为这么做的话模板和渲染函数不会有副作用。不过，如果你想在运行时引入会被作为 JavaScript 处理的字符串，还有别的办法。

每个 HTML 元素都有能接受 JavaScript 字符串的 attribute，如 `onclick`，`onfocus` 和 `onmouseenter`。你应当避免将用户提供的 JavaScript 绑定到任一事件 attribute，因为这会是一个潜在的安全隐患。

:::tip
请注意，永远不要 100% 信任用户提供的 JavaScript，除非它位于 iframe 沙盒中，或位于仅有编写该 HTML 的用户才能接触到它的部分中。
:::

有时我们会收到有关如何在 Vue 模板中执行跨站点脚本 (XSS) 的漏洞报告。一般来说，我们不认为这种情况是真正的漏洞，因为在下列两种允许 XSS 情况中，我们没有切实可行的方法来保护开发者免受其影响：

1. 开发者明确要求 Vue 将用户提供的、未经净化的内容作为 Vue 模板渲染。这根本就是不安全的，并且 Vue 无法知道这些内容的来源。

2. 开发者正在将 Vue 挂载到整个 HTML 页面，而该页面恰好同时包含服务器渲染的和用户提供的内容。这与 \#1 的问题基本相同，但有时开发者可能会没有意识到这一点。这可能会导致出现潜在漏洞，攻击者也许会提供作为纯 HTML 安全但作为 Vue 模板不安全的 HTML 内容。

## 最佳实践

通常来说，如果你允许执行未经净化的、用户提供的内容 (作为 HTML、JavaScript 甚至 CSS)，你可能会面临攻击。无论是使用 Vue、其他框架，或是不使用框架，这些建议都是适用的。

除了上面提到的针对[潜在的安全隐患](#潜在的安全隐患)提出的建议之外，我们还建议你熟悉以下资源：

- [HTML5 安全备忘录](https://html5sec.org/)
- [OWASP 的跨站攻击脚本 (XSS) 防御备忘录](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)

如果你使用了第三方组件或是会影响 DOM 渲染的第三方依赖，请使用你学到的知识检查它们的源代码以便找出潜在的危险。

## 后端协调

HTTP 安全漏洞主要由后端负责处理，例如跨站点请求伪造 (CSRF/XSRF) 和跨站点脚本包含 (XSSI)，因此这不是 Vue 应该考虑的问题。不过，我们非常建议你去和后端团队交流以了解如何最好地与他们的 API 交互，例如通过提交表单提交的 CSRF 令牌。

## 服务器端渲染 (SSR)

使用 SSR 时还有一些额外的安全问题，因此请确保遵循我们在 [SSR 文档](ssr/introduction.html)中概述的最佳实践以避免漏洞。