# 文档风格指南

本指南将概述可用于创建文档的不同设计元素。

## 警告

VuePress提供了一个自定义容器插件来创建警稿框。有四种类型：

- **Info**: 提供中立的信息
- **Tip**: 提供积极和鼓励的信息
- **Warning**: 提供用户应该知道的信息，因为存在低到中等
- **Danger**: 供对用户具有高风险的负面信息

**Markdown 范例**

```
::: info
You can find more information at this site.
:::

::: tip
This is a great tip to remember!
:::

::: warning
This is something to be cautious of.
:::

::: danger DANGER
This is something we do not recommend. Use at your own risk.
:::
```

**渲染 Markdown**

::: info
You can find more information at this site.
:::

::: tip
This is a great tip to remember!
:::

::: warning
This is something to be cautious of.
:::

::: danger DANGER
This is something we do not recommend. Use at your own risk.
:::

## 代码块

VuePress使用Prism提供语言语法高亮显示，方法是将语言附加到代码块的起始反撇号：

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

#### 行组

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
