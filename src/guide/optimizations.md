# 渲染机制和优化

> 为了学习如何更好地使用 Vue，不需要阅读本页，但是它提供了更多信息，如果你想知道渲染在背后是如何工作的。

## 虚拟 DOM

现在我们知道了侦听器是如何更新组件的，你可能会问这些更改最终是如何应用到 DOM 中的！也许你以前听说过虚拟 DOM，包括 Vue 在内的许多框架都使用这种方式来确保我们的接口能够有效地反映我们在 JavaScript 中更新的更改

<div class="reactivecontent">
  <iframe height="500" style="width: 100%;" scrolling="no" title="How does the Virtual DOM work?" src="https://codepen.io/sdras/embed/RwwQapa?height=500&theme-id=light&default-tab=result" frameborder="no" allowtransparency="true" allowfullscreen="true">
    See the Pen <a href='https://codepen.io/sdras/pen/RwwQapa'>How does the Virtual DOM work?</a> by Sarah Drasner
    (<a href='https://codepen.io/sdras'>@sdras</a>) on <a href='https://codepen.io'>CodePen</a>.
  </iframe>
</div>

我们用 JavaScript 复制了一个名为 Virtual Dom 的 DOM，我们这样做是因为用 JavaScript 接触 DOM 的计算成本很高。虽然用 JavaScript 执行更新很廉价，但是找到所需的 DOM 节点并用 JS 更新它们的成本很高。所以我们批处理调用，同时更改 DOM。

虚拟 DOM 是轻量级的 JavaScript 对象，由渲染函数创建。它包含三个参数：元素，带有数据的对象，prop，attr 以及更多，和一个数组。数组是我们传递子级的地方，子级也具有所有这些参数，然后它们可以具有子级，依此类推，直到我们构建完整的元素树为止。

如果需要更新列表项，可以使用前面提到的响应式在 JavaScript 中进行。然后，我们对 JavaScript 副本，虚拟 DOM 进行所有更改，并在此与实际 DOM 之间进行区分。只有这样，我们才能对已更改的内容进行更新。虚拟 DOM 允许我们对 UI 进行高效的更新！
