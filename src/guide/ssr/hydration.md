# 客户端 Hydration

Hydration 是在 Vue 在获取静态 HTML，从服务端发出，然后转化为可反应客户端数据变化的动态 DOM 的过程中被引入到客户端的。

在 `entry-client.js` 中，我们通过这行代码简单的挂载应用：

```js
app.mount('#app')
```

因为服务端已经渲染出了标记，我们显然不希望将其扔掉并重新创建所有的 DOM 元素。取而代之的是我们想要“hydrate”这些静态标记并使其变得可交互。

Vue 提供了一个 `createSSRApp` 方法用来在客户端代码中 (在这个例子中是 `entry-client.js`) 告诉 Vue hydrate 现有的静态 HTML 而不是重新创建所有的 DOM 元素。

### Hydration 警告

Vue 会断言客户端生成的虚拟 DOM 树匹配从服务器渲染出来的 DOM 结构。如果不匹配，则它会逃过 hydration 的过程，抛弃已生成的 DOM 并从头开始渲染。这会在浏览器控制台产生一个警告，但是网站还会正常工作。

确保 SSR 工作的第一个关键是确保应用在客户端和服务端的状态一致。密切留意不要依赖浏览器特有的 API (如窗口宽度、设备能力或 localStorage) 或服务器特有的 API (如 Node 内置的)，且留意在不同环境下输出不同结果的代码 (诸如时区、时间戳、规范化 URL 或生成随机数字)。详情参见[编写通用的代码](./universal.md)。

第二个关键是留意 SSR + 客户端 hydration 时 HTML 的有效性会因浏览器不同而不同。例如在 Vue 模板中编写：

```html
<table>
  <tr>
    <td>hi</td>
  </tr>
</table>
```

浏览器会在 `<table>` 内自动注入 `<tbody>`，然而通过 Vue 生成的虚拟 DOM 并不会包含 `<tbody>`，因此会导致不匹配。为了确保匹配正确，请确保模板中编写的 HTML 是有效的。

你可以考虑在模板的研发过程中使用诸如 [W3C Markup Validation Service](https://validator.w3.org/) 或 [HTML-validate](https://html-validate.org/) 的 HTML 验证器。
