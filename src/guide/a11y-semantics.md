# 语义

## 表单

当创建一个表单，你可能使用到以下几个元素：`<form>`、`<label>`、`<input>`、`<textarea>` 和 `<button>`。 

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

<common-codepen-snippet title="Simple Form" slug="dyNzzWZ" :height="368" tab="js,result" theme="light" :preview="false" :editable="false" />

注意如何在表单元素中包含 `autocomplete='on'`，它将应用于表单中的所有输入。你也可以为每个输入设置不同的[自动完成属性的值](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete)。

### 标签

提供标签以描述所有表单控件的用途；链接 `for` 和 `id`：

```html
<label for="name">Name</label>
<input type="text" name="name" id="name" v-model="name" />
```

<common-codepen-snippet title="Form Label" slug="XWpaaaj" :height="265" tab="js,result" theme="light" :preview="false" :editable="false" />

如果你在 chrome 开发工具中检查这个元素，并打开 Elements 选项卡中的 Accessibility 选项卡，你将看到输入是如何从标签中获取其名称的：

![Chrome开发工具显示可从标签输入的可访问名称](/images/AccessibleLabelChromeDevTools.png)

:::warning 警告：

虽然你可能已经看到这样包裹输入字段的标签：

```html
<label>
  Name:
  <input type="text" name="name" id="name" v-model="name" />
</label>
```

辅助技术可以更好地支持用匹配的 id 显式设置标签。
:::

#### aria-label

你也可以为输入配置一个带有 [`aria-label`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Techniques/Using_the_aria-label_attribute) 的可访问名称。

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

<common-codepen-snippet title="Form ARIA label" slug="NWdvvYQ" :height="265" tab="js,result" theme="light" :preview="false" :editable="false" />

请随意在 Chrome DevTools 中检查此元素，以查看可访问名称是如何更改的：

![Chrome Developer Tools showing input accessible name from aria-label](/images/AccessibleARIAlabelDevTools.png)

#### aria-labelledby

使用 [`aria-labelledby`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Techniques/Using_the_aria-labelledby_attribute) 类似于 `aria-label`，除非标签文本在屏幕上可见。它通过 `id` 与其他元素配对，你可以链接多个 `id`：

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

<common-codepen-snippet title="Form ARIA labelledby" slug="MWJvvBe" :height="265" tab="js,result" theme="light" :preview="false" :editable="false" />

![Chrome Developer Tools showing input accessible name from aria-labelledby](/images/AccessibleARIAlabelledbyDevTools.png)

#### aria-describedby

[aria-describedby](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Techniques/Using_the_aria-describedby_attribute) 的用法与 `aria-labelledby` 相同，它提供了一条包含用户可能需要的附加信息的描述。这可用于描述任何输入的标准：

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

<common-codepen-snippet title="Form ARIA describedby" slug="gOgxxQE" :height="265" tab="js,result" theme="light" :preview="false" :editable="false" />

你可以通过使用 Chrome 开发工具来查看说明：

![Chrome开发工具显示aria-labelledby的输入可访问名称和aria-describedby的描述](/images/AccessibleARIAdescribedby.png)

### 占位符

避免使用占位符，因为它们可能会使许多用户感到困惑。

占位符的一个问题是默认情况下它们不符合[颜色对比标准](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)；修复颜色对比度会使占位符看起来像输入字段中预填充的数据。查看以下示例，可以看到满足颜色对比度条件的姓氏占位符看起来像预填充的数据：

<common-codepen-snippet title="Form Placeholder" slug="ExZvvMw" :height="265" tab="js,result" theme="light" :preview="false" :editable="false" />

最好提供用户在任何输入之外填写表单所需的所有信息。

### 用法说明

为输入字段添加用法说明时，请确保将其正确链接到输入。你可以提供附加用法说明并在 [`aria-labelledby`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Techniques/Using_the_aria-labelledby_attribute) 内绑定多个 id。这可以使设计更加灵活。

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

或者，你可以用 [`aria-describedby`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Techniques/Using_the_aria-describedby_attribute) 将用法说明附加到输入。

```html
<fieldset>
  <legend>Using aria-describedby</legend>
  <label id="dob" for="dob">Date of Birth:</label>
  <input type="date" name="dob" id="dob" aria-describedby="dob-instructions" />
  <p id="dob-instructions">MM/DD/YYYY</p>
</fieldset>
```

<common-codepen-snippet title="Form Instructions" slug="WNREEqv" :height="265" tab="js,result" theme="light" :preview="false" :editable="false" />

### 隐藏内容

通常，即使输入具有可访问的名称，也不建议在视觉上隐藏标签。但是，如果可以借助周围的内容来理解输入的功能，那么我们可以隐藏视觉标签。

让我们看看这个搜索字段：

```html
<form role="search">
  <label for="search" class="hidden-visually">Search: </label>
  <input type="text" name="search" id="search" v-model="search" />
  <button type="submit">Search</button>
</form>
```

我们可以这样做，因为搜索按钮将帮助可视化用户识别输入字段的用途。

我们可以使用 CSS 在视觉上隐藏元素，但保持其可以用于辅助技术：
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

<common-codepen-snippet title="Form Search" slug="QWdMqWy" :height="265" tab="js,result" theme="light" :preview="false" :editable="false" />

#### aria-hidden="true"

添加 `aria hidden="true"` 将隐藏辅助技术中的元素，但使其在视觉上对其他用户可用。不要把它用在可聚焦的元素上，而只用于装饰性的、重复的或屏幕外的内容。

```html
<p>This is not hidden from screen readers.</p>
<p aria-hidden="true">This is hidden from screen readers.</p>
```

### 按钮

在表单中使用按钮时，必须设置类型以防止提交表单。你也可以使用输入创建按钮：

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

<common-codepen-snippet title="Form Buttons" slug="JjEyrYZ" :height="467" tab="js,result" theme="light" :preview="false" :editable="false" />

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

<common-codepen-snippet title="Functional Images" slug="jOyLGqM" :height="265" tab="js,result" theme="light" :preview="false" :editable="false" />
