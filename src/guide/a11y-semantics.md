# 语义学

## 表单

当创建一个表单，你可能使用到以下几个元素:  `<form>` 、 `<label>` 、 `<input>` 、  `<textarea>`  和  `<button>`。 

标签通常放置在表单字段的顶部或左侧：

```html
<form action="/dataCollectionLocation" method="post" autocomplete="on">
  <div v-for="item in formItems" :key="item.id" class="form-item">
    <label :for="item.id">{{ item.label }}: </label>
    <input
      :type="item.type"
      :id="item.id"
      :name="item.id"
      v-model="item.value"
    />
  </div>
  <button type="submit">Submit</button>
</form>
```

<p class="codepen" data-height="368" data-theme-id="light" data-default-tab="js,result" data-user="mlama007" data-slug-hash="YzwpPYZ" style="height: 368px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="Simple Form">
  <span>See the Pen <a href="https://codepen.io/mlama007/pen/YzwpPYZ">
  Simple Form</a> by Maria (<a href="https://codepen.io/mlama007">@mlama007</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

注意如何在表单元素中包含 `autocomplete='on'` ，它将应用于表单中的所有输入。你也可以为每个输入设置不同的[自动完成属性的值](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete)。

### 标签

提供标签以描述所有表单控件的用途；链接 `for` 和 `id` ：

```html
<label for="name">Name</label>
<input type="text" name="name" id="name" v-model="name" />
```

<p class="codepen" data-height="265" data-theme-id="light" data-default-tab="js,result" data-user="mlama007" data-slug-hash="wvMrGqz" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="Form Label">
  <span>See the Pen <a href="https://codepen.io/mlama007/pen/wvMrGqz">
  Form Label</a> by Maria (<a href="https://codepen.io/mlama007">@mlama007</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>


如果你在chrome开发工具中检查这个元素，并打开Elements选项卡中的 Accessibility 选项卡，你将看到输入是如何从标签中获取其名称的：

![Chrome开发工具显示可从标签输入的可访问名称](/images/AccessibleLabelChromeDevTools.png)

:::warning 警告:

虽然你可能已经看到这样包装输入字段的标签：

```html
<label>
  Name:
  <input type="text" name="name" id="name" v-model="name" />
</label>
```

辅助技术更好地支持用匹配的id显式设置标签。
:::

#### aria-label

你也可以给输入一个带有[`aria-label`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Techniques/Using_the_aria-label_attribute) 的可访问名称。

```html
<label for="name">Name</label>
<input
  type="text"
  name="name"
  id="name"
  v-model="name"
  :aria-label="nameLabel"
/>
```

<p class="codepen" data-height="265" data-theme-id="light" data-default-tab="js,result" data-user="mlama007" data-slug-hash="jOWGqgz" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="Form ARIA label">
  <span>See the Pen <a href="https://codepen.io/mlama007/pen/jOWGqgz">
  Form ARIA label</a> by Maria (<a href="https://codepen.io/mlama007">@mlama007</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

请随意在Chrome DevTools中检查此元素，以查看可访问名称是如何更改的：

![Chrome Developer Tools showing input accessible name from aria-label](/images/AccessibleARIAlabelDevTools.png)

#### aria-labelledby

使用 [`aria-labelledby`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Techniques/Using_the_aria-labelledby_attribute) 类似于 `aria-label` ，除非标签文本在屏幕上可见。它通过 `id` 与其他元素配对，你可以链接多个 `id` ：

```html
<form
  class="demo"
  action="/dataCollectionLocation"
  method="post"
  autocomplete="on"
>
  <h1 id="billing">Billing</h1>
  <div class="form-item">
    <label for="name">Name:</label>
    <input
      type="text"
      name="name"
      id="name"
      v-model="name"
      aria-labelledby="billing name"
    />
  </div>
  <button type="submit">Submit</button>
</form>
```

<p class="codepen" data-height="265" data-theme-id="light" data-default-tab="js,result" data-user="mlama007" data-slug-hash="ZEQXOLP" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="Form ARIA labelledby">
  <span>See the Pen <a href="https://codepen.io/mlama007/pen/ZEQXOLP">
  Form ARIA labelledby</a> by Maria (<a href="https://codepen.io/mlama007">@mlama007</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

![Chrome Developer Tools showing input accessible name from aria-labelledby](/images/AccessibleARIAlabelledbyDevTools.png)

#### aria-describedby

[aria-describedby](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Techniques/Using_the_aria-describedby_attribute)的用法与 `aria-labelledby`相同，预期提供了用户可能需要的附加信息的描述。这可用于描述任何输入的标准：

```html
<form
  class="demo"
  action="/dataCollectionLocation"
  method="post"
  autocomplete="on"
>
  <h1 id="billing">Billing</h1>
  <div class="form-item">
    <label for="name">Full Name:</label>
    <input
      type="text"
      name="name"
      id="name"
      v-model="name"
      aria-labelledby="billing name"
      aria-describedby="nameDescription"
    />
    <p id="nameDescription">Please provide first and last name.</p>
  </div>
  <button type="submit">Submit</button>
</form>
```

<p class="codepen" data-height="265" data-theme-id="light" data-default-tab="js,result" data-user="mlama007" data-slug-hash="JjGrKyY" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="Form ARIA describedby">
  <span>See the Pen <a href="https://codepen.io/mlama007/pen/JjGrKyY">
  Form ARIA describedby</a> by Maria (<a href="https://codepen.io/mlama007">@mlama007</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

你可以通过使用Chrome开发工具来查看说明：

![Chrome开发工具显示aria-labelledby的输入可访问名称和aria-describedby的描述](/images/AccessibleARIAdescribedby.png)

### 占位符

避免使用占位符，因为它们可能会混淆许多用户。

占位符的一个问题是默认情况下它们不符合 [颜色对比标准](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)；修复颜色对比度会使占位符看起来像输入字段中预填充的数据。查看以下示例，可以看到满足颜色对比度条件的姓氏占位符看起来像预填充的数据：


<p class="codepen" data-height="265" data-theme-id="light" data-default-tab="js,result" data-user="mlama007" data-slug-hash="PoZJzeQ" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="Form Placeholder">
  <span>See the Pen <a href="https://codepen.io/mlama007/pen/PoZJzeQ">
  Form Placeholder</a> by Maria (<a href="https://codepen.io/mlama007">@mlama007</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

最好提供用户在任何输入之外填写表单所需的所有信息。

### 操作指南

为输入字段添加说明时，请确保将其正确链接到输入。你可以提供附加指令并在 [`aria-labelledby`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Techniques/Using_the_aria-labelledby_attribute) 内绑定多个id。这使得设计更加灵活。

```html
<fieldset>
  <legend>Using aria-labelledby</legend>
  <label id="date-label" for="date">Current Date:</label>
  <input
    type="date"
    name="date"
    id="date"
    aria-labelledby="date-label date-instructions"
  />
  <p id="date-instructions">MM/DD/YYYY</p>
</fieldset>
```

或者，你可以用 [`aria-describedby`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Techniques/Using_the_aria-describedby_attribute)将指令附加到输入。

```html
<fieldset>
  <legend>Using aria-describedby</legend>
  <label id="dob" for="dob">Date of Birth:</label>
  <input type="date" name="dob" id="dob" aria-describedby="dob-instructions" />
  <p id="dob-instructions">MM/DD/YYYY</p>
</fieldset>
```

<p class="codepen" data-height="265" data-theme-id="light" data-default-tab="js,result" data-user="mlama007" data-slug-hash="GRoMqYy" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="Form Instructions">
  <span>See the Pen <a href="https://codepen.io/mlama007/pen/GRoMqYy">
  Form Instructions</a> by Maria (<a href="https://codepen.io/mlama007">@mlama007</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

### 隐藏内容

通常不建议直观地隐藏标签，即使输入具有可访问的名称。但是，如果输入的功能可以与周围的内容一起理解，那么我们可以隐藏视觉标签。

让我们看看这个搜索字段：

```html
<form role="search">
  <label for="search" class="hidden-visually">Search: </label>
  <input type="text" name="search" id="search" v-model="search" />
  <button type="submit">Search</button>
</form>
```

我们可以这样做，因为搜索按钮将帮助可视化用户识别输入字段的用途。

我们可以使用CSS直观地隐藏元素，但可以将它们用于辅助技术：
```css
.hidden-visually {
  position: absolute;
  overflow: hidden;
  white-space: nowrap;
  margin: 0;
  padding: 0;
  height: 1px;
  width: 1px;
  clip: rect(0 0 0 0);
  clip-path: inset(100%);
}
```

<p class="codepen" data-height="265" data-theme-id="light" data-default-tab="js,result" data-user="mlama007" data-slug-hash="qBbpQwB" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="Form Search">
  <span>See the Pen <a href="https://codepen.io/mlama007/pen/qBbpQwB">
  Form Search</a> by Maria (<a href="https://codepen.io/mlama007">@mlama007</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

#### aria-hidden="true"

添加 `aria hidden=“true”` 将隐藏辅助技术中的元素，但使其在视觉上对其他用户可用。不要把它用在可聚焦的元素上，纯粹用于装饰性的、复制的或屏幕外的内容上。

```html
<p>This is not hidden from screen readers.</p>
<p aria-hidden="true">This is hidden from screen readers.</p>
```

### 按钮

在表单中使用按钮时，必须设置类型以防止提交表单。

也可以使用输入创建按钮：

```html
<form action="/dataCollectionLocation" method="post" autocomplete="on">
  <!-- Buttons -->
  <button type="button">Cancel</button>
  <button type="submit">Submit</button>

  <!-- Input buttons -->
  <input type="button" value="Cancel" />
  <input type="submit" value="Submit" />
</form>
```

<p class="codepen" data-height="467" data-theme-id="light" data-default-tab="js,result" data-user="mlama007" data-slug-hash="PoZEXoj" style="height: 467px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="Form Buttons">
  <span>See the Pen <a href="https://codepen.io/mlama007/pen/PoZEXoj">
  Form Buttons</a> by Maria (<a href="https://codepen.io/mlama007">@mlama007</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

#### 功能图像

你可以使用此技术创建功能图像。

- Input 字段
  - 这些图像将作为表单上的提交类型按钮
  
  ```html
  <form role="search">
    <label for="search" class="hidden-visually">Search: </label>
    <input type="text" name="search" id="search" v-model="search" />
    <input
      type="image"
      class="btnImg"
      src="https://img.icons8.com/search"
      alt="Search"
    />
  </form>
  ```

- 图标
  
```html
<form role="search">
  <label for="searchIcon" class="hidden-visually">Search: </label>
  <input type="text" name="searchIcon" id="searchIcon" v-model="searchIcon" />
  <button type="submit">
    <i class="fas fa-search" aria-hidden="true"></i>
    <span class="hidden-visually">Search</span>
  </button>
</form>
```

<p class="codepen" data-height="265" data-theme-id="light" data-default-tab="js,result" data-user="mlama007" data-slug-hash="NWxXeqY" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="Functional Images">
  <span>See the Pen <a href="https://codepen.io/mlama007/pen/NWxXeqY">
  Functional Images</a> by Maria (<a href="https://codepen.io/mlama007">@mlama007</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>
