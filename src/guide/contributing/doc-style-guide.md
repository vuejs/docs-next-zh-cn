# 文档风格指南

本指南将概述可用于创建文档的不同设计元素。

## 警告

VuePress 提供了一个自定义容器插件来创建警告框。有四种类型：

- **Info**：提供中立的信息
- **Tip**：提供积极和鼓励的信息
- **Warning**：提供用户应该知道的从低级到中级的信息
- **Danger**：提供对用户具有高风险的负面信息

**Markdown 范例**

```
::: info
你可以在该网站找到更多信息。
:::

::: tip
这是一个值得记住的好建议！
:::

::: warning
这是一些值得注意的东西。
:::

::: danger DANGER
这是一些我们不推荐的事情。您在使用的时候需要承担相应的风险。
:::
```

**渲染 Markdown**

::: info
你可以在该网站找到更多信息。
:::

::: tip
这是一个值得记住的好建议！
:::

::: warning
这是一些值得注意的东西。
:::

::: danger DANGER
这是一些我们不推荐的事情。您在使用的时候需要承担相应的风险。
:::

## 代码块

VuePress 使用 Prism 提供语法高亮显示，方法是将语言名称附加到代码块起始的反斜杠后面：

**Markdown 示例**

````
```js
export default {
  name: 'MyComponent'
}
```
````

**渲染输出**

```js
export default {
  name: 'MyComponent'
}
```

### 行高亮

向代码块添加行高亮显示，需要在大括号中附加行号。

#### 单行

**Markdown 示例**

````
```js{2}
export default {
  name: 'MyComponent',
  props: {
    type: String,
    item: Object
  }
}
```
````

**渲染 Markdown**

```js{2}
export default {
  name: 'MyComponent',
  props: {
    type: String,
    item: Object
  }
}
```

#### 多行区间

````
```js{4-5}
export default {
  name: 'MyComponent',
  props: {
    type: String,
    item: Object
  }
}
```
````

```js{4-5}
export default {
  name: 'MyComponent',
  props: {
    type: String,
    item: Object
  }
}
```

#### 多个段落

````
```js{2,4-5}
export default {
  name: 'MyComponent',
  props: {
    type: String,
    item: Object
  }
}
```
````

```js{2,4-5}
export default {
  name: 'MyComponent',
  props: {
    type: String,
    item: Object
  }
}
```
