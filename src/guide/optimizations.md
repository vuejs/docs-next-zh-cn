# 渲染机制和优化

> 如果你仅仅想了解如何很好的使用 Vue，那么你不必阅读此页面。但如果你好奇框架底层的渲染工作是如何进行的，那么你可以阅读本页面从而获取更多的信息。

## 虚拟 DOM

现在我们知道了侦听器是如何更新组件的，你可能会问这些更改最终是如何应用到 DOM 中的！也许你以前听说过虚拟 DOM，包括 Vue 在内的许多框架都使用这种范式来确保界面能够有效地反映我们在 JavaScript 中更新的更改

<div class="reactivecontent">
  <common-codepen-snippet title="How does the Virtual DOM work?" slug="KKNJKbw" tab="result" theme="light" :height="500" :editable="false" :preview="false" />
</div>

我们用 JavaScript 生成名为 Virtual Dom 的 DOM 副本，这样做的原因是用 JavaScript 直接操作 DOM 的计算成本很高。虽然用 JavaScript 执行更新很快，但是找到所需的 DOM 节点并用 JavaScript 更新它们的成本却很高。所以我们批量处理调用，并一次性更改 DOM。

虚拟 DOM 是轻量级的 JavaScript 对象，由渲染函数创建。它包含三个参数：元素，具有数据、prop、attr 等的对象，以及一个数组。数组是我们传递子级的地方，子级也具有所有这些参数，然后它们也可以具有子级，依此类推，直到我们构建完整的元素树为止。

如果需要更新列表项，我们可以借助前面提到的响应性在 JavaScript 中进行。我们将更改应用至 JavaScript 副本、虚拟 DOM 中，然后在它们和实际 DOM 之间执行 diff。只有这样，我们才能对已更改的内容进行更新。虚拟 DOM 允许我们对 UI 进行高效的更新！
